<script lang="ts">
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";

    import RapidReact from "../fields/RapidReact.svelte";
    import { paths, activePathId } from "../stores/path";
    import { convertPathToSVGPoints } from "./pathToSVG";
    import Waypoint from "./Waypoint.svelte";
    import type { Waypoint as Point } from "../paths/index";

    const fields = {
        2022: RapidReact,
    };
    let selectedPointId = undefined;
    const changePoint = (point: Point, index: number) => {
        console.log(point);
        const pathList = get(paths);
        pathList[get(activePathId)].trajectory[index] = point;
        paths.set(pathList);
    };
</script>

<div class="path-editor">
    <svelte:component this={fields[2022]} />
    <svg class="path-overlay" viewBox="0 0 1654 831">
        {#if $paths.length > $activePathId}
            <path
                d={convertPathToSVGPoints($paths[$activePathId])}
                stroke="#999999"
                stroke-width="4"
                fill="none"
            />
            {#each $paths[0].trajectory as p, index}
                <Waypoint
                    point={p}
                    selected={selectedPointId === index}
                    on:selected={() => {
                        selectedPointId = index;
                    }}
                    on:change={(event) =>
                        changePoint(event.detail.point, index)}
                />
            {/each}
        {/if}
    </svg>
</div>

<style>
    .path-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        max-height: 100%;
    }

    .path-editor {
        position: relative;
        width: 100%;
    }
</style>
