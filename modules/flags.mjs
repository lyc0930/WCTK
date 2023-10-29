const redFlag = document.createElement("img");

const blueFlag = document.createElement("img");

function generateFlags()
{
    redFlag.inert = "true";
    redFlag.title = "红方帅旗";
    redFlag.className = "flag";
    redFlag.src = "./assets/Flag/red.png";
    redFlag.draggable = "false";

    const redBase = document.getElementsByClassName("Red base")[0];
    redBase.appendChild(redFlag);

    blueFlag.inert = "true";
    blueFlag.title = "蓝方帅旗";
    blueFlag.className = "flag";
    blueFlag.src = "./assets/Flag/blue.png";
    blueFlag.draggable = "false";

    const blueBase = document.getElementsByClassName("Blue base")[0];
    blueBase.appendChild(blueFlag);
}


export { redFlag, blueFlag, generateFlags};