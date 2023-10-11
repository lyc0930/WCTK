import { heroes } from '../modules/data.mjs';

var pick1st = "red";
var pick2nd = pick1st == "red" ? "blue" : "red";
var nextIndex = -1;

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

    // pick1st = window.confirm("红方是否先选？") ? "red" : "blue";
    // pick2nd = pick1st == "red" ? "blue" : "red";

    const board1st = document.getElementById(pick1st + 'Board');
    const board2nd = document.getElementById(pick2nd + 'Board');

    for (let i = 0; i < number; i++)
    {
        const pick = (i % 4 == 0 || i % 4 == 3) ?  pick1st :  pick2nd;
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

function createHeroCandidate(name, index)
{
    const piece = document.createElement("div");
    const avatar = document.createElement("img");
    avatar.src = "./assets/Avatar/active/" + heroes[name][0] + ".png";
    avatar.draggable = false;
    avatar.className = "avatar";
    piece.appendChild(avatar);

    // const partnerNames = ["乐进&李典", "关兴&张苞", "张昭&张纮", "颜良&文丑"];

    // if (partnerNames.includes(name))
    // {

    // }

    piece.className = "piece";

    piece.title = name;
    piece.name = name;

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
                draggingPiece.old_parent = cell;

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

                const candidate = draggingPiece.old_parent.parentElement;

                if (candidate.id.slice(0, 6) == "unpick")
                {
                    const pick = (nextIndex % 4 == 0 || nextIndex % 4 == 3) ? pick1st : pick2nd;
                    const cell = document.getElementById("cell" + nextIndex);
                    const name = document.getElementById("name" + nextIndex);
                    const board = document.getElementById(pick + "Board");
                    const boardRect = board.getBoundingClientRect();

                    if (event.clientX >= boardRect.left && event.clientX <= boardRect.right && event.clientY >= boardRect.top && event.clientY <= boardRect.bottom) // 在看板范围内
                    {
                        cell.appendChild(draggingPiece);
                        draggingPiece.classList.add(pick + "-piece");
                        name.innerHTML = draggingPiece.name;
                        updateNextCandidate();
                    }
                    else
                    {
                        const cell = draggingPiece.old_parent;
                        cell.appendChild(draggingPiece);
                        const nameTag = document.getElementById("unpickedName" + cell.id.slice(12));
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
                draggingPiece.old_parent = cell;

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

                const candidate = draggingPiece.old_parent.parentElement;

                if (candidate.id.slice(0, 6) == "unpick")
                {
                    const pick = (nextIndex % 4 == 0 || nextIndex % 4 == 3) ? pick1st : pick2nd;
                    const cell = document.getElementById("cell" + nextIndex);
                    const name = document.getElementById("name" + nextIndex);
                    const board = document.getElementById(pick + "Board");
                    const boardRect = board.getBoundingClientRect();

                    if (event.changedTouches[0].clientX >= boardRect.left && event.changedTouches[0].clientX <= boardRect.right && event.changedTouches[0].clientY >= boardRect.top && event.changedTouches[0].clientY <= boardRect.bottom) // 在看板范围内
                    {
                        cell.appendChild(draggingPiece);
                        draggingPiece.classList.add(pick + "-piece");
                        name.innerHTML = draggingPiece.name;
                        updateNextCandidate();
                    }
                    else
                    {
                        const cell = draggingPiece.old_parent;
                        cell.appendChild(draggingPiece);
                        const nameTag = document.getElementById("unpickedName" + cell.id.slice(12));
                        nameTag.innerHTML = draggingPiece.name;
                    }
                }
                draggingPiece = null;
            }
        });
    });



}

function initializeHeroCandidates(number = 16)
{
    const heroesList = Object.keys(heroes);
    var initHeroes = [];
    for (var i = 0; i < number; i++)
    {
        var index = Math.floor(Math.random() * (heroesList.length - i));
        initHeroes.push(heroesList[index]);
        heroesList[index] = heroesList[heroesList.length - 1 - i];
    }
    for (var i = 0; i < number; i++)
    {
        createHeroCandidate(initHeroes[i], i);
    }
}

function updateNextCandidate()
{
    nextIndex++;

    const pick = (nextIndex % 4 == 0 || nextIndex % 4 == 3) ? pick1st : pick2nd;

    // const board = document.getElementById(pick + "Board");
    // board.style.backgroundColor = (pick == "red") ? "rgb(255, 0, 0, 0.3)" : "rgb(0, 0, 255, 0.3)";

    // const otherBoard = document.getElementById((pick == "red") ? "blueBoard" : "redBoard");
    // otherBoard.style.backgroundColor = (pick == "red") ? "rgb(0, 0, 255, 0.3)" : "rgb(255, 0, 0, 0.3)";

    if (nextIndex == 0 || nextIndex == 16)
    {
        const nextCandidate = document.getElementById("candidate" + nextIndex);
        nextCandidate.style.border = "3px solid " + ((pick == "red") ? "rgb(255, 0, 0, 0.3)" : "rgb(0, 0, 255, 0.3)");
    }
    else
    {
        const index1 = nextIndex - (nextIndex % 2 == 0 ? 1 : 0);
        const index2 = index1 + 1;
        const nextCandidate1 = document.getElementById("candidate" + index1);
        const nextCandidate2 = document.getElementById("candidate" + index2);
        nextCandidate1.style.border = "3px solid " + ((pick == "red") ? "rgb(255, 0, 0, 0.3)" : "rgb(0, 0, 255, 0.3)");
        nextCandidate2.style.border = "3px solid " + ((pick == "red") ? "rgb(255, 0, 0, 0.3)" : "rgb(0, 0, 255, 0.3)");

        if (nextIndex == 1)
        {
            const candidate = document.getElementById("candidate0");
            candidate.style.border = "none";
        }
        else if (nextIndex % 2 == 1)
        {
            const candidate1 = document.getElementById("candidate" + (nextIndex - 2));
            const candidate2 = document.getElementById("candidate" + (nextIndex - 1));
            candidate1.style.border = "none";
            candidate2.style.border = "none";
        }
    }
}

createHeroBoard();
initializeHeroCandidates();
updateNextCandidate();