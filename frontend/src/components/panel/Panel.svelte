<script lang="ts">
    import PanelBrand from './PanelBrand.svelte';
    import PanelInstanceInfo from '$components/panel/PanelInstanceInfo.svelte';
    import PanelVrpLoading from '$components/panel/PanelVrpLoading.svelte';
    import PanelVrpInfo from '$components/panel/PanelVrpInfo.svelte';

    export let vrpStep: 'onboarding' | 'vrp' | 'done';
</script>

<style>
    aside {
        width: 25rem;
        height: calc(100% - 2rem);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        z-index: 1;
        position: relative;
        padding: 1rem;
        overflow: hidden auto;
    }
</style>

<aside>
    <PanelBrand/>
    {#if vrpStep !== 'onboarding'}
        <PanelInstanceInfo/>
    {/if}

    {#if vrpStep === 'vrp'}
        <PanelVrpLoading/>
    {:else if vrpStep === 'done'}
        <PanelVrpInfo/>
    {/if}
</aside>
