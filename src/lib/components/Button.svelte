<script lang="ts">
</script>

<button class="button" on:click>
    <slot />
</button>

<style>
    .button {
        font-size: 14px;
        padding: 0.5em;
        background-color: goldenrod;
        color: white;
        border-radius: 4px;
        outline: none;
        box-shadow: none;
        border: none;
    }
</style>
