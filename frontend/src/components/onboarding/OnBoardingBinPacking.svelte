<script lang="ts">
    import OnBoardingStepLayout from '$components/onboarding/utils/OnBoardingStepLayout.svelte';
    import { onMount } from 'svelte';
    import { binPacking } from '$helpers/api.ts';
    import { TruckData } from '$models/truck-data.ts';
    import { PackageData } from '$models/package-data.ts';
    import { fade } from 'svelte/transition';
    import { tweened } from 'svelte/motion';
    import { cubicInOut } from 'svelte/easing';
    import { binPackingResult } from '$resources/stores.ts';

    let trucksSlots = 0;
    let usedTrucks = tweened(0, {
        duration: 1000,
        easing: cubicInOut,
    });
    let packagesUsed = tweened(0, {
        duration: 1000,
        easing: cubicInOut,
    });
    let slotsUsed = tweened(0, {
        duration: 1000,
        easing: cubicInOut,
    });

    onMount(async () => {
        $binPackingResult = await binPacking([ ...TruckData.instances ], [ ...PackageData.instances ]);

        await new Promise((resolve) => setTimeout(resolve, 300));

        $slotsUsed = $binPackingResult.matrix.flat(3).filter(Boolean).length ?? 0;
        trucksSlots = $binPackingResult.matrix.flat(3).length ?? 0;
        $packagesUsed = $binPackingResult.packagesCount?.reduce((acc, val) => acc + val, 0) ?? 0;
        $usedTrucks = $binPackingResult.trucksUsed ?? 0;
    });
</script>


<style>
    .loader {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .successful {
        width: calc(100% - 2rem);
        background-color: var(--primary-theme);
        color: var(--primary-white);
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
    }

    .results {
        margin-top: 2rem;
    }

    .results p {
        margin: 1.5rem 0 0.5rem 0;
    }

    progress {
        width: 100%;
    }
</style>


<OnBoardingStepLayout title="Bin packing" on:next nextDisabled={!$binPackingResult}>
    {#if !$binPackingResult}
        <div class="loader">
            Loading bin packing...
        </div>
    {:else}
        <div in:fade={{duration: 200}}>
            <div class="successful">Bin packing successful!</div>
            <div class="results">
                <p>
                    Used trucks: {Math.round($usedTrucks)} / {TruckData.instances.size}
                </p>
                <progress value={$usedTrucks} max={TruckData.instances.size}/>
                <p>
                    Placed packages: {Math.round($packagesUsed)} / {PackageData.instances.size}
                    ({Math.round($packagesUsed / PackageData.instances.size * 100)}%)
                </p>
                <progress value={$packagesUsed} max={PackageData.instances.size}/>
                <p>
                    Truck slots used : {Math.round($slotsUsed)}/{trucksSlots}
                    ({Math.round($slotsUsed / trucksSlots * 100)}%)
                </p>
                <progress value={$slotsUsed} max={trucksSlots}/>
            </div>
        </div>
    {/if}
</OnBoardingStepLayout>
