import { baseOf, allyPiecesOf, adjacentCells, isStayable, allPiecesOf } from "./utils.mjs";
import { highlightCells, highlightPieces } from "./highlight.mjs";

function AnDuChenCang(user, limit = 3)
{
    console.log(`${user.name}使用【暗度陈仓】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var landableCells = [];
    landableCells.push(baseOf(user));
    jumpingPiece = user;
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
    highlightCells(landableCells, "landable", clickCell_jump);
}

function BingGuiShenSu(user)
{
    console.log(`${user.name}使用【兵贵神速】`);
    user.moveSteps = 2;
    moveSteps(user, true);
}

function QiMenDunJia(user, limit = 2)
{
    console.log(`${user.name}使用【奇门遁甲】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var targetablePieces = [];
    jumpingPiece = user;

    for (const allPiece of allPiecesOf(user))
    {
        if (allPiece != user)
        {
            if (Math.abs(allPiece.parentElement.row - userRow) + Math.abs(allPiece.parentElement.col - userCol) <= limit)
            {
                targetablePieces.push(allPiece);
            }
        }
    }
    highlightPieces(targetablePieces, "targetable", clickPiece_swap);
}

function YouDiShenRu(user, limit = 4)
{
    console.log(`${user.name}使用【诱敌深入】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var targetablePieces = [];

    for (const allPiece of allPiecesOf(user))
    {
        if (Math.abs(allPiece.parentElement.row - userRow) + Math.abs(allPiece.parentElement.col - userCol) <= limit)
        {
            targetablePieces.push(allPiece);
        }
    }
    highlightPieces(targetablePieces, "targetable", clickPiece_control);
}

export { AnDuChenCang, BingGuiShenSu, QiMenDunJia, YouDiShenRu };