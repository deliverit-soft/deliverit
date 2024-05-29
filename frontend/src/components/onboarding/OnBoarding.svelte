<script lang="ts">
    import OnBoardingMethodStep from './OnBoardingMethodStep.svelte';
    import OnBoardingInstanceCreateTrucks from './OnBoardingInstanceCreateTrucks.svelte';
    import OnBoardingInstanceCreatePackages from './OnBoardingInstanceCreatePackages.svelte';
    import OnBoardingStartingCities from './OnBoardingStartingCities.svelte';

    type MethodChoice = 'import' | 'create' | 'history';
    type Step = 'method' | 'import' | 'create-trucks' | 'create-packages' | 'start-cities' | 'history';

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
        step = 'start-cities';
    }

    function handleStartCitiesSet() {
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
        {#if step === 'create-packages'}
            <OnBoardingInstanceCreatePackages on:next={handlePackagesCreated}/>
        {/if}
        {#if step === 'start-cities'}
            <OnBoardingStartingCities on:next={handleStartCitiesSet}/>
        {/if}
        {#if step === 'history'}
            <p>History</p>
        {/if}
    </div>
</div>
