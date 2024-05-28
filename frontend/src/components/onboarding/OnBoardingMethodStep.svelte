<script lang="ts">
    import { ArchiveBoxArrowDown, ArrowUpTray, GlobeEuropeAfrica, Icon } from 'svelte-hero-icons';
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function handleChoice(choice: string) {
        dispatch("choice", choice);
    }
</script>

<style>
    .choices-container {
        display: flex;
        flex-direction: row;
        gap: 2rem;
    }

    .onboarding-choice {
        background: inherit;
        border: none;
        padding: 1rem;
        font-size: inherit;
        border-radius: .5rem;
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        height: 10rem;
        width: 10rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: all .2s;
    }

    .onboarding-choice:hover {
        box-shadow: var(--shadow-md);
        transform: scale(1.05);
    }
</style>

<div class="choices-container">
    <button class="onboarding-choice" on:click={() => handleChoice("import")}>
        Import instance
        <Icon src={ArrowUpTray} size="2rem"/>
    </button>

    <button class="onboarding-choice" on:click={() => handleChoice("create")}>
        Create new instance
        <Icon src={GlobeEuropeAfrica} size="2rem"/>
    </button>

    <button class="onboarding-choice" on:click={() => handleChoice("history")}>
        Instances history
        <Icon src={ArchiveBoxArrowDown} size="2rem"/>
    </button>
</div>
