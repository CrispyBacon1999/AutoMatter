import {
    createDir,
    readDir,
    readTextFile,
    writeTextFile,
} from "@tauri-apps/api/fs";
import { join } from "@tauri-apps/api/path";
import { paths } from "../stores/path";

/**
 * Full path object, representing trajectories
 */
export type Path = {
    /**
     * Name of the path (shown in AutoMatter)
     */
    name: string;
    /**
     * Basic trajectory to follow, with no commands
     */
    trajectory: Waypoint[];
    /**
     * Commands to tie to the path
     */
    commands: {
        /**
         * What commands to run when stopped at a point
         * (length should be the same as the number of points)
         */
        pointCommands: Command[];
        /**
         * What commands to run when travelling between points
         * (length should be n-1 where n=number of points)
         */
        splineCommands: Command[];
    };
};

/**
 * Represents a basic point, with an X and a Y coordinate (in meters)
 */
export type Point = { x: number; y: number };

/**
 * Individual waypoint to have the robot drive through
 */
export type Waypoint = {
    /**
     * Point the robot must drive through
     * */
    anchorPoint: Point;
    /**
     * Control spline point before point
     */
    prevControl: Point | null;
    /**
     * Control spline point after point
     */
    nextControl: Point | null;
    /**
     * Angle for the robot to be at when hitting this point
     */
    holonomicAngle: number;
    /**
     * Whether the robot should reverse when leaving this point
     * (Drive against wall, then continue back the same way it came from)
     */
    isReversal: boolean;
    /**
     * Max speed the robot is allowed to go coming into spline
     */
    velOverride?: number;
};

export type Command = {} | ParallelDealineCommandGroup | SequentialCommandGroup;

/**
 * Command group that will run all commands at the same time, finishing when
 * the deadline finishes.
 */
export type ParallelDealineCommandGroup = [Command, ...Command[]];
/**
 * Runs all commands back to back. Useful for sequencing steps.
 */
export type SequentialCommandGroup = Command[];

export const pathsFolder = ["src", "main", "deploy", "automatter"];

export const generateInitialPath = (name?: string) => {
    const defaultPath: Path = {
        name: name || "New Path",
        trajectory: [
            {
                anchorPoint: {
                    x: 5,
                    y: 3,
                },
                holonomicAngle: 90,
                isReversal: false,
                nextControl: {
                    x: 6,
                    y: 4,
                },
                prevControl: null,
            },
            {
                anchorPoint: {
                    x: 9,
                    y: 3,
                },
                holonomicAngle: 90,
                isReversal: false,
                nextControl: null,
                prevControl: {
                    x: 8,
                    y: 4,
                },
            },
        ],
        commands: {
            pointCommands: [[], []],
            splineCommands: [[]],
        },
    };
    return defaultPath;
};

export const writePath = async (pathsFolder: string, path: Path) => {
    await writeTextFile(
        await join(pathsFolder, `${path.name}.json`),
        JSON.stringify(path, null, 4)
    );
};

export const loadPaths = async (robotFolder: string) => {
    const pathsFolderFull = await join(robotFolder, ...pathsFolder);
    try {
        const pathFiles = await readDir(pathsFolderFull);
        console.log(pathFiles);
        // const pathData: Path[] = [];
        if (pathFiles.length === 0) {
            const path = generateInitialPath();
            await writePath(pathsFolderFull, path);
            paths.set([path]);
            return;
        }
        const pathPromises = pathFiles.map(async (file) => {
            console.log(file);
            const text = await readTextFile(file.path);
            console.log(text);
            return JSON.parse(text);
        });

        console.log(pathPromises);
        const pathData = await Promise.all(pathPromises);
        console.log(pathData);

        paths.set(pathData);
    } catch (err) {
        console.error(err);
        await createDir(pathsFolderFull, { recursive: true });
        const path = generateInitialPath();
        await writePath(pathsFolderFull, path);
        paths.set([path]);
    }
};
