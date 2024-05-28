<script lang="ts">
    import { ArrowPath, Icon, Plus, Trash } from 'svelte-hero-icons';
    import { TruckData } from '../../helpers/truck-data.ts';
    import OnBoardingTrucks from './utils/OnBoardingTrucks.svelte';
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();

    onMount(() => {
        TruckData.destroyAll();
    });

    const { instancesStore, groupedInstancesStore } = TruckData;

    function handleNewTruck() {
        TruckData.randomInstance();
    }

    function handleRandomTruck() {
        TruckData.randomInstances();
    }

    function handleDeleteTrucks() {
        TruckData.destroyAll();
    }

    function handleNext() {
        dispatch('next');
    }
</script>


<style>
    .create-container {
        width: 50.5rem;
        height: 32rem;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .create-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h2 {
        font-size: 2rem;
        margin: 0;
        position: relative;
    }

    .create-header button {
        background: none;
        border: none;
        cursor: pointer;
        padding: .5rem;
        border-radius: .5rem;
        height: 2.5rem;
        width: 2.5rem;
        color: var(--primary-black);
        transition: all .2s;
    }

    .create-header button:hover {
        background-color: var(--primary-theme);
        color: var(--primary-white);
    }

    .create-trucks {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        height: 100%;
        overflow: auto visible;
        padding: .25rem;
    }

    .create-next {
        display: flex;
        justify-content: center;
    }

    .create-next button {
        background-color: var(--primary-theme);
        color: var(--primary-white);
        border: none;
        border-radius: .5rem;
        padding: .5rem 1rem;
        font-size: inherit;
        cursor: pointer;
    }

    .create-next button:disabled {
        background-color: var(--light-gray);
        cursor: not-allowed;
    }
</style>


<div class="create-container">
    <div class="create-header">
        <h2>
            Truck fleet
            {#if $instancesStore.length > 0}
                ({$instancesStore.length})
            {/if}
        </h2>
        <div>
            <button on:click={handleNewTruck}>
                <Icon src={Plus} size="1.5rem"/>
            </button>
            <button on:click={handleRandomTruck}>
                <Icon src={ArrowPath} size="1.5rem"/>
            </button>
            <button on:click={handleDeleteTrucks}>
                <Icon src={Trash} size="1.5rem"/>
            </button>
        </div>
    </div>

    <div class="create-trucks">
        {#each $groupedInstancesStore as trucks, index}
            <OnBoardingTrucks {trucks} {index}/>
        {/each}
    </div>

    <div class="create-next">
        <button disabled={$instancesStore.length === 0} on:click={handleNext}>Next</button>
    </div>
</div>
