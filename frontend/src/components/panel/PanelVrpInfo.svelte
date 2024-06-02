<script lang="ts">
    import { mapFeatures, vrpResults } from '$resources/stores.ts';
    import { durationFormat } from '$helpers/utils.ts';
    import { ArrowPathRoundedSquare, ArrowTrendingUp, Clock, Icon, Squares2x2 } from 'svelte-hero-icons';
    import { fade } from 'svelte/transition';
    import { getRoute } from '$helpers/geo.ts';
    import { drawLine, removeLine } from '$helpers/draw.ts';


    let calculateRoadsProgress = 0;


    async function handleRoadsCalculation() {
        for (const truckLines of $mapFeatures.straightLines) {
            const realPath = [];
            for (const segment of truckLines) {
                try {
                    const route = await getRoute(segment.geometry.coordinates)
                    removeLine(segment);
                    realPath.push(drawLine(route, segment.properties.paint));
                } catch (error) {
                    console.error('Route plotting error', error);
                }
            }
            $mapFeatures.straightLines = [];
            $mapFeatures.realPaths.push(realPath);
        }
        console.log($mapFeatures);
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

{#if calculateRoadsProgress === 0}
    <button on:click={handleRoadsCalculation}>
        Click to calculate real roads
    </button>
{/if}
