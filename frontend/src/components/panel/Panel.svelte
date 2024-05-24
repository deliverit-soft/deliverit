<script lang="ts">
    import { directionsClient, mapStore } from '../../resources/stores.ts';
    import { drawLine } from '../../helpers/draw.ts';
    import cities from '../../resources/cities.json';
    import { distanceBetween, pathLength } from '../../helpers/geo.ts';
    import type { Position } from 'geojson';
    import { Threebox } from 'threebox-plugin';

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

    let tspState: string | null =  null;

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
            const match = await $directionsClient.getDirections({
                waypoints: pack.map(coord => ({ coordinates: coord as [ number, number ] })),
                profile: 'driving',
                geometries: 'geojson',
                overview: 'full',
            }).send();
            drawLine(match.body.routes[0]!.geometry.coordinates as Position[], {
                "line-color": "#0000ff",
                "line-width": 3,
                "line-opacity": 0.5,
            });
        }
        tspState = null;
    }

    async function addTruck() {
        // Find path
        const path = [
            [2.3522, 48.8566],
            [2.3622, 48.8566],
            [2.3522, 48.8566],
        ];
        const match = await $directionsClient.getDirections({
            waypoints: path.map(coord => ({ coordinates: coord as [ number, number ] })),
            profile: 'driving',
            geometries: 'geojson',
            overview: 'full',
        }).send();
        await drawLine(match.body.routes[0]!.geometry.coordinates as Position[], {
            "line-color": "#ff0000",
            "line-width": 3,
            "line-opacity": 0.5,
        });
        let threebox: Threebox;
        $mapStore.addLayer({
            id: 'truck',
            type: 'custom',
            renderingMode: '3d',
            onAdd: (map, gl) => {
                threebox = new Threebox(map, gl, {
                    defaultLights: true,
                    enableDraggingObjects: true,
                    enableRotatingObjects: true,
                    enableHelpTooltips: true,
                    enableSelectingFeatures: true,
                    enableSelectingObjects: true,
                });
                threebox.loadObj({
                    obj: '/truck.glb',
                    type: 'gltf',
                    scale: 10,
                    units: 'meters',
                    anchor: 'bottom',
                    rotation: { x: 90, y: 90, z: 0 },
                }, async obj => {
                    console.log(obj);
                    obj.setCoords([2.3522, 48.8566]);
                    threebox.add(obj);
                    $mapStore.flyTo({
                        center: [2.3522, 48.8566],
                        zoom: 19,
                        pitch: 55,
                        duration: 1000,
                        bearing: 50,
                    });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    obj.followPath({
                        path: match.body.routes[0]!.geometry.coordinates as Position[],
                        trackHeading: true,
                        duration: pathLength(match.body.routes[0]!.geometry.coordinates as Position[]) * 50,
                    });
                    obj.addEventListener('ObjectChanged', e => {
                        console.log(e);
                        $mapStore.panTo([e.detail.action.position![0], e.detail.action.position![1]], {
                            animate: false,
                        });
                        // Rotation is in radians
                        $mapStore.setBearing(-e.detail.action.rotation!.z * 180 / Math.PI + 190);
                        console.log(e);
                    });
                })
            },
            render: _ => {
                threebox.update();
            }
        });

        // @ts-ignore
        window.tb = threebox;
    }
</script>

<style>
    aside {
        width: 25rem;
        height: 100%;
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

<svelte:body on:mouseup={handleResizeEnd} on:mousemove={handleMouseMove}/>

<aside bind:this={panel}>
    <button on:click={handleTsp}>Start TSP</button>
    {#if tspState}
        {tspState}
    {/if}
    <br><br>
    <button on:click={addTruck}>Truck</button>
    <div class="resizer" on:mousedown={handleResizeStart} role="none" on:dblclick={handleDblClick}/>
</aside>
