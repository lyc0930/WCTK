import { HERO_DATA, TERRAIN_INFO } from './data.mjs';
import { isHighlighting } from './utils.mjs';
import { showModeTable } from './map.mjs';
import { Hero } from './hero.mjs';

const MENU_LOGO = {
    "更换武将": "class='fas fa-users'",
    "选择": "class='fas fa-user-check'",
    "查看技能": "class='fas fa-list-ul'",
    "移动阶段": "class='fas fa-up-down-left-right'",
    "移动阶段〖诱兵〗": "class='fas fa-arrows-turn-right'",
    "移动阶段〖神行〗": "class='fas fa-smog'",
    "〖节钺〗": "class='fas fa-person-walking-arrow-loop-left'",
    "〖归营〗": "class='fas fa-tent-arrow-down-to-line'",
    "迅【闪】": "class='fas fa-arrow-right-from-bracket'",
    "【暗度陈仓】": "class='fas fa-person-arrow-down-to-line'",
    "【兵贵神速】": "class='fas fa-angles-right'",
    "【奇门遁甲】": "class='fas fa-arrows-rotate'",
    "【诱敌深入】": "class='fas fa-person-walking-arrow-right'",
    "更换地图": "class='fas fa-grip'",
}

for (let name in TERRAIN_INFO)
{
    MENU_LOGO[name] = TERRAIN_INFO[name]["icon"];
}

// CONTEXT MENU

function addContextMenu(element, object, disable = function () { return false; })
{
    const menu = document.getElementById("context-menu");

    element.contextmenuEventListener = {
        "contextmenu": function (event)
        {
            if (disable()) return;
            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();
        },
        "mousedown": function (event)
        {
            if (event.button != 2) return;
            if (disable()) return;

            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            // 记录初始位置
            const startX = event.clientX + window.scrollX;
            const startY = event.clientY + window.scrollY;

            function onmouseup(event)
            {
                if (event.button != 2) return;

                // 计算移动距离
                const moveX = event.clientX + window.scrollX - startX;
                const moveY = event.clientY + window.scrollY - startY;

                // 移动距离大于10px则取消右键
                if (Math.abs(moveX) <= 10 && Math.abs(moveY) <= 10)
                {
                    if (event.cancelable) event.preventDefault();
                    // event.stopPropagation();
                    updateContextMenu(menu, object.context_menu_items);
                    positionMenu(menu, event);
                    if (menu.style.visibility != 'visible')
                    {
                        menu.style.visibility = 'visible';
                        menu.style.opacity = 1;
                    }
                }

            }

            element.addEventListener("mouseup", onmouseup, { once: true });
        },
        "touchstart": function (event)
        {
            if (event.touches.length > 1) return;
            if (disable()) return;
            if (isHighlighting()) return;

            // if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            hideContextMenu();

            // 记录初始位置
            const startX = event.touches[0].clientX + window.scrollX;
            const startY = event.touches[0].clientY + window.scrollY;

            const timeoutId = setTimeout(function ()
            {
                updateContextMenu(menu, object.context_menu_items);
                positionMenu(menu, event);
                if (menu.style.visibility != 'visible')
                {
                    menu.style.visibility = 'visible';
                    menu.style.opacity = 1;
                }
            }, 500);

            element.touchEventListener = {
                "touchmove": function (event)
                {
                    if (event.cancelable) event.preventDefault();
                    // event.stopPropagation();

                    // 计算移动距离
                    const moveX = event.touches[0].clientX + window.scrollX - startX;
                    const moveY = event.touches[0].clientY + window.scrollY - startY;

                    // 移动距离大于10px则取消长按
                    if (Math.abs(moveX) > 10 || Math.abs(moveY) > 10)
                    {
                        clearTimeout(timeoutId);
                        hideContextMenu();
                        element.removeEventListener("touchmove", element.touchEventListener["touchmove"]);
                        element.removeEventListener("touchend", element.touchEventListener["touchend"]);
                    }
                },
                "touchend": function (event)
                {
                    // if (event.cancelable) event.preventDefault();
                    // event.stopPropagation();
                    element.removeEventListener("touchmove", element.touchEventListener["touchmove"]);
                    element.removeEventListener("touchend", element.touchEventListener["touchend"]);
                    clearTimeout(timeoutId);
                }
            };

            element.addEventListener("touchmove", element.touchEventListener["touchmove"], { passive: false });

            element.addEventListener("touchend", element.touchEventListener["touchend"], { passive: false, once: true });
        }
    }

    element.addEventListener("contextmenu", element.contextmenuEventListener["contextmenu"]);

    element.addEventListener("mousedown", element.contextmenuEventListener["mousedown"]);

    element.addEventListener("touchstart", element.contextmenuEventListener["touchstart"], { passive: false });

}

function updateContextMenu(menu, items = {})
{
    menu.innerHTML = "";
    for (const item in items)
    {
        if (items[item] != "<hr>")
        {
            const menuItem = document.createElement("div");
            menuItem.classList.add("context-menu-item");
            const itemLabel = document.createElement("label");
            itemLabel.innerHTML = `<i ${MENU_LOGO[item]} ></i> ${item}`;
            menuItem.appendChild(itemLabel);
            menuItem.addEventListener("click", function (event)
            {
                if (event.cancelable) event.preventDefault();
                event.stopPropagation();
                hideContextMenu();
                items[item]();
            });
            menu.appendChild(menuItem);
        }
        else
        {
            const hr = document.createElement("hr");
            hr.style.border = "none";
            hr.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
            hr.style.height = "2px";
            hr.style.margin = "2px 0 2px 0";
            hr.style.boxShadow = "none";
            menu.appendChild(hr);
        }
    }
}

function removeContextMenu(element)
{
    if (element.contextmenuEventListener != null)
    {
        element.removeEventListener("contextmenu", element.contextmenuEventListener["contextmenu"]);
        element.removeEventListener("mousedown", element.contextmenuEventListener["mousedown"]);
        element.removeEventListener("touchstart", element.contextmenuEventListener["touchstart"]);
        element.contextmenuEventListener = null;
    }
}

function hideContextMenu()
{
    const menu = document.getElementById("context-menu");

    if (menu && menu.style.visibility != 'hidden')
    {
        menu.style.visibility = 'hidden';
        menu.style.opacity = 0;
        menu.ontrasitionend = function ()
        {
            menu.innerHTML = "";
            delete menu.ontrasitionend;
        }
    }
}

function positionMenu(menu, event)
{
    if (event?.clientX || event?.clientY)
    {
        var posX = event.clientX;
        var posY = event.clientY;
    }
    else if (event?.touches[0].clientX || event?.touches[0].clientY)
    {
        var posX = event.touches[0].clientX;
        var posY = event.touches[0].clientY;
    }
    else if (event?.changedTouches[0].clientX || event?.changedTouches[0].clientY)
    {
        var posX = event.changedTouches[0].clientX;
        var posY = event.changedTouches[0].clientY;
    }

    const clickCoordsX = posX + window.scrollX;
    const clickCoordsY = posY + window.scrollY;

    const menuWidth = menu.offsetWidth + 4;
    const menuHeight = menu.offsetHeight + 4;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (windowWidth - clickCoordsX < menuWidth)
    {
        menu.style.left = windowWidth - menuWidth + "px";
    } else
    {
        menu.style.left = clickCoordsX + "px";
    }

    if (windowHeight - clickCoordsY < menuHeight)
    {
        menu.style.top = windowHeight - menuHeight + "px";
    } else
    {
        menu.style.top = clickCoordsY + "px";
    }
}

// SKILL PANEL

function addSkillPanel(piece)
{

    piece.skillPanelEventListener = {
        "mouseover": function (event)
        {
            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            const timeoutId = setTimeout(function ()
            {
                showSkillPanel(piece);
            }, 300);

            function onmouseout(event)
            {
                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();
                clearTimeout(timeoutId);
                hideSkillPanel();
            }

            piece.addEventListener("mouseout", onmouseout, { once: true });
        },
        "touchstart": function (event)
        {
            if (event.touches.length > 1) return;
            if (isHighlighting()) return;

            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            // 记录初始位置
            const startX = event.touches[0].clientX + window.scrollX;
            const startY = event.touches[0].clientY + window.scrollY;

            showSkillPanel(piece);

            piece.touchEventListener = {
                "touchmove": function (event)
                {
                    if (event.cancelable) event.preventDefault();
                    // event.stopPropagation();

                    // 计算移动距离
                    const moveX = event.touches[0].clientX + window.scrollX - startX;
                    const moveY = event.touches[0].clientY + window.scrollY - startY;

                    // 移动距离大于10px则取消长按
                    if (Math.abs(moveX) > 10 || Math.abs(moveY) > 10)
                    {
                        hideSkillPanel();
                        piece.removeEventListener("touchmove", piece.touchEventListener["touchmove"]);
                        piece.removeEventListener("touchend", piece.touchEventListener["touchend"]);
                    }
                },
                "touchend": function (event)
                {
                    // document.addEventListener("click", function (event)
                    // {
                        hideSkillPanel();
                        piece.removeEventListener("touchmove", piece.touchEventListener["touchmove"]);
                    // });
                }
            };

            piece.addEventListener("touchmove", piece.touchEventListener["touchmove"], { passive: false });

            piece.addEventListener("touchend", piece.touchEventListener["touchend"], { passive: false, once: true });
        }
    };

    piece.addEventListener("mouseover", piece.skillPanelEventListener["mouseover"]);

    piece.addEventListener("touchstart", piece.skillPanelEventListener["touchstart"], { passive: false });
}

function updateSkillPanel(panel, name)
{
    panel.innerHTML = "";

    const skills = HERO_DATA[name]["技能"];
    const faction = HERO_DATA[name]["势力"];

    for (const skill in skills)
    {
        const skillItem = document.createElement("div");
        skillItem.classList.add("skill-item");

        const skillName = document.createElement("label");
        skillName.classList.add("skill-name");
        skillName.innerHTML = skill;

        if (faction === "魏")
        {
            skillName.classList.add("wei-front");
        }
        else if (faction === "蜀")
        {
            skillName.classList.add("shu-front");
        }
        else if (faction === "吴")
        {
            skillName.classList.add("wu-front");
        }
        else if (faction === "群")
        {
            skillName.classList.add("qun-front");
        }

        skillItem.appendChild(skillName);
        const skillText = document.createElement("p");
        skillText.classList.add("skill-text");
        skillText.innerHTML = skills[skill];
        skillItem.appendChild(skillText);

        panel.appendChild(skillItem);
    }
}

function showSkillPanel(hero)
{
    const skillPanel = document.getElementById("skill-panel");
    updateSkillPanel(skillPanel, hero.name);
    skillPanel.style.visibility = 'visible';
    skillPanel.style.opacity = 1;
}

function hideSkillPanel()
{
    const skillPanel = document.getElementById("skill-panel");

    skillPanel.style.visibility = 'hidden';
    skillPanel.style.opacity = 0;
    skillPanel.ontrasitionend = function ()
    {
        skillPanel.innerHTML = "";
        delete skillPanel.ontrasitionend;
    }
}

// TERRAIN PANEL

function showTerrainPanel(cell)
{
    const terrainPanel = document.getElementById("terrain-panel");

    terrainPanel.innerHTML = "";

    const terrainEffectItem = document.createElement("div");
    terrainEffectItem.classList.add("skill-item");

    const terrainEffectName = document.createElement("label");
    terrainEffectName.classList.add("skill-name");
    if (TERRAIN_INFO[cell.terrain]["neutral"])
    {
        terrainEffectName.style.color = TERRAIN_INFO[cell.terrain]["color"];
    }
    else
    {
        if (cell.classList.contains("Red"))
        {
            terrainEffectName.style.color = "rgba(255, 46, 46, 0.8)";
        }
        else if (cell.classList.contains("Blue"))
        {
            terrainEffectName.style.color = "rgba(46, 46, 255, 0.8)";
        }
        else
        {
            terrainEffectName.style.color = TERRAIN_INFO[cell.terrain]["color"];
        }
    }
    terrainEffectName.innerHTML = cell.terrain;

    terrainEffectItem.appendChild(terrainEffectName);
    const terrainEffectText = document.createElement("p");
    terrainEffectText.classList.add("terrainEffect-text");
    terrainEffectText.innerHTML = TERRAIN_INFO[cell.terrain]["地形效果"];
    terrainEffectItem.appendChild(terrainEffectText);

    terrainPanel.appendChild(terrainEffectItem);

    terrainPanel.style.visibility = 'visible';
    terrainPanel.style.opacity = 1;

    // all cells in the same terrain
    const cells = document.getElementsByClassName("cell");
    for (const c of cells)
    {
        if (TERRAIN_INFO[cell.terrain]["neutral"])
        {
            if (c.terrain === cell.terrain)
            {
                c.style.boxShadow = "0 0 0.25em 0.25em" + TERRAIN_INFO[cell.terrain]["color"];
                c.style.zIndex = 10;
            }
        }
        else
        {
            if (c.terrain === cell.terrain)
            {
                if (c.classList.contains("Red") && cell.classList.contains("Red"))
                {
                    c.style.boxShadow = "0 0 0.25em 0.25em rgba(255, 46, 46, 0.8)";
                    c.style.zIndex = 10;
                }
                else if (c.classList.contains("Blue") && cell.classList.contains("Blue"))
                {
                    c.style.boxShadow = "0 0 0.25em 0.25em rgba(46, 46, 255, 0.8)";
                    c.style.zIndex = 10;
                }
            }
        }
    }
}

function hideTerrainPanel()
{
    const terrainEffectPanel = document.getElementById("terrain-panel");

    terrainEffectPanel.style.visibility = 'hidden';
    terrainEffectPanel.style.opacity = 0;
    terrainEffectPanel.ontrasitionend = function ()
    {
        terrainEffectPanel.innerHTML = "";
        delete terrainEffectPanel.ontrasitionend;
    }

    // all cells in the same terrain
    const cells = document.getElementsByClassName("cell");
    for (const c of cells)
    {
        c.style.boxShadow = "none";
        c.style.zIndex = "auto";
    }
}

// HERO TABLE

function createHeroTable()
{
    const heroTable = document.createElement("div");
    heroTable.id = "hero-table";
    heroTable.classList.add("hero-table");
    document.body.appendChild(heroTable);

    const factions = ["魏", "蜀", "吴", "群"];
    for (const faction of factions)
    {
        const factionTable = document.createElement("div");
        factionTable.classList.add("faction-table");
        heroTable.appendChild(factionTable);

        const factionLabel = document.createElement("label");
        factionLabel.classList.add("faction-label");

        factionLabel.innerHTML = faction;
        factionTable.appendChild(factionLabel);

        const factionHeroes = document.createElement("div");
        factionHeroes.classList.add("faction-heroes");
        factionTable.appendChild(factionHeroes);

        if (faction === "魏")
        {
            factionLabel.classList.add("wei-front");
            factionTable.classList.add("wei-back");
        }
        else if (faction === "蜀")
        {
            factionLabel.classList.add("shu-front");
            factionTable.classList.add("shu-back");
        }
        else if (faction === "吴")
        {
            factionLabel.classList.add("wu-front");
            factionTable.classList.add("wu-back");
        }
        else if (faction === "群")
        {
            factionLabel.classList.add("qun-front");
            factionTable.classList.add("qun-back");
        }

        const heroes = (Object.keys(HERO_DATA)).filter(hero => HERO_DATA[hero]["势力"] === faction);

        for (const hero of heroes)
        {
            const heroName = document.createElement("div");
            heroName.classList.add("hero-name");
            heroName.textContent = hero;
            heroName.id = hero + "-hero-name";
            factionHeroes.appendChild(heroName);
        }
    }
}

function showHeroTable(piece)
{
    const heroTable = document.getElementById("hero-table");
    heroTable.style.visibility = 'visible';
    heroTable.style.opacity = 1;

    const pieces = document.getElementsByClassName("piece");
    const heroNames_existed = Array.from(pieces, piece => piece.name);

    const heroNames = heroTable.getElementsByClassName("hero-name");
    for (const heroName of heroNames)
    {
        if (heroNames_existed.includes(heroName.textContent))
        {
            heroName.style.opacity = 0.4;
            heroName.style.pointerEvents = 'none';
        }
        else
        {
            heroName.style.opacity = 1;
            heroName.style.pointerEvents = 'auto';
            heroName.onclick = function (event)
            {
                if (event.cancelable) event.preventDefault();
                piece.name = heroName.textContent;

                const avatar = piece.getElementsByClassName("avatar")[0];
                avatar.src = "https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Avatar" + HERO_DATA[piece.name]["拼音"] + "_active.webp";

                const nameTag = document.getElementById("unpickedName" + piece.id.slice(4));
                nameTag.innerHTML = piece.name;

                heroTable.style.visibility = 'hidden';
                heroTable.style.opacity = 0;
            };
        }
    }
}

// CLICK TO HIDE
document.addEventListener("click", function (event)
{
    if (event.button === 0)
    {
        hideContextMenu();
    }
    hideSkillPanel();
    hideTerrainPanel();

    const heroTable = document.getElementById("hero-table");
    if (heroTable)
    {
        heroTable.style.visibility = 'hidden';
        heroTable.style.opacity = 0;
    }

    const modeTable = document.getElementById("mode-table");
    if (modeTable)
    {
        modeTable.style.visibility = 'hidden';
        modeTable.style.opacity = 0;
    }
});

export { addContextMenu, removeContextMenu, hideContextMenu, addSkillPanel, createHeroTable, showHeroTable, showSkillPanel };