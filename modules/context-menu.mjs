import { HERO_DATA } from './data.mjs';

function addContextMenu(element, items = {})
{
    const menu = document.getElementById("context-menu");

    element.addEventListener("contextmenu", function (event)
    {
        event.preventDefault();
        event.stopPropagation();
    });

    element.addEventListener("mousedown", function (event)
    {
        if (event.button != 2)
        {
            return;
        }

        if (element?.picked)
        {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        element.addEventListener("mouseup", function (event)
        {
            event.preventDefault();
            event.stopPropagation();
            updateContextMenu(menu, items);
            positionMenu(menu, event);
            if (menu.style.visibility != 'visible')
            {
                menu.style.visibility = 'visible';
                menu.style.opacity = 1;
            }
            element.onmouseup = null;
        });
    });

    element.addEventListener("touchstart", function (event)
    {
        event.preventDefault();
        event.stopPropagation();

        if (element?.picked)
        {
            return;
        }

        const timeoutId = setTimeout(function ()
        {
            updateContextMenu(menu, items);
            positionMenu(menu, event);
            if (menu.style.visibility != 'visible')
            {
                menu.style.visibility = 'visible';
                menu.style.opacity = 1;
            }
        }, 1000);

        element.addEventListener("touchend", function (event)
        {
            event.preventDefault();
            event.stopPropagation();
            clearTimeout(timeoutId);
            element.ontouchend = null;
        });
    });

    document.addEventListener("click", (event) =>
    {
        if (event.button === 0 && menu != null)
        {
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
    });
}

function removeContextMenu(element)
{
    element.onmousedown = null;
    element.oncontextmenu = null;
}

function addSkillPanel(piece)
{
    const skillPanel = document.getElementById("skill-panel");

    piece.addEventListener("mouseover", function (event)
    {
        event.preventDefault();
        event.stopPropagation();

        updateSkillPanel(skillPanel, piece.name);

        const timeoutId = setTimeout(function ()
        {
            skillPanel.style.visibility = 'visible';
            skillPanel.style.opacity = 1;
        }, 300);

        piece.addEventListener("mouseout", function (event)
        {
            event.preventDefault();
            event.stopPropagation();
            clearTimeout(timeoutId);
            skillPanel.style.visibility = 'hidden';
            skillPanel.style.opacity = 0;
            skillPanel.ontrasitionend = function () {
                skillPanel.innerHTML = "";
                skillPanel.ontrasitionend = null;
            }
            piece.onmouseout = null;
        });
    });

    piece.addEventListener("touchstart", function (event)
    {
        event.preventDefault();
        event.stopPropagation();

        updateSkillPanel(skillPanel, piece.name);
        skillPanel.style.visibility = 'visible';
        skillPanel.style.opacity = 1;

        piece.addEventListener("touchend", function (event)
        {
            document.addEventListener("click", function (event)
            {
                skillPanel.style.visibility = 'hidden';
                skillPanel.style.opacity = 0;
                skillPanel.ontrasitionend = function () {
                    skillPanel.innerHTML = "";
                    skillPanel.ontrasitionend = null;
                }
                piece.ontouchend = null;

            });
        });
    });
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
        const skillText = document.createElement("label");
        skillText.classList.add("skill-text");
        skillText.innerHTML = skills[skill];
        skillItem.appendChild(skillText);

        panel.appendChild(skillItem);
    }
}

function updateContextMenu(menu, items = {})
{
    menu.innerHTML = "";
    for (const item in items)
    {
        const menuItem = document.createElement("div");
        menuItem.classList.add("context-menu-item");
        const itemLabel = document.createElement("label");
        itemLabel.textContent = item;
        menuItem.appendChild(itemLabel);
        menuItem.addEventListener("click", items[item]);
        menu.appendChild(menuItem);
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
            heroName.innerHTML = hero;
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
        if (heroNames_existed.includes(heroName.innerHTML))
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
                event.preventDefault();
                piece.name = heroName.innerHTML;

                const avatar = piece.getElementsByClassName("avatar")[0];
                avatar.src = "./assets/Avatar/active/" + HERO_DATA[piece.name]["拼音"] + ".png";

                const nameTag = document.getElementById("unpickedName" + piece.id.slice(4));
                nameTag.innerHTML = piece.name;

                heroTable.style.visibility = 'hidden';
                heroTable.style.opacity = 0;
            };
        }
    }
}

export { addContextMenu, removeContextMenu, addSkillPanel, createHeroTable, showHeroTable };