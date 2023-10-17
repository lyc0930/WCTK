import { Pieces } from "../scripts/main.js";
import { armors, horses } from "./data.mjs";
import { saveState } from "./history.mjs";

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

export { zhan_ji, zhan_ji_undo };


