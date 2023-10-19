import { terrain, HERO_DATA, weapons, armors, horses } from './data.mjs';
import { redFlag, blueFlag, redCarrier, blueCarrier, setCarrier } from "./flags.mjs";
import { Pieces } from "./global_variables.mjs";
import { piecesIn, HPColor } from './utils.mjs';

class StateHistory
{
    constructor()
    {
        this.history = []; // 用于保存状态历史记录的数组
        this.currentIndex = -1; // 当前状态的索引
    }

    // 更新状态
    updateHistory(newState)
    {
        // 截断历史记录，删除当前状态之后的记录
        this.history = this.history.slice(0, this.currentIndex + 1);
        // 添加新状态到历史记录
        this.history.push(newState);
        this.currentIndex++;
    }

    // 撤销操作
    undo()
    {
        if (this.currentIndex > 0)
        {
            this.currentIndex--;

            const historyTooltip = document.getElementById("history-tooltip");
            const icon = historyTooltip.querySelector("i");
            const label = historyTooltip.querySelector("label");
            label.style.display = "block";

            var number = parseInt(label.textContent.slice(2, -1));
            if (historyTooltip.style.visibility == "visible" && historyTooltip.style.opacity == "1" && icon.className == "fas fa-rotate-left" && !isNaN(number))
            {
                number++;
                label.textContent = `后退${number}步`;
            }
            else
            {
                icon.className = "fas fa-rotate-left";
                label.textContent = "后退1步";
            }

            historyTooltip.style.visibility = "visible";
            historyTooltip.style.opacity = "1";
            historyTooltip.style.top = "50%";
            historyTooltip.style.webkitTransform = "translate(-50%, -50%)";
            historyTooltip.style.transform = "translate(-50%, -50%)";

            clearTimeout(this.tooltipTimeoutId);

            this.tooltipTimeoutId = setTimeout(() =>
            {
                label.style.display = "none";
                label.textContent = "";
                historyTooltip.style.visibility = "hidden";
                historyTooltip.style.opacity = "0";
            }, 2000);

            return this.history[this.currentIndex];
        }
        return null; // 没有可以撤销的状态
    }

    // 重做操作
    redo()
    {
        if (this.currentIndex < this.history.length - 1)
        {
            this.currentIndex++;

            const historyTooltip = document.getElementById("history-tooltip");
            const icon = historyTooltip.querySelector("i");
            const label = historyTooltip.querySelector("label");
            label.style.display = "block";

            var number = parseInt(label.textContent.slice(2, -1));
            if (historyTooltip.style.visibility == "visible" && historyTooltip.style.opacity == "1" && icon.className == "fas fa-rotate-right" && !isNaN(number))
            {
                number++;
                label.textContent = `重做${number}步`;
            }
            else
            {
                icon.className = "fas fa-rotate-right";
                label.textContent = "重做1步";
            }

            historyTooltip.style.visibility = "visible";
            historyTooltip.style.opacity = "1";
            historyTooltip.style.top = "50%";
            historyTooltip.style.webkitTransform = "translate(-50%, -50%)";
            historyTooltip.style.transform = "translate(-50%, -50%)";

            clearTimeout(this.tooltipTimeoutId);

            this.tooltipTimeoutId = setTimeout(() =>
            {
                label.style.display = "none";
                label.textContent = "";
                historyTooltip.style.visibility = "hidden";
                historyTooltip.style.opacity = "0";
            }, 2000);

            return this.history[this.currentIndex];
        }
        return null; // 没有可以重做的状态
    }

    // 获取当前状态
    getCurrentState()
    {
        return this.history[this.currentIndex];
    }
}

function saveState()
{
    const state = {
        players: [],
    };
    if (redCarrier)
    {
        state.redCarrier = redCarrier;
    }
    else
    {
        state.redFlagPosition = [redFlag.parentElement.row, redFlag.parentElement.col];
    }
    if (blueCarrier)
    {
        state.blueCarrier = blueCarrier;
    }
    else
    {
        state.blueFlagPosition = [blueFlag.parentElement.row, blueFlag.parentElement.col];
    }
    var overlaps = {};
    for (const piece of Pieces)
    {
        let player = {
            name: piece.name,
            piece: piece,
            acted: piece.acted,
        };
        if (piece.parentElement.classList.contains("grave"))
        {
            player.alive = false;
            player.carrier = false;
        }
        else
        {
            player.alive = true;
            player.HP = piece.HP;
            player.position = [piece.parentElement.row, piece.parentElement.col];
            player.acted = piece.acted;
            player.carrier = piece.carrier;
            player.weapons = [];
            player.armors = [];
            player.horses = [];

            for (const weapon of piece.weapons)
            {
                player.weapons.push(weapon);
            }
            for (const armor of piece.armors)
            {
                player.armors.push(armor);
            }
            for (const horse of piece.horses)
            {
                player.horses.push(horse);
            }

            // 〖展骥〗
            if (player.piece.name != "庞统")
            {
                player.armors.push("");
                player.horses.push("");
            }

            const overlapPieces = piecesIn(piece.parentElement);
            if (overlapPieces.length > 1)
            {
                const index = Pieces.indexOf(piece) + 1;
                const order = overlapPieces.indexOf(piece);
                overlaps[index] = order;
            }
        }
        state.players.push(player);
    }
    state.overlaps = overlaps;
    stateHistory.updateHistory(state);
}

function recoverStatefrom(state)
{
    for (const player of state.players)
    {
        if (player.name != player.piece.name)
        {
            continue;
        }
        const index = Pieces.indexOf(player.piece) + 1;
        player.piece.acted = player.acted;
        const actedCheckbox = document.getElementById("actedCheckbox" + index);
        actedCheckbox.checked = player.acted;
        const avatar = player.piece.querySelector(".avatar");
        if (player.acted)
        {
            avatar.src = "./assets/Avatar/inactive/" + HERO_DATA[player.piece.name]["拼音"] + ".png";
        }
        else
        {
            avatar.src = "./assets/Avatar/active/" + HERO_DATA[player.piece.name]["拼音"] + ".png";
        }
        const grave = document.getElementById("grave" + index);
        if (player.alive)
        {
            grave.style.display = "none";
            actedCheckbox.disabled = false;

            const alivePanel = document.getElementById("alivePanel" + index);
            alivePanel.style.display = "flex";

            player.piece.HP = player.HP;
            const labelHP = document.getElementById("HP" + index);
            labelHP.textContent = player.HP;
            labelHP.style.color = HPColor(player.HP, HERO_DATA[player.piece.name]["体力上限"]);

            player.piece.weapons = player.weapons;
            const weaponSelect = document.getElementById("weaponSelect" + index);
            weaponSelect.value = player.weapons[0];

            player.piece.armors = player.armors;
            const armorSelect = document.getElementById("armorSelect" + index);
            armorSelect.value = player.armors[0];

            player.piece.horses = player.horses;
            const horseSelect = document.getElementById("horseSelect" + index);
            horseSelect.value = player.horses[0];

            // 〖展骥〗
            if (player.piece.name == "庞统")
            {
                const armorSelect_zhanji = document.getElementById("armorSelect" + "_zhanji" + index);
                armorSelect_zhanji.value = player.armors[1];

                const horseSelect_zhanji = document.getElementById("horseSelect" + "_zhanji" + index);
                horseSelect_zhanji.value = player.horses[1];
            }

            player.piece.carrier = player.carrier;
            const carrierCheckbox = document.getElementById("carrierCheckbox" + index);
            carrierCheckbox.disabled = false;

            const cell = document.getElementsByClassName("cell")[player.position[0] * 7 + player.position[1]];
            cell.appendChild(player.piece);
        }
        else
        {
            grave.style.display = "flex";
            actedCheckbox.disabled = true;

            const alivePanel = document.getElementById("alivePanel" + index);
            alivePanel.style.display = "none";

            grave.appendChild(player.piece);
        }

    }
    if (state.redCarrier)
    {
        setCarrier("Red", state.redCarrier, false);
    }
    else
    {
        setCarrier("Red", null, false);
        const cell = document.getElementsByClassName("cell")[state.redFlagPosition[0] * 7 + state.redFlagPosition[1]];
        cell.appendChild(redFlag);
    }
    if (state.blueCarrier)
    {
        setCarrier("Blue", state.blueCarrier, false);
    }
    else
    {
        setCarrier("Blue", null, false);
        const cell = document.getElementsByClassName("cell")[state.blueFlagPosition[0] * 7 + state.blueFlagPosition[1]];
        cell.appendChild(blueFlag);
    }


    var overlaps = JSON.parse(JSON.stringify(state.overlaps));
    for (var index in overlaps)
    {
        if (overlaps[index] !== -1)
        {
            const piece = Pieces[index - 1];
            const cell = piece.parentElement;
            let overlapPieces = piecesIn(piece.parentElement);
            overlapPieces.sort((a, b) => overlaps[Pieces.indexOf(a) + 1] - overlaps[Pieces.indexOf(b) + 1]);
            for (const overlapPiece of overlapPieces)
            {
                cell.appendChild(overlapPiece);
                overlaps[Pieces.indexOf(overlapPiece) + 1] = -1;
            }
        }
    }
}

const stateHistory = new StateHistory();

export { stateHistory, saveState, recoverStatefrom };