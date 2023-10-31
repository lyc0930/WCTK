import { TERRAIN, TERRAIN_INFO, HERO_DATA, weapons, armors, horses } from '../modules/data.mjs';
import { generateFlags } from '../modules/flags.mjs';
import { HPColor, cls, record } from '../modules/utils.mjs';
import { setMode } from '../modules/map.mjs';
import { Hero, create_hero } from '../modules/hero.mjs';
import { Area, create_area } from '../modules/area.mjs';

export var Heroes = [];
export var Areas = [];

for (let row = 0; row < 7; row++)
{
    Areas.push([]);
    for (let col = 0; col < 7; col++)
    {
        Areas[row].push(null);
    }
}


// 创建棋盘
function createChessboard(mode = "野战")
{
    const chessboard = document.getElementById("chessboard");
    const Map = TERRAIN[mode];

    for (let row = 0; row < 7; row++)
    {
        for (let col = 0; col < 7; col++)
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

    document.body.appendChild(redMenuList);
    document.body.appendChild(blueMenuList);
}

// 初始化棋盘上的棋子
function initializePieces(names = [])
{
    const chessboard = document.getElementById("chessboard");
    const HERO_DATAList = Object.keys(HERO_DATA);
    let init_heroes = names;
    for (let i = names.length; i < 6; i++)
    {
        let index = Math.floor(Math.random() * (HERO_DATAList.length - i));
        init_heroes.push(HERO_DATAList[index]);
        HERO_DATAList[index] = HERO_DATAList[HERO_DATAList.length - 1 - i];
    }
    for (let index = 0; index < 6; index++)
    {
        const hero_name = init_heroes[index];
        const hero = create_hero(hero_name, (index < 3) ? "Red" : "Blue", index);
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