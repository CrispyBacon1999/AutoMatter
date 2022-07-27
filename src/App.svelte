<script lang="ts">
    import Button from "./lib/components/Button.svelte";
    import { readConfig } from "./lib/config/robotConfig";

    import RapidReact from "./lib/fields/RapidReact.svelte";
    import { promptForRobotCode } from "./lib/fs/folderSelect";
    import { loadPaths } from "./lib/paths";
    import PathEditor from "./lib/paths/PathEditor.svelte";
    import PointEditor from "./lib/paths/PointEditor.svelte";

    const readPaths = async () => {
        const folder = await promptForRobotCode();
        const config = await readConfig(folder);
        const paths = loadPaths(folder);
    };
</script>

<main>
    <nav>
        <Button on:click={readPaths}>Open</Button>
        <PointEditor />
    </nav>
    <PathEditor />
</main>

<style>
    main {
        display: grid;
        grid-template-columns: auto 1fr;
        height: 100vh;
    }
</style>
