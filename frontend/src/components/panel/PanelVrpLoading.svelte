<script lang="ts">
    import { Icon, MagnifyingGlass } from 'svelte-hero-icons';
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let duration: string = '';
    let start: number = Date.now();
    let updateDuration: NodeJS.Timeout;

    function updateDurationText() {
        const elapsed = Date.now() - start;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const milliseconds = Math.floor((elapsed % 1000));
        if (elapsed < 10000)
            duration = `${seconds}s ${milliseconds}ms`;
        else
            duration = `${minutes}m ${seconds}s`;
    }

    onMount(() => {
        updateDurationText();
        updateDuration = setInterval(updateDurationText, 20);
    });

    onDestroy(() => {
        clearInterval(updateDuration);
    });
</script>


<style>
    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--primary-theme);
        color: var(--primary-white);
        padding: 1.5rem;
        border-radius: 1rem;
    }

    .loading-icon {
        animation: bounce 2s linear infinite;
        margin-right: 2rem;
    }

    @keyframes bounce {
        from {
            scale: 1;
        }
        20% {
            scale: 1.2;
        }
        40% {
            scale: 1;
        }
        60% {
            scale: 1.2;
        }
        80% {
            scale: 1;
        }
    }
</style>


<div class="loading-container" in:fade={{duration: 200}}>
    <div class="loading-icon">
        <Icon src={MagnifyingGlass} color="var(--primary-white)" size="2rem"/>
    </div>
    Loading VRP...
    <br/>
    {duration}
</div>
