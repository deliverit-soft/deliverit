<script lang="ts">
    import OnBoardingMethodStep from './OnBoardingMethodStep.svelte';
    import OnBoardingInstanceCreateTrucks from './OnBoardingInstanceCreateTrucks.svelte';
    import OnBoardingInstanceCreatePackages from './OnBoardingInstanceCreatePackages.svelte';
    import OnBoardingCities from './OnBoardingCities.svelte';
    import { citiesToTour, startCities } from '$resources/stores.ts';
    import { TruckData } from '$models/truck-data.ts';
    import { PackageData } from '$models/package-data.ts';
    import OnBoardingBinPacking from '$components/onboarding/OnBoardingBinPacking.svelte';

    type MethodChoice = 'import' | 'create' | 'history';
    type Step =
        'method'
        | 'import'
        | 'create-trucks'
        | 'create-packages'
        | 'bin-packing'
        | 'start-cities'
        | 'cities'
        | 'history';

    let step: Step = 'method';

    function handleMethodChoice(ev: CustomEvent<MethodChoice>) {
        switch (ev.detail) {
            case 'import':
                step = 'import';
                break;
            case 'create':
                step = 'create-trucks';
                break;
            case 'history':
                step = 'history';
                break;
        }
    }

    function handleTrucksCreated() {
        step = 'create-packages';
    }

    function handlePackagesCreated() {
        step = 'bin-packing';
    }

    function handleBinPacking() {
        step = 'start-cities';
    }

    function handleStartCitiesSet() {
        step = 'cities';
    }

    function handleCitiesSet() {
        step = 'method';
    }
</script>

<style>
    .onboarding-container {
        position: absolute;
        inset: 0;
        height: 100vh;
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .onboarding-popup {
        background-color: var(--primary-white);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: var(--shadow-md);
    }
</style>


<div class="onboarding-container">
    <div class="onboarding-popup">
        {#if step === "method"}
            <OnBoardingMethodStep on:choice={handleMethodChoice}/>
        {/if}
        {#if step === 'import'}
            <p>Import</p>
        {/if}
        {#if step === 'create-trucks'}
            <OnBoardingInstanceCreateTrucks on:next={handleTrucksCreated}/>
        {/if}
        {#if step === 'bin-packing'}
            <OnBoardingBinPacking on:next={handleBinPacking}/>
        {/if}
        {#if step === 'create-packages'}
            <OnBoardingInstanceCreatePackages on:next={handlePackagesCreated}/>
        {/if}
        {#if step === 'start-cities'}
            <OnBoardingCities
                    title="Starting cities"
                    cityStore={startCities}
                    max={TruckData.instances.size}
                    on:next={handleStartCitiesSet}/>
        {/if}
        {#if step === 'cities'}
            <OnBoardingCities
                    title="Cities to visit"
                    cityStore={citiesToTour}
                    min={PackageData.instances.size}
                    max={PackageData.instances.size}
                    on:next={handleCitiesSet}/>
        {/if}
        {#if step === 'history'}
            <p>History</p>
        {/if}
    </div>
</div>
