<script lang="ts">
    import { mapStore } from '../../resources/stores.ts';
    import { drawLine } from '../../helpers/draw.ts';
    import cities from '../../resources/cities.json';
    import { distanceBetween, getRoute } from '../../helpers/geo.ts';
    import type { Position } from 'geojson';
    import { type LngLatLike } from 'mapbox-gl';
    import { Truck } from '../../models/truck.ts';
    import PanelBrand from './PanelBrand.svelte';

    let isResizing = false;
    let panel: HTMLElement;
    const minWidth = 300;
    const maxWidth = 500;

    function handleResizeStart() {
        isResizing = true;
    }

    function handleResizeEnd() {
        isResizing = false;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isResizing)
            return;

        const width = Math.min(maxWidth, Math.max(minWidth, event.clientX)) - 32;
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

    let speed: number = 1;
    let truckProgress: number = 0;
    let truck: Truck;

    $: truck && (truck.speed = speed * 50);

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

        // Spawn truck
        truck = new Truck({
            id: 'truck',
            enableMarker: true,
            autoCameraFollow: true,
        });
        await truck.load();
        truck.object.setCoords(route[0] as LngLatLike);
        truck.spawn();
        await truck.focus();
        truck.addEventListener('pathProgress', () => {
            truckProgress = truck.progress;
        });
        await truck.followPath(route);
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
    <PanelBrand/>
    <button on:click={handleTsp}>Start TSP</button>
    {#if tspState}
        {tspState}
    {/if}
    <br><br>
    <button on:click={addTruck}>
        Truck
        {#if truckProgress !== 0}
            {Math.round(truckProgress * 100)}%
        {/if}
    </button>
    <br>
    <progress max="100" value={truckProgress * 100}/>
    <br>
    <button on:click={() => truck.follow(true)}>Follow</button>
    <br>
    <input bind:value={speed} max="10" min="1" step="1" type="range"/> {speed}
    <div class="resizer" on:dblclick={handleDblClick} on:mousedown={handleResizeStart} role="none"/>
</aside>
