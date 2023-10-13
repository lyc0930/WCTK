import { HERO_DATA } from '../modules/data.mjs';
import { addContextMenu, removeContextMenu, addSkillPanel } from '../modules/context-menu.mjs';

var side1st = "red";
var side2nd = side1st == "red" ? "blue" : "red";
var INDEX = 0;

function createHeroBoard(number = 16)
{
    const heroBoard = document.getElementById('heroBoard');

    for (let i = 0; i < number; i++)
    {
        const candidate = document.createElement('div');
        candidate.classList.add('candidate');
        candidate.id = 'unpickedCandidate' + i;

        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = 'unpickedCell' + i;

        const nameTag = document.createElement('label');
        nameTag.classList.add('name');
        nameTag.id = 'unpickedName' + i;

        candidate.appendChild(cell);
        candidate.appendChild(nameTag);
        heroBoard.appendChild(candidate);
    }

    // side1st = window.confirm("红方是否先选？") ? "red" : "blue";
    // side2nd = side1st == "red" ? "blue" : "red";

    const board1st = document.getElementById(side1st + 'Board');
    const board2nd = document.getElementById(side2nd + 'Board');

    for (let i = 0; i < number; i++)
    {
        const board = (i % 4 == 0 || i % 4 == 3) ? board1st : board2nd;

        const candidate = document.createElement('div');
        candidate.classList.add('candidate');
        candidate.id = 'candidate' + i;

        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = 'cell' + i;

        const nameTag = document.createElement('label');
        nameTag.classList.add('name');
        nameTag.id = 'name' + i;

        candidate.appendChild(cell);
        candidate.appendChild(nameTag);
        board.appendChild(candidate);
    }
}

function pick(piece)
{
    const oldNameTag = piece.parentElement.parentElement.lastChild;
    oldNameTag.innerHTML = "";

    const side = (INDEX % 4 == 0 || INDEX % 4 == 3) ? side1st : side2nd;
    const cell = document.getElementById("cell" + INDEX);
    const name = document.getElementById("name" + INDEX);

    removeContextMenu(piece);

    cell.appendChild(piece);
    piece.classList.add(side + "-piece");
    name.innerHTML = piece.name;
    saveBPState();
    INDEX++;
    highlightCandidate();
}

function createHeroCandidate(name, index)
{
    const piece = document.createElement("div");
    const avatar = document.createElement("img");
    avatar.src = "./assets/Avatar/active/" + HERO_DATA[name]["拼音"] + ".png";
    avatar.draggable = false;
    avatar.className = "avatar";
    piece.appendChild(avatar);

    // const partnerNames = ["乐进&李典", "关兴&张苞", "张昭&张纮", "颜良&文丑"];

    // if (partnerNames.includes(name))
    // {

    // }

    piece.className = "piece";

    piece.name = name;
    piece.id = "hero" + index;

    const cell = document.getElementById("unpickedCell" + index);
    const nameTag = document.getElementById("unpickedName" + index);
    nameTag.innerHTML = name;
    cell.appendChild(piece);

    piece.addEventListener("mouseenter", function (event)
    {
        piece.style.width = "12dvmin";
        piece.style.height = "12dvmin";
    });
    piece.addEventListener("mouseleave", function (event)
    {
        piece.style.width = "10dvmin";
        piece.style.height = "10dvmin";
    });

    piece.addEventListener("mousedown", function (event)
    {
        const rect = piece.getBoundingClientRect();

        const shiftX = event.clientX - (rect.left + 0.5 * rect.width);
        const shiftY = event.clientY - (rect.top + 0.5 * rect.height);

        var draggingPiece = null;

        function onMouseDragPiece(event)
        {
            if (draggingPiece === null)
            {
                const cell = piece.parentElement;
                const candidate = cell.parentElement;

                if (candidate.id.slice(0, 6) != "unpick")
                {
                    return;
                }

                const nameTag = document.getElementById("unpickedName" + index);
                nameTag.innerHTML = "";

                draggingPiece = piece;

                draggingPiece.style.transition = "width 100ms ease-out, height 100ms ease-out";
                document.body.append(piece);
            }

            event.preventDefault();
            event.stopPropagation();

            draggingPiece.style.left = event.clientX - shiftX + window.scrollX + 'px';
            draggingPiece.style.top = event.clientY - shiftY + window.scrollY + 'px';

        }

        document.addEventListener('mousemove', onMouseDragPiece);

        piece.addEventListener('mouseup', function (event)
        {
            document.removeEventListener('mousemove', onMouseDragPiece);

            if (draggingPiece != null)
            {
                event.preventDefault();
                event.stopPropagation();

                draggingPiece.onmouseup = null;
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPiece.style.width = "10dvmin";
                draggingPiece.style.height = "10dvmin";
                draggingPiece.style.transition = "width 100ms ease-out, height 100ms ease-out, left 70ms ease-out, top 70ms ease-out";

                const candidate = document.getElementById("unpickedCandidate" + index);

                if (candidate.id.slice(0, 6) == "unpick")
                {
                    const side = (INDEX % 4 == 0 || INDEX % 4 == 3) ? side1st : side2nd;
                    const board = document.getElementById(side + "Board");
                    const boardRect = board.getBoundingClientRect();

                    if (event.clientX >= boardRect.left && event.clientX <= boardRect.right && event.clientY >= boardRect.top && event.clientY <= boardRect.bottom) // 在看板范围内
                    {
                        pick(draggingPiece);
                    }
                    else
                    {
                        const index = draggingPiece.id.slice(4);
                        const oldCell = document.getElementById("unpickedCell" + index);
                        oldCell.appendChild(draggingPiece);
                        const nameTag = document.getElementById("unpickedName" + oldCell.id.slice(12));
                        nameTag.innerHTML = draggingPiece.name;
                    }
                }
                draggingPiece = null;
            }
        });
    });

    piece.addEventListener("touchstart", function (event)
    {
        if (event.touches.length > 1)
        {
            return;
        }
        event.stopPropagation();

        piece.style.width = "12dvmin";
        piece.style.height = "12dvmin";

        const rect = piece.getBoundingClientRect();

        const shiftX = event.touches[0].clientX - (rect.left + 0.5 * rect.width);
        const shiftY = event.touches[0].clientY - (rect.top + 0.5 * rect.height);

        var draggingPiece = null;

        function onTouchDragPiece(event)
        {
            event.preventDefault();
            if (event.touches.length > 1)
            {
                return;
            }

            if (draggingPiece === null)
            {
                const cell = piece.parentElement;
                const candidate = cell.parentElement;

                if (candidate.id.slice(0, 6) != "unpick")
                {
                    return;
                }

                const nameTag = document.getElementById("unpickedName" + index);
                nameTag.innerHTML = "";

                draggingPiece = piece;

                document.body.append(piece);
            }

            draggingPiece.style.left = event.touches[0].clientX - shiftX + window.scrollX + 'px';
            draggingPiece.style.top = event.touches[0].clientY - shiftY + window.scrollY + 'px';

        }

        piece.addEventListener('touchmove', onTouchDragPiece);

        piece.addEventListener('touchend', function (event)
        {
            if (event.changedTouches.length > 1)
            {
                return;
            }

            piece.style.width = "10dvmin";
            piece.style.height = "10dvmin";

            piece.removeEventListener('touchmove', onTouchDragPiece);

            if (draggingPiece != null)
            {
                event.stopPropagation();

                draggingPiece.ontouchend = null;
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPiece.style.width = "10dvmin";
                draggingPiece.style.height = "10dvmin";

                const candidate = document.getElementById("unpickedCandidate" + index);

                if (candidate.id.slice(0, 6) == "unpick")
                {
                    const side = (INDEX % 4 == 0 || INDEX % 4 == 3) ? side1st : side2nd;
                    const board = document.getElementById(side + "Board");
                    const boardRect = board.getBoundingClientRect();

                    if (event.changedTouches[0].clientX >= boardRect.left && event.changedTouches[0].clientX <= boardRect.right && event.changedTouches[0].clientY >= boardRect.top && event.changedTouches[0].clientY <= boardRect.bottom) // 在看板范围内
                    {
                        pick(draggingPiece);
                    }
                    else
                    {
                        const index = draggingPiece.id.slice(4);
                        const cell = document.getElementById("unpickedCell" + index);
                        cell.appendChild(draggingPiece);
                        const nameTag = document.getElementById("unpickedName" + cell.id.slice(12));
                        nameTag.innerHTML = draggingPiece.name;
                    }
                }
                draggingPiece = null;
            }
        });
    });

    piece.addEventListener("click", function (event)
    {
        pick(piece);
        piece.style.width = "10dvmin";
        piece.style.height = "10dvmin";
    });

    addContextMenu(piece, {
        "更换武将": function () { console.log("test"); }, // TODO
        "选择": function () { pick(piece); }
    });

    addSkillPanel(piece);

}

function initializeHeroCandidates(number = 16)
{
    const HERO_DATAList = Object.keys(HERO_DATA);
    var initHeroes = [];
    for (var i = 0; i < number; i++)
    {
        var index = Math.floor(Math.random() * (HERO_DATAList.length - i));
        initHeroes.push(HERO_DATAList[index]);
        HERO_DATAList[index] = HERO_DATAList[HERO_DATAList.length - 1 - i];
    }
    for (var i = 0; i < number; i++)
    {
        createHeroCandidate(initHeroes[i], i);
    }
}

function highlightCandidate(index = INDEX)
{
    if (index < 16)
    {
        const side = (index % 4 == 0 || index % 4 == 3) ? side1st : side2nd;

        for (let i = 0; i < 16; i++)
        {
            const candidate = document.getElementById("candidate" + i);
            if (i == (index - (index % 2 == 0 ? 1 : 0)) || i == (index - (index % 2 == 0 ? 1 : 0) + 1))
            {
                candidate.style.border = "3px solid " + ((side == "red") ? "rgb(255, 0, 0, 0.3)" : "rgb(0, 0, 255, 0.3)");
            }
            else
            {
                candidate.style.border = "none";
            }
        }
    }
    else
    {
        for (let i = 0; i < 16; i++)
        {
            const candidate = document.getElementById("candidate" + i);
            candidate.style.border = "none";
        }
    }

}

class BPHistory
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

function saveBPState()
{
    const state = {};
    const pieces = document.getElementsByClassName("piece");
    for (const piece of pieces)
    {
        state[piece.id] = piece.parentElement.id;
    }
    history.updateHistory(state);
}

function recoverBPStatefrom(state)
{
    const pieces = document.getElementsByClassName("piece");
    for (const piece of pieces)
    {
        const oldNameTag = piece.parentElement.parentElement.lastChild;
        oldNameTag.innerHTML = "";
        const cell = document.getElementById(state[piece.id]);
        cell.appendChild(piece);
        const nameTag = cell.parentElement.lastChild;
        nameTag.innerHTML = piece.name;
        if (cell.id.slice(0, 6) == "unpick")
        {
            piece.classList.remove("red-piece");
            piece.classList.remove("blue-piece");
        }
        else
        {
            piece.classList.add(cell.parentElement.parentElement.id.slice(0, -5) + "-piece");
        }
    }
    highlightCandidate();
}

function initializeHistory()
{
    document.addEventListener("wheel", function (event)
    {
        event.preventDefault();
        if (event.deltaY < 0)
        {
            const previousState = history.undo();
            if (previousState)
            {
                recoverBPStatefrom(previousState);
            }
        } else if (event.deltaY > 0)
        {
            const nextState = history.redo();
            if (nextState)
            {
                recoverBPStatefrom(nextState);
            }
        }
    }, { passive: false });

    document.addEventListener("keydown", function (event)
    {
        if (event.key == 'ArrowUp')
        {
            event.preventDefault();
            const previousState = history.undo();
            if (previousState)
            {
                recoverBPStatefrom(previousState);
            }
        }
        else if (event.key == 'ArrowDown')
        {
            event.preventDefault();
            const nextState = history.redo();
            if (nextState)
            {
                recoverBPStatefrom(nextState);
            }
        }
        else if (event.key == 'z' && event.ctrlKey)
        {
            event.preventDefault();
            const previousState = history.undo();
            if (previousState)
            {
                recoverBPStatefrom(previousState);
            }
        }
        else if (event.key == 'y' && event.ctrlKey)
        {
            event.preventDefault();
            const nextState = history.redo();
            if (nextState)
            {
                recoverBPStatefrom(nextState);
            }
        }
    });
}

const history = new BPHistory();
initializeHistory();
createHeroBoard();
initializeHeroCandidates();
highlightCandidate(0);
saveBPState();