import { Pieces } from "../scripts/main.js";
import { distance, PathesOf, isPassable, isStayable, baseOf, enemyPiecesOf, piecesIn } from "./utils.mjs";
import { highlightCells, highlightPieces, removeHighlight, isHighlighting } from "./highlight.mjs";
import { move } from '../modules/actions.mjs';
import { yong_quan } from "../modules/skills.mjs";

// 移动阶段
function movePhase(piece)
{
    // 正在等待响应
    if (isHighlighting())
    {
        return;
    }

    // 基于体力值生成移动力
    piece.movePoints = piece.HP;

    // 〖拒敌〗
    var ju_di = false;
    var limit = 4;
    for (const enemyPiece of enemyPiecesOf(piece))
    {
        if (enemyPiece.name === "王异")
        {
            if (distance(piece, enemyPiece) <= limit && !yong_quan(piece))
            {
                console.log("王异发动【拒敌】");
                ju_di = true;
            }
            break;
        }
    }
    if (ju_di)
    {
        piece.movePoints -= 1;
    }

    // 〖奔命〗
    if (piece.name === "孙乾")
    {
        console.log("孙乾发动【奔命】");
        piece.movePoints = 4;
    }

    movePhase_subphase(piece);
}

function movePhase_subphase(piece)
{
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
        if (event.target.classList.contains("cell") && !event.target.classList.contains("reachable") && event.target != piece.parentElement)
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();
            removeHighlight("reachable", onclick);
            document.removeEventListener("contextmenu", endMovePhase);
            document.removeEventListener("click", endMovePhase);
        }
    }

    // 高亮可到达的区域
    highlightCells(reachableCells, "reachable", onclick);

    // 空白处结束移动阶段
    document.addEventListener("contextmenu", endMovePhase);
    document.addEventListener("click", endMovePhase);
}

export { movePhase };