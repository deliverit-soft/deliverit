<script lang="ts">
    import Map from './map/Map.svelte';
    import ResetView from './map/ResetView.svelte';
    import Panel from './panel/Panel.svelte';
    import OnBoarding from './onboarding/OnBoarding.svelte';
    import { tabuVrp } from '$helpers/api.ts';
    import { binPackingResult, citiesToTour, startCities } from '$resources/stores.ts';
    import { drawLine, colorGenerator } from '$helpers/draw.ts';
    import type { Position } from 'geojson';

    let showOnBoarding = true;

    async function handleOnBoardingDone() {
        showOnBoarding = false;
        const result = await tabuVrp(
            $binPackingResult.packageCountPerTruck,
            $startCities,
            $citiesToTour
        );
        const color = colorGenerator(result.bestSolution.length);
        console.log(result);
        for (const trajectory of result.bestSolution) {
            drawLine(
                trajectory.map(value => ([ value.lon, value.lat ]) as Position),
                {
                    "line-color": color.next().value!,
                    "line-width": 3
                }
            )
        }
    }
</script>

<style>
    main {
        height: 100vh;
        width: 100vw;
        display: flex;
    }

    .map-container {
        height: 100%;
        width: 100%;
        position: relative;
        flex: 1;
    }
</style>

<main>
    {#if showOnBoarding}
        <OnBoarding on:done={handleOnBoardingDone}/>
    {/if}
    <Panel/>
    <div class="map-container">
        <Map/>
        <ResetView/>
    </div>
</main>
