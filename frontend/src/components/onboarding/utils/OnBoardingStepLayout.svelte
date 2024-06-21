<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { ChevronLeft, Icon } from 'svelte-hero-icons';

    export let nextDisabled: boolean = false;
    export let nextHidden: boolean = false;
    export let title: string = 'Onboarding step';
    export let allowBack: boolean = false;

    const dispatch = createEventDispatcher();

    function handleNext() {
        dispatch('next');
    }

    function handleBack() {
        dispatch('back');
    }
</script>


<style>
    .onboarding-container {
        width: 50.5rem;
        height: 32rem;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .onboarding-title {
        display: flex;
        align-items: center;
        justify-content: start;
        gap: 1rem;
    }

    .onboarding-back {
        cursor: pointer;
        height: 2rem;
        width: 2rem;
        border: none;
        background: none;
    }

    h2 {
        font-size: 2rem;
        margin: 0;
    }

    .onboarding-body {
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    .create-next {
        display: flex;
        justify-content: center;
    }

    .create-next button {
        background-color: var(--primary-theme);
        color: var(--primary-white);
        border: none;
        border-radius: .5rem;
        padding: .5rem 1rem;
        font-size: inherit;
        cursor: pointer;
    }

    .create-next button:disabled {
        background-color: var(--light-gray);
        cursor: not-allowed;
    }
</style>


<div class="onboarding-container">
    <div class="onboarding-title">
        {#if allowBack}
            <button class="onboarding-back" on:click={handleBack}>
                <Icon src={ChevronLeft} size="2rem"/>
            </button>
        {/if}
        <slot name="title">
            <h2>{title}</h2>
        </slot>
    </div>

    <slot name="controls"/>

    <div class="onboarding-body">
        <slot/>
    </div>

    {#if !nextHidden}
        <div class="create-next">
            <button disabled={nextDisabled} on:click={handleNext}>Next</button>
        </div>
    {/if}
</div>
