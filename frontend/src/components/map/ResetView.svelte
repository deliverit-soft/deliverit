<script lang="ts">
    import { mapStore } from '../../resources/stores.ts';
    import { DEFAULT_POSITION } from '../../resources/defaults.ts';
    import { Truck } from '../../helpers/truck.ts';

    export function resetView() {
        Truck.unfollowAll();
        $mapStore.flyTo({
            ...DEFAULT_POSITION,
            duration: 1000,
        });
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

<button on:click={resetView}>
    Reset View
</button>
