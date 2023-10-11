import { Pieces } from "../script.js";
import { armors, horses } from "./data.mjs";
import { saveState } from "./history.mjs";

function skill_zhanji(piece, _index = null)
{
    const index = _index === null ? Pieces.indexOf(piece) + 1 : _index;

    const armorPanel = document.getElementById("armorPanel" + index);
    const armorSelect = document.getElementById("armorSelect" + index);
    const armorSelect_zhanji = document.createElement("select");
    armorSelect_zhanji.id = "armorSelect" + "_zhanji" + index;
    armorSelect_zhanji.className = "heroSelect";
    armorPanel.appendChild(armorSelect_zhanji);

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


    const horsePanel = document.getElementById("horsePanel" + index);
    const horseSelect = document.getElementById("horseSelect" + index);
    const horseSelect_zhanji = document.createElement("select");
    horseSelect_zhanji.id = "horseSelect" + "_zhanji" + index;
    horseSelect_zhanji.className = "heroSelect";
    horsePanel.appendChild(horseSelect_zhanji);

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

function skill_zhanji_undo(piece)
{
    const index = Pieces.indexOf(piece) + 1;

    const armorPanel = document.getElementById("armorPanel" + index);
    const armorSelect = document.getElementById("armorSelect" + index);
    const armorSelect_zhanji = document.getElementById("armorSelect" + "_zhanji" + index);
    if (armorSelect_zhanji)
    {
        armorPanel.removeChild(armorSelect_zhanji);
    }

    armorSelect.style.width = "65%";

    const horsePanel = document.getElementById("horsePanel" + index);
    const horseSelect = document.getElementById("horseSelect" + index);
    const horseSelect_zhanji = document.getElementById("horseSelect" + "_zhanji" + index);
    if (horseSelect_zhanji)
    {
        horsePanel.removeChild(horseSelect_zhanji);
    }

    horseSelect.style.width = "65%";
}

export { skill_zhanji, skill_zhanji_undo };

