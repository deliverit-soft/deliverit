<script lang="ts">
    import { getHistory, type HistoryElement, loadInstance } from '$helpers/history.ts';
    import { createEventDispatcher, onMount } from 'svelte';
    import OnBoardingStepLayout from '$components/onboarding/utils/OnBoardingStepLayout.svelte';
    import { ArchiveBox, Calendar, Icon, MapPin, Truck } from 'svelte-hero-icons';

    const dispatch = createEventDispatcher();

    onMount(() => {
        history = getHistory().toReversed();
    });

    let history: HistoryElement[] = [];

    const dateFormatter = new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    function handleInstanceClick(instance: HistoryElement) {
        loadInstance(instance);
        dispatch('next');
    }
</script>


<style>
    .history-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        width: calc(100% - 1rem);
        padding: .5rem;
    }

    .history-element {
        display: grid;
        grid-template-columns: 1.5rem 1fr;
        align-items: end;
        gap: 1rem .5rem;
        padding: 1rem;
        box-shadow: var(--shadow-sm);
        border-radius: 1rem;
        cursor: pointer;
        transition: box-shadow .2s;
        border: none;
        text-align: start;
        background: transparent;
        font-size: inherit;
    }

    .history-element:hover {
        box-shadow: var(--shadow-md-theme);
    }
</style>


<OnBoardingStepLayout title="Instances history" nextHidden>
    <div class="history-container">
        {#each history as element}
            <button class="history-element" on:click={() => handleInstanceClick(element)}>
                <Icon src={Truck} size="1.5rem" />
                {element.binPackingResult.trucksUsed} trucks
                <Icon src={ArchiveBox} size="1.5rem" />
                {element.binPackingResult.packagesPlaced} packages
                <Icon src={MapPin} size="1.5rem" />
                {element.startCities.length} starting cities
                <Icon src={Calendar} size="1.5rem" />
                {dateFormatter.format(element.date)}
            </button>
        {/each}
    </div>
</OnBoardingStepLayout>
