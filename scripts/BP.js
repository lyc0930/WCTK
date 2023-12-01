import { HERO_DATA } from '../modules/data.mjs';
import { addContextMenu, removeContextMenu, hideContextMenu, addSkillPanel, showSkillPanel, createHeroTable, showHeroTable } from '../modules/context-menu.mjs';

var side1st = "red";
var side2nd = side1st === "red" ? "blue" : "red";
var INDEX = 0;

// side1st = window.confirm("红方是否先选？") ? "red" : "blue";
// side2nd = side1st === "red" ? "blue" : "red";

class Candidate
{
    constructor(name, index)
    {
        this.index = index; // 序号
        this.name = name; // 姓名
        this.recruited = false; // 是否已经被招募
        this.piece = this._create_piece(); // 棋子

        this._dragging = false; // 是否正在拖动

        const cell = document.getElementById("unpickedCell" + this.index);
        cell.appendChild(this.piece);

        const nameTag = document.getElementById("unpickedName" + this.index);
        nameTag.innerHTML = this.name;
    }

    set dragging(value)
    {
        if (this._dragging !== value)
        {
            this._dragging = value;
            if (value) // 开始拖动
            {
                const nameTag = document.getElementById("unpickedName" + this.index);
                nameTag.innerHTML = "";

                this.piece.style.width = "12vmin";
                this.piece.style.height = "12vmin";
                this.piece.style.transition = "width 100ms ease-out, height 100ms ease-out";
                document.body.appendChild(this.piece);
            }
            else // 结束拖动
            {
                this.piece.style.left = null;
                this.piece.style.top = null;
                this.piece.style.width = "10vmin";
                this.piece.style.height = "10vmin";
                this.piece.style.transition = "width 100ms ease-out, height 100ms ease-out, left 70ms ease-out, top 70ms ease-out";
            }
        }
    }

    get dragging()
    {
        return this._dragging;
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
        piece.id = "hero" + this.index;
        piece.candidate = this;

        // 添加鼠标事件
        piece.addEventListener("mousedown", (event) =>
        {
            if (this.recruited) return;
            if (event.button !== 0) return;
            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();
            const startX = event.clientX;
            const startY = event.clientY;

            const rect = piece.getBoundingClientRect();

            const shiftX = event.clientX - (rect.left + 0.5 * rect.width);
            const shiftY = event.clientY - (rect.top + 0.5 * rect.height);

            const onmousemove = (event) =>
            {
                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                piece.style.left = event.clientX - shiftX + window.scrollX + 'px';
                piece.style.top = event.clientY - shiftY + window.scrollY + 'px';
            }

            const onmouseup = (event) =>
            {
                if (this.recruited) return;
                if (event.button != 0) return;
                event.stopPropagation();

                document.removeEventListener('mousemove', onmousemove);

                if (this.dragging)
                {
                    this.dragging = false;

                    const side = (INDEX % 4 === 0 || INDEX % 4 === 3) ? side1st : side2nd;
                    const board = document.getElementById(side + "Board");
                    const boardRect = board.getBoundingClientRect();

                    if (event.clientX >= boardRect.left && event.clientX <= boardRect.right && event.clientY >= boardRect.top && event.clientY <= boardRect.bottom) // 在看板范围内
                    {
                        this.recruit();
                    }
                    else
                    {
                        // 移动距离小于10px则选择
                        if (Math.abs(event.clientX + window.scrollX - startX) <= 10 && Math.abs(event.clientY + window.scrollY - startY) <= 10)
                        {
                            this.recruit();
                        }
                        else
                        {
                            const cell = document.getElementById("unpickedCell" + this.index);
                            cell.appendChild(this.piece);
                            const name = document.getElementById("unpickedName" + this.index);
                            name.innerHTML = this.name;
                        }
                    }
                }
                else
                {
                    this.recruit();

                    piece.style.width = "10vmin";
                    piece.style.height = "10vmin";
                }
            }

            document.addEventListener('mousemove', onmousemove);

            piece.addEventListener('mouseup', onmouseup, { once: true });
        });

        piece.addEventListener("mouseenter", function (event)
        {
            piece.style.width = "12vmin";
            piece.style.height = "12vmin";
        });
        piece.addEventListener("mouseleave", function (event)
        {
            piece.style.width = "10vmin";
            piece.style.height = "10vmin";
        });

        // 添加触摸事件
        piece.addEventListener("touchstart", (event) =>
        {
            if (event.touches.length > 1) return;
            if (this.recruited) return;

            if (event.cancelable) event.preventDefault();
            // event.stopPropagation();

            piece.style.width = "12vmin";
            piece.style.height = "12vmin";

            const rect = piece.getBoundingClientRect();

            const shiftX = event.touches[0].clientX - (rect.left + 0.5 * rect.width);
            const shiftY = event.touches[0].clientY - (rect.top + 0.5 * rect.height);

            const ontouchmove = (event) =>
            {
                if (event.touches.length > 1) return;
                if (event.cancelable) event.preventDefault();
                // event.stopPropagation();

                this.dragging = true;

                piece.style.left = event.touches[0].clientX - shiftX + window.scrollX + 'px';
                piece.style.top = event.touches[0].clientY - shiftY + window.scrollY + 'px';
            }

            const ontouchend = (event) =>
            {
                if (this.recruited) return;
                if (event.changedTouches.length > 1) return;
                event.stopPropagation();

                document.removeEventListener("touchmove", ontouchmove);

                if (this.dragging)
                {
                    this.dragging = false;

                    const side = (INDEX % 4 === 0 || INDEX % 4 === 3) ? side1st : side2nd;
                    const board = document.getElementById(side + "Board");
                    const boardRect = board.getBoundingClientRect();

                    if (event.changedTouches[0].clientX >= boardRect.left && event.changedTouches[0].clientX <= boardRect.right && event.changedTouches[0].clientY >= boardRect.top && event.changedTouches[0].clientY <= boardRect.bottom) // 在看板范围内
                    {
                        this.recruit();
                    }
                    else
                    {
                        const cell = document.getElementById("unpickedCell" + this.index);
                        cell.appendChild(this.piece);
                        const name = document.getElementById("unpickedName" + this.index);
                        name.innerHTML = this.name;
                    }
                }

                piece.style.width = "10vmin";
                piece.style.height = "10vmin";
            }

            document.addEventListener("touchmove", ontouchmove, { passive: false });

            piece.addEventListener("touchend", ontouchend, { once: true });
        }, { passive: false });

        addContextMenu(piece, this);

        return piece;
    }

    recruit()
    {
        const side = (INDEX % 4 === 0 || INDEX % 4 === 3) ? side1st : side2nd;
        this._recruited_by(side);
    }

    _recruited_by(side)
    {
        const old_name = document.getElementById("unpickedName" + this.index);
        old_name.innerHTML = "";

        this.recruited = true;
        this.piece.classList.add(side + "-piece");
        const cell = document.getElementById("cell" + INDEX);
        cell.appendChild(this.piece);
        const name = document.getElementById("name" + INDEX);
        name.innerHTML = this.name;

        saveState();
        INDEX++;
        highlightVacancy();
    }

    get context_menu_items()
    {
        const items = {
            "查看技能": () => { showSkillPanel(this); }
        };

        if (!this.recruited)
        {
            items["更换武将"] = () =>
            {
                const heroNames_existed = Array.from(document.getElementsByClassName("piece"), piece => piece.candidate.name);
                showHeroTable(heroNames_existed,
                    (name) =>
                    {
                        const index = this.index;
                        const cell = document.getElementById("unpickedCell" + index);
                        cell.innerHTML = "";

                        const new_candidate = create_candidate(name, index);
                    }
                );
            };
            items["选择"] = () => { this.recruit(); };
        }

        return items;
    }
}

// 工厂函数
function create_candidate(name, index)
{
    return new Candidate(name, index);
}

function createHeroBoard(number = 16)
{
    const heroBoard = document.getElementById('heroBoard');

    for (let i = 0; i < number; i++)
    {
        const candidate = document.createElement('div');
        candidate.classList.add("candidate");
        candidate.id = 'unpickedCandidate' + i;

        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = 'unpickedCell' + i;

        const nameTag = document.createElement('label');
        nameTag.classList.add('hero-name');
        nameTag.id = 'unpickedName' + i;

        candidate.appendChild(cell);
        candidate.appendChild(nameTag);
        heroBoard.appendChild(candidate);
    }

    // side1st = window.confirm("红方是否先选？") ? "red" : "blue";
    // side2nd = side1st === "red" ? "blue" : "red";

    const board1st = document.getElementById(side1st + 'Board');
    const board2nd = document.getElementById(side2nd + 'Board');

    for (let i = 0; i < number; i++)
    {
        const board = (i % 4 === 0 || i % 4 === 3) ? board1st : board2nd;

        const vacancy = document.createElement('div');
        vacancy.classList.add("candidate");
        vacancy.id = "candidate" + i;

        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = 'cell' + i;

        const nameTag = document.createElement('label');
        nameTag.classList.add('hero-name');
        nameTag.id = 'name' + i;

        vacancy.appendChild(cell);
        vacancy.appendChild(nameTag);
        board.appendChild(vacancy);
    }
}

function initializeCandidates(number = 16)
{
    const HERO_DATAList = Object.keys(HERO_DATA);
    var initHeroes = [];
    for (let i = 0; i < number; i++)
    {
        var index = Math.floor(Math.random() * (HERO_DATAList.length - i));
        initHeroes.push(HERO_DATAList[index]);
        HERO_DATAList[index] = HERO_DATAList[HERO_DATAList.length - 1 - i];
    }
    for (let i = 0; i < number; i++)
    {
        const candidate = create_candidate(initHeroes[i], i);
    }
}

function highlightVacancy(index = INDEX)
{
    if (index < 16)
    {
        const side = (index % 4 === 0 || index % 4 === 3) ? side1st : side2nd;

        for (let i = 0; i < 16; i++)
        {
            const vacancy = document.getElementById("candidate" + i);
            if (i === (index - (index % 2 === 0 ? 1 : 0)) || i === (index - (index % 2 === 0 ? 1 : 0) + 1))
            {
                vacancy.classList.add("waiting-" + side);
            }
            else
            {
                vacancy.classList.remove("waiting-red");
                vacancy.classList.remove("waiting-blue");
            }
        }
    }
    else
    {
        for (let i = 0; i < 16; i++)
        {
            const candidate = document.getElementById("candidate" + i);
            candidate.classList.remove("waiting-red");
            candidate.classList.remove("waiting-blue");
        }
    }

}

class History
{
    constructor()
    {
        this.history = []; // 用于保存状态历史记录的数组
        this.currentIndex = -1; // 当前状态的索引
    }

    // 更新状态
    updateHistory(newState)
    {
        // 截断历史记录，删除当前状态之后的记录
        this.history = this.history.slice(0, this.currentIndex + 1);
        // 添加新状态到历史记录
        this.history.push(newState);
        this.currentIndex++;
    }

    // 撤销操作
    undo()
    {
        if (this.currentIndex > 0 && INDEX > 0)
        {
            this.currentIndex--;
            INDEX--;

            const historyTooltip = document.getElementById("history-tooltip");
            const icon = historyTooltip.querySelector("i");
            const label = historyTooltip.querySelector("label");
            label.style.display = "block";

            var number = parseInt(label.textContent.slice(2, -1));
            if (historyTooltip.style.visibility === "visible" && historyTooltip.style.opacity === "1" && icon.className === "fas fa-rotate-left" && !isNaN(number))
            {
                number++;
                label.textContent = `后退${number}步`;
            }
            else
            {
                icon.className = "fas fa-rotate-left";
                label.textContent = "后退1步";
            }

            historyTooltip.style.visibility = "visible";
            historyTooltip.style.opacity = "1";
            historyTooltip.style.top = "50%";
            historyTooltip.style.webkitTransform = "translate(-50%, -50%)";
            historyTooltip.style.transform = "translate(-50%, -50%)";

            clearTimeout(this.tooltipTimeoutId);

            this.tooltipTimeoutId = setTimeout(() =>
            {
                label.style.display = "none";
                label.textContent = "";
                historyTooltip.style.visibility = "hidden";
                historyTooltip.style.opacity = "0";
            }, 2000);

            return this.history[this.currentIndex];
        }
        return null; // 没有可以撤销的状态
    }

    // 重做操作
    redo()
    {
        if (this.currentIndex < this.history.length - 1 && INDEX < 16)
        {
            this.currentIndex++;
            INDEX++;

            const historyTooltip = document.getElementById("history-tooltip");
            const icon = historyTooltip.querySelector("i");
            const label = historyTooltip.querySelector("label");
            label.style.display = "block";

            var number = parseInt(label.textContent.slice(2, -1));
            if (historyTooltip.style.visibility === "visible" && historyTooltip.style.opacity === "1" && icon.className === "fas fa-rotate-right" && !isNaN(number))
            {
                number++;
                label.textContent = `重做${number}步`;
            }
            else
            {
                icon.className = "fas fa-rotate-right";
                label.textContent = "重做1步";
            }

            historyTooltip.style.visibility = "visible";
            historyTooltip.style.opacity = "1";
            historyTooltip.style.top = "50%";
            historyTooltip.style.webkitTransform = "translate(-50%, -50%)";
            historyTooltip.style.transform = "translate(-50%, -50%)";

            clearTimeout(this.tooltipTimeoutId);

            this.tooltipTimeoutId = setTimeout(() =>
            {
                label.style.display = "none";
                label.textContent = "";
                historyTooltip.style.visibility = "hidden";
                historyTooltip.style.opacity = "0";
            }, 2000);

            return this.history[this.currentIndex];
        }
        return null; // 没有可以重做的状态
    }

    // 获取当前状态
    getCurrentState()
    {
        return this.history[this.currentIndex];
    }
}

function saveState()
{
    const state = {};
    const pieces = document.getElementsByClassName("piece");
    for (const piece of pieces)
    {
        state[piece.id] = piece.parentElement.id;
    }
    history.updateHistory(state);
}

function recoverState(state)
{
    const pieces = document.getElementsByClassName("piece");
    for (const piece of pieces)
    {
        const cell = document.getElementById(state[piece.id]);
        if (cell != piece.parentElement)
        {
            const oldNameTag = piece.parentElement.parentElement.lastChild;
            oldNameTag.innerHTML = "";
            const nameTag = cell.parentElement.lastChild;
            nameTag.innerHTML = piece.name;

            cell.appendChild(piece);

            if (piece.picked === true)
            {
                piece.classList.remove("red-piece");
                piece.classList.remove("blue-piece");
                piece.picked = false;
            }
            else
            {
                piece.picked = true;

                piece.classList.add(cell.parentElement.parentElement.id.slice(0, -5) + "-piece");

            }
        }
    }
    highlightVacancy();
}

function initializeHistory()
{
    const heroBoard = document.getElementById("heroBoard");
    heroBoard.addEventListener("wheel", function (event)
    {
        if (event.cancelable) event.preventDefault();
        if (event.deltaY < 0)
        {
            const previousState = history.undo();
            if (previousState)
            {
                recoverState(previousState);
            }
        } else if (event.deltaY > 0)
        {
            const nextState = history.redo();
            if (nextState)
            {
                recoverState(nextState);
            }
        }
    }, { passive: false });

    document.addEventListener("keydown", function (event)
    {
        if (event.key === 'ArrowUp')
        {
            if (event.cancelable) event.preventDefault();
            const previousState = history.undo();
            if (previousState)
            {
                recoverState(previousState);
            }
        }
        else if (event.key === 'ArrowDown')
        {
            if (event.cancelable) event.preventDefault();
            const nextState = history.redo();
            if (nextState)
            {
                recoverState(nextState);
            }
        }
        else if (event.key === 'z' && event.ctrlKey)
        {
            if (event.cancelable) event.preventDefault();
            const previousState = history.undo();
            if (previousState)
            {
                recoverState(previousState);
            }
        }
        else if (event.key === 'y' && event.ctrlKey)
        {
            if (event.cancelable) event.preventDefault();
            const nextState = history.redo();
            if (nextState)
            {
                recoverState(nextState);
            }
        }
    });

    document.addEventListener("touchstart", function (event)
    {
        if (event.touches.length > 1) return;

        var edge = null;

        const historyTooltip = document.getElementById("history-tooltip");
        const icon = historyTooltip.querySelector("i");
        const label = historyTooltip.querySelector("label");

        if (window.scrollY <= 0)
        {
            edge = "top";
        }
        else if (window.scrollY + window.innerHeight >= document.body.scrollHeight)
        {
            edge = "bottom";
        }
        else
        {
            return;
        }

        historyTooltip.style.visibility = "visible";
        historyTooltip.style.opacity = "1";

        if (edge === "top")
        {
            historyTooltip.style.top = "0";
            historyTooltip.style.webkitTransform = "translate(-50%, -100%)";
            historyTooltip.style.transform = "translate(-50%, -100%)";
            icon.className = "fas fa-rotate-left";
            label.textContent = "后退0步";
        }
        else if (edge === "bottom")
        {
            historyTooltip.style.top = `${document.body.scrollHeight}px`;
            historyTooltip.style.webkitTransform = "translate(-50%, 100%)";
            historyTooltip.style.transform = "translate(-50%, 100%)";
            icon.className = "fas fa-rotate-right";
            label.textContent = "重做0步";
        }

        const startIndex = history.currentIndex;
        const startINDEX = INDEX;
        const startY = event.touches[0].clientY;
        const threshold = 100;

        var direction = null;

        function ontouchscroll(event)
        {
            var deltaY = (event.touches[0].clientY - startY);

            if (direction === null)
            {
                // 纵向滑动已经到顶
                if (edge === "top" && deltaY > 0)
                {
                    direction = "pull-down";
                }
                // 纵向滑动已经到底
                else if (edge === "bottom" && deltaY < 0)
                {
                    direction = "pull-up";
                }
                else
                {
                    return;
                }
            }

            if (event.cancelable) event.preventDefault();

            // 纵向滑动已经到顶
            if (direction === "pull-down" && deltaY > 0)
            {
                var deltaIndex = parseInt(deltaY / threshold);
                if (startIndex - deltaIndex >= 0 && startINDEX - deltaIndex >= 0)
                {
                    const state = history.history[startIndex - deltaIndex];
                    history.currentIndex = startIndex - deltaIndex;
                    INDEX = startINDEX - deltaIndex;
                    if (state)
                    {
                        recoverState(state);
                    }

                    label.textContent = `后退${deltaIndex}步`;
                    label.style.display = (deltaIndex != 0) ? "block" : "none";
                }
                historyTooltip.style.top = `${30 * deltaY / window.innerHeight}vh`;
            }
            // 纵向滑动已经到底
            else if (direction === "pull-up" && deltaY < 0)
            {
                var deltaIndex = parseInt(- deltaY / threshold);
                if (startIndex + deltaIndex < history.history.length && startINDEX + deltaIndex < 16)
                {
                    const state = history.history[startIndex + deltaIndex];
                    history.currentIndex = startIndex + deltaIndex;
                    INDEX = startINDEX + deltaIndex;
                    if (state)
                    {
                        recoverState(state);
                    }
                    label.textContent = `重做${deltaIndex}步`;
                    label.style.display = (deltaIndex != 0) ? "block" : "none";
                }
                historyTooltip.style.top = `${document.body.scrollHeight * (1 + 0.3 * deltaY / window.innerHeight)}px`;
            }
        }

        function ontouchscrollend(event)
        {
            historyTooltip.style.visibility = "hidden";
            historyTooltip.style.opacity = "0";
            document.removeEventListener("touchmove", ontouchscroll);
            document.removeEventListener("touchend", ontouchscrollend);
        }

        document.addEventListener("touchmove", ontouchscroll, { passive: false });

        document.addEventListener("touchend", ontouchscrollend);
    }, { passive: false });
}

const history = new History();



// 初始化BP
function initializeBP()
{
    document.addEventListener("contextmenu", event => { event.preventDefault(); event.stopPropagation(); }); // 禁用右键菜单

    createHeroTable();
    // initializeHistory();

    createHeroBoard();
    initializeCandidates();
    highlightVacancy(0);

    // saveState();
}

document.body.onload = () => { initializeBP(); }