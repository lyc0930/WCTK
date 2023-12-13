import { TERRAIN, TERRAIN_INFO } from "./data.mjs";
import { Areas, Heroes } from "./global_variables.mjs";
import { isHighlighting } from "./utils.mjs";
import { addContextMenu, showTerrainPanel } from './context-menu.mjs';
import { showModeTable } from "./map.mjs";

class Area
{
    constructor(row, col, terrain)
    {
        this.row = row;
        this.col = col;
        this.terrain = terrain;
        this.color = null;
        this.cell = this._create_cell();
        Areas[row][col] = this;
    }

    valueOf()
    {
        return this.terrain;
    }

    _create_cell()
    {
        const cell = document.createElement("div");
        cell.className = `cell ${TERRAIN_INFO[this.terrain]["className"]}`;
        cell.style.gridRow = this.row + 1;
        cell.style.gridColumn = this.col + 1;
        cell.area = this;

        addContextMenu(cell, this, isHighlighting);

        return cell;
    }

    get context_menu_items()
    {
        const items = { };

        let i = 0;

        Object.assign(items, this._context_menu_items_terrain());

        items[`break-line-${i++}`] = "<hr>";
        Object.assign(items, this._context_menu_items_change_mode());

        return items;
    }

    _context_menu_items_terrain()
    {
        return { [this.terrain]: () => { showTerrainPanel(this); } };
    }

    _context_menu_items_change_mode()
    {
        return { "更换地图": () => { showModeTable(); } };
    }

    // 相邻区域
    get adjacent_areas()
    {
        const adj_areas = [];
        for (let i = 0; i < 4; i++)
        {
            // 下上右左
            const next_row = this.row + (i === 0 ? 1 : (i === 1 ? -1 : 0));
            const next_col = this.col + (i === 2 ? 1 : (i === 3 ? -1 : 0));
            if (next_row >= 0 && next_row < 7 && next_col >= 0 && next_col < 7)
            {
                adj_areas.push(Areas[next_row][next_col]);
            }
        }
        return adj_areas;
    }

    contains(hero)
    {
        return hero.area === this;
    }

    get heroes()
    {
        return Array.from(Heroes).filter(hero => hero.area === this);
    }

    // 空区域
    get empty()
    {
        return this.heroes.length === 0;
    }

    // 标记
    get tokens()
    {
        const tokens = [];
        for (const piece of this.cell.children)
        {
            if (piece.token)
            {
                tokens.push(piece.token);
            }
        }
        return tokens;
    }

    highlight(className, listener = null)
    {
        this.cell.classList.add(className);
        if (className.endsWith("-target"))
        {
            this.cell.addEventListener("click", listener);
        }
    }

    unhighlight(className, listener = null)
    {
        this.cell.classList.remove(className);
        this.cell.removeEventListener("click", listener);
    }

    // 工事
    build(fortification = null, color = null)
    {
        if (fortification === null)
        {
            switch (this.terrain)
            {
                case "平原":
                    fortification = "哨卡";
                    break;
                case "树林":
                    fortification = "掷火器";
                    break;
                case "沙地":
                    fortification = "土城";
                    break;
                default:
                    throw new Error(`无法在${this.terrain}建造默认工事`);
            }
        }

        if (fortification === "哨卡" && color !== "Red" && color !== "Blue") throw new Error("哨卡必须指定阵营");

        this.fortified = true;
        this.original_terrain = this.terrain;
        this.terrain = fortification;

        this.cell.classList.remove(TERRAIN_INFO[this.original_terrain]["className"]);
        this.cell.classList.add(TERRAIN_INFO[this.terrain]["className"]);

        if (color)
        {
            this.color = color;
            this.cell.classList.add(color);
        }
    }

    demolish()
    {
        if (!this.fortified) throw new Error("该区域没有工事");

        this.cell.classList.remove(TERRAIN_INFO[this.terrain]["className"]);
        this.cell.classList.add(TERRAIN_INFO[this.original_terrain]["className"]);

        this.terrain = this.original_terrain;
        delete this.fortified;
        delete this.original_terrain;

        this.color = null;
        this.cell.classList.remove("Red", "Blue");
    }
}

// 工厂函数
function create_area(row, col, terrain)
{
    if (terrain.startsWith("大本营"))
    {
        return new base(row, col, terrain);
    }
    else if (terrain.startsWith("军营"))
    {
        return new barrack(row, col, terrain);
    }
    else if (terrain.startsWith("城墙"))
    {
        return new wall(row, col, terrain);
    }
    else if (terrain.startsWith("拒马刺"))
    {
        return new caltrop(row, col, terrain);
    }
    else if (terrain.startsWith("烽火台"))
    {
        return new beacon(row, col, terrain);
    }
    else if (terrain.startsWith("校场"))
    {
        return new ground(row, col, terrain);
    }
    else if (terrain.startsWith("前锋校场"))
    {
        return new front_ground(row, col, terrain);
    }
    else if (terrain.startsWith("点将台"))
    {
        return new command_platform(row, col, terrain);
    }
    else if (terrain.startsWith("粮道"))
    {
        return new supply_route(row, col, terrain);
    }
    else
    {
        return new Area(row, col, terrain);
    }
}

// 大本营
class base extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "大本营");

        if (terrain.endsWith("-红方"))
        {
            this.color = "Red";
            this.cell.classList.add("Red");
        }
        else if (terrain.endsWith("-蓝方"))
        {
            this.color = "Blue";
            this.cell.classList.add("Blue");
        }
    }
}

// 军营
class barrack extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "军营");

        if (terrain.endsWith("-红方"))
        {
            this.color = "Red";
            this.cell.classList.add("Red");
        }
        else if (terrain.endsWith("-蓝方"))
        {
            this.color = "Blue";
            this.cell.classList.add("Blue");
        }
    }
}

// 城墙
class wall extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "城墙");

        if (terrain.endsWith("-红方"))
        {
            this._foot_row = row - 1;
            this._foot_col = col;
        }
        else if (terrain.endsWith("-蓝方"))
        {
            this._foot_row = row + 1;
            this._foot_col = col;
        }
    }

    // 墙脚
    get foot_area()
    {
        return Areas[this._foot_row][this._foot_col];
    }
}

// 拒马刺
class caltrop extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "拒马刺");

        this.direction = terrain.substr(-1);
        if (this.direction === "上")
        {
            this._next_area_row = row - 1;
            this._next_area_col = col;
        }
        else if (this.direction === "下")
        {
            this._next_area_row = row + 1;
            this._next_area_col = col;
        }
        else if (this.direction === "左")
        {
            this._next_area_row = row;
            this._next_area_col = col - 1;
        }
        else if (this.direction === "右")
        {
            this._next_area_row = row;
            this._next_area_col = col + 1;
        }
    }

    // 通行区域
    get next_area()
    {
        return Areas[this._next_area_row][this._next_area_col];
    }
}

class beacon extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "烽火台");
    }

    occupied_by(hero)
    {
        this.color = hero.color;
        this.cell.classList.remove("Red", "Blue", "occupied");
        setTimeout(() => { this.cell.classList.add(hero.color); this.cell.classList.add("occupied"); }, 50);
    }
}

// 校场
class ground extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "校场");

        if (terrain.endsWith("-红方"))
        {
            this.color = "Red";
            this.cell.classList.add("Red");
        }
        else if (terrain.endsWith("-蓝方"))
        {
            this.color = "Blue";
            this.cell.classList.add("Blue");
        }
    }
}

// 前锋校场
class front_ground extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "前锋校场");
    }

    occupied_by(hero)
    {
        this.color = hero.color;
        this.cell.classList.remove("Red", "Blue", "occupied");
        setTimeout(() => { this.cell.classList.add(hero.color); this.cell.classList.add("occupied"); }, 50);
    }
}

// 点将台
class command_platform extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "点将台");

        if (terrain.endsWith("-红方"))
        {
            this.color = "Red";
            this.cell.classList.add("Red");
        }
        else if (terrain.endsWith("-蓝方"))
        {
            this.color = "Blue";
            this.cell.classList.add("Blue");
        }
    }
}

// 粮道
class supply_route extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, "粮道");

        if (terrain.endsWith("-红方"))
        {
            this.color = "Red";
            this.cell.classList.add("Red");
        }
        else if (terrain.endsWith("-蓝方"))
        {
            this.color = "Blue";
            this.cell.classList.add("Blue");
        }
    }
}

export { Area, create_area }