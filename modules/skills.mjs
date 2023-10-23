import { Pieces } from "./global_variables.mjs";
import { armors, horses } from "./data.mjs";
import { saveState } from "./history.mjs";
import { move, leap_to_cells, leap } from "./actions.mjs";
import { distance, allPiecesOf, allyPiecesOf, baseOf, adjacentCells, nearestCellOf, isRideOn, isOnSameLine, isStayable, piecesIn, cls, record } from "./utils.mjs";
import { endMovePhase } from "./phases.mjs";
import { highlightPieces, removeHighlight } from "./highlight.mjs";

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
        const index = this.id.slice(-1);
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
        const index = this.id.slice(-1);
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

// 〖归营〗
function gui_ying(piece)
{
    // 结束阶段，你可以转移至己方大本营，
    record(`孙乾发动〖归营〗`);
    leap(piece, baseOf(piece), true);
    // 然后你摸一张牌。
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
    record(`张绣发动〖冲杀〗`);
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
    if (adjacentCells(cell, object).includes(targetCell) && !yong_quan(object) && !isRideOn(object, "阻动"))
    {
        object.moveSteps = 1;
        move(object, targetCell, false, true);
    }
    // 若该角色不可以执行步数为1且方向与你相同的移动且其可以转移，你控制其转移至与其距离最近的可进入区域，
    else if (!yong_quan(object) && !isRideOn(object, "阻动"))
    {
        endMovePhase(); // 先结束移动阶段
        const nearestCells = nearestCellOf(object);
        if (nearestCells.length > 1)
        {
            leap_to_cells(object, nearestCells, false);
        }
        else // 只有一个最近的可进入区域
        {
            leap(object, nearestCells[0], false);
        }
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
    if (adjacentCells(cell, object).includes(targetCell) && !yong_quan(object) && !isRideOn(object, "阻动"))
    {
        record(`祖茂发动〖诱兵〗`);
        object.moveSteps = 1;
        move(object, targetCell, false, true);
    }
}

// 〖神行〗
function shen_xing(piece)
{
    // 移动阶段开始前，你可以跳过此阶段，然后转移至一个可进入空区域。
    record(`左慈发动〖神行〗`);
    const targetCells = [];
    for (const cell of document.getElementsByClassName("cell"))
    {
        if (isStayable(cell, piece) && piecesIn(cell).length == 0)
        {
            targetCells.push(cell);
        }
    }
    leap_to_cells(piece, targetCells, true);
}

// 〖节钺〗
function jie_yue(piece, limit = 3)
{
    // 出牌阶段限一次，你可以选择一名与你的距离为<3>以内且与你位于同一直线的其他角色，
    var targetablePieces = [];
    for (const otherPiece of allPiecesOf(piece))
    {
        if (otherPiece !== piece && distance(piece, otherPiece) <= limit && isOnSameLine(piece, otherPiece) && !yong_quan(otherPiece) && !isRideOn(otherPiece, "阻动"))
        {
            targetablePieces.push(otherPiece);
        }
    }

    if (targetablePieces.length <= 0) // 没有合法目标
    {
        return;
    }
    else
    {
        // 高亮可选择的角色
        highlightPieces(targetablePieces, "targetable", click_to_pull);

        // 定义点击高亮元素行为
        function click_to_pull(event)
        {
            // event.stopPropagation();

            record(`于禁发动〖节钺〗`);
            removeHighlight("targetable", click_to_pull);

            // 将其转移至该角色所在的方向上与你的距离最近的可进入区域，
            const signRow = Math.sign(this.parentElement.row - piece.parentElement.row);
            const signCol = Math.sign(this.parentElement.col - piece.parentElement.col);
            var nearestCells = [];
            var minDistance = 100;
            for (const cell of document.getElementsByClassName("cell"))
            {
                if (isStayable(cell, this, false) && Math.sign(cell.row - piece.parentElement.row) == signRow && Math.sign(cell.col - piece.parentElement.col) == signCol)
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
            if (nearestCells.length > 1)
            {
                leap_to_cells(this, nearestCells, true);
            }
            else // 只有一个最近的可进入区域
            {
                leap(this, nearestCells[0], true);
                cls(1000);
            }
        }
    }

    // 若如此做，本回合你不能对其使用牌。
}

export { zhan_ji, zhan_ji_undo, gui_ying, yong_quan, chong_sha, you_bing, shen_xing, jie_yue };


