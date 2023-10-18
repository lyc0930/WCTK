import { isHighlighting } from "./highlight.mjs";
import { move_fixed_steps } from '../modules/actions.mjs';

// 迅【闪】
function xunShan(piece, steps = 1)
{
    // 正在等待响应
    if (isHighlighting())
    {
        return;
    }

    // 执行一次步数为1的移动
    piece.moveSteps = steps;

    move_fixed_steps(piece, true);
}

export { xunShan };