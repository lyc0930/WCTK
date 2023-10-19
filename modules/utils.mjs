import { HERO_DATA, weapons, armors, horses } from './data.mjs';
import { currentPlayer, currentPhase } from "./global_variables.mjs";
import { yong_quan } from "./skills.mjs";

// 计算距离
function distance(P, Q)
{
    var cellP = P;
    var cellQ = Q;
    if (P.classList.contains("piece"))
    {
        cellP = P.parentElement;
    }
    if (Q.classList.contains("piece"))
    {
        cellQ = Q.parentElement;
    }
    return Math.abs(cellP.row - cellQ.row) + Math.abs(cellP.col - cellQ.col);
}

// 计算路径
function PathesOf(piece)
{
    var Pathes = new Array(7)
    for (var i = 0; i < 7; i++)
    {
        Pathes[i] = new Array(7)
        for (var j = 0; j < 7; j++)
        {
            Pathes[i][j] = null;
        }
    }

    var queue = [];
    queue.push(piece.parentElement);
    const startRow = piece.parentElement.row;
    const startCol = piece.parentElement.col;
    Pathes[startRow][startCol] = [piece.parentElement];

    while (queue.length)
    {
        const currentCell = queue.shift();

        // 〖冲杀〗
        // 当你于移动阶段声明你执行的移动时，你可以进入有敌方角色的区域（并Stop）；
        var subject = piece;
        var chong_sha = (currentPhase == "移动" && piece.name === "张绣" && subject === piece);
        var chong_sha_stop = false;
        for (const pieceInCell of piecesIn(currentCell))
        {
            if (enemyPiecesOf(piece).includes(pieceInCell) && chong_sha && !isRideOn(pieceInCell, "阻动"))
            {
                chong_sha_stop = true;
                break;
            }
        }
        if (chong_sha_stop)
        {
            continue;
        }

        const row = currentCell.row;
        const col = currentCell.col;
        for (const cell of adjacentCells(currentCell, piece))
        {
            const nextRow = cell.row;
            const nextCol = cell.col;
            if (Pathes[nextRow][nextCol] == null)
            {
                Pathes[nextRow][nextCol] = Pathes[row][col].concat([cell]);
                queue.push(cell);
            }
        }
    }

    // 删除起点
    Pathes[startRow][startCol] = null;

    for (const cell of document.getElementsByClassName("cell"))
    {
        const row = cell.row;
        const col = cell.col;
        if (!isStayable(cell, piece))
        {
            Pathes[row][col] = null;
        }
    }

    return Pathes;
}

// 可停留
function isStayable(cell, piece = null, reentry = true)
{
    // 如果不是重新进入，且棋子已经在该区域，那么可以停留
    if (cell === piece.parentElement && !reentry)
    {
        if (cell.classList.contains("camp") || cell.classList.contains("base"))
        {
            return true;
        }
        else if (cell.classList.contains("ridge"))
        {
            return false;
        }
        else if (piecesIn(cell).length > 1)
        {
            return false;
        }
    }

    var hold_by_enemy = false;
    for (const enemyPiece of enemyPiecesOf(piece))
    {
        if (cell.contains(enemyPiece))
        {
            hold_by_enemy = true;
            break;
        }
    }

    // 〖固城〗
    var gu_cheng = false;
    for (const enemyPiece of enemyPiecesOf(piece))
    {
        if (enemyPiece.name === "曹仁")
        {
            gu_cheng = true;
            break;
        }
    }

    if (hold_by_enemy && gu_cheng)
    {
        if (cell.classList.contains("base"))
        {
            if (piece.classList.contains("blue-piece") && !cell.classList.contains("Blue"))
            {
                return false;
            }
            if (piece.classList.contains("red-piece") && !cell.classList.contains("Red"))
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    if (cell.classList.contains("camp") || cell.classList.contains("base"))
    {
        return true;
    }
    else if (cell.classList.contains("ridge"))
    {
        return false;
    }
    // 〖冲杀〗
    // 当你于移动阶段声明你执行的移动时，你可以进入有敌方角色的区域
    var subject = piece;
    var chong_sha = (currentPhase == "移动" && piece.name === "张绣" && subject === piece);
    for (const pieceInCell of piecesIn(cell))
    {
        if (allyPiecesOf(piece).includes(pieceInCell))
        {
            return false;
        }
        else // enemyPiecesOf(piece).includes(pieceInCell)
        {
            if (chong_sha)
            {
                if (!yong_quan(pieceInCell) && !isRideOn(pieceInCell, "阻动"))
                {
                    return true;
                }
            }
            else
            {
                return false;
            }
        }
    }

    if (chong_sha && hold_by_enemy) // cell中的棋子都是敌方不能动的棋子
    {
        return false;
    }

    return true;
}

// 可穿越
function isPassable(cell, piece = null)
{
    // 如果可以停留必然可以穿越
    if (isStayable(cell, piece))
    {
        return true;
    }
    else
    {
        // 【穿越马】
        if (isRideOn(piece, "穿越"))
        {
            var hold_by_enemy = false;
            for (const enemyPiece of enemyPiecesOf(piece))
            {
                if (cell.contains(enemyPiece))
                {
                    hold_by_enemy = true;
                    break;
                }
            }

            // 〖固城〗
            var gucheng = false;
            for (const enemyPiece of enemyPiecesOf(piece))
            {
                if (enemyPiece.name === "曹仁")
                {
                    gucheng = true;
                    break;
                }
            }

            if (hold_by_enemy && gucheng)
            {
                if (cell.classList.contains("base"))
                {
                    if (piece.classList.contains("blue-piece") && !cell.classList.contains("Blue"))
                    {
                        return false;
                    }
                    if (piece.classList.contains("red-piece") && !cell.classList.contains("Red"))
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            return true;
        }

        return false;
    }
}

// 相邻区域
function adjacentCells(cell, piece = null)
{
    var adjCells = [];
    const cells = document.getElementsByClassName("cell");
    const row = cell.row;
    const col = cell.col;
    for (var i = 0; i < 4; i++)
    {
        // 下上右左
        const nextRow = row + (i === 0 ? 1 : (i === 1 ? -1 : 0));
        const nextCol = col + (i === 2 ? 1 : (i === 3 ? -1 : 0));
        const nextCell = cells[nextRow * 7 + nextCol];
        if (nextRow >= 0 && nextRow < 7 && nextCol >= 0 && nextCol < 7 && isPassable(nextCell, piece))
        {
            adjCells.push(nextCell);
        }
    }

    // 〖渡江〗
    if (piece === currentPlayer && piece.name === "吕蒙" && cell.classList.contains("lake"))
    {
        for (const lakeCell of document.getElementsByClassName("lake"))
        {
            if (isPassable(lakeCell, piece))
            {
                adjCells.push(lakeCell);
            }
        }
    }

    return adjCells;
}

// 距离最近的可进入区域
function nearestCellOf(piece)
{
    var nearestCells = [];
    var minDistance = 100;
    for (const cell of document.getElementsByClassName("cell"))
    {
        if (isStayable(cell, piece))
        {
            const d = distance(piece, cell);
            if (d < minDistance)
            {
                minDistance = d;
                nearestCells = [cell];
            }
            else if (d === minDistance)
            {
                nearestCells.push(cell);
            }
        }
    }
    return nearestCells;
}

// 是否装备特定类型的坐骑
function isRideOn(piece, horse_type)
{
    for (const horse of piece.horses)
    {
        if (horses[horse] == horse_type)
        {
            return true;
        }
    }
    return false;
}

// 所有棋子
function allPiecesOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        const allPieces = document.getElementsByClassName("piece");
        return Array.from(allPieces).filter(piece => !piece.parentElement.classList.contains("grave"));
    }
    return null;
}

// 所有己方棋子
function allyPiecesOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        if (piece.classList.contains("red-piece"))
        {
            const redPieces = document.getElementsByClassName("red-piece");
            return Array.from(redPieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
        else if (piece.classList.contains("blue-piece"))
        {
            const bluePieces = document.getElementsByClassName("blue-piece");
            return Array.from(bluePieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
        else
        {
            throw new Error("Invalid faction");
        }
    }
    return null;
}

// 所有敌方棋子
function enemyPiecesOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        if (piece.classList.contains("red-piece"))
        {
            const bluePieces = document.getElementsByClassName("blue-piece");
            return Array.from(bluePieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
        else if (piece.classList.contains("blue-piece"))
        {
            const redPieces = document.getElementsByClassName("red-piece");
            return Array.from(redPieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
        else
        {
            throw new Error("Invalid faction");
        }
    }
    return null;
}

// 大本营
function baseOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        if (piece.classList.contains("red-piece"))
        {
            return document.getElementsByClassName("Red base")[0];
        }
        else if (piece.classList.contains("blue-piece"))
        {
            return document.getElementsByClassName("Blue base")[0];
        }
        else
        {
            throw new Error("Invalid faction");
        }
    }
    return null;
}

// 敌方大本营
function enemyBaseOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        if (piece.classList.contains("red-piece"))
        {
            return document.getElementsByClassName("Blue base")[0];
        }
        else if (piece.classList.contains("blue-piece"))
        {
            return document.getElementsByClassName("Red base")[0];
        }
        else
        {
            throw new Error("Invalid faction");
        }
    }
    return null;
}

// 区域中的棋子
function piecesIn(cell)
{
    var pieces = [];
    for (const child of cell.children)
    {
        if (child.classList.contains("piece"))
        {
            pieces.push(child);
        }
    }
    return pieces;
}

// 血量颜色
function HPColor(HP, maxHP)
{
    var factor = HP / maxHP;

    var color1 = { r: 255, g: 50, b: 50 }; // 红色
    var color2 = { r: 255, g: 127, b: 0 }; // 橙色
    var color3 = { r: 50, g: 160, b: 50 }; // 绿色

    var result = {};

    if (factor >= 0.5)
    {
        // 血量在一半以上，从橙色插值到绿色
        factor = (factor - 0.5) * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color2.r + factor * (color3.r - color2.r));
        result.g = Math.round(color2.g + factor * (color3.g - color2.g));
        result.b = Math.round(color2.b + factor * (color3.b - color2.b));
    } else
    {
        // 血量在一半以下，从红色插值到橙色
        factor = factor * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color1.r + factor * (color2.r - color1.r));
        result.g = Math.round(color1.g + factor * (color2.g - color1.g));
        result.b = Math.round(color1.b + factor * (color2.b - color1.b));
    }

    return 'rgb(' + result.r + ',' + result.g + ',' + result.b + ')';
}

function drawArrow(line, color = 'rgba(50, 50, 50)', isArrow = true)
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    var cellSize = canvas.width / 7; // 计算每个单元格的大小
    const width = 20;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    for (var i = 1; i < line.length; i++)
    {

        const Px = line[i - 1][1] * cellSize + cellSize / 2;
        const Py = line[i - 1][0] * cellSize + cellSize / 2;
        const Qx = line[i][1] * cellSize + cellSize / 2;
        const Qy = line[i][0] * cellSize + cellSize / 2;
        if (Px === Qx && Py === Qy)
        {
            continue;
        }

        ctx.moveTo(Px, Py);
        ctx.lineTo(Qx, Qy);
    }
    ctx.stroke();
    if (isArrow)
    {
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        for (var i = 1; i < line.length; i++)
        {

            const Px = line[i - 1][1] * cellSize + cellSize / 2;
            const Py = line[i - 1][0] * cellSize + cellSize / 2;
            const Qx = line[i][1] * cellSize + cellSize / 2;
            const Qy = line[i][0] * cellSize + cellSize / 2;

            if (Px === Qx && Py === Qy)
            {
                continue;
            }

            ctx.moveTo(Px, Py);
            ctx.lineTo(Qx, Qy);

            var dx = Qx - Px;
            var dy = Qy - Py;
            var angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.moveTo((Px + (Qx - Px) * 0.55) - 0.5 * width * Math.cos(angle + Math.PI / 6), (Py + (Qy - Py) * 0.55) - 0.5 * width * Math.sin(angle + Math.PI / 6));
            ctx.lineTo((Px + (Qx - Px) * 0.55), (Py + (Qy - Py) * 0.55));
            ctx.lineTo((Px + (Qx - Px) * 0.55) - 0.5 * width * Math.cos(angle - Math.PI / 6), (Py + (Qy - Py) * 0.55) - 0.5 * width * Math.sin(angle - Math.PI / 6));
            ctx.closePath();
            ctx.stroke();
        }
    }
}

function drawTeleport(line, color = 'rgba(50, 50, 50)')
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    var cellSize = canvas.width / 7; // 计算每个单元格的大小

    const Px = line[0][1] * cellSize + cellSize / 2;
    const Py = line[0][0] * cellSize + cellSize / 2;
    const Qx = line[1][1] * cellSize + cellSize / 2;
    const Qy = line[1][0] * cellSize + cellSize / 2;
    if (Px === Qx && Py === Qy)
    {
        return;
    }

    const width = 10;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.setLineDash([5, 20]);
    ctx.strokeStyle = color;

    ctx.moveTo(Px, Py);
    ctx.lineTo(Qx, Qy);

    ctx.stroke();

    ctx.lineWidth = width / 2;
    ctx.setLineDash([]);

    var dx = Qx - Px;
    var dy = Qy - Py;

    // 起点优弧
    ctx.beginPath();
    var angle = Math.atan2(dy, dx);
    ctx.moveTo(line[0][1] * cellSize + cellSize / 2 + 50 * Math.cos(angle + Math.PI / 5), line[0][0] * cellSize + cellSize / 2 + 50 * Math.sin(angle + Math.PI / 5));
    ctx.arc(line[0][1] * cellSize + cellSize / 2, line[0][0] * cellSize + cellSize / 2, 50, angle + Math.PI / 5, angle - Math.PI / 5);

    ctx.stroke();

    // 终点优弧
    ctx.beginPath();
    angle = Math.atan2(-dy, -dx);
    ctx.moveTo(line[1][1] * cellSize + cellSize / 2 + 50 * Math.cos(angle + Math.PI / 5), line[1][0] * cellSize + cellSize / 2 + 50 * Math.sin(angle + Math.PI / 5));
    ctx.arc(line[1][1] * cellSize + cellSize / 2, line[1][0] * cellSize + cellSize / 2, 50, angle + Math.PI / 5, angle - Math.PI / 5);

    ctx.stroke();
}

function cls(delay = 0)
{
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (delay > 0)
    {
        setTimeout(() =>
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, delay);
    }
    else
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export { distance, PathesOf, isStayable, isPassable, adjacentCells, nearestCellOf, isRideOn, allPiecesOf, allyPiecesOf, enemyPiecesOf, baseOf, enemyBaseOf, piecesIn, HPColor, drawArrow, drawTeleport, cls};