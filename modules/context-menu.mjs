import { HERO_DATA } from './data.mjs';

function addContextMenu(element, items = {})
{
    const menu = document.createElement("div");
    menu.id = element.id + "-context-menu";
    menu.classList.add("context-menu");
    document.body.appendChild(menu);

    // Add items to the context menu
    for (let item in items)
    {
        let menuItem = document.createElement("div");
        menuItem.classList.add("context-menu-item");
        let itemLabel = document.createElement("label");
        itemLabel.textContent = item;
        menuItem.appendChild(itemLabel);
        menuItem.addEventListener("click", items[item]);
        menu.appendChild(menuItem);
    }


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

        event.preventDefault();
        event.stopPropagation();

        element.addEventListener("mouseup", function (event)
        {
            event.preventDefault();
            event.stopPropagation();
            if (menu.style.visibility != 'visible')
            {
                menu.style.visibility = 'visible';
                menu.style.opacity = 1;
            }
            positionMenu(menu, event);
            element.onmouseup = null;
        });
    });

    element.addEventListener("touchstart", function (event)
    {
        event.preventDefault();
        event.stopPropagation();

        const timeoutId = setTimeout(function ()
        {
            if (menu.style.visibility != 'visible')
            {
                hideAllSuspension();
                menu.style.visibility = 'visible';
                menu.style.opacity = 1;
            }
            positionMenu(menu, event);
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
            }
        }
    });
}

function removeContextMenu(element)
{
    const menu = document.getElementById(element.id + "-context-menu");
    document.body.removeChild(menu);
    element.oncontextmenu = null;
}

function addSkillPanel(piece)
{
    const skillPanel = document.createElement("div");
    skillPanel.id = piece.id + "-skill-panel";
    skillPanel.classList.add("skill-panel");
    document.body.appendChild(skillPanel);

    const skills = HERO_DATA[piece.name]["技能"];
    const faction = HERO_DATA[piece.name]["势力"];
    for (let skill in skills)
    {
        const skillItem = document.createElement("div");
        skillItem.classList.add("skill-item");

        const skillName = document.createElement("label");
        skillName.classList.add("skill-name");
        skillName.innerHTML = skill;

        if (faction == "魏")
        {
            skillName.classList.add("wei");
        } else if (faction == "蜀")
        {
            skillName.classList.add("shu");
        } else if (faction == "吴")
        {
            skillName.classList.add("wu");
        } else if (faction == "群")
        {
            skillName.classList.add("qun");
        }

        skillItem.appendChild(skillName);
        const skillText = document.createElement("label");
        skillText.classList.add("skill-text");
        skillText.innerHTML = skills[skill];
        skillItem.appendChild(skillText);
        skillPanel.appendChild(skillItem);
    }

    piece.addEventListener("mouseover", function (event)
    {
        event.preventDefault();
        event.stopPropagation();
        const timeoutId = setTimeout(function ()
        {
            skillPanel.style.visibility = 'visible';
            skillPanel.style.opacity = 1;
        }, 500);

        piece.addEventListener("mouseout", function (event)
        {
            event.preventDefault();
            event.stopPropagation();
            clearTimeout(timeoutId);
            skillPanel.style.visibility = 'hidden';
            skillPanel.style.opacity = 0;
            piece.onmouseout = null;
        });
    });

    piece.addEventListener("touchstart", function (event)
    {
        event.preventDefault();
        event.stopPropagation();

        hideAllSuspension();
        skillPanel.style.visibility = 'visible';
        skillPanel.style.opacity = 1;

        piece.addEventListener("touchend", function (event)
        {
            document.addEventListener("click", function (event)
            {
                skillPanel.style.visibility = 'hidden';
                skillPanel.style.opacity = 0;
                piece.ontouchend = null;

            });
        });
    });
}

function hideAllSuspension()
{
    const contextMenus = document.getElementsByClassName("context-menu");
    for (let i = 0; i < contextMenus.length; i++)
    {
        contextMenus[i].style.visibility = 'hidden';
        contextMenus[i].style.opacity = 0;
    }

    const skillPanels = document.getElementsByClassName("skill-panel");
    for (let i = 0; i < skillPanels.length; i++)
    {
        skillPanels[i].style.visibility = 'hidden';
        skillPanels[i].style.opacity = 0;
    }
}

function getPosition(event)
{
    var posX = 0;
    var posY = 0;
    if (event?.pageX || event?.pageY)
    {
        posX = event.pageX;
        posY = event.pageY;
    } else if (event?.clientX || event?.clientY)
    {
        posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    } else if (event?.touches[0].clientX || event?.touches[0].clientY)
    {
        posX = event.touches[0].clientX;
        posY = event.touches[0].clientY;
    } else if (event?.changedTouches[0].clientX || event?.changedTouches[0].clientY)
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

export { addContextMenu, removeContextMenu, addSkillPanel };