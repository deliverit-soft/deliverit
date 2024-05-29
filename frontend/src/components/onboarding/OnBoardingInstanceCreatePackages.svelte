<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { TruckData } from '../../helpers/truck-data.ts';

    const dispatch = createEventDispatcher();

    const { instancesStore } = TruckData;
    let trucksCount: number = $instancesStore.length;
    $: trucksCount = $instancesStore.length;

    let chosenPackages: number = trucksCount * 10;

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

    h2 {
        font-size: 2rem;
        margin: 0;
    }

    .chose-packages {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 2rem;
    }

    .chose-packages input[type="range"] {
        width: 100%;
    }

    .chose-packages input[type="number"] {
        width: 3rem;
        border: none;
        background: transparent;
        font-size: inherit;
    }

    .selected-packages {
        height: 100%;
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
    <h2>Setup packages</h2>

    <div class="chose-packages">
        <input type="range" min={1} max={trucksCount * 20} step={1} bind:value={chosenPackages}>
        <input type="number" min={1} max={trucksCount * 20} step={1} bind:value={chosenPackages}>
    </div>

    <div class="selected-packages">

    </div>

    <div class="create-next">
        <button disabled={false} on:click={handleNext}>Next</button>
    </div>
</div>
