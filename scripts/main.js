import { slot, bury } from '../modules/actions.mjs';
import { terrain, HERO_DATA, weapons, armors, horses } from '../modules/data.mjs';
import { highlightCells, removeHighlight, isHighlighting } from '../modules/highlight.mjs';
import { stateHistory, saveState, recoverStatefrom } from '../modules/history.mjs';
import { generateFlags, setCarrier } from '../modules/flags.mjs';
import { HPColor, cls } from '../modules/utils.mjs';
import { zhan_ji, zhan_ji_undo } from '../modules/skills.mjs';
import { contextMenuItems, addContextMenu, removeContextMenu } from '../modules/context-menu.mjs';
import { Pieces } from '../modules/global_variables.mjs';

function onMouseEnterPiece(event)
{
    if (isHighlighting())
    {
        return;
    }

    const hoverRow = this.parentElement.row;
    const hoverCol = this.parentElement.col;
    var attackableCells = [];

    for (const cell of document.getElementsByClassName("cell"))
    {
        const row = cell.row;
        const col = cell.col;
        const attackRange = weapons[this.weapons[0]];
        if (Math.abs(row - hoverRow) + Math.abs(col - hoverCol) <= attackRange)
        {
            attackableCells.push(cell);
        }
    }
    highlightCells(attackableCells, "attackable");
}

function onMouseLeavePiece(event)
{
    removeHighlight("attackable");
}

// 创建棋盘
function createChessboard()
{
    const chessboard = document.getElementById("chessboard");

    for (var i = 0; i < 7; i++)
    {
        for (var j = 0; j < 7; j++)
        {
            const cell = document.createElement("div");
            cell.className = "cell";
            if (terrain[i][j].includes("R") || terrain[i][j].includes("B"))
            {
                if (terrain[i][j].includes("R"))
                {
                    cell.classList.add("Red");
                }
                else
                {
                    cell.classList.add("Blue");
                }
                cell.classList.add(terrain[i][j].slice(1));
            }
            else
            {
                cell.classList.add(terrain[i][j]);
            }
            cell.row = i;
            cell.col = j;
            chessboard.appendChild(cell);
        }
    }
}

function nearestCellOf(X, Y)
{
    var nearestCell = null;
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
            nearestCell = cell;
        }
    }
    return nearestCell;
}

// 创建棋子
function createPiece(color, name, index)
{
    const piece = document.createElement("div");
    const avatar = document.createElement("img");
    avatar.src = "./assets/Avatar/active/" + HERO_DATA[name]["拼音"] + ".png";
    avatar.draggable = false;
    avatar.className = "avatar";
    piece.appendChild(avatar);
    piece.className = "piece";
    piece.classList.add(color === "red" ? "red-piece" : "blue-piece");
    piece.name = name;
    piece.HP = HERO_DATA[name]["体力上限"];
    piece.weapons = [""];
    piece.armors = ["", ""];
    piece.horses = ["", ""];
    piece.carrier = false;
    piece.acted = false;
    piece.alive = true;

    const heroSelect = document.getElementById("heroSelect" + index);
    var heroOption = document.getElementById(piece.name + index);
    heroOption.selected = true;

    const actedCheckbox = document.getElementById("actedCheckbox" + index);
    actedCheckbox.checked = false;

    const carrierCheckbox = document.getElementById("carrierCheckbox" + index);
    carrierCheckbox.checked = false;
    carrierCheckbox.required = false;

    const labelHP = document.getElementById("HP" + index);
    labelHP.textContent = piece.HP;
    labelHP.style.color = HPColor(piece.HP, HERO_DATA[piece.name]["体力上限"]);

    const labelMaxHP = document.getElementById("maxHP" + index);
    labelMaxHP.textContent = HERO_DATA[piece.name]["体力上限"];

    // 〖展骥〗
    if (name == "庞统")
    {
        zhan_ji(piece, index);
    }

    // 添加鼠标事件
    piece.addEventListener("mousedown", function (event)
    {
        // 正在等待响应
        if (isHighlighting())
        {
            return;
        }
        if (event.cancelable) event.preventDefault();
        event.stopPropagation();

        const rect = piece.getBoundingClientRect();

        const shiftX = event.clientX - (rect.left + 0.5 * rect.width);
        const shiftY = event.clientY - (rect.top + 0.5 * rect.height);

        var draggingPiece = null; // 正在拖动的棋子

        const phantomPiece = document.createElement("div");
        phantomPiece.className = "phantom piece";
        phantomPiece.id = "phantomPiece";

        function onmousemove(event)
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();
            if (draggingPiece === null)
            {
                draggingPiece = piece;
                draggingPiece.old_parent = piece.parentElement;
                draggingPiece.style.transition = "width 100ms ease-out, height 100ms ease-out";
                document.body.append(piece);
            }

            draggingPiece.style.left = event.clientX - shiftX + window.scrollX  + 'px';
            draggingPiece.style.top = event.clientY - shiftY + window.scrollY  + 'px';

            const nearestCell = nearestCellOf(event.clientX, event.clientY);
            nearestCell.appendChild(phantomPiece);
        }

        function onmouseup(event)
        {
            event.stopPropagation();
            document.removeEventListener('mousemove', onmousemove);

            phantomPiece.remove();

            if (draggingPiece != null)
            {
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPiece.old_parent.appendChild(draggingPiece); // 解决出身问题
                draggingPiece.style.transition = "width 100ms ease-out, height 100ms ease-out, left 70ms ease-out, top 70ms ease-out";

                const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();

                if (event.clientX >= chessboardRect.left && event.clientX <= chessboardRect.right && event.clientY >= chessboardRect.top && event.clientY <= chessboardRect.bottom) // 在棋盘范围内
                {
                    const nearestCell = nearestCellOf(event.clientX, event.clientY);
                    slot(draggingPiece, nearestCell, (event.button === 2) || (event.altKey));
                }
                else
                { // 超出棋盘范围
                    bury(draggingPiece);
                }
                draggingPiece.old_parent = null;
                draggingPiece = null;
            }
        }

        document.addEventListener('mousemove', onmousemove);

        piece.addEventListener('mouseup', onmouseup, { once: true });
    });

    // 添加触摸事件
    piece.addEventListener("touchstart", function (event)
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

        var draggingPiece = null; // 正在拖动的棋子

        const phantomPiece = document.createElement("div");
        phantomPiece.className = "phantom piece";
        phantomPiece.id = "phantomPiece";

        function ontouchmove(event)
        {
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();
            if (event.touches.length > 1)
            {
                return;
            }
            if (draggingPiece === null)
            {
                draggingPiece = piece;
                draggingPiece.old_parent = piece.parentElement;
                document.body.append(piece);
                draggingPiece.style.transition = "width 100ms ease-out, height 100ms ease-out";
            }

            draggingPiece.style.left = event.touches[0].clientX - shiftX + window.scrollX  + 'px';
            draggingPiece.style.top = event.touches[0].clientY - shiftY + window.scrollY  + 'px';

            const nearestCell = nearestCellOf(event.touches[0].clientX, event.touches[0].clientY);
            nearestCell.appendChild(phantomPiece);
        }

        function ontouchend(event)
        {
            if (event.changedTouches.length > 1)
            {
                return;
            }
            if (event.cancelable) event.preventDefault();
            event.stopPropagation();
            piece.removeEventListener("touchmove", ontouchmove);

            phantomPiece.remove();

            piece.style = piece.old_style;

            if (draggingPiece != null)
            {
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPiece.old_parent.appendChild(draggingPiece); // 解决出身问题
                draggingPiece.style.transition = "width 100ms ease-out, height 100ms ease-out, left 70ms ease-out, top 70ms ease-out";

                const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();

                if (event.changedTouches[0].clientX >= chessboardRect.left && event.changedTouches[0].clientX <= chessboardRect.right && event.changedTouches[0].clientY >= chessboardRect.top && event.changedTouches[0].clientY <= chessboardRect.bottom) // 在棋盘范围内
                {
                    const nearestCell = nearestCellOf(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                    slot(draggingPiece, nearestCell);
                }
                else
                {
                    bury(draggingPiece);
                }
                draggingPiece.old_parent = null;
                draggingPiece = null;
            }
        }

        piece.addEventListener("touchmove", ontouchmove, { passive: false });

        piece.addEventListener("touchend", ontouchend, { once: true });
    }, { passive: false });

    piece.addEventListener("mouseenter", onMouseEnterPiece);
    piece.addEventListener("mouseleave", onMouseLeavePiece);

    addContextMenu(piece, contextMenuItems(piece));

    return piece;
}

// 初始化棋盘上的棋子
function initializePieces()
{
    const chessboard = document.getElementById("chessboard");
    const HERO_DATAList = Object.keys(HERO_DATA);
    var initHeroes = [];
    for (var i = 0; i < 6; i++)
    {
        var index = Math.floor(Math.random() * (HERO_DATAList.length - i));
        initHeroes.push(HERO_DATAList[index]);
        HERO_DATAList[index] = HERO_DATAList[HERO_DATAList.length - 1 - i];
    }
    for (var i = 0; i < chessboard.children.length; i++)
    {
        if (chessboard.children[i].classList.contains("camp") || chessboard.children[i].classList.contains("base"))
        {
            if (chessboard.children[i].classList.contains("Red"))
            {
                const redPiece = createPiece("red", initHeroes.pop(), 6 - initHeroes.length);
                Pieces.push(redPiece);
                chessboard.children[i].appendChild(redPiece);
                if (chessboard.children[i].classList.contains("base"))
                {
                    setCarrier("Red", redPiece);
                }

            }
        }
    }
    for (var i = 0; i < chessboard.children.length; i++)
    {
        if (chessboard.children[i].classList.contains("camp") || chessboard.children[i].classList.contains("base"))
        {
            if (chessboard.children[i].classList.contains("Blue"))
            {
                const bluePiece = createPiece("blue", initHeroes.pop(), 6 - initHeroes.length);
                Pieces.push(bluePiece);
                chessboard.children[i].appendChild(bluePiece);
                if (chessboard.children[i].classList.contains("base"))
                {
                    setCarrier("Blue", bluePiece);
                }
            }
        }
    }
}

// 初始化游戏
function initializeGame()
{

    createChessboard();
    generateFlags();

    document.addEventListener('contextmenu', event => event.preventDefault()); // 禁用右键菜单
    document.addEventListener('mouseup', function (event)
    {
        if (event.button === 2)
        {
            event.preventDefault()
            cls();
        }
    });

    const redMenuList = document.createElement("div");
    redMenuList.className = "menu-list";
    redMenuList.id = "redMenuList";

    const blueMenuList = document.createElement("div");
    blueMenuList.className = "menu-list";
    blueMenuList.id = "blueMenuList";

    for (var i = 1; i <= 6; i++)
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
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            piece.name = heroSelect.value;
            const avatar = piece.querySelector(".avatar");
            avatar.src = "./assets/Avatar/active/" + HERO_DATA[heroSelect.value]["拼音"] + ".png";
            piece.HP = HERO_DATA[heroSelect.value]["体力上限"];

            const labelHP = document.getElementById("HP" + index);
            labelHP.textContent = piece.HP;
            labelHP.style.color = HPColor(piece.HP, HERO_DATA[piece.name]["体力上限"]);
            const labelMaxHP = document.getElementById("maxHP" + index);
            labelMaxHP.textContent = HERO_DATA[piece.name]["体力上限"];

            const weaponSelect = document.getElementById("weaponSelect" + index);
            weaponSelect.value = "";

            const armorSelect = document.getElementById("armorSelect" + index);
            armorSelect.value = "";

            const horseSelect = document.getElementById("horseSelect" + index);
            horseSelect.value = "";

            // 〖展骥〗
            if (piece.name == "庞统")
            {
                zhan_ji(piece);
            }
            else
            {
                zhan_ji_undo(piece);
            }

            removeContextMenu(piece);
            addContextMenu(piece, contextMenuItems(piece));

            saveState();
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
        carrierCheckbox.name = (i<=3 ? 'red' : 'blue') + "Checkbox";

        carrierCheckbox.addEventListener("change", function (event)
        {
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            piece.carrier = this.checked;
            setCarrier(piece.classList.contains("red-piece") ? "Red" : "Blue", this.checked ? piece : null);
            saveState();
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
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            if (!actedCheckbox.checked)
            {
                for (const piece of Pieces)
                {
                    piece.acted = false;
                    const checkBox = document.getElementById("actedCheckbox" + (Pieces.indexOf(piece) + 1));
                    checkBox.checked = false;
                    const avatar = piece.querySelector(".avatar");
                    avatar.src = "./assets/Avatar/active/" + HERO_DATA[piece.name]["拼音"] + ".png";
                }
                console.log(`新轮次开始`);
            }
            else
            {
                piece.acted = true;
                const avatar = piece.querySelector(".avatar");
                avatar.src = "./assets/Avatar/inactive/" + HERO_DATA[piece.name]["拼音"] + ".png";
                console.log(`${piece.name}回合结束`);
            }
            saveState();
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
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            const labelHP = document.getElementById("HP" + index);
            var HP = piece.HP;
            var MaxHP = HERO_DATA[piece.name]["体力上限"];
            if (HP > 0)
            {
                labelHP.textContent = HP - 1;
                labelHP.style.color = HPColor(HP - 1, MaxHP);
                piece.HP = HP - 1;

            }
            saveState();
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
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            const labelHP = document.getElementById("HP" + index);
            var HP = piece.HP;
            var MaxHP = HERO_DATA[piece.name]["体力上限"];
            if (HP < MaxHP)
            {
                labelHP.textContent = HP + 1;
                labelHP.style.color = HPColor(HP + 1, MaxHP);
                piece.HP = HP + 1;
            }
            saveState();
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
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            piece.weapons[0] = weaponSelect.value;
            piece.range = weapons[weaponSelect.value];
            saveState();
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
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            piece.armors[0] = armorSelect.value;
            saveState();
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
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            piece.horses[0] = horseSelect.value;
            saveState();
        });

        horseBlock.appendChild(horseLabel);
        horseBlock.appendChild(horseSelect);

        alivePanel.appendChild(HPBlock);
        alivePanel.appendChild(weaponBlock);
        alivePanel.appendChild(armorBlock);
        alivePanel.appendChild(horseBlock);

        menu.appendChild(fixedPanel);
        menu.appendChild(alivePanel);

        const grave = document.createElement("div");
        grave.className = "grave";
        grave.classList.add(i <= 3 ? "Red" : "Blue");
        grave.id = "grave" + i;

        menu.appendChild(grave);

        if (i <= 3)
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

    initializePieces();

    // 撤销重做
    const chessboard = document.getElementById("chessboard");

    chessboard.addEventListener("wheel", function (event)
    {
        if (event.cancelable) event.preventDefault();
        if (event.deltaY < 0)
        {
            const previousState = stateHistory.undo();
            if (previousState)
            {
                recoverStatefrom(previousState);
            }
        } else if (event.deltaY > 0)
        {
            const nextState = stateHistory.redo();
            if (nextState)
            {
                recoverStatefrom(nextState);
            }
        }
    }, { passive: false });

    document.addEventListener("keydown", function (event)
    {
        if (event.key == 'ArrowUp')
        {
            if (event.cancelable) event.preventDefault();
            const previousState = stateHistory.undo();
            if (previousState)
            {
                recoverStatefrom(previousState);
            }
        }
        else if (event.key == 'ArrowDown')
        {
            if (event.cancelable) event.preventDefault();
            const nextState = stateHistory.redo();
            if (nextState)
            {
                recoverStatefrom(nextState);
            }
        }
        else if(event.key == 'z' && event.ctrlKey)
        {
            if (event.cancelable) event.preventDefault();
            const previousState = stateHistory.undo();
            if (previousState)
            {
                recoverStatefrom(previousState);
            }
        }
        else if (event.key == 'y' && event.ctrlKey)
        {
            if (event.cancelable) event.preventDefault();
            const nextState = stateHistory.redo();
            if (nextState)
            {
                recoverStatefrom(nextState);
            }
        }
        else if (event.key == 'l' && event.ctrlKey)
        {
            event.preventDefault()
            cls();
        }
    });

    document.addEventListener("touchstart", function (event)
    {
        if (event.touches.length > 1)
        {
            return;
        }

        var direction = null;
        // 没到顶且没到底
        if (window.scrollY <= 0)
        {
            direction = "up";
        }
        else if (window.scrollY + window.innerHeight >= document.body.scrollHeight)
        {
            direction = "down";
        }
        else
        {
            return;
        }

        var startY = event.touches[0].clientY;
        var deltaY = 0;
        const threshold = 100;

        function ontouchscroll(event)
        {
            // 纵向滑动已经到顶后仍然向下滑动
            if (direction == "up" && window.scrollY <= 0 && event.touches[0].clientY > startY)
            {
                if (event.cancelable) event.preventDefault();
                event.stopPropagation();
                deltaY += (event.touches[0].clientY - startY);
                startY = event.touches[0].clientY;
                while (deltaY > threshold)
                {
                    const previousState = stateHistory.undo();
                    if (previousState)
                    {
                        recoverStatefrom(previousState);
                    }
                    deltaY -= threshold;
                }
            }
            // 纵向滑动已经到底后仍然向上滑动
            else if (direction == "down" && window.scrollY + window.innerHeight >= document.body.scrollHeight && event.touches[0].clientY < startY)
            {
                if (event.cancelable) event.preventDefault();
                event.stopPropagation();
                deltaY += (event.touches[0].clientY - startY);
                startY = event.touches[0].clientY;
                while (deltaY < -threshold)
                {
                    const nextState = stateHistory.redo();
                    if (nextState)
                    {
                        recoverStatefrom(nextState);
                    }
                    deltaY += threshold;
                }
            }
        }

        document.addEventListener("touchmove", ontouchscroll, { passive: false });

        document.addEventListener("touchend", function (event)
        {
            document.removeEventListener("touchmove", ontouchscroll);
        });
    }, { passive: false });
}
// 启动游戏
initializeGame();
saveState();