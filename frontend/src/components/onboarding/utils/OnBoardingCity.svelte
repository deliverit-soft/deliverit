<script lang="ts">
    import type { City } from '$models/city.ts';
    import { Icon, Trash } from 'svelte-hero-icons';
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    export let city: City;

    const dispatch = createEventDispatcher();

    function handleCityDelete() {
        dispatch('delete', city.insee_code);
    }
</script>


<style>
    .city {
        padding: .5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .5rem;
        border-radius: .5rem;
        background: transparent;
        box-shadow: var(--shadow-sm);
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        border-radius: .5rem;
        height: 1.5rem;
        width: 1.5rem;
        color: red;
        transition: scale .2s;
    }

    button:hover {
        scale: 1.1;
    }
</style>


<div class="city" in:fade={{duration: 200}}>
    <div>
        {city.insee_code} {city.name}
    </div>
    <button on:click={handleCityDelete}>
        <Icon src={Trash} size="1.5rem"/>
    </button>
</div>
