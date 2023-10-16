import { Pieces } from "../scripts/main.js";
import { adjacentCells, PathesOf, isPassable, isStayable, baseOf, enemyBaseOf, piecesIn, HPColor, draw } from "./utils.mjs";
import { highlightCells, highlightPieces, removeHighlight } from "./highlight.mjs";
import { move } from '../modules/actions.mjs';

const movingPieces = [];

// 移动阶段
// TODO 多次移动
function movePhase(piece)
{
    // 基于体力值生成移动力
    piece.movePoints = piece.HP;

    // 棋子压栈
    movingPieces.push(piece);

    // 计算可到达的区域
    const Pathes = PathesOf(piece);
    const reachableCells = [];

    for (const cell of document.getElementsByClassName("cell"))
    {
        const row = cell.row;
        const col = cell.col;
        if (Pathes[row][col] && (Pathes[row][col].length - 1 <= piece.movePoints))
        {
            reachableCells.push(cell);
        }
    }

    // 定义点击高亮区域行为
    function onclick(event)
    {
        move(piece, event.target, true);
        removeHighlight("reachable", onclick);
        // 出栈
        movingPieces.pop();
    }

    // 高亮可到达的区域
    highlightCells(reachableCells, "reachable", onclick);

}

export { movePhase };