<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let nextDisabled: boolean = false;
    export let nextHidden: boolean = false;
    export let title: string = 'Onboarding step';

    const dispatch = createEventDispatcher();

    function handleNext() {
        dispatch('next');
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
