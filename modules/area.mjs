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
        cell.className = "cell";
        cell.area = this;
        return cell;
    }

    // 相邻区域
    get adjacent_areas()
    {
        var adj_areas = [];
        for (var i = 0; i < 4; i++)
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
        if (className === "reachable" || className === "landable" || className === "targetable")
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
    if (terrain === "平原")
    {
        return new plain(row, col, terrain);
    }
    else if (terrain === "山岭")
    {
        return new ridge(row, col, terrain);
    }
    else if (terrain === "湖泊")
    {
        return new lake(row, col, terrain);
    }
    else if (terrain === "驿站")
    {
        return new post_station(row, col, terrain);
    }
    else if (terrain === "树林")
    {
        return new grove(row, col, terrain);
    }
    else if (terrain === "箭塔")
    {
        return new arrow_tower(row, col, terrain);
    }
    else if (terrain.startsWith("大本营"))
    {
        return new base(row, col, terrain);
    }
    else if (terrain.startsWith("军营"))
    {
        return new barrack(row, col, terrain);
    }
    else
    {
        throw new Error(`Unknown terrain: ${terrain}`);
    }
}

// 平原
class plain extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
    }

    _create_cell()
    {
        const cell = super._create_cell();
        cell.classList.add("plain");
        return cell;
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
        const cell = super._create_cell();
        cell.classList.add("base");
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
        const cell = super._create_cell();
        cell.classList.add("barrack");
        return cell;
    }
}

// 山岭
class ridge extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
    }

    _create_cell()
    {
        const cell = super._create_cell();
        cell.classList.add("ridge");
        return cell;
    }
}

// 驿站
class post_station extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
    }

    _create_cell()
    {
        const cell = super._create_cell();
        cell.classList.add("post-station");
        return cell;
    }
}

// 树林
class grove extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
    }

    _create_cell()
    {
        const cell = super._create_cell();
        cell.classList.add("grove");
        return cell;
    }
}

// 箭塔
class arrow_tower extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
    }

    _create_cell()
    {
        const cell = super._create_cell();
        cell.classList.add("arrow-tower");
        return cell;
    }
}

// 湖泊
class lake extends Area
{
    constructor(row, col, terrain)
    {
        super(row, col, terrain);
    }

    _create_cell()
    {
        const cell = super._create_cell();
        cell.classList.add("lake");
        return cell;
    }
}

export { Area, create_area }