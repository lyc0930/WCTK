import { HERO_DATA } from './data.mjs';
import { adjacentCells, PathesOf, isPassable, isStayable, isRideOn, baseOf, enemyBaseOf, enemyPiecesOf, piecesIn, HPColor, drawArrow, drawTeleport, cls } from "./utils.mjs";
import { highlightCells, removeHighlight } from "./highlight.mjs";
import { saveState } from "./history.mjs";
import { redFlag, blueFlag, redCarrier, blueCarrier, setCarrier } from "./flags.mjs";
import { Pieces, currentPhase } from "./global_variables.mjs";
import { contextMenuItems, addContextMenu, removeContextMenu } from './context-menu.mjs';
import { chong_sha } from './skills.mjs';

//移动
function move(piece, cell, ifConsumeMovePoints = false, isDraw = false)
{
    const row = cell.row;
    const col = cell.col;
    const Pathes = PathesOf(piece);

    if (piece && Pathes[row][col] != null && isStayable(cell, piece))
    {
        var steps = Pathes[row][col].length - 1;

        if (ifConsumeMovePoints)
        {
            if (piece.movePoints >= steps)
            {
                piece.movePoints = piece.movePoints - steps;
            }
            else
            {
                return false;
            }
        }
        else
        {
            if (piece.moveSteps >= steps)
            {
                piece.moveSteps = piece.moveSteps - steps;
            }
            else
            {
                return false;
            }
        }

        var path = Pathes[row][col];
        var moveLog = `(${path[0].row + 1}, ${path[0].col + 1})`;
        for (var i = 1; i < path.length; i++)
        {
            step(piece, path[i], isDraw);
            moveLog += ` -> (${path[i].row + 1}, ${path[i].col + 1})`;
        }
        console.log(piece.name, moveLog);

        return true;
    }
    return false;
}

// Step类
class Step
{
    constructor(start, end)
    {
        this.start = start;
        this.end = end;

        const startRow = this.start.row;
        const startCol = this.start.col;
        const endRow = this.end.row;
        const endCol = this.end.col;

        if (startRow === endRow && startCol === endCol)
        {
            this.direction = null;
        }
        else if (startRow === endRow && Math.abs(startCol - endCol) === 1)
        {
            this.direction = startCol < endCol ? "+X" : "-X";
        }
        else if (startCol === endCol && Math.abs(startRow - endRow) === 1)
        {
            this.direction = startRow < endRow ? "+Y" : "-Y";
        }
        else
        {
            this.direction = null;
        }
    }
}

// 移动一步
function step(piece, cell, isDraw = false)
{
    if (piece && isPassable(cell, piece) && adjacentCells(piece.parentElement, piece).includes(cell))
    {
        const _step = new Step(piece.parentElement, cell);
        // 有方向
        if (_step.direction != null)
        {
            if (isDraw)
            {
                drawArrow([[_step.start.row, _step.start.col], [_step.end.row, _step.end.col]], piece.classList.contains("red-piece") ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
            }
        }
        else // 〖渡江〗
        {
            console.log(`${piece.name}使用【渡江】`);
            if (isDraw)
            {
                drawTeleport([[_step.start.row, _step.start.col], [_step.end.row, _step.end.col]], piece.classList.contains("red-piece") ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
            }
        }

        cell.appendChild(piece);
        afterPositionChange(piece, cell);


        // 〖冲杀〗
        // 当你移动一步后，若你进入有敌方角色的区域；
        // TODO: 张绣冲向一个同时存在{己方曹仁、敌方A、敌方B}的区域
        var subject = piece;
        for (const pieceInCell of piecesIn(cell))
        {
            if (enemyPiecesOf(piece).includes(pieceInCell) && (currentPhase == "移动" && piece.name === "张绣" && subject === piece) && !isRideOn(pieceInCell, "阻动"))
            {
                chong_sha(piece, pieceInCell, _step.direction);
            }
        }

        return _step;
    }
    return null;
}

function move_fixed_steps(piece, isDraw = false)
{
    // 计算可到达的区域
    const Pathes = PathesOf(piece);
    const reachableCells = [];

    for (const cell of document.getElementsByClassName("cell"))
    {
        const row = cell.row;
        const col = cell.col;
        if (Pathes[row][col] && (Pathes[row][col].length - 1 <= piece.moveSteps))
        {
            reachableCells.push(cell);
        }
    }

    // 定义点击高亮区域行为
    function onclick(event)
    {
        // event.stopPropagation();
        move(piece, this, false, isDraw);
        removeHighlight("reachable", onclick);

        // 还有移动力
        if (piece.moveSteps > 0)
        {
            move_fixed_steps(piece, isDraw);
        }
        else
        {
            removeHighlight("reachable", onclick);
            if (isDraw)
            {
                cls(1000);
            }
        }
    }

    // 高亮可到达的区域
    highlightCells(reachableCells, "reachable", onclick);
}

// 转移
function leap(piece, cell, isDraw = false)
{
    const row = cell.row;
    const col = cell.col;
    if (piece && isStayable(cell, piece, false))
    {
        console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        if (isDraw)
        {
            drawTeleport([[piece.parentElement.row, piece.parentElement.col], [row, col]], piece.classList.contains("red-piece") ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
        }
        cell.appendChild(piece);
        afterPositionChange(piece, cell);

        return true;
    }
    return false;
}

function leap_to_cells(piece, cells, isDraw = false)
{
    // 定义点击高亮区域行为
    function onclick(event)
    {
        // event.stopPropagation();
        leap(piece, this, isDraw);
        removeHighlight("landable", onclick);
        if (isDraw)
        {
            cls(1000);
        }
    }

    // 高亮可到达的区域
    highlightCells(cells, "landable", onclick);
}

// 任意拖动
function slot(piece, cell, isDraw = false)
{
    const row = cell.row;
    const col = cell.col;

    if (isDraw)
    {
        drawArrow([[piece.parentElement.row, piece.parentElement.col], [row, col]], piece.classList.contains("red-piece") ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
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

            // 〖展骥〗
            if (piece.name == "庞统")
            {
                const armorSelect_zhanji = document.getElementById("armorSelect" + "_zhanji" + index);
                armorSelect_zhanji.value = "";

                const horseSelect_zhanji = document.getElementById("horseSelect" + "_zhanji" + index);
                horseSelect_zhanji.value = "";
            }

            const alivePanel = document.getElementById("alivePanel" + index);
            alivePanel.style.display = "flex";

            piece.alive = true;

            console.log(`${piece.name}登场于(${row + 1}, ${col + 1})`);

            removeContextMenu(piece);
            addContextMenu(piece, contextMenuItems(piece));
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

    // 临时存放于body
    document.body.appendChild(pieceP);
    document.body.appendChild(pieceQ);

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

        // 〖展骥〗
        if (piece.name == "庞统")
        {
            const armorSelect_zhanji = document.getElementById("armorSelect" + "_zhanji" + index);
            armorSelect_zhanji.value = "";

            const horseSelect_zhanji = document.getElementById("horseSelect" + "_zhanji" + index);
            horseSelect_zhanji.value = "";
        }

        const alivePanel = document.getElementById("alivePanel" + index);
        alivePanel.style.display = "none";

        piece.alive = false;

        grave.appendChild(piece);
        removeContextMenu(piece);
        addContextMenu(piece, contextMenuItems(piece));
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

export { move, step, leap, swap, slot, bury, move_fixed_steps, leap_to_cells };