<script lang="ts">
    import { mapStore } from '$resources/stores.ts';
    import { DEFAULT_BOUNDS } from '$resources/defaults.ts';
    import { TruckModel } from '$models/truck-model.ts';
    import { fade } from 'svelte/transition';

    let isDefaultPosition = true;
    let cameraMoving = false;

    $: $mapStore?.on('move', () => {
        if (cameraMoving)
            return;

        isDefaultPosition = false;
    });

    async function resetView() {
        if (cameraMoving)
            return;

        // Set variables and unfollow all trucks
        cameraMoving = true;
        isDefaultPosition = true;
        TruckModel.unfollowAll();

        // Reset view
        $mapStore.setMinZoom(1);
        $mapStore.fitBounds(DEFAULT_BOUNDS, {
            duration: 1000,
        });
        await new Promise(resolve => setTimeout(resolve, 1050));

        // Reset variables
        cameraMoving = false;
    }
</script>

<style>
    button {
        position: absolute;
        bottom: 2rem;
        right: 50%;
        transform: translateX(50%);
        background-color: #f8f9fa;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        color: #495057;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #e9ecef;
    }
</style>

{#if !isDefaultPosition}
    <button on:click={resetView} transition:fade={{duration: 300}}>
        Reset View
    </button>
{/if}
