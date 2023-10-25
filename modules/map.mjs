import { TERRAIN, TERRAIN_INFO } from "./data.mjs";
import { isHighlighting } from "./highlight.mjs";
import { piecesIn } from "./utils.mjs";
import { addContextMenu, removeContextMenu, contextMenuItems } from "./context-menu.mjs";

// 更换地图
function setMode(mode)
{
    const mainboard = document.getElementById("mainboard");
    mainboard.style.backgroundImage = `url('../assets/Map/${mode}.jpg')`;
    mainboard.mode = mode;

    const Map = TERRAIN[mode];

    const cells = document.getElementsByClassName("cell");

    for (var row = 0; row < 7; row++)
    {
        for (var col = 0; col < 7; col++)
        {
            const cell = cells[row * 7 + col];
            setTerrain(cell, Map[row][col]);
        }
    }
}

// 更改地形
function setTerrain(cell, terrain)
{
    cell.className = "cell";

    if (terrain.includes("红方") || terrain.includes("蓝方"))
    {
        if (terrain.includes("红方"))
        {
            cell.classList.add("Red");
        }
        else
        {
            cell.classList.add("Blue");
        }
        cell.classList.add(TERRAIN_INFO[terrain.slice(0, -3)]["className"]);
        cell.terrain = terrain.slice(0, -3);
    }
    else
    {
        cell.classList.add(TERRAIN_INFO[terrain]["className"]);
        cell.terrain = terrain;
    }

    removeContextMenu(cell);
    addContextMenu(cell, contextMenuItems(cell), function ()
    {
        if (piecesIn(cell).length > 0 || isHighlighting())
        {
            return true;
        }
        else
        {
            return false;
        }
    });
}

(function createModeTable()
{
    const modeTable = document.createElement("div");
    modeTable.id = "mode-table";
    modeTable.classList.add("mode-table");
    document.body.appendChild(modeTable);

    const modes = Object.keys(TERRAIN);

    const color = {
        "野战": "rgb(157, 250, 150)",
        "攻城": "rgb(250, 127, 180)",
        "水战": "rgb(052, 255, 250)",
        "马战": "rgb(255, 250, 052)",
        "车战": "rgb(255, 157, 150)",
        "步战": "rgb(255, 180, 127)",
    }

    for (const mode of modes)
    {
        const modeName = document.createElement("div");
        modeName.classList.add("mode-name");
        modeName.textContent = mode;
        modeName.style.color = color[mode];

        const modeItem = document.createElement("div");
        modeItem.classList.add("mode-item");
        modeItem.style.backgroundImage = `url('../assets/Map/${mode}.jpg')`;

        modeItem.appendChild(modeName);
        modeTable.appendChild(modeItem);
    }
})();

function showModeTable()
{
    const modeTable = document.getElementById("mode-table");
    modeTable.style.visibility = 'visible';
    modeTable.style.opacity = 1;

    const mainboard = document.getElementById("mainboard");
    const currentMode = mainboard.mode;

    const heroNames = modeTable.getElementsByClassName("mode-name");
    for (const modeName of heroNames)
    {
        if (modeName.textContent === currentMode)
        {
            modeName.parentElement.style.opacity = 0.4;
            modeName.parentElement.style.pointerEvents = 'none';
        }
        else
        {
            modeName.parentElement.style.opacity = 1;
            modeName.parentElement.style.pointerEvents = 'auto';
            modeName.parentElement.onclick = function (event)
            {
                if (event.cancelable) event.preventDefault();

                setMode(modeName.textContent);

                modeTable.style.visibility = 'hidden';
                modeTable.style.opacity = 0;
            };
        }
    }
}


export { setMode, setTerrain, showModeTable };