import { HERO_DATA, weapons, armors, horses } from './data.mjs';
import { isHighlighting, HPColor, drawArrow, drawTeleport, cls, record, afterPositionChange } from "./utils.mjs";
import { addContextMenu, showSkillPanel } from './context-menu.mjs';
import { Areas, Heroes } from '../scripts/main.js';
import { redFlag, blueFlag } from './flags.mjs';
import { setCurrentPhase, setCurrentPlayer } from './global_variables.mjs';
import { Area } from './area.mjs';

// 武将类
class Hero
{
    constructor(name, color, index)
    {
        this.index = index; // 序号
        this.color = color; // 阵营
        this.name = name; // 姓名

        this.piece = this.#create_piece(); // 棋子

        this.move_points = 0; // 移动力
        this.move_steps = 0; // 移动步数

        this._area = null; // 所在区域
        this._carrier = false; // 是否携带帅旗
        this._alive = false; // 是否存活
        this._acted = false; // 是否行动过
        this._dragging = false; // 是否正在拖动

        this.maxHP = HERO_DATA[name]["体力上限"]; // 体力上限
        this.HP = this.maxHP; // 体力值
        this.weapon = ""; // 武器
        this.armor = ""; // 防具
        this.horse = ""; // 坐骑
    }

    set area(value)
    {
        if (value instanceof Area)
        {
            this._area = value;
            this._area.cell.appendChild(this.piece);
            // 捡起帅旗逻辑
            if (redFlag.parentElement === value.cell && this.color === "Red")
            {
                this.carrier = true;
            }
            if (blueFlag.parentElement === value.cell && this.color === "Blue")
            {
                this.carrier = true;
            }

            // 运送帅旗逻辑
            if (this.carrier && value === this.enemy_base)
            {
                var score = 5;

                this.carrier = false;

                record(`${this.name}送至帅旗, ${this.color === "Red" ? "红" : "蓝"}方+${score}分`);

                const alliesInBase = Array.from(this.allies).filter(ally => ally.area === this.base);
                if (alliesInBase.length === 1)
                {
                    const ally = alliesInBase[0];
                    ally.carrier = true;
                }
                else // 大本营 没有己方棋子 或者 有多个己方棋子
                {
                    this.base.cell.appendChild(this.color === "Red" ? redFlag : blueFlag);
                }
            }
        }
        else
        {
            this._area = null;
        }
    }

    get area()
    {
        return this._area;
    }

    get grave()
    {
        return document.getElementById("grave" + this.index);
    }

    get base()
    {
        return this.color === "Red" ? Areas[6][0] : Areas[0][6];
    }

    get enemy_base()
    {
        return this.color === "Red" ? Areas[0][6] : Areas[6][0];
    }

    set carrier(value)
    {
        if (this._carrier !== value)
        {
            this._carrier = value;
            const carrierCheckbox = document.getElementById("carrierCheckbox" + this.index);
            carrierCheckbox.checked = value;

            if (value) // 获得帅旗
            {
                var old_carrier = null;
                for (const ally of this.allies)
                {
                    if (ally.carrier)
                    {
                        old_carrier = ally;
                        break;
                    }
                }
                if (old_carrier) // 从队友手中接过帅旗
                {
                    old_carrier.carrier = false;
                }

                this.piece.appendChild(this.color === "Red" ? redFlag : blueFlag);

                record(`${this.name}成为主帅`);

                if (this.area === this.enemy_base)  // 在敌方大本营获得帅旗
                {
                    var score = 5; // 分值

                    this.carrier = false;

                    record(`${this.name}送至帅旗, ${this.color === "Red" ? "红" : "蓝"}方+${score}分`);

                    const alliesInBase = Array.from(this.allies).filter(ally => ally.area === this.base);

                    if (alliesInBase.length === 1)
                    {
                        const ally = alliesInBase[0];
                        ally.carrier = true;
                    }
                    else // 大本营 没有己方棋子 或者 有多个己方棋子
                    {
                        this.base.cell.appendChild(this.color === "Red" ? redFlag : blueFlag);
                    }
                }

            }
            else // 掉落帅旗
            {
                this.area.cell.appendChild(this.color === "Red" ? redFlag : blueFlag);
            }
        }
    }

    get carrier()
    {
        return this._carrier;
    }

    set acted(value)
    {
        if (this._acted !== value)
        {
            this._acted = value;
            const actedCheckbox = document.getElementById("actedCheckbox" + this.index);
            actedCheckbox.checked = value;
            const avatar = this.piece.querySelector(".avatar");
            avatar.src = `./assets/Avatar/${value ? "inactive" : "active"}/${HERO_DATA[this.name]["拼音"]}.png`;
        }
    }

    get acted()
    {
        return this._acted;
    }

    set alive(value)
    {
        if (value === false) // 死亡
        {
            this.grave.appendChild(this.piece);

            if (this._alive === true)
            {
                this._alive = false;
                this.carrier = false;
                this.HP = 0;
                this.weapon = "";
                this.armor = "";
                this.horse = "";

                const alivePanel = document.getElementById("alivePanel" + this.index);
                alivePanel.style.display = "none";

                this.grave.style.display = "flex";

                const carrierCheckbox = document.getElementById("carrierCheckbox" + this.index);
                carrierCheckbox.disabled = true;

                const actedCheckbox = document.getElementById("actedCheckbox" + this.index);
                actedCheckbox.disabled = true;

                var score = 3;
                record(`${this.name}死亡, ${this.color === "Red" ? '蓝方' : '红方'}+${score}分`);
            }
        }
        else
        {
            if (this._alive === false) // 复活
            {
                this._alive = true;
                this.HP = this.maxHP;

                const alivePanel = document.getElementById("alivePanel" + this.index);
                alivePanel.style.display = "flex";

                this.grave.style.display = "none";

                const carrierCheckbox = document.getElementById("carrierCheckbox" + this.index);
                carrierCheckbox.disabled = false;

                const actedCheckbox = document.getElementById("actedCheckbox" + this.index);
                actedCheckbox.disabled = false;
            }
        }
    }

    get alive()
    {
        return this._alive;
    }

    set HP(value)
    {
        if (value !== this._HP)
        {
            if (value > this.maxHP)
            {
                value = this.maxHP;
            }
            else if (value < 0)
            {
                value = 0;
            }

            this._HP = value;
            const labelHP = document.getElementById("HP" + this.index);
            labelHP.textContent = value;
            labelHP.style.color = HPColor(value, this.maxHP);
        }
    }

    get HP()
    {
        return this._HP;
    }

    set weapon(value)
    {
        if (this._weapon !== value)
        {
            this._weapon = value;
            const weaponSelect = document.getElementById("weaponSelect" + this.index);
            weaponSelect.value = value;
        }
    }

    get weapon()
    {
        return this._weapon;
    }

    set armor(value)
    {
        if (this._armor !== value)
        {
            this._armor = value;
            const armorSelect = document.getElementById("armorSelect" + this.index);
            armorSelect.value = value;
        }
    }

    get armor()
    {
        return this._armor;
    }

    set horse(value)
    {
        if (this._horse !== value)
        {
            this._horse = value;
            const horseSelect = document.getElementById("horseSelect" + this.index);
            horseSelect.value = value;
        }
    }

    get horse()
    {
        return this._horse;
    }

    set dragging(value)
    {
        if (this._dragging !== value)
        {
            this._dragging = value;
            if (value) // 开始拖动
            {
                this.piece.style.transition = "width 100ms ease-out, height 100ms ease-out";
                document.body.appendChild(this.piece);

                for (const area of Areas.flat())
                {
                    area.unhighlight("attackable");
                    for (const hero of area.heroes)
                    {
                        hero.unhighlight("attackable");
                    }
                }
            }
            else // 结束拖动
            {
                this.piece.style.left = null;
                this.piece.style.top = null;
                this.piece.style.transition = "width 100ms ease-out, height 100ms ease-out, left 70ms ease-out, top 70ms ease-out";
            }
        }
    }

    get dragging()
    {
        return this._dragging;
    }

    get allies()
    {
        const ally_heroes = [];
        for (const hero of Heroes)
        {
            if (hero.color === this.color && hero !== this)
            {
                ally_heroes.push(hero);
            }
        }
        return ally_heroes;
    }

    get enemies()
    {
        const enemy_heroes = [];
        for (const hero of Heroes)
        {
            if (hero.color !== this.color)
            {
                enemy_heroes.push(hero);
            }
        }
        return enemy_heroes;
    }

    get context_menu_items()
    {
        const items = {
            "查看技能": () => { showSkillPanel(this); }
        };

        if (this.alive)
        {
            items["break-line-1"] = "<hr>";
            items["移动阶段"] = () => { this.move_phase(); };
            items["break-line-2"] = "<hr>";
            items["迅【闪】"] = () => { xunShan(); };
            items["break-line-3"] = "<hr>";
            items["【暗度陈仓】"] = () => { AnDuChenCang(3); };
            items["【兵贵神速】"] = () => { BingGuiShenSu(); };
            items["【奇门遁甲】"] = () => { QiMenDunJia(2); };
            items["【诱敌深入】"] = () => { YouDiShenRu(4); };
        }
        return items;
    }

    #create_piece()
    {
        const piece = document.createElement("div");
        const avatar = document.createElement("img");
        avatar.src = "./assets/Avatar/active/" + HERO_DATA[this.name]["拼音"] + ".png";
        avatar.draggable = false;
        avatar.className = "avatar";
        piece.appendChild(avatar);
        piece.className = "piece";
        piece.classList.add(this.color === "Red" ? "red-piece" : "blue-piece");

        var heroOption = document.getElementById(this.name + this.index);
        heroOption.selected = true;

        const labelMaxHP = document.getElementById("maxHP" + this.index);
        labelMaxHP.textContent = HERO_DATA[this.name]["体力上限"];

        const cell_at = (X, Y) =>
        {
            var nearest_cell = null;
            let min_d_sqr = 100000000;
            for (const cell of document.getElementsByClassName("cell"))
            {
                const { left, top, width, height } = cell.getBoundingClientRect()
                const centerX = left + width / 2
                const centerY = top + height / 2
                const d_sqr = Math.pow(X - centerX, 2) + Math.pow(Y - centerY, 2)
                if (d_sqr < min_d_sqr)
                {
                    min_d_sqr = d_sqr;
                    nearest_cell = cell;
                }
            }
            return nearest_cell;
        }

        // 添加鼠标事件
        piece.addEventListener("mousedown", (event) =>
        {
            // 正在等待响应
            if (isHighlighting())
            {
                return;
            }
            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            const rect = piece.getBoundingClientRect();

            const shiftX = event.clientX - (rect.left + 0.5 * rect.width);
            const shiftY = event.clientY - (rect.top + 0.5 * rect.height);

            const phantom_piece = document.createElement("div");
            phantom_piece.className = "phantom piece";
            phantom_piece.id = "phantom_piece";

            const onmousemove = (event) =>
            {
                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                this.piece.style.left = event.clientX - shiftX + window.scrollX + 'px';
                this.piece.style.top = event.clientY - shiftY + window.scrollY + 'px';

                const nearest_cell = cell_at(event.clientX, event.clientY);
                nearest_cell.appendChild(phantom_piece);
            }

            const onmouseup = (event) =>
            {
                event.stopPropagation();
                document.removeEventListener('mousemove', onmousemove);

                phantom_piece.remove();

                if (this.dragging)
                {
                    this.dragging = false;

                    const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();

                    if (event.clientX >= chessboardRect.left && event.clientX <= chessboardRect.right && event.clientY >= chessboardRect.top && event.clientY <= chessboardRect.bottom) // 在棋盘范围内
                    {
                        const nearest_cell = cell_at(event.clientX, event.clientY);
                        this.slot(nearest_cell.area, (event.button === 2) || (event.altKey));
                    }
                    else // 超出棋盘范围
                    {
                        this.alive = false;
                    }
                }
            }

            document.addEventListener('mousemove', onmousemove);

            piece.addEventListener('mouseup', onmouseup, { once: true });
        });

        // 添加触摸事件
        piece.addEventListener("touchstart", (event) =>
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

            event.stopPropagation();

            piece.old_style = piece.style;
            piece.style.width = "11vmin";
            piece.style.height = "11vmin";
            piece.style.zIndex = "92";
            piece.style.borderWidth = ".8vmin";
            piece.style.boxShadow = "0 0 0.4em 0.4em rgb(0, 0, 0, 0.15)";

            const rect = piece.getBoundingClientRect();

            const shiftX = event.touches[0].clientX - (rect.left + 0.5 * rect.width);
            const shiftY = event.touches[0].clientY - (rect.top + 0.5 * rect.height);

            const phantom_piece = document.createElement("div");
            phantom_piece.className = "phantom piece";
            phantom_piece.id = "phantom_piece";

            const ontouchmove = (event) =>
            {
                if (event.touches.length > 1)
                {
                    return;
                }

                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                this.piece.style.left = event.touches[0].clientX - shiftX + window.scrollX + 'px';
                this.piece.style.top = event.touches[0].clientY - shiftY + window.scrollY + 'px';

                const nearest_cell = cell_at(event.touches[0].clientX, event.touches[0].clientY);
                nearest_cell.appendChild(phantom_piece);
            }

            const ontouchend = (event) =>
            {
                if (event.changedTouches.length > 1)
                {
                    return;
                }
                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();
                piece.removeEventListener("touchmove", ontouchmove);

                phantom_piece.remove();

                piece.style = piece.old_style;

                if (this.dragging)
                {
                    this.dragging = false;

                    const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();


                    if (event.changedTouches[0].clientX >= chessboardRect.left && event.changedTouches[0].clientX <= chessboardRect.right && event.changedTouches[0].clientY >= chessboardRect.top && event.changedTouches[0].clientY <= chessboardRect.bottom) // 在棋盘范围内
                    {
                        const nearest_cell = cell_at(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                        this.slot(nearest_cell.area);
                    }
                    else // 超出棋盘范围
                    {
                        this.alive = false;
                    }
                }
            }

            piece.addEventListener("touchmove", ontouchmove, { passive: false });

            piece.addEventListener("touchend", ontouchend, { once: true });
        }, { passive: false });

        piece.addEventListener("mouseenter", (event) =>
        {
            if (!this.alive || isHighlighting())
            {
                return;
            }
            const attack_range = weapons[this.weapon];
            for (const area of Areas.flat())
            {
                if (Math.abs(area.row - this.area.row) + Math.abs(area.col - this.area.col) <= attack_range)
                {
                    area.highlight("attackable");
                    for (const hero of area.heroes)
                    {
                        if (hero !== this)
                        {
                            hero.highlight("attackable");
                        }
                    }
                }
            }
        });

        piece.addEventListener("mouseleave", (event) =>
        {
            for (const area of Areas.flat())
            {
                area.unhighlight("attackable");
                for (const hero of area.heroes)
                {
                    hero.unhighlight("attackable");
                }
            }
        });

        addContextMenu(piece, this, isHighlighting);

        return piece;
    }

    // 可停留
    can_stay(area, reentry = true)
    {
        // 如果不是重新进入，且棋子已经在该区域，那么可以停留
        if (area === this.area && !reentry)
        {
            if (area.terrain === "山岭")
            {
                return false;
            }
            else if (area.terrain === "军营" || area.terrain === "大本营")
            {
                return true;
            }
            else if (area.heroes.length > 1)
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        var hold_by_enemy = false;
        for (const enemy of this.enemies)
        {
            if (area.contains(enemy))
            {
                hold_by_enemy = true;
                break;
            }
        }

        // 〖固城〗
        var gu_cheng = false;
        for (const enemy of this.enemies)
        {
            if (enemy.name === "曹仁")
            {
                gu_cheng = true;
                break;
            }
        }

        if (hold_by_enemy && gu_cheng)
        {
            if (area !== this.base)
            {
                return false;
            }
        }

        if (area.terrain === "军营" || area.terrain === "大本营")
        {
            return true;
        }
        else if (area.terrain === "山岭")
        {
            return false;
        }
        else if (area.heroes.length > 0)
        {
            return false;
        }

        return true;
    }

    // 可穿越
    can_pass(area)
    {
        // 如果可以停留必然可以穿越
        if (this.can_stay(area))
        {
            return true;
        }
        else
        {
            // 【穿越马】
            if (this.is_ride_on("穿越"))
            {
                var hold_by_enemy = false;
                for (const enemy of this.enemies)
                {
                    if (area.contains(enemy))
                    {
                        hold_by_enemy = true;
                        break;
                    }
                }

                // 〖固城〗
                var gu_cheng = false;
                for (const enemy of this.enemies)
                {
                    if (enemy.name === "曹仁")
                    {
                        gu_cheng = true;
                        break;
                    }
                }

                if (hold_by_enemy && gu_cheng)
                {
                    if (area !== this.base)
                    {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    // 路径
    get pathes()
    {
        var Pathes = new Array(7)
        for (var i = 0; i < 7; i++)
        {
            Pathes[i] = new Array(7)
            for (var j = 0; j < 7; j++)
            {
                Pathes[i][j] = null;
            }
        }

        var queue = [];
        queue.push(this.area);
        const start_row = this.area.row;
        const start_col = this.area.col;
        Pathes[start_row][start_col] = [this.area];

        while (queue.length)
        {
            const current_area = queue.shift();

            const row = current_area.row;
            const col = current_area.col;

            for (const area of current_area.adjacent_areas)
            {
                if (!this.can_pass(area))
                {
                    continue;
                }

                const next_row = area.row;
                const next_col = area.col;
                if (Pathes[next_row][next_col] === null)
                {
                    Pathes[next_row][next_col] = Pathes[row][col].concat([area]);
                    queue.push(area);
                }
            }
        }

        // 删除起点
        Pathes[start_row][start_col] = null;

        for (var row = 0; row < 7; row++)
        {
            for (var col = 0; col < 7; col++)
            {
                if (!this.can_stay(Areas[row][col]))
                {
                    Pathes[row][col] = null;
                }
            }
        }

        return Pathes;
    }

    // 距离最近的可进入区域
    get nearest_area()
    {
        var nearest_areas = [];
        var min_d = 100;
        for (var row = 0; row < 7; row++)
        {
            for (var col = 0; col < 7; col++)
            {
                const area = Areas[row][col]
                if (this.can_stay(area))
                {
                    const d = distance(this, area);
                    if (d < min_d)
                    {
                        min_d = d;
                        nearest_areas = [area];
                    }
                    else if (d === min_d)
                    {
                        nearest_areas.push(area);
                    }
                }
            }
        }
        return nearest_areas;
    }

    // 是否装备特定类型的坐骑
    is_ride_on(type)
    {
        if (horses[this.horse] === type)
        {
            return true;
        }
        return false;
    }

    //移动
    move(area, ifConsumeMovePoints = false, isDraw = false)
    {
        const row = area.row;
        const col = area.col;
        const Pathes = this.pathes;
        if (Pathes[row][col] !== null && this.can_stay(area))
        {
            var steps = Pathes[row][col].length - 1;

            if (ifConsumeMovePoints)
            {
                if (this.movePoints >= steps)
                {
                    this.movePoints = this.movePoints - steps;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                if (this.moveSteps >= steps)
                {
                    this.moveSteps = this.moveSteps - steps;
                }
                else
                {
                    return false;
                }
            }

            var path = Pathes[row][col];
            var moveLog = `(${path[0].row + 1}, ${path[0].col + 1})`;
            var vibration_pattern = [];
            for (var i = 1; i < path.length; i++)
            {
                this.step(path[i], isDraw);
                moveLog += ` ▶ (${path[i].row + 1}, ${path[i].col + 1})`;
                vibration_pattern.push(20);
                vibration_pattern.push(250);
            }
            record(`${this.name} ${moveLog}`);
            navigator.vibrate(vibration_pattern);
            return true;
        }
        return false;
    }

    // 移动一步
    step(area, isDraw = false)
    {
        if (this.can_pass(area))
        {
            const start_row = this.area.row;
            const start_col = this.area.col;
            const end_row = area.row;
            const end_col = area.col;

            var direction = null;
            if (start_row === end_row && Math.abs(start_col - end_col) === 1)
            {
                direction = start_col < end_col ? "+X" : "-X";
            }
            else if (start_col === end_col && Math.abs(start_row - end_row) === 1)
            {
                direction = start_row < end_row ? "+Y" : "-Y";
            }

            if (isDraw)
            {
                if (direction !== null) // 有方向
                {
                    drawArrow([[start_row, start_col], [end_row, end_col]], this.color === "Red" ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
                }
                else // 无方向
                {
                    drawTeleport([[start_row, start_col], [end_row, end_col]], this.color === "Red" ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
                }
            }

            this.area = area;

            return class
            {
                constructor()
                {
                    this.start = this.area;
                    this.end = area;
                    this.direction = direction;
                }
            }
        }
        return null;
    }

    // 移动阶段
    move_phase()
    {
        // 正在等待响应
        if (isHighlighting())
        {
            return;
        }

        // 定义点击高亮区域行为
        const click_to_move = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            this.move(event.currentTarget.area, true, true);

            for (const area of Areas.flat())
            {
                area.unhighlight("reachable", click_to_move);
            }

            // 还有移动力
            if (this.movePoints > 0)
            {
                move_in_move_phase();
            }
            else
            {
                move_phase_end(event);
            }
        }

        const move_in_move_phase = () =>
        {
            // 计算可到达的区域
            const Pathes = this.pathes;

            // 高亮可到达的区域
            for (const area of Areas.flat())
            {
                if (Pathes[area.row][area.col] && (Pathes[area.row][area.col].length - 1 <= this.movePoints))
                {
                    area.highlight("reachable", click_to_move);
                }
            }
        }

        // 定义结束移动阶段函数
        const move_phase_end = (event = null) =>
        {
            if (event !== null)
            {
                if (event.target.classList.contains("cell") && !event.target.classList.contains("reachable"))
                {
                    if (event.cancelable) event.preventDefault();
                    // event.stopPropagation();

                    for (const area of Areas.flat())
                    {
                        area.unhighlight("reachable", click_to_move);
                    }

                    cls(1000);
                    document.removeEventListener("contextmenu", move_phase_end);
                    document.removeEventListener("click", move_phase_end);
                    setCurrentPhase(null);
                }
            }
            else
            {
                for (const area of Areas.flat())
                {
                    area.unhighlight("reachable", click_to_move);
                }

                cls(1000);
                document.removeEventListener("contextmenu", move_phase_end);
                document.removeEventListener("click", move_phase_end);
                setCurrentPhase(null);
            }
        }

        setCurrentPlayer(this.piece);
        setCurrentPhase("移动");

        // 基于体力值生成移动力
        this.movePoints = this.HP;

        move_in_move_phase(this.piece);

        // 空白处结束移动阶段
        document.addEventListener("click", move_phase_end);
    }

    // 移动固定步数
    move_fixed_steps(isDraw = false)
    {
        // 计算可到达的区域
        const Pathes = this.pathes;

        // 高亮可到达的区域
        for (const area of Areas.flat())
        {
            if (Pathes[area.row][area.col] && (Pathes[area.row][area.col].length - 1 <= this.moveSteps))
            {
                area.highlight("reachable", click_to_move);
            }
        }

        // 定义点击高亮区域行为
        const click_to_move = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            this.move(event.currentTarget.area, false, isDraw);

            for (const area of Areas.flat())
            {
                area.unhighlight("reachable", click_to_move);
            }

            // 还有移动力
            if (this.moveSteps > 0)
            {
                this.move_fixed_steps(isDraw);
            }
            else
            {
                if (isDraw)
                {
                    cls(1000);
                }
            }
        }

    }

    // 转移
    leap(area, isDraw = false)
    {
        if (this.can_stay(area))
        {
            record(`${this.name} (${this.area.row + 1}, ${this.area.col + 1}) ▷ (${area.row + 1}, ${area.col + 1})`);
            if (isDraw)
            {
                drawTeleport([[this.area.row, this.area.col], [area.row, area.col]], this.color === "Red" ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
            }
            this.area = area;

            navigator.vibrate(20);
            return true;
        }
        return false;
    }

    // 转移到若干区域之一
    leap_to_areas(areas, isDraw = false)
    {
        // 定义点击高亮区域行为
        const click_to_leap = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            this.leap(event.currentTarget.area, isDraw);

            for (const area of Areas.flat())
            {
                area.unhighlight("landable", click_to_leap);
            }

            if (isDraw)
            {
                cls(1000);
            }
        }

        // 高亮可到达的区域
        for (const area of areas)
        {
            area.highlight("landable", click_to_leap);
        }
    }

    // 任意拖动
    slot(area, isDraw = false)
    {
        if (isDraw)
        {
            drawArrow([[this.area.row, this.area.col], [area.row, area.col]], this.color === "Red" ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
        }

        // 复活逻辑
        if (!this.alive)
        {
            this.alive = true;
            record(`${this.name}登场于(${area.row + 1}, ${area.col + 1})`);
        }
        else
        {
            record(`${this.name} (${this.area.row + 1}, ${this.area.col + 1}) ▷ (${area.row + 1}, ${area.col + 1})`);
        }

        this.area = area;

    }

    // 交换
    swap(that)
    {
        const this_area = this.area;
        const that_area = that.area;

        // TODO 临时存放真的对吗？
        document.body.appendChild(this.piece);
        document.body.appendChild(that.piece);

        // 交换
        if ((this.can_stay(that_area)) && that.can_stay(this_area))
        {
            record(`${this.name} (${this_area.row + 1}, ${this_area.col + 1}) ▷ (${that_area.row + 1}, ${that_area.col + 1})`);
            this.area = that_area;

            record(`${that.name} (${that_area.row + 1}, ${that_area.col + 1}) ▷ (${this_area.row + 1}, ${this_area.col + 1})`);
            that.area = this_area;

            return true;
        }
        else
        {
            this.area = this_area;
            that.area = that_area;
            return false;
        }
    }

    highlight(className, listener = null)
    {
        this.piece.classList.add(className);
        if (className === "targetable")
        {
            this.piece.addEventListener("click", listener);
        }
    }

    unhighlight(className, listener = null)
    {
        this.piece.classList.remove(className);
        this.piece.removeEventListener("click", listener);
    }
}

export { Hero };