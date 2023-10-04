import { adjacentCells, distanceMapOf, isPassable, isStayable, draw } from "./utils.mjs";
import { saveState } from "./history.mjs";
import { Pieces, redFlag, blueFlag, redCarrier, blueCarrier, setRedCarrier, setBlueCarrier } from "../script.js";

//移动
function move(piece, cell, ifConsumeMovePoints = false)
{
    const row = cell.row;
    const col = cell.col;
    const distance = distanceMapOf(piece);

    if (piece && cell.classList.contains("reachable") && (distance[row][col] > 0) && isStayable(cell, piece))
    {
        var steps = distance[row][col];

        if (ifConsumeMovePoints)
        {
            if (piece.movePoints >= distance[row][col])
            {
                piece.movePoints = piece.movePoints - distance[row][col];
            }
            else
            {
                return false;
            }
        }
        else
        {
            if (piece.moveSteps >= distance[row][col])
            {
                piece.moveSteps = piece.moveSteps - distance[row][col];
            }
            else
            {
                return false;
            }
        }

        // 步进
        var moveLink = [cell];
        var currentCell = cell;
        for (var i = 0; i < steps; i++)
        {
            const currRow = currentCell.row;
            const currCol = currentCell.col;
            for (const adjacentCell of adjacentCells(currentCell, piece))
            {
                const prevRow = adjacentCell.row;
                const prevCol = adjacentCell.col;
                if (distance[prevRow][prevCol] === distance[currRow][currCol] - 1)
                {
                    moveLink.push(adjacentCell);
                    currentCell = adjacentCell;
                    break;
                }
            }
        }
        // moveLink.pop() // 移除起点
        var moveLog = `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1})`;
        for (var i = moveLink.length - 2; i >= 0; i--)
        {
            const currentCell = moveLink[i];
            step(piece, currentCell);
            moveLog += ` -> (${currentCell.row + 1}, ${currentCell.col + 1})`;
        }
        console.log(piece.name, moveLog);

        return true;
    }
    return false;
}

// 移动一步
function step(piece, cell)
{
    if (piece && isPassable(cell, piece) && adjacentCells(cell, piece).includes(piece.parentElement))
    {
        cell.appendChild(piece);
        piecePositionChange(piece, cell);
        return true;
    }
    return false;
}

// 转移
function jump(piece, cell)
{
    const row = cell.row;
    const col = cell.col;
    if (piece && cell.classList.contains("landable") && isStayable(cell, piece))
    {
        console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        cell.appendChild(piece);
        piecePositionChange(piece, cell);

        return true;
    }
    return false;
}

// 任意拖动
function leap(piece, cell, isDraw = false)
{
    const row = cell.row;
    const col = cell.col;

    if (isDraw)
    {
        draw([[piece.parentElement.row, piece.parentElement.col], [row, col]], piece.classList.contains("red-piece") ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
    }

    if (piece)
    {
        // 复活逻辑
        if (piece.parentElement.classList.contains("grave"))
        {
            const index = Pieces.indexOf(piece) + 1;
            const grave = document.getElementById("grave" + index);
            grave.style.display = "none";

            const carrierCheckbox = document.getElementById("carrierCheckbox" + index);
            const actedCheckbox = document.getElementById("actedCheckbox" + index);
            carrierCheckbox.disabled = false;
            actedCheckbox.disabled = false;

            const alivePanel = document.getElementById("alivePanel" + index);
            alivePanel.style.display = "flex";

            console.log(`${piece.name}登场于(${row + 1}, ${col + 1})`);
        }
        else
        {
            console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        }

        cell.appendChild(piece);
        piecePositionChange(piece, cell);

        return true;
    }
    return false;
}

// 交换
function swap(pieceP, pieceQ)
{
    const cellP = pieceP.parentElement;
    const cellQ = pieceQ.parentElement;

    // 临时存放于墓地
    const grave = document.getElementsByClassName("grave")[0];
    grave.appendChild(pieceP);
    grave.appendChild(pieceQ);

    // 交换
    if ((pieceP && isStayable(cellQ, pieceP)) && pieceQ && isStayable(cellP, pieceQ))
    {
        console.log(pieceP.name, `(${cellP.row + 1}, ${cellP.col + 1}) |> (${cellQ.row + 1}, ${cellQ.col + 1})`);
        cellQ.appendChild(pieceP);
        piecePositionChange(pieceP, cellQ);

        console.log(pieceQ.name, `(${cellQ.row + 1}, ${cellQ.col + 1}) |> (${cellP.row + 1}, ${cellP.col + 1})`);
        cellP.appendChild(pieceQ);
        piecePositionChange(pieceQ, cellP);

        return true;
    }
    else
    {
        cellP.appendChild(pieceP);
        cellQ.appendChild(pieceQ);
        return false;
    }
}

// 死亡逻辑
function bury(piece)
{
    if (!piece.parentElement.classList.contains("grave"))
    {
        const index = Pieces.indexOf(piece) + 1;
        const grave = document.getElementById("grave" + index);
        grave.style.display = "flex";

        const carrierCheckbox = document.getElementById("carrierCheckbox" + index);
        carrierCheckbox.disabled = true;

        console.log(`${piece.name}死亡`);
        if (piece === redCarrier)
        {
            setRedCarrier(null);
        }
        else if (piece === blueCarrier)
        {
            setBlueCarrier(null);
        }

        const actedCheckbox = document.getElementById("actedCheckbox" + index);
        actedCheckbox.disabled = true;

        const alivePanel = document.getElementById("alivePanel" + index);
        alivePanel.style.display = "none";

        grave.appendChild(piece);
        saveState();
    }
}

function piecePositionChange(piece, cell)
{
    // 帅旗逻辑
    if (redFlag.parentElement === cell && redCarrier === null && piece.classList.contains("red-piece"))
    {
        setRedCarrier(piece);
    }
    if (blueFlag.parentElement === cell && blueCarrier === null && piece.classList.contains("blue-piece"))
    {
        setBlueCarrier(piece);
    }
    saveState();
}

export { move, step, jump, swap, leap, bury };