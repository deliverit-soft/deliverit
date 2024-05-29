<script lang="ts">
    import { ArrowPath, Icon, Plus, Trash } from 'svelte-hero-icons';
    import { TruckData } from '../../models/truck-data.ts';
    import OnBoardingTrucks from './utils/OnBoardingTrucks.svelte';
    import OnBoardingStepLayout from './utils/OnBoardingStepLayout.svelte';
    import { onMount } from 'svelte';

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
</script>


<style>
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
        height: calc(100% - .5rem);
        overflow: auto visible;
        padding: .25rem;
    }
</style>


<OnBoardingStepLayout on:next nextDisabled={$instancesStore.length === 0}>
    <div class="create-header" slot="title">
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
</OnBoardingStepLayout>
