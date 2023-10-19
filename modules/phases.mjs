import { setCurrentPlayer, setCurrentPhase } from "./global_variables.mjs";
import { distance, PathesOf, adjacentCells, isStayable, allPiecesOf, enemyPiecesOf, cls } from "./utils.mjs";
import { highlightCells, highlightPieces, removeHighlight, isHighlighting } from "./highlight.mjs";
import { move, step } from '../modules/actions.mjs';
import { yong_quan, you_bing } from "../modules/skills.mjs";

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

    // 空白处结束移动阶段
    document.addEventListener("contextmenu", endMovePhase);
    document.addEventListener("click", endMovePhase);
}

// 定义点击高亮区域行为
function onclick(event)
{
    if (!movingPiece)
    {
        return;
    }

    event.stopPropagation();
    move(movingPiece, this, true, true);
    removeHighlight("reachable", onclick);

    // 还有移动力
    if (movingPiece && movingPiece.movePoints > 0)
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
}

// 定义结束移动阶段函数
function endMovePhase(event = null)
{
    if (event != null)
    {
        if (event.target.classList.contains("cell") && !event.target.classList.contains("reachable"))
        {
            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();
            movingPiece = null;
            removeHighlight("reachable", onclick);
            cls(1000);
            document.removeEventListener("contextmenu", endMovePhase);
            document.removeEventListener("click", endMovePhase);
            setCurrentPhase(null);
        }
    }
    else
    {
        movingPiece = null;
        removeHighlight("reachable", onclick);
        cls(1000);
        document.removeEventListener("contextmenu", endMovePhase);
        document.removeEventListener("click", endMovePhase);
        setCurrentPhase(null);
    }
}

// 〖诱兵〗移动阶段
function movePhase_you_bing(piece)
{
    // 正在等待响应
    if (isHighlighting() || piece.name !== "祖茂")
    {
        return;
    }

    setCurrentPlayer(piece);
    setCurrentPhase("移动");

    movingPiece = piece;

    var object = null;

    // 基于体力值生成移动力
    // 和选择目标不冲突，可以前置
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

    // 移动阶段开始时，你可以选择一名与你的距离为<4>以内的其他非主帅角色；
    var targetablePieces = [];
    for (const otherPiece of allPiecesOf(piece))
    {
        if (otherPiece !== piece && distance(piece, otherPiece) <= 4 && !otherPiece.carrier && !yong_quan(otherPiece))
        {
            targetablePieces.push(otherPiece);
        }
    }

    if (targetablePieces.length <= 0)
    {
        movePhase_subphase(piece); // 正常移动

        // 空白处结束移动阶段
        document.addEventListener("contextmenu", endMovePhase);
        document.addEventListener("click", endMovePhase);
    }
    else
    {
        // 高亮可选择的角色
        highlightPieces(targetablePieces, "targetable", onclick);

        // 定义点击高亮元素行为
        function onclick(event)
        {
            // event.stopPropagation();
            console.log(`祖茂发动〖诱兵〗`);
            removeHighlight("targetable", onclick);

            object = this;
            movePhase_subphase_you_bing(piece, object);

            // 空白处结束移动阶段
            document.addEventListener("contextmenu", endMovePhase_you_bing);
            document.addEventListener("click", endMovePhase_you_bing);

        }
    }

    // 定义点击高亮区域行为
    function onclick_you_bing(event)
    {
        // event.stopPropagation();

        movingPiece.movePoints -= 1;
        const s = step(movingPiece, this, true);

        you_bing(piece, object, s.direction);

        removeHighlight("reachable", onclick_you_bing);

        // 还有移动力
        if (movingPiece && movingPiece.movePoints > 0)
        {
            movePhase_subphase_you_bing(movingPiece, object);
        }
        else
        {
            endMovePhase_you_bing(event);
        }
    }


    function movePhase_subphase_you_bing(piece, object)
    {
        // 计算可到达的区域
        const reachableCells = adjacentCells(piece.parentElement, piece)

        if (piece.movePoints == 1) // 最后一步
        {
            // 移除所有不能停留的区域
            for (const cell of reachableCells)
            {
                if (!isStayable(cell, piece))
                {
                    reachableCells.splice(reachableCells.indexOf(cell), 1);
                }
            }
        }

        // 高亮可到达的区域
        highlightCells(reachableCells, "reachable", onclick_you_bing);
    }

    // 定义结束移动阶段函数
    function endMovePhase_you_bing(event)
    {
        if (movingPiece && movingPiece.movePoints > 0 && !isStayable(movingPiece.parentElement, movingPiece, false))
        {
            return;
        }

        movingPiece = null;
        if (event.target.classList.contains("cell") && !event.target.classList.contains("reachable"))
        {
            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();
            removeHighlight("reachable", onclick_you_bing);
            cls(1000);
            document.removeEventListener("contextmenu", endMovePhase_you_bing);
            document.removeEventListener("click", endMovePhase_you_bing);
            setCurrentPhase(null);
        }
    }
}

export { movePhase, endMovePhase, movePhase_you_bing };