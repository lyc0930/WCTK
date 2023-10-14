import { terrain, HERO_DATA, weapons, armors, horses } from './data.mjs';
import { adjacentCells, distanceMapOf, isPassable, isStayable, baseOf, enemyBaseOf, piecesIn, HPColor, draw } from "./utils.mjs";
import { saveState } from "./history.mjs";
import { redFlag, blueFlag, redCarrier, blueCarrier, setCarrier } from "./flags.mjs";
import { Pieces } from "../scripts/main.js";

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
        afterPositionChange(piece, cell);
        return true;
    }
    return false;
}

// 转移
function leap(piece, cell)
{
    const row = cell.row;
    const col = cell.col;
    if (piece && cell.classList.contains("landable") && isStayable(cell, piece))
    {
        console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        cell.appendChild(piece);
        afterPositionChange(piece, cell);

        return true;
    }
    return false;
}

// 任意拖动
function slot(piece, cell, isDraw = false)
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

            const labelHP = document.getElementById("HP" + index);
            labelHP.textContent = HERO_DATA[piece.name]["体力上限"];
            labelHP.style.color = HPColor(HERO_DATA[piece.name]["体力上限"], HERO_DATA[piece.name]["体力上限"]);

            const weaponSelect = document.getElementById("weaponSelect" + index);
            weaponSelect.value = "";

            const armorSelect = document.getElementById("armorSelect" + index);
            armorSelect.value = "";

            const horseSelect = document.getElementById("horseSelect" + index);
            horseSelect.value = "";

            if (piece.name == "庞统")
            {
                const armorSelect_zhanji = document.getElementById("armorSelect" + "_zhanji" + index);
                armorSelect_zhanji.value = "";

                const horseSelect_zhanji = document.getElementById("horseSelect" + "_zhanji" + index);
                horseSelect_zhanji.value = "";
            }

            const HPBlock = document.getElementById("HPBlock" + index);
            HPBlock.style.display = "flex";
            const weaponBlock = document.getElementById("weaponBlock" + index);
            weaponBlock.style.display = "flex";
            const armorBlock = document.getElementById("armorBlock" + index);
            armorBlock.style.display = "flex";
            const horseBlock = document.getElementById("horseBlock" + index);
            horseBlock.style.display = "flex";

            console.log(`${piece.name}登场于(${row + 1}, ${col + 1})`);
        }
        else
        {
            console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        }

        cell.appendChild(piece);
        afterPositionChange(piece, cell);

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
        afterPositionChange(pieceP, cellQ);

        console.log(pieceQ.name, `(${cellQ.row + 1}, ${cellQ.col + 1}) |> (${cellP.row + 1}, ${cellP.col + 1})`);
        cellP.appendChild(pieceQ);
        afterPositionChange(pieceQ, cellP);

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

        var score = 3;
        console.log(`${piece.name}死亡, ${piece.classList.contains("red-piece") ? '蓝方' : '红方'}+${score}分`);
        if (piece === redCarrier)
        {
            setCarrier("Red", null);
        }
        else if (piece === blueCarrier)
        {
            setCarrier("Blue", null);
        }

        const actedCheckbox = document.getElementById("actedCheckbox" + index);
        actedCheckbox.disabled = true;

        const labelHP = document.getElementById("HP" + index);
        labelHP.textContent = 0;
        labelHP.style.color = HPColor(0, HERO_DATA[piece.name]["体力上限"]);

        const weaponSelect = document.getElementById("weaponSelect" + index);
        weaponSelect.value = "";

        const armorSelect = document.getElementById("armorSelect" + index);
        armorSelect.value = "";

        const horseSelect = document.getElementById("horseSelect" + index);
        horseSelect.value = "";

        if (piece.name == "庞统")
        {
            const armorSelect_zhanji = document.getElementById("armorSelect" + "_zhanji" + index);
            armorSelect_zhanji.value = "";

            const horseSelect_zhanji = document.getElementById("horseSelect" + "_zhanji" + index);
            horseSelect_zhanji.value = "";
        }

        const HPBlock = document.getElementById("HPBlock" + index);
        HPBlock.style.display = "none";
        const weaponBlock = document.getElementById("weaponBlock" + index);
        weaponBlock.style.display = "none";
        const armorBlock = document.getElementById("armorBlock" + index);
        armorBlock.style.display = "none";
        const horseBlock = document.getElementById("horseBlock" + index);
        horseBlock.style.display = "none";

        grave.appendChild(piece);
        saveState();
    }
}

function afterPositionChange(piece, cell)
{
    // 捡起帅旗逻辑
    if (redFlag.parentElement === cell && redCarrier === null && piece.classList.contains("red-piece"))
    {
        setCarrier("Red", piece);
    }
    if (blueFlag.parentElement === cell && blueCarrier === null && piece.classList.contains("blue-piece"))
    {
        setCarrier("Blue", piece);
    }

    // 运送帅旗逻辑
    if (piece.carrier && cell === enemyBaseOf(piece))
    {
        var score = 5;
        const base = baseOf(piece);
        if (piece.classList.contains("red-piece"))
        {
            const alliesInBase = Array.from(piecesIn(base)).filter(piece => piece.classList.contains("red-piece"));
            if (alliesInBase.length === 1)
            {
                const allyPiece = alliesInBase[0];
                setCarrier("Red", allyPiece);
            }
            else // 大本营 没有己方棋子 或者 有多个己方棋子
            {
                setCarrier("Red", null);
                base.appendChild(redFlag);
            }
            console.log(`${piece.name}送至帅旗, 红方+${score}分`);
        }
        else if (piece.classList.contains("blue-piece"))
        {
            const alliesInBase = Array.from(piecesIn(base)).filter(piece => piece.classList.contains("blue-piece"));
            if (alliesInBase.length === 1)
            {
                const allyPiece = alliesInBase[0];
                setCarrier("Blue", allyPiece);
            }
            else // 大本营 没有己方棋子 或者 有多个己方棋子
            {
                setCarrier("Blue", null);
                base.appendChild(blueFlag);
            }
            console.log(`${piece.name}送至帅旗, 蓝方+${score}分`);
        }
        else
        {
            throw new Error("Invalid faction");
        }
    }

    saveState();
}

export { move, step, leap, swap, slot, bury };