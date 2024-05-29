<script lang="ts">
    import { TruckData } from '../../models/truck-data.ts';
    import { PackageData } from '../../models/package-data.ts';
    import OnBoardingStepLayout from './utils/OnBoardingStepLayout.svelte';
    import { fade } from 'svelte/transition';

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
</script>


<style>
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
</style>


<OnBoardingStepLayout on:next title="Setup packages">
    <div class="chose-packages" slot="controls">
        <input type="range" min={1} max={maxPackagesCount} step={1} bind:value={packagesCount}>
        <input type="number" min={1} max={maxPackagesCount} step={1} bind:value={packagesCount}>
    </div>

    <div class="selected-packages">
        <div class="packages">
            {#each $packagesInstances as pack}
                <div class="package" transition:fade={{duration: 200}}>
                    {pack.height}x{pack.width}x{pack.length}
                </div>
            {/each}
        </div>
    </div>
</OnBoardingStepLayout>
