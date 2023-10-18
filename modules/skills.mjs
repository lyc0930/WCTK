import { Pieces } from "../scripts/main.js";
import { armors, horses } from "./data.mjs";
import { saveState } from "./history.mjs";
import { move, leap_to_cells } from "./actions.mjs";
import { distance, allyPiecesOf, adjacentCells, nearestCellOf } from "./utils.mjs";
import { endMovePhase } from "./phases.mjs";

function zhan_ji(piece, _index = null)
{
    const index = _index === null ? Pieces.indexOf(piece) + 1 : _index;

    const armorBlock = document.getElementById("armorBlock" + index);
    const armorSelect = document.getElementById("armorSelect" + index);
    const armorSelect_zhanji = document.createElement("select");
    armorSelect_zhanji.id = "armorSelect" + "_zhanji" + index;
    armorSelect_zhanji.className = "hero-select";
    armorBlock.appendChild(armorSelect_zhanji);

    for (const name in armors)
    {
        const option = document.createElement("option");
        option.id = name + "_zhanji" + index;
        option.value = name;
        option.innerText = name;
        armorSelect_zhanji.appendChild(option);
    }
    armorSelect_zhanji.addEventListener("change", function (event)
    {
        const index = event.target.id.slice(-1);
        const piece = Pieces[index - 1];
        piece.armors[1] = armorSelect_zhanji.value;
        saveState();
    });

    armorSelect.style.width = "32.5%";
    armorSelect_zhanji.style.width = "32.5%";


    const horseBlock = document.getElementById("horseBlock" + index);
    const horseSelect = document.getElementById("horseSelect" + index);
    const horseSelect_zhanji = document.createElement("select");
    horseSelect_zhanji.id = "horseSelect" + "_zhanji" + index;
    horseSelect_zhanji.className = "hero-select";
    horseBlock.appendChild(horseSelect_zhanji);

    for (const name in horses)
    {
        const option = document.createElement("option");
        option.id = name + "_zhanji" + index;
        option.value = name;
        option.innerText = name;
        horseSelect_zhanji.appendChild(option);
    }
    horseSelect_zhanji.addEventListener("change", function (event)
    {
        const index = event.target.id.slice(-1);
        const piece = Pieces[index - 1];
        piece.horses[1] = horseSelect_zhanji.value;
        saveState();
    });

    horseSelect.style.width = "32.5%";
    horseSelect_zhanji.style.width = "32.5%";
}

function zhan_ji_undo(piece)
{
    const index = Pieces.indexOf(piece) + 1;

    const armorBlock = document.getElementById("armorBlock" + index);
    const armorSelect = document.getElementById("armorSelect" + index);
    const armorSelect_zhanji = document.getElementById("armorSelect" + "_zhanji" + index);
    if (armorSelect_zhanji)
    {
        armorBlock.removeChild(armorSelect_zhanji);
    }

    armorSelect.style.width = "65%";

    const horseBlock = document.getElementById("horseBlock" + index);
    const horseSelect = document.getElementById("horseSelect" + index);
    const horseSelect_zhanji = document.getElementById("horseSelect" + "_zhanji" + index);
    if (horseSelect_zhanji)
    {
        horseBlock.removeChild(horseSelect_zhanji);
    }

    horseSelect.style.width = "65%";
}

// 〖拥权〗
function yong_quan(piece)
{
    if (piece.name == "董卓")
    {
        var limit = 1;
        // 若距离<1>范围内有其它己方角色
        for (const allyPiece of allyPiecesOf(piece))
        {
            if (piece != allyPiece && distance(piece, allyPiece) <= limit)
            {
                return true;
            }
        }
    }
    return false;
}

// 〖冲杀〗
function chong_sha(piece, object, direction)
{
    console.log(`张绣发动〖冲杀〗`);
    const cell = object.parentElement;
    const row = cell.row;
    const col = cell.col;
    const cells = document.getElementsByClassName("cell");
    const Direction = {
        "-X": [0, -1],
        "+X": [0, +1],
        "-Y": [-1, 0],
        "+Y": [+1, 0],
    }
    const targetCell = cells[(row + Direction[direction][0]) * 7 + (col + Direction[direction][1])];
    // 若该角色可以执行步数为1且方向与你相同的移动，你控制其执行之；
    if (adjacentCells(cell, object).includes(targetCell))
    {
        object.moveSteps = 1;
        move(object, targetCell, false, true);
    }
    // 若该角色不可以执行步数为1且方向与你相同的移动且其可以转移，你控制其转移至与其距离最近的可进入区域，
    else
    {
        endMovePhase(); // 先结束移动阶段
        const nearestCells = nearestCellOf(object);
        leap_to_cells(object, nearestCells, false);
        // 然后你对该角色造成1点普通伤害
    }
}

// 〖诱兵〗
function you_bing(piece, object, direction)
{
    const cell = object.parentElement;
    const row = cell.row;
    const col = cell.col;
    const cells = document.getElementsByClassName("cell");
    const Direction = {
        "-X": [0, -1],
        "+X": [0, +1],
        "-Y": [-1, 0],
        "+Y": [+1, 0],
    }
    const targetCell = cells[(row + Direction[direction][0]) * 7 + (col + Direction[direction][1])];
    // 当你于本阶段移动一步后，你控制该角色执行一次步数为1且方向与你此步移动相同的移动。
    if (adjacentCells(cell, object).includes(targetCell))
    {
        console.log(`祖茂发动〖诱兵〗`);
        object.moveSteps = 1;
        move(object, targetCell, false, true);
    }
}

export { zhan_ji, zhan_ji_undo, yong_quan, chong_sha, you_bing };


