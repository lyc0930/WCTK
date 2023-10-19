import { HERO_DATA } from './data.mjs';
import { isHighlighting } from './highlight.mjs';
import { movePhase, movePhase_you_bing } from './phases.mjs';
import { xunShan } from './basics.mjs';
import { shen_xing, jie_yue } from './skills.mjs';
import { AnDuChenCang, BingGuiShenSu, QiMenDunJia, YouDiShenRu } from './scrolls.mjs';

const MENU_LOGO = {
    "更换武将": "fa-users",
    "选择": "fa-user-check",
    "查看技能": "fa-list-ul",
    "移动阶段": "fa-up-down-left-right",
    "移动阶段〖诱兵〗": "fa-arrows-turn-right",
    "移动阶段〖神行〗": "fa-route",
    "节钺": "fa-person-walking-arrow-loop-left",
    "迅【闪】": "fa-arrow-right-from-bracket",
    "【暗度陈仓】": "fa-person-arrow-down-to-line",
    "【兵贵神速】": "fa-angles-right",
    "【奇门遁甲】": "fa-arrows-rotate",
    "【诱敌深入】": "fa-person-walking-arrow-right"
}

function contextMenuItems(piece)
{
    const items = {
        "查看技能": function () { showSkillPanel(piece); }
    };

    if (piece.alive)
    {
        items["break-line-1"] = "<hr>";
        items["移动阶段"] = function () { movePhase(piece); };

        if (piece.name == "祖茂")
        {
            items["移动阶段〖诱兵〗"] = function () { movePhase_you_bing(piece); };
        }
        else if (piece.name == "左慈")
        {
            items["移动阶段〖神行〗"] = function () { shen_xing(piece); };
        }

        if (piece.name == "于禁")
        {
            items["break-line-4"] = "<hr>";
            items["节钺"] = function () { jie_yue(piece); };
        }
        items["break-line-2"] = "<hr>";
        items["迅【闪】"] = function () { xunShan(piece); };
        items["break-line-3"] = "<hr>";
        // 〖奇才〗
        items["【暗度陈仓】"] = function () { AnDuChenCang(piece, (piece.name == "黄月英") ? 4 : 3); };
        items["【兵贵神速】"] = function () { BingGuiShenSu(piece); };
        items["【奇门遁甲】"] = function () { QiMenDunJia(piece, (piece.name == "黄月英") ? 3 : 2); };
        items["【诱敌深入】"] = function () { YouDiShenRu(piece, (piece.name == "黄月英") ? 5 : 4); };
    }
    return items;
}

function addContextMenu(element, items = {})
{
    const menu = document.getElementById("context-menu");

    element.contextmenuEventListener = {
        "contextmenu": function (event)
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();
        },
        "mousedown": function (event)
        {
            if (event.button != 2)
            {
                return;
            }

            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            // 记录初始位置
            const startX = event.clientX + window.scrollX;
            const startY = event.clientY + window.scrollY;

            function onmouseup(event)
            {
                if (event.button != 2)
                {
                    return;
                }

                // 计算移动距离
                const moveX = event.clientX + window.scrollX - startX;
                const moveY = event.clientY + window.scrollY - startY;

                // 移动距离大于10px则取消右键
                if (Math.abs(moveX) <= 10 && Math.abs(moveY) <= 10)
                {
                    if (event.cancelable) event.preventDefault();
                    event.stopPropagation();
                    updateContextMenu(menu, items);
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
            if (event.touches.length > 1)
            {
                return;
            }

            // 正在等待响应
            if (isHighlighting())
            {
                return;
            }

            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            hideContextMenu();

            // 记录初始位置
            const startX = event.touches[0].clientX + window.scrollX;
            const startY = event.touches[0].clientY + window.scrollY;

            const timeoutId = setTimeout(function ()
            {
                updateContextMenu(menu, items);
                positionMenu(menu, event);
                if (menu.style.visibility != 'visible')
                {
                    menu.style.visibility = 'visible';
                    menu.style.opacity = 1;
                }
            }, 750);

            element.touchEventListener = {
                "touchmove": function (event)
                {
                    if (event.cancelable) event.preventDefault();
                    event.stopPropagation();

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
                    if (event.cancelable) event.preventDefault();
                    event.stopPropagation();
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

    document.addEventListener("click", (event) =>
    {
        if (event.button === 0 && menu != null)
        {
            hideContextMenu();
        }
    });
}

function removeContextMenu(element)
{
    element.removeEventListener("contextmenu", element.contextmenuEventListener["contextmenu"]);
    element.removeEventListener("mousedown", element.contextmenuEventListener["mousedown"]);
    element.removeEventListener("touchstart", element.contextmenuEventListener["touchstart"]);
    element.contextmenuEventListener = null;
}

function hideContextMenu()
{
    const menu = document.getElementById("context-menu");

    if (menu.style.visibility != 'hidden')
    {
        menu.style.visibility = 'hidden';
        menu.style.opacity = 0;
        menu.ontrasitionend = function ()
        {
            menu.innerHTML = "";
            menu.ontrasitionend = null;
        }
    }
}

function addSkillPanel(piece)
{

    piece.skillPanelEventListener = {
        "mouseover": function (event)
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            const timeoutId = setTimeout(function ()
            {
                showSkillPanel(piece);
            }, 300);

            function onmouseout(event)
            {
                if (event.cancelable) event.preventDefault();
                event.stopPropagation();
                clearTimeout(timeoutId);
                hideSkillPanel();
            }

            piece.addEventListener("mouseout", onmouseout, { once: true });
        },
        "touchstart": function (event)
        {
            if (event.touches.length > 1)
            {
                return;
            }

            // 正在等待响应
            if (isHighlighting())
            {
                return;
            }

            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            // 记录初始位置
            const startX = event.touches[0].clientX + window.scrollX;
            const startY = event.touches[0].clientY + window.scrollY;

            showSkillPanel(piece);

            piece.touchEventListener = {
                "touchmove": function (event)
                {
                    if (event.cancelable) event.preventDefault();
                    event.stopPropagation();

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

        if (faction == "魏")
        {
            skillName.classList.add("wei-front");
        }
        else if (faction == "蜀")
        {
            skillName.classList.add("shu-front");
        }
        else if (faction == "吴")
        {
            skillName.classList.add("wu-front");
        }
        else if (faction == "群")
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

function showSkillPanel(piece)
{
    // hideContextMenu();

    const skillPanel = document.getElementById("skill-panel");
    updateSkillPanel(skillPanel, piece.name);
    skillPanel.style.visibility = 'visible';
    skillPanel.style.opacity = 1;

    document.addEventListener("click", function (event)
    {
        hideSkillPanel();
    });
}

function hideSkillPanel()
{
    const skillPanel = document.getElementById("skill-panel");

    skillPanel.style.visibility = 'hidden';
    skillPanel.style.opacity = 0;
    skillPanel.ontrasitionend = function ()
    {
        skillPanel.innerHTML = "";
        skillPanel.ontrasitionend = null;
    }
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
            itemLabel.innerHTML = `<i class="fas ${MENU_LOGO[item]}" style="color: #333333;"></i> ${item}`;
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

function getPosition(event)
{
    var posX = 0;
    var posY = 0;
    if (event?.clientX || event?.clientY)
    {
        posX = event.clientX;
        posY = event.clientY;
    }
    else if (event?.touches[0].clientX || event?.touches[0].clientY)
    {
        posX = event.touches[0].clientX;
        posY = event.touches[0].clientY;
    }
    else if (event?.changedTouches[0].clientX || event?.changedTouches[0].clientY)
    {
        posX = event.changedTouches[0].clientX;
        posY = event.changedTouches[0].clientY;
    }

    return {
        x: posX + window.scrollX,
        y: posY + window.scrollY
    };
}

function positionMenu(menu, event)
{
    let clickCoords = getPosition(event);
    let clickCoordsX = clickCoords.x;
    let clickCoordsY = clickCoords.y;

    let menuWidth = menu.offsetWidth + 4;
    let menuHeight = menu.offsetHeight + 4;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

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

        if (faction == "魏")
        {
            factionLabel.classList.add("wei-front");
            factionTable.classList.add("wei-back");
        }
        else if (faction == "蜀")
        {
            factionLabel.classList.add("shu-front");
            factionTable.classList.add("shu-back");
        }
        else if (faction == "吴")
        {
            factionLabel.classList.add("wu-front");
            factionTable.classList.add("wu-back");
        }
        else if (faction == "群")
        {
            factionLabel.classList.add("qun-front");
            factionTable.classList.add("qun-back");
        }

        const heroes = (Object.keys(HERO_DATA)).filter(hero => HERO_DATA[hero]["势力"] == faction);

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
                avatar.src = "./assets/Avatar/active/" + HERO_DATA[piece.name]["拼音"] + ".png";

                const nameTag = document.getElementById("unpickedName" + piece.id.slice(4));
                nameTag.innerHTML = piece.name;

                heroTable.style.visibility = 'hidden';
                heroTable.style.opacity = 0;
            };
        }
    }

    document.addEventListener("click", function (event)
    {
        heroTable.style.visibility = 'hidden';
        heroTable.style.opacity = 0;
    });
}

export { contextMenuItems, addContextMenu, removeContextMenu, hideContextMenu, addSkillPanel, createHeroTable, showHeroTable, showSkillPanel };