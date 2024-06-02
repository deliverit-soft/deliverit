<script lang="ts">
    import { mapStore } from '$resources/stores.ts';
    import PanelBrand from './PanelBrand.svelte';
    import PanelInstanceInfo from '$components/panel/PanelInstanceInfo.svelte';
    import PanelVrpLoading from '$components/panel/PanelVrpLoading.svelte';

    export let vrpStep: 'onboarding' | 'vrp' | 'done';

    let isResizing = false;
    let panel: HTMLElement;
    const minWidth = 300;
    const maxWidth = 500;

    function handleResizeStart() {
        isResizing = true;
    }

    function handleResizeEnd() {
        isResizing = false;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isResizing)
            return;

        const width = Math.min(maxWidth, Math.max(minWidth, event.clientX)) - 32;
        panel.style.width = `${width}px`;
        $mapStore.resize();
    }

    function handleDblClick() {
        panel.style.width = '25rem';
        $mapStore.resize();
    }
</script>

<style>
    aside {
        width: 25rem;
        height: calc(100% - 2rem);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        z-index: 1;
        position: relative;
        padding: 1rem;
    }

    .resizer {
        height: 100%;
        width: 2rem;
        cursor: ew-resize;
        position: absolute;
        right: -1rem;
        top: 0;
        user-select: none;
        transition: opacity 0.2s;
    }
</style>

<svelte:body on:mousemove={handleMouseMove} on:mouseup={handleResizeEnd}/>

<aside bind:this={panel}>
    <PanelBrand/>
    {#if vrpStep !== 'onboarding'}
        <PanelInstanceInfo/>
    {/if}

    {#if vrpStep === 'vrp'}
        <PanelVrpLoading/>
    {:else if vrpStep === 'done'}
    {/if}
    <div class="resizer" on:dblclick={handleDblClick} on:mousedown={handleResizeStart} role="none"/>
</aside>
