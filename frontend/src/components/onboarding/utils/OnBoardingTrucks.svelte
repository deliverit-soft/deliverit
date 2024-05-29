<script lang="ts">
    import { TruckData } from '../../../models/truck-data.ts';
    import { fade } from 'svelte/transition';

    export let trucks: TruckData[] = [];
    export let index = 0;

    $: updateTrucksStats(trucks);

    function updateTrucksStats(_: TruckData[]) {
        trucksCount = trucks.length;
        width = trucks[0]!.width;
        length = trucks[0]!.length;
        height = trucks[0]!.height;
    }

    let trucksCount: number;
    let width: number;
    let length: number;
    let height: number;

    function handleCountChange() {
        if (trucksCount < trucks.length) {
            for (let i = trucksCount; i < trucks.length; i++) {
                trucks[i]?.destroy();
            }
        } else {
            for (let i = trucks.length; i < trucksCount; i++) {
                new TruckData(width, length, height);
            }
        }
    }

    function handleWidthChange() {
        if (width === trucks[0]!.width)
            return;

        for (let i = 0; i < trucks.length; i++) {
            trucks[i]!.width = width;
        }
    }

    function handleLengthChange() {
        if (length === trucks[0]!.length)
            return;

        for (let i = 0; i < trucks.length; i++) {
            trucks[i]!.length = length;
        }
    }

    function handleHeightChange() {
        if (height === trucks[0]!.height)
            return;

        for (let i = 0; i < trucks.length; i++) {
            trucks[i]!.height = height;
        }
    }
</script>


<style>
    .truck-container {
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-sm);
        padding: .5rem;
        border-radius: .5rem;
        gap: 1rem;
        height: fit-content;
    }

    .truck-stats {
        display: flex;
        flex-direction: column;
        gap: .25rem;
    }

    h3 {
        margin: 0;
    }

    label {
        display: flex;
        gap: .1rem;
        align-items: center;
    }

    input {
        border: none;
        background: transparent;
        font-size: inherit;
        display: block;
        width: 2rem;
        flex: 1;
    }
</style>


<div class="truck-container" transition:fade={{duration: 200}}>
    <h3>Group #{index + 1}</h3>
    <div class="truck-stats">
        <label>
            Trucks count:
            <input type="number" bind:value={trucksCount} max="100" min="0" step="1" on:blur={handleCountChange}/>
        </label>
        <label>
            Width:
            <input type="number" bind:value={width} max="5" min="1" step="1" on:blur={handleWidthChange}>
        </label>
        <label>
            Length:
            <input type="number" bind:value={length} max="100" min="1" step="1" on:blur={handleLengthChange}>
        </label>
        <label>
            Height:
            <input type="number" bind:value={height} max="5" min="1" step="1" on:blur={handleHeightChange}>
        </label>
    </div>
</div>
