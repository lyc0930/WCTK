import { HERO_DATA, weapons, armors, horses } from './data.mjs';
import { isHighlighting, HPColor, drawArrow, drawTeleport, cls, record, calc_distance, calc_direction, Direction, isOnSameLine } from "./utils.mjs";
import { addContextMenu, showSkillPanel } from './context-menu.mjs';
import { Areas, Heroes } from "./global_variables.mjs";

import { redFlag, blueFlag } from './flags.mjs';
import { currentPlayer, currentPhase, setCurrentPhase, setCurrentPlayer } from './global_variables.mjs';
import { Area } from './area.mjs';

// 武将类
class Hero
{
    constructor(name, color, index)
    {
        this.index = index; // 序号
        this.color = color; // 阵营
        this.name = name; // 姓名

        this.menu = this._create_menu(); // 菜单
        this.piece = this._create_piece(); // 棋子

        this.move_points = 0; // 移动力

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
                for (const ally of this.allies)
                {
                    if (ally.carrier) // 从队友手中接过帅旗
                    {
                        ally.carrier = false;
                        break;
                    }
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
            avatar.src = `https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Avatar/${HERO_DATA[this.name]["拼音"]}_${value ? "inactive" : "active"}.webp`;
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

                var score = 3; // 分值
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
                    area.unhighlight("attack-target");
                    for (const hero of area.heroes)
                    {
                        hero.unhighlight("attack-target");
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
            items["移动阶段"] = () => { this.move_phase_begin(); };
            items["break-line-2"] = "<hr>";
            items["迅【闪】"] = () => { this.use("迅【闪】") };
            items["break-line-3"] = "<hr>";
            items["【暗度陈仓】"] = () => { this.use("【暗度陈仓】") };
            items["【兵贵神速】"] = () => { this.use("【兵贵神速】") };
            items["【奇门遁甲】"] = () => { this.use("【奇门遁甲】") };
            items["【诱敌深入】"] = () => { this.use("【诱敌深入】") };
        }
        return items;
    }

    _create_piece()
    {
        const piece = document.createElement("div");
        const avatar = document.createElement("img");
        avatar.src = "https://lyc-sgs.oss-accelerate.aliyuncs.com/zq/Avatar/" + HERO_DATA[this.name]["拼音"] + "_active.webp";
        avatar.draggable = false;
        avatar.className = "avatar";
        piece.appendChild(avatar);
        piece.className = "piece";
        piece.classList.add(this.color === "Red" ? "red-piece" : "blue-piece");

        piece.hero = this;

        const heroOption = document.getElementById(this.name + this.index);
        heroOption.selected = true;

        const labelMaxHP = document.getElementById("maxHP" + this.index);
        labelMaxHP.textContent = HERO_DATA[this.name]["体力上限"];

        const cell_at = (X, Y) =>
        {
            let nearest_cell = null;
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
            if (isHighlighting()) return;

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
            if (event.touches.length > 1) return;
            if (isHighlighting()) return;

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
                if (event.touches.length > 1) return;

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
                if (event.changedTouches.length > 1) return;

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
            if (!this.alive || isHighlighting()) return;

            const attack_range = weapons[this.weapon];
            for (const area of Areas.flat())
            {
                if (Math.abs(area.row - this.area.row) + Math.abs(area.col - this.area.col) <= attack_range)
                {
                    area.highlight("attack-target");
                    for (const hero of area.heroes)
                    {
                        if (hero !== this)
                        {
                            hero.highlight("attack-target");
                        }
                    }
                }
            }
        });

        piece.addEventListener("mouseleave", (event) =>
        {
            for (const area of Areas.flat())
            {
                area.unhighlight("attack-target");
                for (const hero of area.heroes)
                {
                    hero.unhighlight("attack-target");
                }
            }
        });

        addContextMenu(piece, this, isHighlighting);

        return piece;
    }

    _create_menu()
    {
        const menu = document.createElement("div");
        menu.className = "menu";
        menu.id = "menu" + this.index;
        menu.style.order = this.index;

        const fixedPanel = document.createElement("div");
        fixedPanel.className = "fixed-panel";
        fixedPanel.id = "fixedPanel" + this.index;

        const selectBlock = document.createElement("div");
        selectBlock.className = "select-block";
        selectBlock.classList.add("block");

        const heroLabel = document.createElement("label");
        heroLabel.innerHTML = "武将：";
        heroLabel.htmlFor = "heroSelect" + this.index;

        const heroSelect = document.createElement("select");
        heroSelect.className = "hero-select";
        heroSelect.id = "heroSelect" + this.index;

        selectBlock.appendChild(heroLabel);
        selectBlock.appendChild(heroSelect);

        for (const name in HERO_DATA)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            heroSelect.appendChild(option);
        }
        heroSelect.addEventListener("change", (event) =>
        {
            this.piece.parentElement.removeChild(this.piece);
            this.menu.parentElement.removeChild(this.menu);

            Heroes[this.index] = create_hero(event.currentTarget.value, this.color, this.index);

            if (this.alive)
            {
                Heroes[this.index].alive = true;
                Heroes[this.index].area = this.area;
            }
            else
            {
                Heroes[this.index].alive = false;
                Heroes[this.index].grave.appendChild(Heroes[this.index].piece);
            }

            if (this.carrier)
            {
                Heroes[this.index].carrier = true;
            }
        });

        const checkBlock = document.createElement("div");
        checkBlock.className = "check-block";
        checkBlock.classList.add("block");
        checkBlock.id = "checkBlock" + this.index;

        const carrierLabel = document.createElement("label");
        carrierLabel.innerHTML = "主帅";
        carrierLabel.htmlFor = "carrierCheckbox" + this.index;

        const carrierCheckbox = document.createElement("input");
        carrierCheckbox.type = "checkbox";
        carrierCheckbox.className = "checkbox";
        carrierCheckbox.id = "carrierCheckbox" + this.index;
        carrierCheckbox.name = (this.color === "Red" ? 'red' : 'blue') + "Checkbox";
        carrierCheckbox.disabled = true;

        carrierCheckbox.addEventListener("change", (event) =>
        {
            this.carrier = event.currentTarget.checked;
        });

        const actedLabel = document.createElement("label");
        actedLabel.innerHTML = "本轮行动";
        actedLabel.htmlFor = "actedCheckbox" + this.index;

        const actedCheckbox = document.createElement("input");
        actedCheckbox.type = "checkbox";
        actedCheckbox.className = "checkbox";
        actedCheckbox.id = "actedCheckbox" + this.index;
        actedCheckbox.disabled = true;

        actedCheckbox.addEventListener("change", (event) =>
        {
            if (!event.currentTarget.checked)
            {
                for (const hero of Heroes)
                {
                    hero.acted = false;
                }
                record(`新轮次开始`);
            }
            else
            {
                this.acted = true;
                record(`${this.name}回合结束`);
            }
        });

        checkBlock.appendChild(carrierLabel);
        checkBlock.appendChild(carrierCheckbox);
        checkBlock.appendChild(actedLabel);
        checkBlock.appendChild(actedCheckbox);

        fixedPanel.appendChild(selectBlock);
        fixedPanel.appendChild(checkBlock);

        const alivePanel = document.createElement("div");
        alivePanel.className = "alive-panel";
        alivePanel.id = "alivePanel" + this.index;

        const HPBlock = document.createElement("div");
        HPBlock.className = "HP-block";
        HPBlock.classList.add("block");
        HPBlock.id = "HPBlock" + this.index;

        const HPLabel = document.createElement("label");
        HPLabel.innerHTML = "体力值：";
        HPLabel.htmlFor = "HPMinus" + this.index;

        const HPMinus = document.createElement("i");
        HPMinus.className = "fas fa-minus-circle";
        HPMinus.id = "HPMinus" + this.index;

        HPMinus.addEventListener("click", (event) =>
        {
            this.HP = Math.max(0, this.HP - 1);
        });

        const labelHP = document.createElement("label");
        labelHP.id = "HP" + this.index;
        labelHP.type = "number";
        labelHP.className = "number";
        labelHP.innerHTML = "0";
        labelHP.htmlFor = "HPMinus" + this.index;

        const labelSlash = document.createElement("label");
        labelSlash.innerHTML = "/";

        const labelMaxHP = document.createElement("label");
        labelMaxHP.id = "maxHP" + this.index;
        labelMaxHP.type = "number";
        labelMaxHP.className = "number";
        labelMaxHP.innerHTML = "0";
        labelMaxHP.htmlFor = "HPPlus" + this.index;

        const HPPlus = document.createElement("i");
        HPPlus.className = "fas fa-plus-circle";
        HPPlus.id = "HPPlus" + this.index;

        HPPlus.addEventListener("click", (event) =>
        {
            this.HP = Math.min(this.HP + 1, HERO_DATA[this.name]["体力上限"]);
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
        weaponBlock.id = "weaponBlock" + this.index;

        const weaponLabel = document.createElement("label");
        weaponLabel.innerHTML = "武器：";
        weaponLabel.htmlFor = "weaponSelect" + this.index;

        const weaponSelect = document.createElement("select");
        weaponSelect.className = "hero-select";
        weaponSelect.id = "weaponSelect" + this.index;

        for (const name in weapons)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            weaponSelect.appendChild(option);
        }

        weaponSelect.addEventListener("change", (event) =>
        {
            this.weapon = event.currentTarget.value;
        });

        weaponBlock.appendChild(weaponLabel);
        weaponBlock.appendChild(weaponSelect);

        const armorBlock = document.createElement("div");
        armorBlock.className = "select-block";
        armorBlock.classList.add("block");
        armorBlock.id = "armorBlock" + this.index;

        const armorLabel = document.createElement("label");
        armorLabel.innerHTML = "防具：";
        armorLabel.htmlFor = "armorSelect" + this.index;

        const armorSelect = document.createElement("select");
        armorSelect.className = "hero-select";
        armorSelect.id = "armorSelect" + this.index;

        for (const name in armors)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            armorSelect.appendChild(option);
        }

        armorSelect.addEventListener("change", (event) =>
        {
            this.armor = event.currentTarget.value;
        });

        armorBlock.appendChild(armorLabel);
        armorBlock.appendChild(armorSelect);

        const horseBlock = document.createElement("div");
        horseBlock.className = "select-block";
        horseBlock.classList.add("block");
        horseBlock.id = "horseBlock" + this.index;

        const horseLabel = document.createElement("label");
        horseLabel.innerHTML = "坐骑：";
        horseLabel.htmlFor = "horseSelect" + this.index;

        const horseSelect = document.createElement("select");
        horseSelect.className = "hero-select";
        horseSelect.id = "horseSelect" + this.index;

        for (const name in horses)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            horseSelect.appendChild(option);
        }

        horseSelect.addEventListener("change", (event) =>
        {
            this.horse = event.currentTarget.value;
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
        grave.classList.add(this.color);
        grave.id = "grave" + this.index;

        grave.style.display = "flex";

        menu.appendChild(grave);

        if (this.color === "Red")
        {
            const redMenuList = document.getElementById("redMenuList");
            redMenuList.appendChild(menu);
        }
        else if (this.color === "Blue")
        {
            const blueMenuList = document.getElementById("blueMenuList");
            blueMenuList.appendChild(menu);
        }

        return menu;
    }

    // 可停留
    can_stay(area)
    {
        // 如果不是重新进入，且棋子已经在该区域，那么可以停留
        if (area === this.area && area === this?.move_start)
        {
            if (area.terrain === "军营" || area.terrain === "大本营") return true;
            if (area.terrain === "山岭") return false;
            if (area.heroes.length > 1) return false;

            return true;
        }

        // 〖固城〗
        if (this._cannot_pass_because_of_gu_cheng(area)) return false;

        if (area.terrain === "军营" || area.terrain === "大本营") return true;

        if (this._cannot_stay_because_of_terrain(area)) return false;

        if (this._cannot_stay_because_of_other_heroes(area)) return false;

        return true;
    }

    // 因〖固城〗而形成的不可进入区域
    _cannot_pass_because_of_gu_cheng(area)
    {
        return area.heroes.some(hero => hero.color !== this.color) && this.enemies.some(hero => hero.name === "曹仁" && hero.alive) && area !== this.base;
    }

    // 因地形而形成的不可进入区域
    _cannot_stay_because_of_terrain(area)
    {
        return area.terrain === "山岭";
    }

    // 因其他角色而形成的不可进入区域
    _cannot_stay_because_of_other_heroes(area)
    {
        return area.heroes.some(hero => hero !== this);
    }

    // 可穿越
    can_pass(area, from=this.area)
    {
        // 如果可以停留必然可以穿越, 城墙除外
        if (this.can_stay(area))
        {
            if (area.terrain !== "城墙" && from.terrain !== "城墙") return true;
            if (area.terrain === "城墙" && from !== area.foot_area) return true;
            if (from.terrain === "城墙" && area !== from.foot_area) return true;
        }

        // 〖固城〗
        if (this._cannot_pass_because_of_gu_cheng(area)) return false;

        // 【穿越马】
        if (this.is_ride_on("穿越") && currentPlayer === this) return true;

        return false;
    }

    // 可沿方向执行移动
    can_step_towards(direction, subject = this)
    {
        if (this.color !== subject.color && this.is_ride_on("阻动")) return false;
        if (this.color !== subject.color && this?.yong_quan) return false;

        const target_area_row = this.area.row + Direction[direction][0];
        const target_area_col = this.area.col + Direction[direction][1];

        if (target_area_row < 0 || target_area_row >= 7) return false;
        if (target_area_col < 0 || target_area_col >= 7) return false;
        if (!this.can_pass(Areas[target_area_row][target_area_col])) return false;
        if (!this.can_stay(Areas[target_area_row][target_area_col])) return false;

        return true;
    }

    // 路径
    get paths()
    {
        const Paths = new Array(7)
        for (let row = 0; row < 7; row++)
        {
            Paths[row] = new Array(7)
            for (let col = 0; col < 7; col++)
            {
                Paths[row][col] = null;
            }
        }

        const queue = [];
        queue.push(this.area);
        const start_row = this.area.row;
        const start_col = this.area.col;
        Paths[start_row][start_col] = [this.area];

        while (queue.length)
        {
            const current_area = queue.shift();

            if (current_area !== this.move_start && queue.length !== 0 &&this._stop_at(current_area)) continue;

            const row = current_area.row;
            const col = current_area.col;

            for (const area of this._next_areas_at(current_area))
            {
                if (Paths[area.row][area.col] !== null) continue;
                if (!this.can_pass(area, current_area)) continue;
                if (current_area.terrain === "拒马刺" && current_area !== this.move_start && area !== current_area.next_area) continue;

                Paths[area.row][area.col] = Paths[row][col].concat([area]);
                queue.push(area);
            }
        }

        // 删除起点
        Paths[start_row][start_col] = null;

        return Paths;
    }

    // 判断是否停下，不再自动寻路
    _stop_at(area)
    {
        return false;
    }

    // 相邻区域
    _next_areas_at(current_area)
    {
        return current_area.adjacent_areas;
    }

    // 距离最近的可进入区域
    get nearest_area()
    {
        let nearest_areas = [];
        let min_distance = 100;
        for (let row = 0; row < 7; row++)
        {
            for (let col = 0; col < 7; col++)
            {
                const area = Areas[row][col]
                if (this.can_stay(area))
                {
                    const distance = calc_distance(this, area);
                    if (distance < min_distance)
                    {
                        min_distance = distance;
                        nearest_areas = [area];
                    }
                    else if (distance === min_distance)
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
        if (horses[this.horse] === type) return true;

        return false;
    }

    //移动
    move(area, consume_move_points = false, isDraw = false, subject = this)
    {
        const row = area.row;
        const col = area.col;
        const Paths = this.paths;

        if (Paths[row][col] === null) return false;

        const steps = Paths[row][col].length - 1;

        if (consume_move_points)
        {
            if (steps > this.move_points) return false;
            if (steps === this.move_points && !this.can_stay(area)) return false;

            this.move_points = this.move_points - steps;
        }
        else
        {
            if (steps > this.move_steps) return false;
            if (steps === this.move_steps && !this.can_stay(area)) return false;

            this.move_steps = this.move_steps - steps;
        }

        const path = Paths[row][col];
        let move_log = `(${path[0].row + 1}, ${path[0].col + 1})`;
        const vibration_pattern = [];
        for (let i = 1; i < path.length; i++)
        {
            this.step(path[i], isDraw);
            move_log += ` ▶ (${path[i].row + 1}, ${path[i].col + 1})`;
            vibration_pattern.push(20);
            vibration_pattern.push(250);
        }

        if (subject === this)
        {
            record(`${this.name} ${move_log}`);
        }
        else
        {
            record(`${subject.name}控制${this.name} ${move_log}`);
        }

        if (navigator.vibrate) navigator.vibrate(vibration_pattern);;
        return true;
    }

    // 移动一步
    step(area, isDraw = false)
    {
        if (!this.can_pass(area)) throw new Error(`无法进入(${area.row + 1}, ${area.col + 1})`);

        const start = this.area;
        const end = area;

        let direction = calc_direction(start, end);

        if (isDraw)
        {
            if (direction !== null) // 有方向
            {
                drawArrow([[start.row, start.col], [end.row, end.col]], this.color === "Red" ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
            }
            else // 无方向
            {
                drawTeleport([[start.row, start.col], [end.row, end.col]], this.color === "Red" ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
            }
        }

        this.area = area;

        this.after_step(start, end, direction);

        return {
            start: start,
            end: end,
            direction: direction
        };
    }

    // 移动一步后
    after_step(start, end, direction)
    {
        return;
    }

    // 移动阶段
    move_phase_begin()
    {
        // 正在等待响应
        if (isHighlighting()) return;

        // 定义点击高亮区域行为
        this.move_phase_click_to_move = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            this.move(event.currentTarget.area, true, true);

            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.move_phase_click_to_move);
                area.unhighlight("trap-target", this.move_phase_click_to_fall);
            }

            // 移动阶段没有被提前结束
            if (this?.move_phase_highlight === undefined || this?.move_phase_end === undefined) return;
            // 还有移动力
            if (this.move_points > 0)
            {
                this.move_phase_highlight();
            }
            else
            {
                this.move_phase_end();
            }
        }

        // 定义点击高亮区域行为(拒马刺)
        this.move_phase_click_to_fall = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.move_phase_click_to_move);
                area.unhighlight("trap-target", this.move_phase_click_to_fall);
            }

            record(`${this.name}试图执行移动：(${this.area.row + 1}, ${this.area.col + 1}) ▶ (${event.currentTarget.area.row + 1}, ${event.currentTarget.area.col + 1})，触发拒马刺的地形效果！`);

            // 失去1点体力
            // TODO

            // 移动阶段没有被提前结束
            if (this?.move_phase_highlight === undefined || this?.move_phase_end === undefined) return;

            // 结束移动阶段
            this.move_phase_end();
        }

        // 高亮可进入的区域
        this.move_phase_highlight = () =>
        {
            // 计算可到达的区域
            const Paths = this.paths;

            if (this.area.terrain === "拒马刺" && this.area !== this.move_start)
            {
                for (const area of this.area.adjacent_areas)
                {
                    if (Paths[area.row][area.col] === null) continue;
                    if (this.move_points === 1 && !this.can_stay(area)) continue;

                    if (area === this.area.next_area)
                    {
                        area.highlight("move-target", this.move_phase_click_to_move);
                    }
                    else
                    {
                        area.highlight("trap-target", this.move_phase_click_to_fall);
                    }
                }
                return;
            }

            // 高亮可到达的区域
            for (const area of Areas.flat())
            {
                if (Paths[area.row][area.col] === null) continue;
                if (Paths[area.row][area.col].length - 1 > this.move_points) continue;
                if (Paths[area.row][area.col].length - 1 === this.move_points && !this.can_stay(area)) continue;

                area.highlight("move-target", this.move_phase_click_to_move);
            }
        }

        // 结束移动阶段
        this.move_phase_end = (event = null) =>
        {
            if (this.move_points > 0 && !this.can_stay(this.area)) return;

            if (event !== null)
            {
                if (!event.target.classList.contains("cell") || event.target.classList.contains("move-target")) return;

                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();
            }

            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.move_phase_click_to_move);
                area.unhighlight("trap-target", this.move_phase_click_to_fall);
            }

            cls(1000);
            document.removeEventListener("contextmenu", this.move_phase_end);
            document.removeEventListener("click", this.move_phase_end);

            delete this.move_phase_click_to_move;
            delete this.move_phase_highlight;
            delete this.move_phase_end;
            delete this.move_start;

            setCurrentPhase(null);
        }

        setCurrentPlayer(this);
        setCurrentPhase("移动");

        // 基于体力值生成移动力
        this.move_points = this.generate_move_points();

        // 记录移动起点
        this.move_start = this.area;

        this.move_phase_highlight();

        // 空白处结束移动阶段
        document.addEventListener("contextmenu", this.move_phase_end);
        document.addEventListener("click", this.move_phase_end);
    }

    // 生成移动力
    generate_move_points()
    {
        let move_points = this.HP;

        // 〖拒敌〗
        if (this.affected_by_ju_di)
        {
            record(`王异发动〖拒敌〗`);
            move_points -= 1;
        }

        return move_points;
    }

    // 移动固定步数
    move_fixed_steps(isDraw = false, subject = this)
    {
        // 定义点击高亮区域行为
        this.click_to_move = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            this.move(event.currentTarget.area, false, isDraw, subject);

            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.click_to_move);
                area.unhighlight("trap-target", this.click_to_fall);
            }

            // 还有移动力
            if (this.move_steps > 0)
            {
                this.move_fixed_steps(isDraw, subject);
            }
            else
            {
                delete this.move_start;
                delete this.move_steps;
                if (isDraw)
                {
                    cls(1000);
                }
            }
        }

        // 定义点击高亮区域行为(拒马刺)
        this.click_to_fall = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.click_to_move);
                area.unhighlight("trap-target", this.click_to_fall);
            }

            record(`${this.name}试图执行移动：(${this.area.row + 1}, ${this.area.col + 1}) ▶ (${event.currentTarget.area.row + 1}, ${event.currentTarget.area.col + 1})，触发拒马刺的地形效果！`);

            // 失去1点体力
            // TODO

            // 结束移动
            delete this.move_start;
            if (isDraw)
            {
                cls(1000);
            }
        }

        // 计算可到达的区域
        const Paths = this.paths;

        if (this.area.terrain === "拒马刺" && this.area !== this.move_start)
        {
            for (const area of this.area.adjacent_areas)
            {
                if (Paths[area.row][area.col] === null) continue;
                if (this.move_steps === 1 && !this.can_stay(area)) continue;

                if (area === this.area.next_area)
                {
                    area.highlight("move-target", this.click_to_move);
                }
                else
                {
                    area.highlight("trap-target", this.click_to_fall);
                }
            }
            return;
        }

        // 高亮可到达的区域
        for (const area of Areas.flat())
        {
            if (Paths[area.row][area.col] === null) continue;
            if (Paths[area.row][area.col].length - 1 > this.move_steps) continue;
            if (Paths[area.row][area.col].length - 1 === this.move_steps && !this.can_stay(area)) continue;

            area.highlight("move-target", this.click_to_move);
        }
    }

    // 转移
    leap(area, isDraw = false, subject = this)
    {
        if (this.can_stay(area))
        {
            if (subject === this)
            {
                record(`${this.name} (${this.area.row + 1}, ${this.area.col + 1}) ▷ (${area.row + 1}, ${area.col + 1})`);
            }
            else
            {
                record(`${subject.name}控制${this.name} (${this.area.row + 1}, ${this.area.col + 1}) ▷ (${area.row + 1}, ${area.col + 1})`);
            }
            if (isDraw)
            {
                drawTeleport([[this.area.row, this.area.col], [area.row, area.col]], this.color === "Red" ? 'rgb(255,0,0)' : 'rgb(0,0,255)');
            }
            this.area = area;

            if (navigator.vibrate) navigator.vibrate(20);;
            return true;
        }
        return false;
    }

    // 转移到若干区域之一
    leap_to_areas(areas, isDraw = false, subject = this)
    {
        // 定义点击高亮区域行为
        const click_to_leap = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            this.leap(event.currentTarget.area, isDraw, subject);

            for (const area of Areas.flat())
            {
                area.unhighlight("transfer-target", click_to_leap);
            }

            if (isDraw)
            {
                cls(1000);
            }
        }

        // 高亮可到达的区域
        for (const area of areas)
        {
            area.highlight("transfer-target", click_to_leap);
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

        document.body.appendChild(this.piece);
        document.body.appendChild(that.piece);
        this._area = null;
        that._area = null;

        // 交换
        if (this.can_stay(that_area) && that.can_stay(this_area))
        {
            record(`${this.name} (${this_area.row + 1}, ${this_area.col + 1}) ▷ (${that_area.row + 1}, ${that_area.col + 1})`);
            this.area = that_area;

            record(`${this.name} 控制 ${that.name} 转移 (${that_area.row + 1}, ${that_area.col + 1}) ▷ (${this_area.row + 1}, ${this_area.col + 1})`);
            that.area = this_area;

            return true;
        }
        else
        {
            this.area.cell.appendChild(this.piece);
            that.area.cell.appendChild(that.piece);
            this._area = this_area;
            that._area = that_area;

            return false;
        }
    }

    highlight(className, listener = null)
    {
        this.piece.classList.add(className);
        if (className === "choose-target")
        {
            this.piece.addEventListener("click", listener);
        }
    }

    unhighlight(className, listener = null)
    {
        this.piece.classList.remove(className);
        this.piece.removeEventListener("click", listener);
    }

    use(card)
    {
        // 正在等待响应
        if (isHighlighting()) return;

        if (card === "迅【闪】")
        {
            this._xun_Shan();
        }
        // 锦囊
        // 〖秘计〗
        else if (card === "【暗度陈仓】")
        {
            setCurrentPlayer(this)
            this._An_Du_Chen_Cang(3 - this.affected_by_mi_ji);
        }
        else if (card === "【兵贵神速】")
        {
            setCurrentPlayer(this)
            this._Bing_Gui_Shen_Su();
        }
        else if (card === "【奇门遁甲】")
        {
            setCurrentPlayer(this)
            this._Qi_Men_Dun_Jia(2 - this.affected_by_mi_ji);
        }
        else if (card === "【诱敌深入】")
        {
            setCurrentPlayer(this)
            this._You_Di_Shen_Ru(4 - this.affected_by_mi_ji);
        }
    }

    // 迅【闪】
    _xun_Shan()
    {
        record(`${this.name}使用【迅【闪】】`);

        this.move_steps = 1;
        this.move_start = this.area;
        this.move_fixed_steps(true);
    }

    // 【暗度陈仓】
    _An_Du_Chen_Cang(limit = 3)
    {
        const targets = [];
        targets.push(this.base);

        for (const ally of this.allies)
        {
            if (!ally.alive) continue;

            for (const area of ally.area.adjacent_areas)
            {
                if (!this.can_stay(area)) continue;
                if (calc_distance(this, area) > limit) continue;

                targets.push(area);
            }
        }

        if (targets.length <= 0) return;

        record(`${this.name}使用【暗度陈仓】`);

        this.leap_to_areas(targets, true);
    }

    // 【兵贵神速】
    _Bing_Gui_Shen_Su()
    {
        record(`${this.name}使用【兵贵神速】`);

        this.move_steps = 2;
        this.move_start = this.area;
        this.move_fixed_steps(true);
    }

    // 【奇门遁甲】
    _Qi_Men_Dun_Jia(limit = 2)
    {
        const click_to_swap = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            if (navigator.vibrate) navigator.vibrate(20);;

            for (const hero of Heroes)
            {
                hero.unhighlight("choose-target", click_to_swap);
            }

            this.swap(event.currentTarget.hero);
        }

        const targets = [];

        for (const hero of Heroes)
        {
            if (!hero.alive) continue;
            if (hero === this) continue;
            if (calc_distance(this, hero) > limit) continue;
            if (hero.color !== this.color && (hero.is_ride_on("阻动") || hero?.yong_quan)) continue;

            targets.push(hero);
        }

        if (targets.length <= 0) return;

        record(`${this.name}使用【奇门遁甲】`);

        for (const hero of targets)
        {
            hero.highlight("choose-target", click_to_swap);
        }
    }

    // 【诱敌深入】
    _You_Di_Shen_Ru(limit = 4)
    {
        const click_to_control = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            if (navigator.vibrate) navigator.vibrate(20);;

            for (const hero of Heroes)
            {
                hero.unhighlight("choose-target", click_to_control);
            }

            const object_hero = event.currentTarget.hero;
            object_hero.move_steps = 1;
            object_hero.move_start = object_hero.area;
            object_hero.move_fixed_steps(true, this);
        }

        const targets = [];

        for (const hero of Heroes)
        {
            if (!hero.alive) continue;
            if (calc_distance(this, hero) > limit) continue;
            if (hero.color !== this.color && (hero.is_ride_on("阻动") || hero?.yong_quan)) continue;

            targets.push(hero);
        }

        if (targets.length <= 0) return;

        record(`${this.name}使用【诱敌深入】`);

        for (const hero of targets)
        {
            hero.highlight("choose-target", click_to_control);
        }
    }

    // 〖拒敌〗
    get affected_by_ju_di()
    {
        for (const enemy of this.enemies)
        {
            if (enemy.name !== "王异") continue;
            return calc_distance(this, enemy) <= enemy?.ju_di_limit;
        }
        return false;
    }

    // 〖秘计〗
    get affected_by_mi_ji()
    {
        for (const enemy of this.enemies)
        {
            if (enemy.name !== "王异") continue;
            return (calc_distance(this, enemy) <= enemy?.mi_ji_limit) ? enemy?.mi_ji_X : 0;
        }
        return 0;
    }
}

// 工厂函数
function create_hero(name, color, index)
{
    if (name === "王异")
    {
        return new Wang_Yi(color, index);
    }
    else if (name === "董卓")
    {
        return new Dong_Zhuo(color, index);
    }
    else if (name === "庞统")
    {
        return new Pang_Tong(color, index);
    }
    else if (name === "左慈")
    {
        return new Zuo_Ci(color, index);
    }
    else if (name === "于禁")
    {
        return new Yu_Jin(color, index);
    }
    else if (name === "张绣")
    {
        return new Zhang_Xiu(color, index);
    }
    else if (name === "祖茂")
    {
        return new Zu_Mao(color, index);
    }
    else if (name === "孙乾")
    {
        return new Sun_Qian(color, index);
    }
    else if (name === "吕蒙")
    {
        return new Lv_Meng(color, index);
    }
    else
    {
        return new Hero(name, color, index);
    }
}

// 王异
class Wang_Yi extends Hero
{
    constructor(color, index)
    {
        super("王异", color, index);
    }

    // 〖拒敌〗
    // 锁定技，敌方角色的移动阶段开始时，若其在你的距离<4>范围内，其少生成1点移动力。
    get ju_di_limit()
    {
        return 4;
    }

    // 〖秘计〗
    // 锁定技，你的距离<3>范围内的敌方角色使用锦囊牌的距离限制-X（X为你的已损失体力值）。
    get mi_ji_limit()
    {
        return 3;
    }

    get mi_ji_X()
    {
        return this.maxHP - this.HP;
    }
}

// 董卓
class Dong_Zhuo extends Hero
{
    constructor(color, index)
    {
        super("董卓", color, index);
    }

    // 〖拥权〗
    // 锁定技，若你的距离<1>范围内有其它己方角色，你不能成为敌方角色使用牌或发动技能的目标。
    get yong_quan_limit()
    {
        return 1;
    }

    get yong_quan()
    {
        for (const ally of this.allies)
        {
            if (!ally.alive) continue;
            if (calc_distance(this, ally) > this.yong_quan_limit) continue;

            return true;
        }
        return false;
    }

    // 〖拒敌〗
    get affected_by_ju_di()
    {
        if (this.yong_quan) return false;

        for (const enemy of this.enemies)
        {
            if (enemy.name !== "王异") continue;
            return calc_distance(this, enemy) <= enemy?.ju_di_limit;
        }
        return false;
    }

    // 〖秘计〗
    get affected_by_mi_ji()
    {
        if (this.yong_quan) return 0;

        for (const enemy of this.enemies)
        {
            if (enemy.name !== "王异") continue;
            return (calc_distance(this, enemy) <= enemy?.mi_ji_limit) ? enemy?.mi_ji_X : 0;
        }
        return 0;
    }
}

// 庞统
class Pang_Tong extends Hero
{
    constructor(color, index)
    {
        super("庞统", color, index);
        // 〖展骥〗
        // 锁定技，你的装备区有两个防具栏和两个坐骑栏。
        this.armor2 = "";
        this.horse2 = "";
    }

    set armor2(value)
    {
        if (this._armor2 !== value)
        {
            this._armor2 = value;
            const armorSelect = document.getElementById("armorSelect2" + this.index);
            armorSelect.value = value;
        }
    }

    get armor2()
    {
        return this._armor2;
    }

    set horse2(value)
    {
        if (this._horse !== value)
        {
            this._horse = value;
            const horseSelect = document.getElementById("horseSelect2" + this.index);
            horseSelect.value = value;
        }
    }

    get horse2()
    {
        return this._horse2;
    }

    _create_menu()
    {
        const menu = document.createElement("div");
        menu.className = "menu";
        menu.id = "menu" + this.index;
        menu.style.order = this.index;

        const fixedPanel = document.createElement("div");
        fixedPanel.className = "fixed-panel";
        fixedPanel.id = "fixedPanel" + this.index;

        const selectBlock = document.createElement("div");
        selectBlock.className = "select-block";
        selectBlock.classList.add("block");

        const heroLabel = document.createElement("label");
        heroLabel.innerHTML = "武将：";
        heroLabel.htmlFor = "heroSelect" + this.index;

        const heroSelect = document.createElement("select");
        heroSelect.className = "hero-select";
        heroSelect.id = "heroSelect" + this.index;

        selectBlock.appendChild(heroLabel);
        selectBlock.appendChild(heroSelect);

        for (const name in HERO_DATA)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            heroSelect.appendChild(option);
        }
        heroSelect.addEventListener("change", (event) =>
        {
            this.piece.parentElement.removeChild(this.piece);
            this.menu.parentElement.removeChild(this.menu);

            Heroes[this.index] = create_hero(event.currentTarget.value, this.color, this.index);

            if (this.alive)
            {
                Heroes[this.index].alive = true;
                Heroes[this.index].area = this.area;
            }
            else
            {
                Heroes[this.index].alive = false;
                Heroes[this.index].grave.appendChild(Heroes[this.index].piece);
            }

            if (this.carrier)
            {
                Heroes[this.index].carrier = true;
            }
        });

        const checkBlock = document.createElement("div");
        checkBlock.className = "check-block";
        checkBlock.classList.add("block");
        checkBlock.id = "checkBlock" + this.index;

        const carrierLabel = document.createElement("label");
        carrierLabel.innerHTML = "主帅";
        carrierLabel.htmlFor = "carrierCheckbox" + this.index;

        const carrierCheckbox = document.createElement("input");
        carrierCheckbox.type = "checkbox";
        carrierCheckbox.className = "checkbox";
        carrierCheckbox.id = "carrierCheckbox" + this.index;
        carrierCheckbox.name = (this.color === "Red" ? 'red' : 'blue') + "Checkbox";
        carrierCheckbox.disabled = true;

        carrierCheckbox.addEventListener("change", (event) =>
        {
            this.carrier = event.currentTarget.checked;
        });

        const actedLabel = document.createElement("label");
        actedLabel.innerHTML = "本轮行动";
        actedLabel.htmlFor = "actedCheckbox" + this.index;

        const actedCheckbox = document.createElement("input");
        actedCheckbox.type = "checkbox";
        actedCheckbox.className = "checkbox";
        actedCheckbox.id = "actedCheckbox" + this.index;
        actedCheckbox.disabled = true;

        actedCheckbox.addEventListener("change", (event) =>
        {
            if (!event.currentTarget.checked)
            {
                for (const hero of Heroes)
                {
                    hero.acted = false;
                }
                record(`新轮次开始`);
            }
            else
            {
                this.acted = true;
                record(`${this.name}回合结束`);
            }
        });

        checkBlock.appendChild(carrierLabel);
        checkBlock.appendChild(carrierCheckbox);
        checkBlock.appendChild(actedLabel);
        checkBlock.appendChild(actedCheckbox);

        fixedPanel.appendChild(selectBlock);
        fixedPanel.appendChild(checkBlock);

        const alivePanel = document.createElement("div");
        alivePanel.className = "alive-panel";
        alivePanel.id = "alivePanel" + this.index;

        const HPBlock = document.createElement("div");
        HPBlock.className = "HP-block";
        HPBlock.classList.add("block");
        HPBlock.id = "HPBlock" + this.index;

        const HPLabel = document.createElement("label");
        HPLabel.innerHTML = "体力值：";
        HPLabel.htmlFor = "HPMinus" + this.index;

        const HPMinus = document.createElement("i");
        HPMinus.className = "fas fa-minus-circle";
        HPMinus.id = "HPMinus" + this.index;

        HPMinus.addEventListener("click", (event) =>
        {
            this.HP = Math.max(0, this.HP - 1);
        });

        const labelHP = document.createElement("label");
        labelHP.id = "HP" + this.index;
        labelHP.type = "number";
        labelHP.className = "number";
        labelHP.innerHTML = "0";
        labelHP.htmlFor = "HPMinus" + this.index;

        const labelSlash = document.createElement("label");
        labelSlash.innerHTML = "/";

        const labelMaxHP = document.createElement("label");
        labelMaxHP.id = "maxHP" + this.index;
        labelMaxHP.type = "number";
        labelMaxHP.className = "number";
        labelMaxHP.innerHTML = "0";
        labelMaxHP.htmlFor = "HPPlus" + this.index;

        const HPPlus = document.createElement("i");
        HPPlus.className = "fas fa-plus-circle";
        HPPlus.id = "HPPlus" + this.index;

        HPPlus.addEventListener("click", (event) =>
        {
            this.HP = Math.min(this.HP + 1, HERO_DATA[this.name]["体力上限"]);
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
        weaponBlock.id = "weaponBlock" + this.index;

        const weaponLabel = document.createElement("label");
        weaponLabel.innerHTML = "武器：";
        weaponLabel.htmlFor = "weaponSelect" + this.index;

        const weaponSelect = document.createElement("select");
        weaponSelect.className = "hero-select";
        weaponSelect.id = "weaponSelect" + this.index;

        for (const name in weapons)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            weaponSelect.appendChild(option);
        }

        weaponSelect.addEventListener("change", (event) =>
        {
            this.weapon = event.currentTarget.value;
        });

        weaponBlock.appendChild(weaponLabel);
        weaponBlock.appendChild(weaponSelect);

        const armorBlock = document.createElement("div");
        armorBlock.className = "select-block";
        armorBlock.classList.add("block");
        armorBlock.id = "armorBlock" + this.index;

        const armorLabel = document.createElement("label");
        armorLabel.innerHTML = "防具：";
        armorLabel.htmlFor = "armorSelect" + this.index;

        const armorSelect = document.createElement("select");
        armorSelect.className = "hero-select";
        armorSelect.id = "armorSelect" + this.index;

        for (const name in armors)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            armorSelect.appendChild(option);
        }

        armorSelect.addEventListener("change", (event) =>
        {
            this.armor = event.currentTarget.value;
        });

        // 〖展骥〗
        const armorSelect2 = document.createElement("select");
        armorSelect2.className = "hero-select";
        armorSelect2.id = "armorSelect2" + this.index;

        for (const name in armors)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            armorSelect2.appendChild(option);
        }

        armorSelect2.addEventListener("change", (event) =>
        {
            this.armor2 = event.currentTarget.value;
        });

        armorSelect.style.width = "32.5%";
        armorSelect2.style.width = "32.5%";

        armorBlock.appendChild(armorLabel);
        armorBlock.appendChild(armorSelect);
        armorBlock.appendChild(armorSelect2);

        const horseBlock = document.createElement("div");
        horseBlock.className = "select-block";
        horseBlock.classList.add("block");
        horseBlock.id = "horseBlock" + this.index;

        const horseLabel = document.createElement("label");
        horseLabel.innerHTML = "坐骑：";
        horseLabel.htmlFor = "horseSelect" + this.index;

        const horseSelect = document.createElement("select");
        horseSelect.className = "hero-select";
        horseSelect.id = "horseSelect" + this.index;

        for (const name in horses)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            horseSelect.appendChild(option);
        }

        horseSelect.addEventListener("change", (event) =>
        {
            this.horse = event.currentTarget.value;
        });

        // 〖展骥〗
        const horseSelect2 = document.createElement("select");
        horseSelect2.className = "hero-select";
        horseSelect2.id = "horseSelect2" + this.index;

        for (const name in horses)
        {
            const option = document.createElement("option");
            option.id = name + this.index;
            option.value = name;
            option.innerText = name;
            horseSelect2.appendChild(option);
        }

        horseSelect2.addEventListener("change", (event) =>
        {
            this.horse2 = event.currentTarget.value;
        });

        horseSelect.style.width = "32.5%";
        horseSelect2.style.width = "32.5%";

        horseBlock.appendChild(horseLabel);
        horseBlock.appendChild(horseSelect);
        horseBlock.appendChild(horseSelect2);

        alivePanel.appendChild(HPBlock);
        alivePanel.appendChild(weaponBlock);
        alivePanel.appendChild(armorBlock);
        alivePanel.appendChild(horseBlock);

        alivePanel.style.display = "none";

        menu.appendChild(fixedPanel);
        menu.appendChild(alivePanel);

        const grave = document.createElement("div");
        grave.className = "grave";
        grave.classList.add(this.color);
        grave.id = "grave" + this.index;

        grave.style.display = "flex";

        menu.appendChild(grave);

        if (this.color === "Red")
        {
            const redMenuList = document.getElementById("redMenuList");
            redMenuList.appendChild(menu);
        }
        else if (this.color === "Blue")
        {
            const blueMenuList = document.getElementById("blueMenuList");
            blueMenuList.appendChild(menu);
        }

        return menu;
    }

    // 是否装备特定类型的坐骑
    is_ride_on(type)
    {
        if (horses[this.horse] === type || horses[this.horse2] === type) return true;

        return false;
    }
}

// 左慈
class Zuo_Ci extends Hero
{
    constructor(color, index)
    {
        super("左慈", color, index);
    }

    get context_menu_items()
    {
        const items = {
            "查看技能": () => { showSkillPanel(this); }
        };

        if (this.alive)
        {
            items["break-line-1"] = "<hr>";
            items["移动阶段"] = () => { this.move_phase_begin(); };
            items["移动阶段〖神行〗"] = () => { this.shen_xing(); };
            items["break-line-2"] = "<hr>";
            items["迅【闪】"] = () => { this.use("迅【闪】") };
            items["break-line-3"] = "<hr>";
            items["【暗度陈仓】"] = () => { this.use("【暗度陈仓】") };
            items["【兵贵神速】"] = () => { this.use("【兵贵神速】") };
            items["【奇门遁甲】"] = () => { this.use("【奇门遁甲】") };
            items["【诱敌深入】"] = () => { this.use("【诱敌深入】") };
        }
        return items;
    }

    // 〖神行〗
    // 移动阶段开始前，你可以跳过此阶段，然后转移至一个可进入空区域。
    shen_xing()
    {
        const areas = [];
        for (const area of Areas.flat())
        {
            if (!this.can_stay(area)) continue;
            if (area.heroes.length !== 0) continue;

            areas.push(area);
        }

        this.leap_to_areas(areas, true);
    }
}

// 于禁
class Yu_Jin extends Hero
{
    constructor(color, index)
    {
        super("于禁", color, index);
    }

    get context_menu_items()
    {
        const items = {
            "查看技能": () => { showSkillPanel(this); }
        };

        if (this.alive)
        {
            items["break-line-1"] = "<hr>";
            items["移动阶段"] = () => { this.move_phase_begin(); };
            items["break-line-2"] = "<hr>";
            items["〖节钺〗"] = () => { this.jie_yue(); };
            items["break-line-3"] = "<hr>";
            items["迅【闪】"] = () => { this.use("迅【闪】") };
            items["break-line-4"] = "<hr>";
            items["【暗度陈仓】"] = () => { this.use("【暗度陈仓】") };
            items["【兵贵神速】"] = () => { this.use("【兵贵神速】") };
            items["【奇门遁甲】"] = () => { this.use("【奇门遁甲】") };
            items["【诱敌深入】"] = () => { this.use("【诱敌深入】") };
        }
        return items;
    }

    // 〖节钺〗
    jie_yue()
    {
        // 出牌阶段限一次，你可以选择一名与你的距离为<3>以内且与你位于同一直线的其他角色，

        var limit = 3;

        // 定义点击高亮元素行为
        const click_to_pull = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            if (navigator.vibrate) navigator.vibrate(20);;

            record(`于禁发动〖节钺〗`);

            for (const hero of Heroes)
            {
                hero.unhighlight("choose-target", click_to_pull);
            }

            const object = event.currentTarget.hero;

            // 将其转移至该角色所在的方向上与你的距离最近的可进入区域，
            const signX = Math.sign(this.area.row - object.area.row);
            const signY = Math.sign(this.area.col - object.area.col);
            let nearest_areas = [];
            let min_distance = 100;
            for (const area of Areas.flat())
            {
                if (!object.can_stay(area)) continue;
                if (signX !== 0 && this.area.col !== area.col) continue;
                if (signY !== 0 && this.area.row !== area.row) continue;
                if (Math.sign(this.area.row - area.row) * signX < 0) continue;
                if (Math.sign(this.area.col - area.col) * signY < 0) continue;

                const distance = calc_distance(this, area);
                if (distance < min_distance)
                {
                    min_distance = distance;
                    nearest_areas = [area];
                }
                else if (distance === min_distance)
                {
                    nearest_areas.push(area);
                }
            }
            if (nearest_areas.length > 1)
            {
                object.leap_to_areas(nearest_areas, true, this);
            }
            else // 只有一个最近的可进入区域
            {
                object.leap(nearest_areas[0], true, this);
                cls(1000);
            }
        }

        const targets = [];

        for (const hero of Heroes)
        {
            if (!hero.alive) continue;
            if (hero === this) continue;
            if (calc_distance(hero, this) > limit) continue;
            if (!isOnSameLine(hero, this)) continue;
            if (hero.color !== this.color && (hero.is_ride_on("阻动") || hero?.yong_quan)) continue;

            targets.push(hero);
        }

        if (targets.length <= 0) return;

        for (const hero of targets)
        {
            hero.highlight("choose-target", click_to_pull);
        }

        // 若如此做，本回合你不能对其使用牌。
        // TODO
    }
}

// 张绣
class Zhang_Xiu extends Hero
{
    constructor(color, index)
    {
        super("张绣", color, index);
    }

    // 因其他角色而形成的不可进入区域
    _cannot_stay_because_of_other_heroes(area)
    {
        for (const hero of area.heroes)
        {
            if (hero === this) continue;

            if (hero.color === this.color) return true; // 区域里有己方棋子

            // 〖冲杀〗
            // 当你于移动阶段声明你执行的移动时，你可以进入有敌方角色的区域；
            if (this !== currentPlayer || currentPhase !== "移动") return true;
            if (hero?.yong_quan || hero.is_ride_on("阻动")) return true;
        }

        return false;
    }

    // 判断是否停下，不再自动寻路
    _stop_at(area)
    {
        // 〖冲杀〗
        // 当你于移动阶段声明你执行的移动时，你可以进入有敌方角色的区域；
        // 特殊处理：在进入有敌方角色的区域后停下，不再自动寻路。
        if (this !== currentPlayer || currentPhase !== "移动") return false;

        for (const hero of area.heroes)
        {
            if (hero.color === this.color) continue;
            if (hero?.yong_quan || hero.is_ride_on("阻动")) return false;

            return true;
        }

        return false;
    }

    // 移动一步后
    after_step(start, end, direction)
    {
        // 〖冲杀〗
        // 当你移动一步后，若你进入有敌方角色的区域；
        // TODO: 张绣冲向一个同时存在{己方曹仁、敌方A、敌方B}的区域
        for (const hero of this.area.heroes)
        {
            if (hero.color === this.color) continue;
            if (hero?.yong_quan || hero.is_ride_on("阻动")) continue;

            this.chong_sha(hero, direction);
        }
    }

    // 〖冲杀〗
    chong_sha(object, direction)
    {
        record(`张绣发动〖冲杀〗`);

        if (object.color === this.color) return;
        if (object?.yong_quan || object.is_ride_on("阻动")) return;

        const target_area_row = object.area.row + Direction[direction][0];
        const target_area_col = object.area.col + Direction[direction][1];
        // 若该角色可以执行步数为1且方向与你相同的移动，你控制其执行之；
        if (object.can_step_towards(direction, this))
        {
            object.move_steps = 1;
            object.move_start = object.area;
            object.move(Areas[target_area_row][target_area_col], false, false, this);
            delete object.move_start;
        }
        // 若该角色不可以执行步数为1且方向与你相同的移动且其可以转移，你控制其转移至与其距离最近的可进入区域，
        else
        {
            if (this?.move_phase_end) this.move_phase_end();

            const nearest_areas = object.nearest_area;
            if (nearest_areas.length > 1)
            {
                object.leap_to_areas(nearest_areas, false, this);
            }
            else // 只有一个最近的可进入区域
            {
                object.leap(nearest_areas[0], false, this);
            }
            // 然后你对该角色造成1点普通伤害
            // TODO
        }
    }
}

// 祖茂
class Zu_Mao extends Hero
{
    constructor(color, index)
    {
        super("祖茂", color, index);
    }

    get context_menu_items()
    {
        const items = {
            "查看技能": () => { showSkillPanel(this); }
        };

        if (this.alive)
        {
            items["break-line-1"] = "<hr>";
            items["移动阶段"] = () => { this.move_phase_begin(); };
            items["移动阶段〖诱兵〗"] = () => { this.you_bing_1(); };
            items["break-line-2"] = "<hr>";
            items["迅【闪】"] = () => { this.use("迅【闪】") };
            items["break-line-3"] = "<hr>";
            items["【暗度陈仓】"] = () => { this.use("【暗度陈仓】") };
            items["【兵贵神速】"] = () => { this.use("【兵贵神速】") };
            items["【奇门遁甲】"] = () => { this.use("【奇门遁甲】") };
            items["【诱敌深入】"] = () => { this.use("【诱敌深入】") };
        }
        return items;
    }

    // 〖诱兵〗移动阶段
    move_phase_begin_you_bing()
    {
        // 正在等待响应
        if (isHighlighting()) return;

        // 定义点击高亮区域行为
        this.move_phase_click_to_move = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            this.move_points -= 1;
            const s = this.step(event.currentTarget.area, true);
            this.you_bing_2(s.direction);

            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.move_phase_click_to_move);
                area.unhighlight("trap-target", this.move_phase_click_to_fall);
            }

            // 移动阶段没有被提前结束
            if (this?.move_phase_highlight === undefined || this?.move_phase_end === undefined) return;
            // 还有移动力
            if (this.move_points > 0)
            {
                this.move_phase_highlight();
            }
            else
            {
                this.move_phase_end();
            }
        }

        // 定义点击高亮区域行为(拒马刺)
        this.move_phase_click_to_fall = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.move_phase_click_to_move);
                area.unhighlight("trap-target", this.move_phase_click_to_fall);
            }

            record(`${this.name}试图执行移动：(${this.area.row + 1}, ${this.area.col + 1}) ▶ (${event.currentTarget.area.row + 1}, ${event.currentTarget.area.col + 1})，触发拒马刺的地形效果！`);

            // 失去1点体力
            // TODO

            // 移动阶段没有被提前结束
            if (this?.move_phase_highlight === undefined || this?.move_phase_end === undefined) return;

            // 结束移动阶段
            this.move_phase_end();
        }

        // 高亮可进入的区域
        this.move_phase_highlight = () =>
        {
            // 计算可到达的区域
            const Paths = this.paths;

            if (this.area.terrain === "拒马刺" && this.area !== this.move_start)
            {
                for (const area of this.area.adjacent_areas)
                {
                    if (Paths[area.row][area.col] === null) continue;
                    if (this.move_points === 1 && !this.can_stay(area)) continue;

                    if (area === this.area.next_area)
                    {
                        area.highlight("move-target", this.move_phase_click_to_move);
                    }
                    else
                    {
                        area.highlight("trap-target", this.move_phase_click_to_fall);
                    }
                }
                return;
            }

            const areas = this.area.adjacent_areas;

            // 高亮可到达的区域
            for (const area of areas)
            {
                if (Paths[area.row][area.col] === null) continue;
                if (this.move_points === 1)
                {
                    if (this._cannot_stay_because_of_terrain(area)) continue;
                    if (!this.can_pass(area)) continue;
                    if (!this.is_ride_on("穿越") && !this.can_stay(area)) continue;

                    if (area.heroes.some(hero => hero !== this.you_bing_object)) continue;

                    if (area.heroes.length > 0 && !this.you_bing_object.can_step_towards(calc_direction(this.area, area), this)) continue;
                }

                area.highlight("move-target", this.move_phase_click_to_move);
            }
        }

        // 结束移动阶段
        this.move_phase_end = (event = null) =>
        {
            if (this.move_points > 0 && !this.can_stay(this.area)) return;

            if (event !== null)
            {
                if (!event.target.classList.contains("cell") || event.target.classList.contains("move-target")) return;

                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();
            }
            for (const area of Areas.flat())
            {
                area.unhighlight("move-target", this.move_phase_click_to_move);
                area.unhighlight("trap-target", this.move_phase_click_to_fall);
            }

            cls(1000);
            document.removeEventListener("contextmenu", this.move_phase_end);
            document.removeEventListener("click", this.move_phase_end);
            delete this.move_phase_click_to_move;
            delete this.move_phase_highlight;
            delete this.move_phase_end;
            delete this.move_start;

            setCurrentPhase(null);
        }

        setCurrentPlayer(this);
        setCurrentPhase("移动");

        // 基于体力值生成移动力
        this.move_points = this.generate_move_points();

        // 记录移动起点
        this.move_start = this.area;

        this.move_phase_highlight();

        // 空白处结束移动阶段
        document.addEventListener("contextmenu", this.move_phase_end);
        document.addEventListener("click", this.move_phase_end);
    }

    // 〖诱兵〗1
    you_bing_1()
    {
        // 移动阶段开始时，你可以选择一名与你的距离为<4>以内的其他非主帅角色；

        var limit = 4;

        // 定义点击高亮元素行为
        const click_to_choose = (event) =>
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();

            if (navigator.vibrate) navigator.vibrate(20);;

            record(`祖茂发动〖诱兵〗`);

            for (const hero of Heroes)
            {
                hero.unhighlight("choose-target", click_to_choose);
            }

            this.you_bing_object = event.currentTarget.hero;
            this.move_phase_begin_you_bing();
        }

        for (const hero of Heroes)
        {
            if (hero.alive && hero !== this && calc_distance(hero, this) <= limit && !hero.carrier && !(hero.color !== this.color && hero?.yong_quan))
            {
                hero.highlight("choose-target", click_to_choose);
            }
        }
    }

    // 〖诱兵〗2
    you_bing_2(direction)
    {
        if (!this.you_bing_object.can_step_towards(direction, this)) return;

        // 若如此做，当你于本阶段移动一步后，
        // 你控制该角色执行一次步数为1且方向与你此步移动相同的移动。
        const object = this.you_bing_object;

        const target_area_row = object.area.row + Direction[direction][0];
        const target_area_col = object.area.col + Direction[direction][1];

        record(`祖茂发动〖诱兵〗`);
        object.move_steps = 1;
        object.move_start = object.area;
        object.move(Areas[target_area_row][target_area_col], false, true, this);
        delete object.move_start;
    }
}

// 孙乾
class Sun_Qian extends Hero
{
    constructor(color, index)
    {
        super("孙乾", color, index);
    }

    get context_menu_items()
    {
        const items = {
            "查看技能": () => { showSkillPanel(this); }
        };

        if (this.alive)
        {
            items["break-line-1"] = "<hr>";
            items["移动阶段"] = () => { this.move_phase_begin(); };
            items["break-line-2"] = "<hr>";
            items["〖归营〗"] = () => { this.gui_ying(); };
            items["break-line-3"] = "<hr>";
            items["迅【闪】"] = () => { this.use("迅【闪】") };
            items["break-line-4"] = "<hr>";
            items["【暗度陈仓】"] = () => { this.use("【暗度陈仓】") };
            items["【兵贵神速】"] = () => { this.use("【兵贵神速】") };
            items["【奇门遁甲】"] = () => { this.use("【奇门遁甲】") };
            items["【诱敌深入】"] = () => { this.use("【诱敌深入】") };
        }
        return items;
    }

    // 生成移动力
    generate_move_points()
    {
        let move_points = this.HP;

        // 〖拒敌〗
        if (this.affected_by_ju_di)
        {
            record(`王异发动〖拒敌〗`);
            move_points -= 1;
        }

        // 〖奔命〗
        // 锁定技，移动阶段开始时，你改为获得4点移动力。
        move_points = 4;

        return move_points;
    }

    // 〖归营〗结束阶段，你可以转移至己方大本营，然后你摸一张牌。
    gui_ying()
    {
        record(`孙乾发动〖归营〗`);
        this.leap(this.base, true, this);
        cls(1000);

        // TODO: 摸一张牌
    }
}

// 吕蒙
class Lv_Meng extends Hero
{
    constructor(color, index)
    {
        super("吕蒙", color, index);
    }

    // 相邻区域
    _next_areas_at(current_area)
    {
        // 〖渡江〗
        // 当你于回合内声明你执行的移动时，你可以将一步出发点为湖泊的移动的停留点改为另一个湖泊；
        const next_areas = current_area.adjacent_areas;

        if (currentPlayer !== this) return next_areas;
        // TODO 你执行的移动
        if (current_area.terrain !== "湖泊") return next_areas;

        for (const area of Areas.flat())
        {
            if (area.terrain !== "湖泊") continue;
            if (area === current_area) continue;

            next_areas.push(area);
        }

        return next_areas;

    }

    // 移动一步后
    after_step(start, end, direction)
    {
        // 〖渡江〗
        // 若你本回合以此法移动过，本回合你使用【杀】的距离限制改为1且你使用的第一张【杀】伤害基数+1。
        if (start.terrain !== "湖泊" || end.terrain !== "湖泊") return;

        // TODO: 使用【杀】的距离限制改为1且你使用的第一张【杀】伤害基数+1。
    }
}

export { Hero, create_hero };