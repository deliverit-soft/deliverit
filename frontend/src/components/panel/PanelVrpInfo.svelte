<script lang="ts">
    import { vrpResults } from '$resources/stores.ts';
    import { durationFormat } from '$helpers/utils.ts';
    import { ArrowPathRoundedSquare, ArrowTrendingUp, Clock, Icon, Squares2x2 } from 'svelte-hero-icons';
    import { fade } from 'svelte/transition';
</script>


<style>
    .duration-stats {
        display: grid;
        grid-template-columns: 1.5rem 1fr;
        gap: .75rem 0.5rem;
        align-items: end;
        padding: 1rem;
        background-color: var(--primary-theme);
        color: var(--primary-white);
        border-radius: 1rem;
    }
</style>


<div class="duration-stats" in:fade={{ duration: 200 }}>
    <Icon src={Clock} size="1.5rem"/>
    Total duration: {durationFormat($vrpResults.executionTimes.total * 1000)}
    <Icon src={Squares2x2} size="1.5rem"/>
    Distance matrix generation: {durationFormat($vrpResults.executionTimes.matrix * 1000)}
    <Icon src={ArrowPathRoundedSquare} size="1.5rem"/>
    Route optimization: {durationFormat($vrpResults.executionTimes.vrp * 1000)}
    <Icon src={ArrowTrendingUp} size="1.5rem"/>
    Total distance: {$vrpResults.bestCost.toFixed(0)} km
</div>
