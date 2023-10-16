import { adjacentCells, PathesOf, isPassable, isStayable, baseOf, enemyBaseOf, piecesIn } from "./utils.mjs";
import { move, move_fixed_steps } from '../modules/actions.mjs';

// 迅【闪】
function xunShan(piece, steps = 1)
{
    // 执行一次步数为1的移动
    piece.moveSteps = steps;

    move_fixed_steps(piece, true);
}

export { xunShan };