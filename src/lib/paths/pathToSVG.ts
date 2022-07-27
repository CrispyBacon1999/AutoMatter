import type { Path } from ".";

const fieldHeight = 831;

export const convertPathToSVGPoints = (path: Path) => {
    const traj = path?.trajectory;
    let svgCommands = [];
    if (traj && traj.length > 1) {
        svgCommands.push(
            `M ${traj[0].anchorPoint.x * 100},${
                fieldHeight - traj[0].anchorPoint.y * 100
            }`
        );
        for (let i = 0; i < traj.length - 1; i++) {
            const point = traj[i];
            const nextPoint = traj[i + 1];
            svgCommands.push(
                `C ${point.nextControl.x * 100},${
                    fieldHeight - point.nextControl.y * 100
                } ${nextPoint.prevControl.x * 100},${
                    fieldHeight - nextPoint.prevControl.y * 100
                } ${nextPoint.anchorPoint.x * 100},${
                    fieldHeight - nextPoint.anchorPoint.y * 100
                }`
            );
        }
    }
    // console.log(svgCommands);
    return svgCommands.join(" ");
};
