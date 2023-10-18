import { currentPlayer, setCurrentPlayer, currentPhase, setCurrentPhase } from "../scripts/main.js";
import { distance, PathesOf, isPassable, isStayable, baseOf, enemyPiecesOf, piecesIn } from "./utils.mjs";
import { highlightCells, highlightPieces, removeHighlight, isHighlighting } from "./highlight.mjs";
import { move } from '../modules/actions.mjs';
import { yong_quan } from "../modules/skills.mjs";

var movingPiece = null;

// 移动阶段
function movePhase(piece)
{
    // 正在等待响应
    if (isHighlighting())
    {
        return;
    }

    setCurrentPlayer(piece);
    setCurrentPhase("移动");

    movingPiece = piece;

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

// 定义点击高亮区域行为
function onclick(event)
{
    if (!movingPiece)
    {
        return;
    }

    event.stopPropagation();
    const target = event.target;
    if (target.classList.contains("cell"))
    {
        move(movingPiece, target, true, true);
    }
    else if (target.classList.contains("piece") || target.classList.contains("flag"))
    {
        move(movingPiece, target.parentElement, true, true);
    }
    else if (target.classList.contains("avatar"))
    {
        move(movingPiece, target.parentElement.parentElement, true, true);
    }
    else
    {
        return;
    }
    removeHighlight("reachable", onclick);

    // 还有移动力
    if (movingPiece.movePoints > 0)
    {
        movePhase_subphase(movingPiece);
    }
    else
    {
        endMovePhase(event);
    }
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

    // 高亮可到达的区域
    highlightCells(reachableCells, "reachable", onclick);

    // 空白处结束移动阶段
    document.addEventListener("contextmenu", endMovePhase);
    document.addEventListener("click", endMovePhase);
}

// 定义结束移动阶段函数
function endMovePhase(event = null)
{
    if (event != null)
    {
        if (event.target.classList.contains("cell") && !event.target.classList.contains("reachable"))
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();
            movingPiece = null;
            removeHighlight("reachable", onclick);
            document.removeEventListener("contextmenu", endMovePhase);
            document.removeEventListener("click", endMovePhase);
            setCurrentPhase(null);
        }
    }
    else
    {
        movingPiece = null;
        removeHighlight("reachable", onclick);
        document.removeEventListener("contextmenu", endMovePhase);
        document.removeEventListener("click", endMovePhase);
        setCurrentPhase(null);
    }
}

export { movePhase, endMovePhase };