import { Pieces } from "../script.js";
import { baseOf, enemyBaseOf, piecesIn } from "./utils.mjs";

const redFlag = document.createElement("img");
var redCarrier = null;

const blueFlag = document.createElement("img");
var blueCarrier = null;

function generateFlags()
{
    redFlag.inert = "true";
    redFlag.title = "红方帅旗";
    redFlag.className = "flag";
    redFlag.src = "./assets/Flag/red.png";

    blueFlag.inert = "true";
    blueFlag.title = "蓝方帅旗";
    blueFlag.className = "flag";
    blueFlag.src = "./assets/Flag/blue.png";
}

function setCarrier(faction, piece, log = true)
{
    if (faction === "Red")
    {
        setRedCarrier(piece, log);
    }
    else if (faction === "Blue")
    {
        setBlueCarrier(piece, log);
    }
    else
    {
        throw new Error("Invalid faction");
    }
}

function setRedCarrier(piece, log = true)
{
    if (piece === redCarrier)
    {
        return;
    }
    if (piece)
    {
        if (redCarrier)
        {
            redCarrier.parentElement.appendChild(redFlag);
            const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(redCarrier) + 1));
            oldCheckbox.checked = false;
        }

        redCarrier = piece;
        redCarrier.appendChild(redFlag);
        piece.carrier = true;
        const checkBox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(piece) + 1));
        checkBox.checked = true;

        if (log)
        {
            console.log(`${piece.name}成为主帅`);
        }

        if (piece.parentElement === enemyBaseOf(piece)) // 在敌方大本营获得帅旗
        {
            var score = 5;
            const base = baseOf(piece);
            console.log(`${piece.name}送至帅旗, 红方+${score}分`);
            const alliesInBase = Array.from(piecesIn(base)).filter(piece => piece.classList.contains("red-piece"));
            if (alliesInBase.length === 1)
            {
                const allyPiece = alliesInBase[0];
                setCarrier("Red", allyPiece);
            }
            else // 大本营 没有己方棋子 或者 有多个己方棋子
            {
                setCarrier("Red", null);
                base.appendChild(redFlag);
            }
        }
    }
    else
    {
        if (redCarrier)
        {
            redCarrier.carrier = false;
            redCarrier.parentElement.appendChild(redFlag);
            const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(redCarrier) + 1));
            oldCheckbox.checked = false;
            if (log)
            {
                console.log(`${redCarrier.name}掉落帅旗`);
            }
            redCarrier = null;
        }
    }
}

function setBlueCarrier(piece, log = true)
{
    if (piece === blueCarrier)
    {
        return;
    }
    if (piece)
    {
        if (blueCarrier)
        {
            blueCarrier.parentElement.appendChild(blueFlag);
            const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(blueCarrier) + 1));
            oldCheckbox.checked = false;
        }

        blueCarrier = piece;
        blueCarrier.appendChild(blueFlag);
        piece.carrier = true;
        const checkBox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(piece) + 1));
        checkBox.checked = true;
        if (log)
        {
            console.log(`${piece.name}成为主帅`);
        }

        if (piece.parentElement === enemyBaseOf(piece)) // 在敌方大本营获得帅旗
        {
            var score = 5;
            const base = baseOf(piece);
            console.log(`${piece.name}送至帅旗, 蓝方+${score}分`);
            const alliesInBase = Array.from(piecesIn(base)).filter(piece => piece.classList.contains("blue-piece"));
            if (alliesInBase.length === 1)
            {
                const allyPiece = alliesInBase[0];
                setCarrier("Blue", allyPiece);
            }
            else // 大本营 没有己方棋子 或者 有多个己方棋子
            {
                setCarrier("Blue", null);
                base.appendChild(blueFlag);
            }
        }
    }
    else
    {
        if (blueCarrier)
        {
            blueCarrier.carrier = false;
            blueCarrier.parentElement.appendChild(blueFlag);
            const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(blueCarrier) + 1));
            oldCheckbox.checked = false;
            if (log)
            {
                console.log(`${blueCarrier.name}掉落帅旗`);
            }
            blueCarrier = null;
        }
    }
}

export { redFlag, blueFlag, redCarrier, blueCarrier, generateFlags, setCarrier };