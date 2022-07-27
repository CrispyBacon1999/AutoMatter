import { open } from "@tauri-apps/api/dialog";

export const promptForRobotCode = async (): Promise<string> => {
    const selected = await open({
        multiple: false,
        directory: true,
    });
    console.log(selected);
    if (selected instanceof Array) {
        return selected[0];
    }
    return selected;
};
