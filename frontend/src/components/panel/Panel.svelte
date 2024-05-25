<script lang="ts">
    import { mapStore, threebox } from '../../resources/stores.ts';
    import { drawLine } from '../../helpers/draw.ts';
    import cities from '../../resources/cities.json';
    import { distanceBetween, getRoute, pathLength, sliceAlongPath } from '../../helpers/geo.ts';
    import type { Position } from 'geojson';
    import { type ThreeboxObject } from 'threebox-plugin';
    import { chunkPath } from '../../helpers/geo.js';
    import { type LngLatLike, Marker } from 'mapbox-gl';

    let isResizing = false;
    let panel: HTMLElement;
    const minWidth = 50;
    const maxWidth = 800;

    function handleResizeStart() {
        isResizing = true;
    }

    function handleResizeEnd() {
        isResizing = false;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isResizing)
            return;

        const width = Math.min(maxWidth, Math.max(minWidth, event.clientX));
        panel.style.width = `${width}px`;
        $mapStore.resize();
    }

    function handleDblClick() {
        panel.style.width = '25rem';
        $mapStore.resize();
    }

    let tspState: string | null = null;

    async function handleTsp() {
        tspState = 'Generating lines...';
        const feat = cities.features.slice(0, 100);
        const geometry: Position[] = [ feat[0]!.geometry.coordinates ];
        for (let i = 0; i < feat.length - 1; i++) {
            const coordinates = geometry[geometry.length - 1]!;

            // Find the closest city by distance that is not already in the line
            const closest = feat.reduce((acc, city) => {
                if (geometry.some(coord => coord[0] === city.geometry.coordinates[0] && coord[1] === city.geometry.coordinates[1]))
                    return acc;

                const dist = distanceBetween(coordinates, city.geometry.coordinates);
                return dist < acc.dist ? { city, dist } : acc;
            }, { city: feat[0], dist: Infinity });

            geometry.push(closest.city!.geometry.coordinates);
        }
        // Make packs of 10 waypoints
        const packSize = 5;
        for (let i = 0; i < geometry.length; i += (packSize - 1)) {
            tspState = `Generating lines... ${i}/${geometry.length} (${Math.round(i / geometry.length * 100)}%)`;
            const pack = geometry.slice(i, i + packSize);
            if (pack.length < 2)
                continue;
            const route = await getRoute(pack);
            await drawLine(route, {
                'line-color': '#0000ff',
                'line-width': 3,
                'line-opacity': 0.5,
            });
        }
        tspState = null;
    }

    let follow = false;
    let speed: number = 1;
    let truckProgress: number = 0;
    let truck: ThreeboxObject;
    let truckPathDistance: number;
    let truckPath: Position[] = [];
    let truckPathDuration = 0;

    $: updateTruckSpeed(speed);

    function updateTruckSpeed(_: number) {
        if (!truck)
            return;
        truck.stop();
        const pathWithProgress = sliceAlongPath(truckPath, truckProgress * truckPathDistance, truckPathDistance);
        const newPathDistance = pathLength(pathWithProgress);
        truck.followPath({
            path: pathWithProgress,
            trackHeading: true,
            duration: truckPathDuration * (1 - truckProgress / 100) / speed,
        });
        // TODO: Fix duration calculation
        console.log(`Selected speed: ${speed}, calculated speed: ${truckPathDuration * (1 - truckProgress / 100) / 20 / newPathDistance * speed}`);
    }

    async function addTruck() {
        // Find path
        const path: Position[] = [
            [ 2.3522, 48.8566 ],
            [ 2.3622, 48.8566 ],
            [ 2.3522, 48.8566 ],
        ];
        const route = await getRoute(path);
        await drawLine(route, {
            'line-color': '#ff0000',
            'line-width': 5,
            'line-opacity': 0.2,
        });

        // Add marker to map
        const marker = new Marker({
            color: '#ff0000',
        });
        marker.setLngLat(path[0] as LngLatLike);
        marker.addTo($mapStore);

        $threebox.loadObj({
            obj: '/truck.glb',
            type: 'gltf',
            scale: 10,
            units: 'meters',
            anchor: 'bottom',
            rotation: { x: 90, y: 90, z: 0 },
        }, async obj => {
            truck = obj;
            truck.setCoords([ 2.3522, 48.8566 ]);
            $threebox.add(obj);
            $mapStore.flyTo({
                center: [ 2.3522, 48.8566 ],
                zoom: 19,
                pitch: 55,
                duration: 1000,
                bearing: 50,
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            truckPathDistance = pathLength(route);
            truckPathDuration = truckPathDistance * 20;
            truckPath = chunkPath(route, 5);
            truck.followPath({
                path: truckPath,
                trackHeading: true,
                duration: truckPathDuration / speed,
            });
            let truckLastPosition = truckPath[0] as Position;
            truck.addEventListener('ObjectChanged', e => {
                if (!e.detail.action.position)
                    return;

                // Update marker
                marker.setLngLat([ e.detail.action.position[0], e.detail.action.position[1] ] as LngLatLike);
                marker.addTo($mapStore);

                truckProgress += distanceBetween(truckLastPosition, e.detail.action.position) / truckPathDistance;
                truckLastPosition = e.detail.action.position;

                if (!follow || !e.detail.action.rotation)
                    return;
                $mapStore.jumpTo({
                    center: [ e.detail.action.position[0], e.detail.action.position[1] ],
                    zoom: 19,
                    pitch: 55,
                    bearing: -e.detail.action.rotation.z * 180 / Math.PI + 190,
                });
            });
            $mapStore.on('mousedown', () => (follow = false));
            $mapStore.on('wheel', () => (follow = false));
            $mapStore.on('touchstart', () => (follow = false));

            function updateVisibility() {
                const newVisibility = $mapStore.getZoom() > 15;
                if (truck.visibility !== newVisibility)
                    truck.visibility = newVisibility;
                marker.getElement().style.visibility = newVisibility ? 'hidden' : 'visible';
                requestAnimationFrame(updateVisibility);
            }

            updateVisibility();
        });
    }
</script>

<style>
    aside {
        width: 25rem;
        height: calc(100% - 2rem);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        z-index: 1;
        position: relative;
        padding: 1rem;
    }

    .resizer {
        height: 100%;
        width: 2rem;
        cursor: ew-resize;
        position: absolute;
        right: -1rem;
        top: 0;
        user-select: none;
        transition: opacity 0.2s;
    }
</style>

<svelte:body on:mousemove={handleMouseMove} on:mouseup={handleResizeEnd}/>

<aside bind:this={panel}>
    <button on:click={handleTsp}>Start TSP</button>
    {#if tspState}
        {tspState}
    {/if}
    <br><br>
    <button on:click={addTruck}>
        Truck
        {#if truckProgress !== 0}
            {truckProgress * 100}%
        {/if}
    </button>
    <br>
    <button on:click={() => follow = !follow}>{follow ? 'Stop following' : 'Follow'}</button>
    <br>
    <input bind:value={speed} max="10" min="1" step="1" type="range"/> {speed}
    <div class="resizer" on:dblclick={handleDblClick} on:mousedown={handleResizeStart} role="none"/>
</aside>
