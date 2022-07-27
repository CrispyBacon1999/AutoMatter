import { readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { config as configStore } from "../stores/config";

export type RobotCodeConfig = {
    commands: string[];
    year: 2022;
    holonomic: boolean;
    robotSize: {
        width: number;
        length: number;
    };
};

export const defaultConfig: RobotCodeConfig = {
    commands: [],
    year: 2022,
    holonomic: true,
    robotSize: { width: 0.75, length: 0.75 },
};

/**
 * Read the configuration file from the robot directory.
 * If there isn't one, write the defaults instead. If there is,
 * but there are missing keys, those will be written as well.
 *
 * @param robotDir Directory of robot code
 * @returns Full configuration file
 */
export const readConfig = async (
    robotDir: string
): Promise<RobotCodeConfig> => {
    try {
        const config = await readTextFile(
            await join(robotDir, "automatter.config.json")
        );
        await writeConfig(robotDir, JSON.parse(config));
        const fullConfig = Object.assign(defaultConfig, JSON.parse(config));
        configStore.set(fullConfig);
        return fullConfig;
    } catch (err) {
        configStore.set(defaultConfig);
        return await writeConfig(robotDir);
    }
};

/**
 * Write a configuration file to the robot code directory.
 * @param robotDir Directory of robot code
 * @param config Existing config data to write
 * @returns The full config
 */
export const writeConfig = async (
    robotDir: string,
    config?: RobotCodeConfig
): Promise<RobotCodeConfig> => {
    const configToWrite = defaultConfig;
    if (config !== undefined) {
        Object.assign(defaultConfig, config);
    }
    await writeTextFile(
        await join(robotDir, "automatter.config.json"),
        JSON.stringify(configToWrite, null, 4)
    );
    return configToWrite;
};
