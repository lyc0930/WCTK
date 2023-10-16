import { Pieces } from "../scripts/main.js";
import { adjacentCells, PathesOf, isPassable, isStayable, baseOf, enemyBaseOf, piecesIn } from "./utils.mjs";
import { highlightCells, highlightPieces, removeHighlight } from "./highlight.mjs";
import { move } from '../modules/actions.mjs';

const movingPieces = [];

// 移动阶段
function movePhase(piece)
{
    // 基于体力值生成移动力
    piece.movePoints = piece.HP;

    movePhase_subphase(piece);
}

function movePhase_subphase(piece)
{
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
        const target = event.target;
        if (target.classList.contains("cell"))
        {
            move(piece, target, true, true);
        }
        else if (target.classList.contains("piece") || target.classList.contains("flag"))
        {
            move(piece, target.parentElement, true, true);
        }
        else if (target.classList.contains("avatar"))
        {
            move(piece, target.parentElement.parentElement, true, true);
        }
        else
        {
            return;
        }
        removeHighlight("reachable", onclick);
        movingPieces.pop();

        // 还有移动力
        if (piece.movePoints > 0)
        {
            movePhase_subphase(piece);
        }
        else
        {
            endMovePhase(event);
        }
    }

    // 定义结束移动阶段函数
    function endMovePhase(event)
    {
        event.preventDefault();
        removeHighlight("reachable", onclick);
        document.removeEventListener("contextmenu", endMovePhase);
        movingPieces.pop();
    }

    // 高亮可到达的区域
    highlightCells(reachableCells, "reachable", onclick);

    // 右键结束移动阶段
    document.addEventListener("contextmenu", endMovePhase, { once: true });
}

export { movePhase };