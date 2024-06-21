<script lang="ts">
    import type { PathProgressEventDetail, TruckModel } from '$models/truck-model.ts';
    import type { Position } from 'geojson';
    import { onDestroy, onMount } from 'svelte';
    import { pathLength } from '$helpers/geo.ts';
    import { TRUCK_HIGH_SPEED, TRUCK_LOW_SPEED } from '$resources/defaults.ts';
    import { Eye, Icon, Truck } from 'svelte-hero-icons';
    import { wait } from '$helpers/utils.ts';

    export let truck: TruckModel;
    export let path: Position[];
    export let index: number;
    export let truckColor: string;

    let pathLen = pathLength(path);
    let progress = 0;

    onMount(() => {
        truck.speed = TRUCK_HIGH_SPEED;
        truck.followPath(path);
        // @ts-ignore
        truck.addEventListener('pathProgress', handlePathProgress);
        truck.addEventListener('cameraFollow', handleCameraFollow);
        truck.addEventListener('cameraUnfollow', handleCameraUnfollow);
    });

    onDestroy(() => {
        // @ts-ignore
        truck.removeEventListener('pathProgress', handlePathProgress);
        truck.removeEventListener('cameraFollow', handleCameraFollow);
        truck.removeEventListener('cameraUnfollow', handleCameraUnfollow);
        truck.destroy();
    });

    function handlePathProgress(ev: CustomEvent<PathProgressEventDetail>) {
        progress = ev.detail.progress;
    }

    function handleCameraFollow() {
        truck.speed = TRUCK_LOW_SPEED;
    }

    async function handleCameraUnfollow() {
        await wait(1000);
        truck.speed = TRUCK_HIGH_SPEED;
    }

    function handleTruckFollow() {
        truck.follow(true);
    }
</script>


<style>
    .truck-container {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        padding: 1rem;
        box-shadow: var(--shadow-md);
        border-radius: 0.5rem;
        margin: 1rem 0;
    }

    .truck-header {
        display: flex;
        align-items: end;
        margin-bottom: 0.5rem;
        gap: .5rem;
    }

    .truck-follow {
        background-color: transparent;
        border: none;
        height: 100%;
        cursor: pointer;
        color: var(--primary-theme);
    }
</style>


<div class="truck-container">
    <div class="truck-info">
        <div class="truck-header">
            <Icon src={Truck} size="1.5rem" color={truckColor} />
            <span>Truck #{index + 1}</span>
        </div>
        <span>
            Progress: {Math.round(pathLen * progress / 1000)} km / {Math.round(pathLen / 1000)} km
        </span>
    </div>

    <button class="truck-follow" on:click={handleTruckFollow}>
        <Icon src={Eye} size="1.5rem"/>
    </button>
</div>
