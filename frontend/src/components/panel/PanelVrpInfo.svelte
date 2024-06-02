<script lang="ts">
    import { mapFeatures, vrpResults } from '$resources/stores.ts';
    import { durationFormat } from '$helpers/utils.ts';
    import { ArrowPathRoundedSquare, ArrowTrendingUp, Clock, Icon, Squares2x2 } from 'svelte-hero-icons';
    import { fade } from 'svelte/transition';
    import { getRoute } from '$helpers/geo.ts';
    import { drawLine, removeLine } from '$helpers/draw.ts';
    import { tweened } from 'svelte/motion';
    import { cubicInOut } from 'svelte/easing';
    import { TruckModel } from '$models/truck-model.ts';
    import type { Feature, Position } from 'geojson';
    // @ts-ignore
    import type { GeoJSONObject, LineString } from '@turf/turf';
    import PanelTruck from '$components/panel/PanelTruck.svelte';


    let calculateRoadsProgress = tweened(0, {
        duration: 1000,
        easing: cubicInOut,
    });

    let trucks: TruckModel[] = [];
    let trucksPaths: Position[][] = [];


    const getTruckPath = (index: number) => trucksPaths[index]!;
    const getTruckColor = (index: number) => $mapFeatures.colors[index]!;


    async function handleRoadsCalculation() {
        $calculateRoadsProgress += 0.001;
        const pathsCount = $mapFeatures.straightLines.flat(1).length;

        for (let i = 0; i < $mapFeatures.straightLines.length; i++) {
            const truckLines = $mapFeatures.straightLines[i]!;
            const color = $mapFeatures.colors[i]!;
            trucksPaths.push([]);

            const realPath: Feature<LineString, GeoJSONObject>[] = [];
            for (const segment of truckLines) {
                $calculateRoadsProgress = ($mapFeatures.realPaths.flat(1).length / pathsCount) * 100;
                try {
                    const route = await getRoute(segment.geometry.coordinates);
                    removeLine(segment);
                    realPath.push(drawLine(route, segment.properties.paint));
                    trucksPaths[i]!.push(...route);
                } catch (error) {
                    console.error('Route plotting error', error, segment);
                }
            }
            $mapFeatures.realPaths.push(realPath);

            const truck = new TruckModel({
                id: String(Math.random()).slice(2),
                enableMarker: true,
                markerColor: color,
            });
            await truck.load();
            truck.object.setCoords(realPath[0]!.geometry.coordinates[0]);
            truck.spawn();
            trucks = [...trucks, truck];
        }

        $mapFeatures.straightLines = [];

        $calculateRoadsProgress = 100;
    }
</script>


<style>
    .duration-stats {
        display: grid;
        grid-template-columns: 1.5rem 1fr;
        gap: .75rem 0.5rem;
        align-items: end;
        padding: 1rem;
        background-color: var(--primary-theme);
        color: var(--primary-white);
        border-radius: 1rem;
    }

    button {
        display: block;
        width: 100%;
        padding: 0.75rem;
        margin-top: 1rem;
        background-color: var(--primary-theme);
        color: var(--primary-white);
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        font-size: inherit;
    }

    progress {
        width: 100%;
        margin-top: 1rem;
    }
</style>


<div class="duration-stats" in:fade={{ duration: 200 }}>
    <Icon src={Clock} size="1.5rem"/>
    Total duration: {durationFormat($vrpResults.executionTimes.total * 1000)}
    <Icon src={Squares2x2} size="1.5rem"/>
    Distance matrix generation: {durationFormat($vrpResults.executionTimes.matrix * 1000)}
    <Icon src={ArrowPathRoundedSquare} size="1.5rem"/>
    Route optimization: {durationFormat($vrpResults.executionTimes.vrp * 1000)}
    <Icon src={ArrowTrendingUp} size="1.5rem"/>
    Total distance: {$vrpResults.bestCost.toFixed(0)} km
</div>

{#if $calculateRoadsProgress === 0}
    <button on:click={handleRoadsCalculation}>
        Click to calculate real roads
    </button>
{:else}
    <progress value={$calculateRoadsProgress} max="100"/>
    {#each trucks as truck, index (truck.id)}
        <PanelTruck {truck} path={getTruckPath(index)} {index} truckColor={getTruckColor(index)}/>
    {/each}
{/if}
