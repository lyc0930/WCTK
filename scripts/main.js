import { TERRAIN, TERRAIN_INFO, HERO_DATA, weapons, armors, horses } from '../modules/data.mjs';
import { generateFlags } from '../modules/flags.mjs';
import { HPColor, cls, record } from '../modules/utils.mjs';
import { setMode } from '../modules/map.mjs';
import { Hero, create_hero } from '../modules/hero.mjs';
import { Area, create_area } from '../modules/area.mjs';

export var Heroes = [];
export var Areas = [];

for (var i = 0; i < 7; i++)
{
    Areas.push([]);
    for (var j = 0; j < 7; j++)
    {
        Areas[i].push(null);
    }
}


// 创建棋盘
function createChessboard(mode = "野战")
{
    const chessboard = document.getElementById("chessboard");
    const Map = TERRAIN[mode];

    for (var row = 0; row < 7; row++)
    {
        for (var col = 0; col < 7; col++)
        {
            const area = create_area(row, col, Map[row][col]);
            chessboard.appendChild(area.cell);
        }
    }

    setMode(mode);
}

// 创建菜单
function createMenuList()
{
    const redMenuList = document.createElement("div");
    redMenuList.className = "menu-list";
    redMenuList.id = "redMenuList";

    const blueMenuList = document.createElement("div");
    blueMenuList.className = "menu-list";
    blueMenuList.id = "blueMenuList";

    for (var i = 0; i < 6; i++)
    {
        const menu = document.createElement("div");
        menu.className = "menu";
        menu.id = "menu" + i;

        const fixedPanel = document.createElement("div");
        fixedPanel.className = "fixed-panel";
        fixedPanel.id = "fixedPanel" + i;

        const selectBlock = document.createElement("div");
        selectBlock.className = "select-block";
        selectBlock.classList.add("block");

        const heroLabel = document.createElement("label");
        heroLabel.innerHTML = "武将：";
        heroLabel.htmlFor = "heroSelect" + i;

        const heroSelect = document.createElement("select");
        heroSelect.className = "hero-select";
        heroSelect.id = "heroSelect" + i;

        selectBlock.appendChild(heroLabel);
        selectBlock.appendChild(heroSelect);

        for (const name in HERO_DATA)
        {
            const option = document.createElement("option");
            option.id = name + i;
            option.value = name;
            option.innerText = name;
            heroSelect.appendChild(option);
        }
        heroSelect.addEventListener("change", function (event)
        {
            const index = this.id.slice(-1);
            const hero = Heroes[index];
            Heroes[index] = create_hero(heroSelect.value, hero.color, hero.index);
            if (hero.alive)
            {
                Heroes[index].alive = true;
                Heroes[index].area = hero.area;
            }
            else
            {
                Heroes[index].grave.appendChild(Heroes[index].piece);
            }

            if (hero.carrier)
            {
                Heroes[index].carrier = true;
            }

            hero.piece.parentElement.removeChild(hero.piece);
        });

        const checkBlock = document.createElement("div");
        checkBlock.className = "check-block";
        checkBlock.classList.add("block");
        checkBlock.id = "checkBlock" + i;

        const carrierLabel = document.createElement("label");
        carrierLabel.innerHTML = "主帅";
        carrierLabel.htmlFor = "carrierCheckbox" + i;

        const carrierCheckbox = document.createElement("input");
        carrierCheckbox.type = "checkbox";
        carrierCheckbox.className = "checkbox";
        carrierCheckbox.id = "carrierCheckbox" + i;
        carrierCheckbox.name = (i < 3 ? 'red' : 'blue') + "Checkbox";

        carrierCheckbox.addEventListener("change", function (event)
        {
            const index = this.id.slice(-1);
            const hero = Heroes[index];
            hero.carrier = this.checked;
            // saveState();
        }
        );

        const actedLabel = document.createElement("label");
        actedLabel.innerHTML = "本轮行动";
        actedLabel.htmlFor = "actedCheckbox" + i;

        const actedCheckbox = document.createElement("input");
        actedCheckbox.type = "checkbox";
        actedCheckbox.className = "checkbox";
        actedCheckbox.id = "actedCheckbox" + i;

        actedCheckbox.addEventListener("change", function (event)
        {
            const index = this.id.slice(-1);
            if (!actedCheckbox.checked)
            {
                for (const hero of Heroes)
                {
                    hero.acted = false;
                }
                record(`新轮次开始`);
            }
            else
            {
                const hero = Heroes[index];
                hero.acted = true;
                record(`${hero.name}回合结束`);
            }
            // saveState();
        }
        );

        checkBlock.appendChild(carrierLabel);
        checkBlock.appendChild(carrierCheckbox);
        checkBlock.appendChild(actedLabel);
        checkBlock.appendChild(actedCheckbox);

        fixedPanel.appendChild(selectBlock);
        fixedPanel.appendChild(checkBlock);

        const alivePanel = document.createElement("div");
        alivePanel.className = "alive-panel";
        alivePanel.id = "alivePanel" + i;

        const HPBlock = document.createElement("div");
        HPBlock.className = "HP-block";
        HPBlock.classList.add("block");
        HPBlock.id = "HPBlock" + i;

        const HPLabel = document.createElement("label");
        HPLabel.innerHTML = "体力值：";
        HPLabel.htmlFor = "HPMinus" + i;

        const HPMinus = document.createElement("i");
        HPMinus.className = "fas fa-minus-circle";
        HPMinus.id = "HPMinus" + i;

        HPMinus.addEventListener("click", function (event)
        {
            const index = this.id.slice(-1);
            const hero = Heroes[index];
            hero.HP = Math.max(0, hero.HP - 1);
        });

        const labelHP = document.createElement("label");
        labelHP.id = "HP" + i;
        labelHP.type = "numner";
        labelHP.className = "number";
        labelHP.innerHTML = "0";
        labelHP.htmlFor = "HPMinus" + i;

        const labelSlash = document.createElement("label");
        labelSlash.innerHTML = "/";

        const labelMaxHP = document.createElement("label");
        labelMaxHP.id = "maxHP" + i;
        labelMaxHP.type = "numner";
        labelMaxHP.className = "number";
        labelMaxHP.innerHTML = "0";
        labelMaxHP.htmlFor = "HPPlus" + i;

        const HPPlus = document.createElement("i");
        HPPlus.className = "fas fa-plus-circle";
        HPPlus.id = "HPPlus" + i;

        HPPlus.addEventListener("click", function (event)
        {
            const index = this.id.slice(-1);
            const hero = Heroes[index];
            hero.HP = Math.min(hero.HP + 1, HERO_DATA[hero.name]["体力上限"]);
        });

        HPBlock.appendChild(HPLabel);
        HPBlock.appendChild(HPMinus);
        HPBlock.appendChild(labelHP);
        HPBlock.appendChild(labelSlash);
        HPBlock.appendChild(labelMaxHP);
        HPBlock.appendChild(HPPlus);

        const weaponBlock = document.createElement("div");
        weaponBlock.className = "select-block";
        weaponBlock.classList.add("block");
        weaponBlock.id = "weaponBlock" + i;

        const weaponLabel = document.createElement("label");
        weaponLabel.innerHTML = "武器：";
        weaponLabel.htmlFor = "weaponSelect" + i;

        const weaponSelect = document.createElement("select");
        weaponSelect.className = "hero-select";
        weaponSelect.id = "weaponSelect" + i;

        for (const name in weapons)
        {
            const option = document.createElement("option");
            option.id = name + i;
            option.value = name;
            option.innerText = name;
            weaponSelect.appendChild(option);
        }

        weaponSelect.addEventListener("change", function (event)
        {
            const index = this.id.slice(-1);
            const hero = Heroes[index];
            hero.weapon = weaponSelect.value;
        });

        weaponBlock.appendChild(weaponLabel);
        weaponBlock.appendChild(weaponSelect);

        const armorBlock = document.createElement("div");
        armorBlock.className = "select-block";
        armorBlock.classList.add("block");
        armorBlock.id = "armorBlock" + i;

        const armorLabel = document.createElement("label");
        armorLabel.innerHTML = "防具：";
        armorLabel.htmlFor = "armorSelect" + i;

        const armorSelect = document.createElement("select");
        armorSelect.className = "hero-select";
        armorSelect.id = "armorSelect" + i;

        for (const name in armors)
        {
            const option = document.createElement("option");
            option.id = name + i;
            option.value = name;
            option.innerText = name;
            armorSelect.appendChild(option);
        }

        armorSelect.addEventListener("change", function (event)
        {
            const index = this.id.slice(-1);
            const hero = Heroes[index];
            hero.armor = armorSelect.value;
        });

        armorBlock.appendChild(armorLabel);
        armorBlock.appendChild(armorSelect);

        const horseBlock = document.createElement("div");
        horseBlock.className = "select-block";
        horseBlock.classList.add("block");
        horseBlock.id = "horseBlock" + i;

        const horseLabel = document.createElement("label");
        horseLabel.innerHTML = "坐骑：";
        horseLabel.htmlFor = "horseSelect" + i;

        const horseSelect = document.createElement("select");
        horseSelect.className = "hero-select";
        horseSelect.id = "horseSelect" + i;

        for (const name in horses)
        {
            const option = document.createElement("option");
            option.id = name + i;
            option.value = name;
            option.innerText = name;
            horseSelect.appendChild(option);
        }

        horseSelect.addEventListener("change", function (event)
        {
            const index = this.id.slice(-1);
            const hero = Heroes[index];
            hero.horse = horseSelect.value;
        });

        horseBlock.appendChild(horseLabel);
        horseBlock.appendChild(horseSelect);

        alivePanel.appendChild(HPBlock);
        alivePanel.appendChild(weaponBlock);
        alivePanel.appendChild(armorBlock);
        alivePanel.appendChild(horseBlock);

        alivePanel.style.display = "none";

        menu.appendChild(fixedPanel);
        menu.appendChild(alivePanel);

        const grave = document.createElement("div");
        grave.className = "grave";
        grave.classList.add(i < 3 ? "Red" : "Blue");
        grave.id = "grave" + i;

        grave.style.display = "flex";

        menu.appendChild(grave);

        if (i < 3)
        {
            redMenuList.appendChild(menu);
        }
        else
        {
            blueMenuList.appendChild(menu);
        }
    }

    document.body.appendChild(redMenuList);
    document.body.appendChild(blueMenuList);
}

// 初始化棋盘上的棋子
function initializePieces(names = [])
{
    const chessboard = document.getElementById("chessboard");
    const HERO_DATAList = Object.keys(HERO_DATA);
    var init_heroes = names;
    for (var i = names.length; i < 6; i++)
    {
        var index = Math.floor(Math.random() * (HERO_DATAList.length - i));
        init_heroes.push(HERO_DATAList[index]);
        HERO_DATAList[index] = HERO_DATAList[HERO_DATAList.length - 1 - i];
    }
    for (var i = 0; i < 6; i++)
    {
        const hero_name = init_heroes[i];
        const hero = create_hero(hero_name, (i < 3) ? "Red" : "Blue", i);
        Heroes.push(hero);
        hero.grave.appendChild(hero.piece);
    }
}

// 初始化游戏
function initializeGame(mode = "野战", names = [])
{
    createChessboard(mode);
    generateFlags();

    const chessboard = document.getElementById("chessboard");
    document.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); }); // 禁用右键菜单
    document.addEventListener('mouseup', function (event)
    {
        if (event.button === 2)
        {
            event.preventDefault()
            cls();
        }
    });

    createMenuList();
    initializePieces(names);
    // saveState();

    // // 撤销重做
    // chessboard.addEventListener("wheel", function (event)
    // {
    //     if (event.deltaY < 0 && stateHistory.currentIndex > 0)
    //     {
    //         if (event.cancelable) event.preventDefault();
    //         const previousState = stateHistory.undo();
    //         if (previousState)
    //         {
    //             recoverStatefrom(previousState);
    //         }
    //     } else if (event.deltaY > 0 && stateHistory.currentIndex < stateHistory.history.length - 1)
    //     {
    //         if (event.cancelable) event.preventDefault();
    //         const nextState = stateHistory.redo();
    //         if (nextState)
    //         {
    //             recoverStatefrom(nextState);
    //         }
    //     }
    // }, { passive: false });

    // document.addEventListener("keydown", function (event)
    // {
    //     if (event.key === 'ArrowUp')
    //     {
    //         if (event.cancelable) event.preventDefault();
    //         const previousState = stateHistory.undo();
    //         if (previousState)
    //         {
    //             recoverStatefrom(previousState);
    //         }
    //     }
    //     else if (event.key === 'ArrowDown')
    //     {
    //         if (event.cancelable) event.preventDefault();
    //         const nextState = stateHistory.redo();
    //         if (nextState)
    //         {
    //             recoverStatefrom(nextState);
    //         }
    //     }
    //     else if(event.key === 'z' && event.ctrlKey)
    //     {
    //         if (event.cancelable) event.preventDefault();
    //         const previousState = stateHistory.undo();
    //         if (previousState)
    //         {
    //             recoverStatefrom(previousState);
    //         }
    //     }
    //     else if (event.key === 'y' && event.ctrlKey)
    //     {
    //         if (event.cancelable) event.preventDefault();
    //         const nextState = stateHistory.redo();
    //         if (nextState)
    //         {
    //             recoverStatefrom(nextState);
    //         }
    //     }
    //     else if (event.key === 'l' && event.ctrlKey)
    //     {
    //         event.preventDefault()
    //         cls();
    //     }
    // });

    // document.addEventListener("touchstart", function (event)
    // {
    //     if (event.touches.length > 1 || isHighlighting())
    //     {
    //         return;
    //     }

    //     var edge = null;

    //     const historyTooltip = document.getElementById("history-tooltip");
    //     const icon = historyTooltip.querySelector("i");
    //     const label = historyTooltip.querySelector("label");

    //     if (window.scrollY <= 0)
    //     {
    //         edge = "top";
    //     }
    //     else if (window.scrollY + window.innerHeight >= document.body.scrollHeight)
    //     {
    //         edge = "bottom";
    //     }
    //     else
    //     {
    //         return;
    //     }

    //     historyTooltip.style.visibility = "visible";
    //     historyTooltip.style.opacity = "1";

    //     if (edge === "top")
    //     {
    //         historyTooltip.style.top = "0";
    //         historyTooltip.style.webkitTransform = "translate(-50%, -100%)";
    //         historyTooltip.style.transform = "translate(-50%, -100%)";
    //         icon.className = "fas fa-rotate-left";
    //         label.textContent = "后退0步";
    //     }
    //     else if (edge === "bottom")
    //     {
    //         historyTooltip.style.top = `${document.body.scrollHeight}px`;
    //         historyTooltip.style.webkitTransform = "translate(-50%, 100%)";
    //         historyTooltip.style.transform = "translate(-50%, 100%)";
    //         icon.className = "fas fa-rotate-right";
    //         label.textContent = "重做0步";
    //     }

    //     const startIndex = stateHistory.currentIndex;
    //     const startY = event.touches[0].clientY;
    //     const threshold = 100;

    //     var direction = null;

    //     function ontouchscroll(event)
    //     {
    //         var deltaY = (event.touches[0].clientY - startY);

    //         if (direction === null)
    //         {
    //             // 纵向滑动已经到顶
    //             if (edge === "top" && deltaY > 0)
    //             {
    //                 direction = "pull-down";
    //             }
    //             // 纵向滑动已经到底
    //             else if (edge === "bottom" && deltaY < 0)
    //             {
    //                 direction = "pull-up";
    //             }
    //             else
    //             {
    //                 return;
    //             }
    //         }

    //         if (event.cancelable) event.preventDefault();

    //         // 纵向滑动已经到顶
    //         if (direction === "pull-down" && deltaY > 0)
    //         {
    //             var index = startIndex - parseInt(deltaY / threshold);
    //             if (index >= 0)
    //             {
    //                 const state = stateHistory.history[index];
    //                 stateHistory.currentIndex = index;
    //                 if (state)
    //                 {
    //                     recoverStatefrom(state);
    //                 }

    //                 label.textContent = `后退${parseInt(deltaY / threshold)}步`;
    //                 label.style.display = (parseInt(deltaY / threshold) != 0) ? "block" : "none";
    //             }
    //             historyTooltip.style.top = `${30 * deltaY / window.innerHeight}vh`;
    //         }
    //         // 纵向滑动已经到底
    //         else if (direction === "pull-up" && deltaY < 0)
    //         {
    //             var index = startIndex - parseInt(deltaY / threshold);
    //             if (index < stateHistory.history.length)
    //             {
    //                 const state = stateHistory.history[index];
    //                 stateHistory.currentIndex = index;
    //                 if (state)
    //                 {
    //                     recoverStatefrom(state);
    //                 }
    //                 label.textContent = `重做${parseInt(- deltaY / threshold)}步`;
    //                 label.style.display = (parseInt(deltaY / threshold) != 0) ? "block" : "none";
    //             }
    //             historyTooltip.style.top = `${document.body.scrollHeight * (1 + 0.3 * deltaY / window.innerHeight)}px`;
    //         }
    //     }

    //     function ontouchscrollend(event)
    //     {
    //         historyTooltip.style.visibility = "hidden";
    //         historyTooltip.style.opacity = "0";
    //         document.removeEventListener("touchmove", ontouchscroll);
    //         document.removeEventListener("touchend", ontouchscrollend);
    //     }

    //     document.addEventListener("touchmove", ontouchscroll, { passive: false });

    //     document.addEventListener("touchend", ontouchscrollend);
    // }, { passive: false });
}

// 启动游戏
initializeGame("野战", []);