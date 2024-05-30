<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { searchCities } from '$helpers/api.ts';
    import type { City } from '$models/city.ts';

    const dispatch = createEventDispatcher();

    let input: HTMLInputElement;
    let value = '';
    let cities: City[] = [];

    let selectedIndex = -1;

    onMount(() => {
        input.focus();
    });

    $: handleSearch(value);

    async function handleSearch(_: string) {
        if (value.length < 3)
            cities = [];

        cities = await searchCities(value, 5);
        selectedIndex = -1;
    }

    function selectCity(index = -1) {
        let choice: City | undefined;
        if (index !== -1)
            choice = cities[index];
        else
            choice = cities[Math.max(selectedIndex, 0)];

        if (choice)
            dispatch('select', choice);
    }

    function handleKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Enter')
            selectCity();

        if (ev.key === 'Escape')
            dispatch('close');

        if (![ 'ArrowUp', 'ArrowDown' ].includes(ev.key))
            return;

        ev.preventDefault();

        if (ev.key === 'ArrowUp')
            selectedIndex = Math.max(selectedIndex - 1, 0);
        else
            selectedIndex = Math.min(selectedIndex + 1, cities.length - 1);
    }
</script>


<style>
    .popup-container {
        display: grid;
        place-items: center;
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    .popup-content {
        background-color: var(--primary-white);
        border-radius: 1rem;
        padding: 1rem;
        width: 30rem;
        height: 17.25em;
        box-shadow: var(--shadow-md);
    }

    input {
        width: 100%;
        padding: .5rem;
        border: 1px solid var(--light-gray);
        border-radius: .5rem;
        margin-bottom: 1rem;
    }

    .search-result {
        width: 100%;
        border: none;
        background: inherit;
        margin-top: .5rem;
        padding: .5rem;
        border-radius: .5rem;
        box-shadow: var(--shadow-sm);
        text-align: start;
        font-size: inherit;
        cursor: pointer;
    }

    .search-result.selected {
        box-shadow: var(--shadow-md-theme);
    }
</style>


<div class="popup-container" on:click|self={() => dispatch('close')} role="dialog" on:keydown={handleKeyDown}>
    <div class="popup-content">
        <input type="search" bind:this={input} bind:value placeholder="Search for a city"/>
        {#each cities as city, index}
            <button class="search-result" class:selected={index === selectedIndex} on:click={() => selectCity(index)}>
                {city.name}
            </button>
        {/each}
    </div>
</div>
