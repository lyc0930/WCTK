// 计算移动距离
function distanceMapOf(piece)
{
    var distance = new Array(7)
    for (var i = 0; i < 7; i++)
    {
        distance[i] = new Array(7)
        for (var j = 0; j < 7; j++)
        {
            distance[i][j] = 50;
        }
    }

    var queue = [];
    queue.push(piece.parentElement);
    const startRow = piece.parentElement.row;
    const startCol = piece.parentElement.col;
    distance[startRow][startCol] = 0;

    while (queue.length)
    {
        const currentCell = queue.shift();
        const row = currentCell.row;
        const col = currentCell.col;
        for (const cell of adjacentCells(currentCell, piece))
        {
            const nextRow = cell.row;
            const nextCol = cell.col;
            if (distance[nextRow][nextCol] >= 50)
            {
                distance[nextRow][nextCol] = distance[row][col] + 1;
                queue.push(cell);
            }
        }
    }

    for (const cell of document.getElementsByClassName("cell"))
    {
        const row = cell.row;
        const col = cell.col;
        if (!isStayable(cell, piece))
        {
            distance[row][col] = 50;
        }
    }

    return distance;
}

// 可停留
function isStayable(cell, piece = null)
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
    var hold_gucheng = false;

    for (const enemyPiece of enemyPiecesOf(piece))
    {
        if (enemyPiece.name === "曹仁")
        {
            hold_gucheng = true;
            break;
        }
    }

    if (hold_by_enemy && hold_gucheng)
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
    if (cell === piece.parentElement)
    {
        return true;
    }
    for (const child of cell.children)
    {
        if (child.classList.contains("piece"))
        {
            return false;
        }
    }
    if (cell.classList.contains("ridge"))
    {
        return false;
    }
    return true;
}

// 可穿越
function isPassable(cell, piece = null)
{
    // TODO: 穿越马
    // TODO: 张绣
    return isStayable(cell, piece);
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
    if (piece === currentPlayer && piece.name === "吕蒙" && cell.classList.contains("lake"))
    // if (piece.skills.contains("渡江"))
    {
        for (const lakeCell of document.getElementsByClassName("lake"))
        {
            adjCells.push(lakeCell);
        }
    }
    return adjCells;
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
        else
        {
            const bluePieces = document.getElementsByClassName("blue-piece");
            return Array.from(bluePieces).filter(piece => !piece.parentElement.classList.contains("grave"));
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
        else
        {
            const redPieces = document.getElementsByClassName("red-piece");
            return Array.from(redPieces).filter(piece => !piece.parentElement.classList.contains("grave"));
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
        else
        {
            return document.getElementsByClassName("Blue base")[0];
        }
    }
    return null;
}

// 血量颜色
function HPColor(HP, maxHP)
{
    var factor = HP / maxHP;

    var color1 = { r: 255, g: 50, b: 50 }; // 红色
    var color2 = { r: 200, g: 100, b: 0 }; // 黄色
    var color3 = { r: 50, g: 160, b: 50 }; // 绿色

    var result = {};

    if (factor > 0.5)
    {
        // 血量在一半以上，从黄色插值到绿色
        factor = (factor - 0.5) * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color2.r + factor * (color3.r - color2.r));
        result.g = Math.round(color2.g + factor * (color3.g - color2.g));
        result.b = Math.round(color2.b + factor * (color3.b - color2.b));
    } else
    {
        // 血量在一半以下，从红色插值到黄色
        factor = factor * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color1.r + factor * (color2.r - color1.r));
        result.g = Math.round(color1.g + factor * (color2.g - color1.g));
        result.b = Math.round(color1.b + factor * (color2.b - color1.b));
    }

    return 'rgb(' + result.r + ',' + result.g + ',' + result.b + ')';
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function draw(line, color = 'rgba(50, 50, 50)', isArrow = true)
{
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

function cls()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export { distanceMapOf, isStayable, isPassable, adjacentCells, allPiecesOf, allyPiecesOf, enemyPiecesOf, baseOf, HPColor, draw, cls};