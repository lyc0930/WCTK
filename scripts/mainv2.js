import { TERRAIN, TERRAIN_INFO, HERO_DATA, DECK, weapons, armors, horses } from '../modules/data.mjs';
import { generateFlags } from '../modules/flags.mjs';
import { HPColor, cls, record } from '../modules/utils.mjs';
import { setMode } from '../modules/map.mjs';
import { Hero, create_hero } from '../modules/hero.mjs';
import { Area, create_area } from '../modules/area.mjs';
import { Areas, Heroes } from "../modules/global_variables.mjs";
import { create_zone } from '../modules/zone.mjs';
import { create_card } from '../modules/card.mjs';

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
    const HERO_DATAList = Array.from(Object.keys(HERO_DATA)).slice(0, 70).filter(name => !names.includes(name));
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

function initializeHands(n = 3)
{
    for (const hero of Heroes)
    {
        let a_hand_of_cards = [];
        for (let i = 0; i < n; i++)
        {
            let index = Math.floor(Math.random() * (DECK.length - i));
            let card = create_card(DECK[index].number, DECK[index].suit, DECK[index].name, DECK[index].fanti);
            a_hand_of_cards.push(card);
        }
        hero.hand = a_hand_of_cards;
    }
}

// 初始化游戏
function initializeGame(mode = "野战", names = [])
{
    setMode(mode);
    generateFlags();

    document.addEventListener("contextmenu", (event) => { event.preventDefault(); event.stopPropagation(); }); // 禁用右键菜单

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

    const hand_zone = create_zone("hand");
    initializeHands(10);

    hand_zone.show(Heroes[0]);
}

// 启动游戏
document.body.onload = () => { initializeGame("野战", []); };