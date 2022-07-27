<script lang="ts">
    import type { Point, Waypoint } from ".";
    import { config } from "../stores/config";
    import { createEventDispatcher } from "svelte";

    export let point: Waypoint;
    export let selected: boolean = false;
    let rotating: boolean = false;
    let rotationPoint: Point = { x: 0, y: 0 };

    const dispatch = createEventDispatcher();
    const onSelect = () => {
        dispatch("selected", {
            point,
        });
    };

    function radiansToDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    function degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    function lineLength(point1: Point, point2: Point) {
        return Math.sqrt(
            Math.pow(point1.x - point2.x, 2) +
                Math.pow(point1.y - fieldHeight - point2.y, 2)
        );
    }

    const fieldHeight = 831;

    const centerPoint = {
        x: point.anchorPoint.x * 100,
        y: fieldHeight - point.anchorPoint.y * 100,
    };
    const nextPoint = {
        x: point.nextControl ? point.nextControl.x * 100 : undefined,
        y: point.nextControl
            ? fieldHeight - point.nextControl.y * 100
            : undefined,
    };
    const prevPoint = {
        x: point.prevControl ? point.prevControl.x * 100 : undefined,
        y: point.prevControl
            ? fieldHeight - point.prevControl.y * 100
            : undefined,
    };

    const isFirst = point.prevControl === null;
    const isLast = point.nextControl === null;
    const pointColor = selected
        ? "blue"
        : isFirst
        ? "green"
        : isLast
        ? "red"
        : "gray";
</script>

{#if point.prevControl}
    <line
        x1={point.anchorPoint.x * 100}
        y1={fieldHeight - point.anchorPoint.y * 100}
        x2={point.prevControl.x * 100}
        y2={fieldHeight - point.prevControl.y * 100}
        class="heading-handle-line"
        class:line-selected={selected}
        style={`stroke-dasharray: ${
            lineLength(centerPoint, prevPoint) / 4
        };stroke-dashoffset: ${lineLength(centerPoint, prevPoint) / 4}`}
    />
    <circle
        cx={point.prevControl.x * 100}
        cy={fieldHeight - point.prevControl.y * 100}
        r={8}
        fill="gray"
        stroke-width={1}
        stroke="black"
        class="heading-handle"
        class:heading-handle-selected={selected}
    />
{/if}

{#if point.nextControl}
    <line
        x1={point.anchorPoint.x * 100}
        y1={fieldHeight - point.anchorPoint.y * 100}
        x2={point.nextControl.x * 100}
        y2={fieldHeight - point.nextControl.y * 100}
        class="heading-handle-line"
        class:line-selected={selected}
        style={`stroke-dasharray: ${
            lineLength(centerPoint, nextPoint) / 4
        };stroke-dashoffset: ${lineLength(centerPoint, nextPoint) / 4}`}
    />
    <circle
        cx={point.nextControl.x * 100}
        cy={fieldHeight - point.nextControl.y * 100}
        r={8}
        fill="gray"
        stroke-width={1}
        stroke="black"
        class="heading-handle"
        class:heading-handle-selected={selected}
    />
{/if}

<rect
    width={$config.robotSize.width * 100}
    height={$config.robotSize.length * 100}
    x={point.anchorPoint.x * 100 - $config.robotSize.width * 50}
    y={fieldHeight - point.anchorPoint.y * 100 - $config.robotSize.length * 50}
    transform={`rotate(${point.holonomicAngle * -1},${
        point.anchorPoint.x * 100 - $config.robotSize.width
    },${fieldHeight - point.anchorPoint.y * 100 - $config.robotSize.length})`}
    class="robot-frame"
    class:robot-frame-selected={selected}
/>
<circle
    cx={rotating
        ? rotationPoint.x
        : centerPoint.x +
          ($config.robotSize.width / 2) *
              Math.cos(degreesToRadians(-point.holonomicAngle)) *
              100}
    cy={rotating
        ? rotationPoint.y
        : centerPoint.y +
          ($config.robotSize.length / 2) *
              Math.sin(degreesToRadians(-point.holonomicAngle)) *
              100}
    r={selected ? 8 : 6}
    fill={selected ? "red" : "gray"}
    stroke-width={1}
    stroke="black"
/>

<circle
    cx={centerPoint.x}
    cy={centerPoint.y}
    r={8}
    fill={pointColor}
    stroke-width={1}
    stroke="black"
    on:click={onSelect}
/>

<style>
    .heading-handle-line {
        stroke: rgb(150, 150, 255);
        stroke-width: 5;
        transition: stroke-dashoffset 1s ease-in-out;
    }
    .line-selected {
        stroke-dashoffset: 0 !important;
    }
    .heading-handle {
        transition: opacity 0.5s ease-in-out;
        opacity: 0;
        transition-delay: 0s;
    }
    .heading-handle-selected {
        opacity: 1;
        transition-delay: 0.5s;
    }
    .robot-frame {
        fill: none;
        stroke: black;
        stroke-width: 2;
        transition: stroke-width 0.5s ease-in-out;
    }
    .robot-frame-selected {
        stroke-width: 4;
    }
</style>
