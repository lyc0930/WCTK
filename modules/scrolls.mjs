import { baseOf, allyPiecesOf, adjacentCells, isStayable, allPiecesOf, isRideOn } from "./utils.mjs";
import { isHighlighting, highlightCells, highlightPieces, removeHighlight } from "./highlight.mjs";
import { leap_to_cells, move_fixed_steps, swap } from "./actions.mjs";
import { yong_quan } from "./skills.mjs";

// 【暗度陈仓】
function AnDuChenCang(user, limit = 3)
{
    // 正在等待响应
    if (isHighlighting())
    {
        return;
    }

    console.log(`${user.name}使用【暗度陈仓】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var landableCells = [];
    landableCells.push(baseOf(user));
    for (const allyPiece of allyPiecesOf(user))
    {
        if (allyPiece != user)
        {
            for (const adjacentCell of adjacentCells(allyPiece.parentElement, user))
            {
                if (isStayable(adjacentCell, user) && (Math.abs(adjacentCell.row - userRow) + Math.abs(adjacentCell.col - userCol)) <= limit)
                {
                    landableCells.push(adjacentCell);
                }
            }
        }
    }
    leap_to_cells(user, landableCells, true);
}

// 【兵贵神速】
function BingGuiShenSu(user)
{
    // 正在等待响应
    if (isHighlighting())
    {
        return;
    }

    console.log(`${user.name}使用【兵贵神速】`);
    // 执行一次步数为2的移动
    user.moveSteps = 2;

    move_fixed_steps(user, true);
}

function QiMenDunJia(user, limit = 2)
{
    // 正在等待响应
    if (isHighlighting())
    {
        return;
    }

    console.log(`${user.name}使用【奇门遁甲】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var targetablePieces = [];

    for (const allPiece of allPiecesOf(user))
    {
        if (allPiece != user)
        {
            if ((Math.abs(allPiece.parentElement.row - userRow) + Math.abs(allPiece.parentElement.col - userCol) <= limit) && !yong_quan(allPiece) && !isRideOn(allPiece, "阻动"))
            {
                targetablePieces.push(allPiece);
            }
        }
    }

    function click_to_swap(event)
    {
        event.stopPropagation();

        var target = null;
        if (event.target.classList.contains("avatar"))
        {
            target = event.target.parentElement;
        }
        else if (event.target.classList.contains("piece"))
        {
            target = event.target;
        }
        else
        {
            return;
        }

        removeHighlight("targetable", click_to_swap);

        swap(user, target);
    }

    highlightPieces(targetablePieces, "targetable", click_to_swap);
}

function YouDiShenRu(user, limit = 4)
{
    // 正在等待响应
    if (isHighlighting())
    {
        return;
    }

    console.log(`${user.name}使用【诱敌深入】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var targetablePieces = [];

    for (const allPiece of allPiecesOf(user))
    {
        if ((Math.abs(allPiece.parentElement.row - userRow) + Math.abs(allPiece.parentElement.col - userCol) <= limit) && !yong_quan(allPiece) && !isRideOn(allPiece, "阻动"))
        {
            targetablePieces.push(allPiece);
        }
    }

    function click_to_move(event)
    {
        event.stopPropagation();

        var target = null;
        if (event.target.classList.contains("avatar"))
        {
            target = event.target.parentElement;
        }
        else if (event.target.classList.contains("piece"))
        {
            target = event.target;
        }
        else
        {
            return;
        }

        removeHighlight("targetable", click_to_move);

        target.moveSteps = 1;
        move_fixed_steps(target, true);
    }

    highlightPieces(targetablePieces, "targetable", click_to_move);
}

export { AnDuChenCang, BingGuiShenSu, QiMenDunJia, YouDiShenRu };