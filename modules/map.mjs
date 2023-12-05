import { TERRAIN, TERRAIN_INFO } from "./data.mjs";
import { Areas, Heroes } from "./global_variables.mjs";
import { Area, create_area } from '../modules/area.mjs';

// 更换地图
function setMode(mode, de_novo=true)
{
    const mainboard = document.getElementById("mainboard");
    mainboard.style.backgroundImage = `url('https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Map/${mode}.webp')`;
    mainboard.mode = mode;

    const chessboard = document.getElementById("chessboard");
    const Map = TERRAIN[mode];

    for (let row = 0; row < 7; row++)
    {
        for (let col = 0; col < 7; col++)
        {
            if (de_novo)
            {
                const area = create_area(row, col, Map[row][col]);
                chessboard.appendChild(area.cell);
            }
            else
            {
                const old_area = Areas[row][col];
                const heroes = old_area.heroes;
                const new_area = create_area(row, col, Map[row][col]);
                for (const hero of heroes)
                {
                    hero._area = new_area;
                }
                for (const child of old_area.cell.children)
                {
                    new_area.cell.appendChild(child);
                }
                chessboard.replaceChild(new_area.cell, old_area.cell);
            }
        }
    }
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
        modeItem.style.backgroundImage = `url('https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Map/${mode}.webp')`;

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
            modeName.parentElement.onclick = (event) =>
            {
                if (event.cancelable) event.preventDefault();

                setMode(modeName.textContent, false);

                modeTable.style.visibility = 'hidden';
                modeTable.style.opacity = 0;
            };
        }
    }
}


export { setMode, showModeTable };