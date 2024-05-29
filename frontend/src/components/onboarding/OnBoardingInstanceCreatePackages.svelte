<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { TruckData } from '../../helpers/truck-data.ts';
    import { PackageData } from '../../helpers/package-data.ts';

    const dispatch = createEventDispatcher();

    const { instancesStore: trucksInstances } = TruckData;
    const { instancesStore: packagesInstances } = PackageData;

    let trucksCount: number = $trucksInstances.length;
    $: trucksCount = $trucksInstances.length;

    const maxPackagesCount: number = trucksCount * 20;

    let packagesCount: number = trucksCount * 10;
    $: updatePackageCount(packagesCount);
    let previousPackagesCount: number = $packagesInstances.length;

    function updatePackageCount(_: number) {
        packagesCount = Math.round(packagesCount);

        if (packagesCount > maxPackagesCount)
            packagesCount = maxPackagesCount;

        if (packagesCount < 1)
            packagesCount = 1;

        if (packagesCount < previousPackagesCount)
            [ ...PackageData.instances.values() ].slice(packagesCount).forEach(instance => instance.destroy());

        if (packagesCount > previousPackagesCount)
            for (let i = previousPackagesCount; i < packagesCount; i++)
                PackageData.randomInstance();

        previousPackagesCount = packagesCount;
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
        overflow-y: auto;
    }

    .packages {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        height: fit-content;
    }

    .package {
        background-color: var(--light-gray);
        color: var(--primary-white);
        padding: .5rem 1rem;
        border-radius: .5rem;
        font-size: .8rem;
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
        <input type="range" min={1} max={maxPackagesCount} step={1} bind:value={packagesCount}>
        <input type="number" min={1} max={maxPackagesCount} step={1} bind:value={packagesCount}>
    </div>

    <div class="selected-packages">
        <div class="packages">
            {#each $packagesInstances as pack}
                <div class="package">{pack.height}x{pack.width}x{pack.length}</div>
            {/each}
        </div>
    </div>

    <div class="create-next">
        <button disabled={false} on:click={handleNext}>Next</button>
    </div>
</div>
