<script lang="ts">
    import Map from './map/Map.svelte';
    import ResetView from './map/ResetView.svelte';
    import Panel from './panel/Panel.svelte';
    import OnBoarding from './onboarding/OnBoarding.svelte';
    import { tabuVrp } from '$helpers/api.ts';
    import { binPackingResult, citiesToTour, startCities } from '$resources/stores.ts';
    import { drawVrpSolution } from '$helpers/draw.ts';
    import { ArchiveBox, Icon, Truck } from 'svelte-hero-icons';

    let showOnBoarding = true;

    async function handleOnBoardingDone() {
        showOnBoarding = false;
        const result = await tabuVrp(
            $binPackingResult.packageCountPerTruck,
            $startCities,
            $citiesToTour
        );
        drawVrpSolution(result.bestSolution);
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

    .icons {
        display: none;
    }

    :global(.archive-icon), :global(.truck-icon) {
        padding: .25rem;
        background: var(--primary-white);
        border: 3px solid transparent;
        border-radius: 50%;
        opacity: .75 !important;
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

<div class="icons">
    <Icon src={ArchiveBox} class="archive-icon" size="1rem"/>
    <Icon src={Truck} class="truck-icon" size="1.5rem"/>
</div>
