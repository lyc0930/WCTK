import { TERRAIN, TERRAIN_INFO } from "./data.mjs";
import { Heroes } from "../scripts/main.js";
import { Areas } from "../scripts/main.js";

class Area
{
    constructor(row, col, terrain)
    {
        this.row = row;
        this.col = col;
        this.terrain = terrain;
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
        return cell;
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
        super(row, col, terrain);
        this.terrain = "大本营";

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

    _create_cell()
    {
        const cell = document.createElement("div");
        cell.className = `cell ${TERRAIN_INFO["大本营"]["className"]}`;
        cell.area = this;
        return cell;
    }
}

// 军营
class barrack extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
        this.terrain = "军营";

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

    _create_cell()
    {
        const cell = document.createElement("div");
        cell.className = `cell ${TERRAIN_INFO["军营"]["className"]}`;
        cell.area = this;
        return cell;
    }
}

// 城墙
class wall extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
        this.terrain = "城墙";

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

    get foot_area()
    {
        return Areas[this._foot_row][this._foot_col];
    }

    _create_cell()
    {
        const cell = document.createElement("div");
        cell.className = `cell ${TERRAIN_INFO["城墙"]["className"]}`;
        cell.area = this;
        return cell;
    }
}

// 拒马刺
class caltrop extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
        this.terrain = "拒马刺";

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

    get next_area()
    {
        return Areas[this._next_area_row][this._next_area_col];
    }

    _create_cell()
    {
        const cell = document.createElement("div");
        cell.className = `cell ${TERRAIN_INFO["拒马刺"]["className"]}`;
        cell.area = this;
        return cell;
    }
}

export { Area, create_area }