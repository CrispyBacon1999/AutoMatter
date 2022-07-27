import { writable } from "svelte/store";
import { defaultConfig } from "../config/robotConfig";
import type { RobotCodeConfig } from "../config/robotConfig";

export const config = writable<RobotCodeConfig>({
    commands: [],
    year: 2022,
    holonomic: true,
    robotSize: { width: 0.75, length: 0.75 },
});
