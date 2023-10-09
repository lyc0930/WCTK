import { slot, bury } from './modules/actions.mjs';
import { terrain, heroes, weapons, armors, horses } from './modules/data.mjs';
import { highlightCells, highlightPieces, removeHighlight } from './modules/highlight.mjs';
import { stateHistory, saveState, recoverStatefrom } from './modules/history.mjs';
import { generateFlags, setCarrier } from './modules/flags.mjs';
import { HPColor, draw, cls } from './modules/utils.mjs';
import { skill_zhanji, skill_zhanji_undo } from './modules/skills.mjs';


export var Pieces = [];

var draggingPiece = null; // 正在拖动的棋子
var draggingPieceParent = null;

var leapingPiece = null; // 正在转移的棋子

var movingPiece = null; // 正在移动的棋子

var selectedPiece = null; // 选中的棋子

var currentPlayer = null; // 当前回合玩家


// 棋子点击事件
function clickPiece(event)
{
    event.preventDefault();

    if (selectedPiece == null)
    {
        selectedPiece = this;
        this.classList.add("selected");
        // currentPlayer = this;
    }
    else
    {
        if (document.getElementsByClassName("reachable").length <= 0 && document.getElementsByClassName("landable").length <= 0 && document.getElementsByClassName("targetable").length <= 0)
        {
            selectedPiece = null;
            this.classList.remove("selected");
            // currentPlayer = null;
        }

    }
}

function onMouseEnterPiece(event)
{
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
    avatar.src = "./assets/Avatar/active/" + heroes[name][0] + ".png";
    avatar.draggable = false;
    avatar.className = "avatar";
    piece.appendChild(avatar);
    piece.className = "piece";
    piece.classList.add(color === "red" ? "red-piece" : "blue-piece");
    piece.title = name;
    piece.name = name;
    // piece.maxHP = heroes[name][1];
    piece.HP = heroes[name][2];
    piece.weapons = [""];
    piece.armors = ["", ""];
    piece.horses = ["", ""];
    piece.carrier = false;
    piece.acted = false;

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
    labelHP.style.color = HPColor(piece.HP, heroes[piece.name][1]);

    const labelMaxHP = document.getElementById("maxHP" + index);
    labelMaxHP.textContent = heroes[piece.name][1];

    if (name == "庞统")
    {
        skill_zhanji(piece, index);
    }

    // 添加鼠标事件
    piece.addEventListener("mousedown", function (event)
    {
        const rect = piece.getBoundingClientRect();

        const shiftX = event.clientX - (rect.left + 0.5 * rect.width);
        const shiftY = event.clientY - (rect.top + 0.5 * rect.height);

        const phantomPiece = document.createElement("div");
        phantomPiece.className = "phantom piece";
        phantomPiece.id = "phantomPiece";

        function onMouseDragPiece(event)
        {
            if (draggingPiece === null)
            {
                draggingPiece = piece;
                draggingPieceParent = piece.parentElement;
                document.body.append(piece);
            }

            draggingPiece.style.left = event.clientX - shiftX + 'px';
            draggingPiece.style.top = event.clientY - shiftY + 'px';

            const nearestCell = nearestCellOf(event.clientX, event.clientY);
            nearestCell.appendChild(phantomPiece);
        }

        document.addEventListener('mousemove', onMouseDragPiece);

        piece.addEventListener('mouseup', function (event)
        {
            event.stopPropagation();
            document.removeEventListener('mousemove', onMouseDragPiece);

            phantomPiece.remove();

            if (draggingPiece != null)
            {
                draggingPiece.onmouseup = null;
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPieceParent.appendChild(draggingPiece); // 解决出身问题

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
                draggingPiece = null;
                draggingPieceParent = null;
            }
        });
    });

    // 添加触摸事件
    piece.addEventListener("touchstart", function (event)
    {
        if (event.touches.length > 1)
        {
            return;
        }
        event.stopPropagation();
        const rect = piece.getBoundingClientRect();

        const shiftX = event.touches[0].clientX - (rect.left + 0.5 * rect.width);
        const shiftY = event.touches[0].clientY - (rect.top + 0.5 * rect.height);

        const phantomPiece = document.createElement("div");
        phantomPiece.className = "phantom piece";
        phantomPiece.id = "phantomPiece";

        function onTouchDragPiece(event)
        {
            event.preventDefault();
            if (event.touches.length > 1)
            {
                return;
            }
            if (draggingPiece === null)
            {
                draggingPiece = piece;
                draggingPieceParent = piece.parentElement;
                document.body.append(piece);
            }

            draggingPiece.style.left = event.touches[0].clientX - shiftX + 'px';
            draggingPiece.style.top = event.touches[0].clientY - shiftY + 'px';

            const nearestCell = nearestCellOf(event.touches[0].clientX, event.touches[0].clientY);
            nearestCell.appendChild(phantomPiece);
        }

        piece.addEventListener('touchmove', onTouchDragPiece);

        piece.addEventListener('touchend', function (event)
        {
            if (event.changedTouches.length > 1)
            {
                return;
            }
            event.stopPropagation();
            piece.removeEventListener('touchmove', onTouchDragPiece);

            phantomPiece.remove();

            if (draggingPiece != null)
            {
                draggingPiece.ontouchend = null;
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPieceParent.appendChild(draggingPiece); // 解决出身问题

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
                draggingPiece = null;
                draggingPieceParent = null;
            }
        });
    });
    piece.addEventListener("click", clickPiece);
    piece.addEventListener("mouseenter", onMouseEnterPiece);
    piece.addEventListener("mouseleave", onMouseLeavePiece);
    return piece;
}

// 初始化棋盘上的棋子
function initializePieces()
{
    const chessboard = document.getElementById("chessboard");
    const heroesList = Object.keys(heroes);
    var initHeroes = [];
    for (var i = 0; i < 6; i++)
    {
        var index = Math.floor(Math.random() * (heroesList.length - i));
        initHeroes.push(heroesList[index]);
        heroesList[index] = heroesList[heroesList.length - 1 - i];
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

    for (var i = 1; i <= 6; i++)
    {
        const heroSelect = document.getElementById("heroSelect" + i);
        for (var name in heroes)
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
            avatar.src = "./assets/Avatar/active/" + heroes[heroSelect.value][0] + ".png";
            piece.HP = heroes[heroSelect.value][2];

            const labelHP = document.getElementById("HP" + index);
            labelHP.textContent = piece.HP;
            labelHP.style.color = HPColor(piece.HP, heroes[piece.name][1]);
            const labelMaxHP = document.getElementById("maxHP" + index);
            labelMaxHP.textContent = heroes[piece.name][1];

            const weaponSelect = document.getElementById("weaponSelect" + index);
            weaponSelect.value = "";

            const armorSelect = document.getElementById("armorSelect" + index);
            armorSelect.value = "";

            const horseSelect = document.getElementById("horseSelect" + index);
            horseSelect.value = "";

            if (piece.name == "庞统")
            {
                skill_zhanji(piece);
            }
            else
            {
                skill_zhanji_undo(piece);
            }
            saveState();
        });

        const carrierCheckbox = document.getElementById("carrierCheckbox" + i);
        carrierCheckbox.addEventListener("change", function (event)
        {
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            piece.carrier = this.checked;
            setCarrier(piece.classList.contains("red-piece") ? "Red" : "Blue", this.checked ? piece : null);
            saveState();
        }
        );

        const actedCheckbox = document.getElementById("actedCheckbox" + i);
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
                    avatar.src = "./assets/Avatar/active/" + heroes[piece.name][0] + ".png";
                }
                console.log(`新轮次开始`);
            }
            else
            {
                piece.acted = true;
                const avatar = piece.querySelector(".avatar");
                avatar.src = "./assets/Avatar/inactive/" + heroes[piece.name][0] + ".png";
                console.log(`${piece.name}回合结束`);
            }
            saveState();
        }
        );

        const buttonHPDown = document.getElementById("HPMinus" + i);
        buttonHPDown.addEventListener("click", function (event)
        {
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            const labelHP = document.getElementById("HP" + index);
            var HP = piece.HP;
            var MaxHP = heroes[piece.name][1];
            if (HP > 0)
            {
                labelHP.textContent = HP - 1;
                labelHP.style.color = HPColor(HP - 1, MaxHP);
                piece.HP = HP - 1;

            }
            saveState();
        });
        const buttonHPUp = document.getElementById("HPPlus" + i);
        buttonHPUp.addEventListener("click", function (event)
        {
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            const labelHP = document.getElementById("HP" + index);
            var HP = piece.HP;
            var MaxHP = heroes[piece.name][1];
            if (HP < MaxHP)
            {
                labelHP.textContent = HP + 1;
                labelHP.style.color = HPColor(HP + 1, MaxHP);
                piece.HP = HP + 1;
            }
            saveState();
        });

        const weaponSelect = document.getElementById("weaponSelect" + i);
        for (var name in weapons)
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

        const armorSelect = document.getElementById("armorSelect" + i);
        for (var name in armors)
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

        const horseSelect = document.getElementById("horseSelect" + i);
        for (var name in horses)
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
    }

    initializePieces();

    // 撤销重做
    const chessboard = document.getElementById("chessboard");

    chessboard.addEventListener("wheel", function (event)
    {
        event.preventDefault();
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
            event.preventDefault();
            const previousState = stateHistory.undo();
            if (previousState)
            {
                recoverStatefrom(previousState);
            }
        }
        else if (event.key == 'ArrowDown')
        {
            event.preventDefault();
            const nextState = stateHistory.redo();
            if (nextState)
            {
                recoverStatefrom(nextState);
            }
        }
        else if(event.key == 'z' && event.ctrlKey)
        {
            event.preventDefault();
            const previousState = stateHistory.undo();
            if (previousState)
            {
                recoverStatefrom(previousState);
            }
        }
        else if (event.key == 'y' && event.ctrlKey)
        {
            event.preventDefault();
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
}

// 启动游戏
initializeGame();
saveState();