// 地形
const terrain = [
    ["post", "plain", "grove", "ridge", "plain", "Bcamp", "Bbase"],
    ["plain", "plain", "grove", "lake", "grove", "plain", "Bcamp"],
    ["grove", "plain", "ridge", "plain", "plain", "tower", "plain"],
    ["plain", "ridge", "lake", "plain", "lake", "ridge", "plain"],
    ["plain", "tower", "plain", "plain", "ridge", "plain", "plain"],
    ["Rcamp", "plain", "grove", "lake", "grove", "plain", "plain"],
    ["Rbase", "Rcamp", "plain", "ridge", "plain", "grove", "post"]
];

const heroes = {
    // pinyin, MaxHP, HP, attackRange
    "曹操": ["caocao", 4, 4, 1],
    "司马懿": ["simayi", 3, 3, 1],
    "夏侯惇": ["xiahoudun", 4, 4, 1],
    "张辽": ["zhangliao", 4, 4, 1],
    "许褚": ["xuchu", 4, 4, 1],
    "郭嘉": ["guojia", 3, 3, 1],
    "甄姬": ["zhenji", 3, 3, 1],
    "曹纯": ["caochun", 4, 4, 1],
    "典韦": ["dianwei", 4, 4, 1],
    "刘备": ["liubei", 4, 4, 1],
    "关羽": ["guanyu", 4, 4, 1],
    "张飞": ["zhangfei", 4, 4, 1],
    "诸葛亮": ["zhugeliang", 3, 3, 1],
    "赵云": ["zhaoyun", 4, 4, 1],
    "马超": ["machao", 4, 4, 1],
    "黄月英": ["huangyueying", 3, 3, 1],
    "黄忠": ["huangzhong", 4, 4, 1],
    "孙乾": ["sunqian", 3, 3, 1],
    "孙权": ["sunquan", 4, 4, 1],
    "甘宁": ["ganning", 4, 4, 1],
    "吕蒙": ["lvmeng", 4, 4, 1],
    "黄盖": ["huanggai", 4, 4, 1],
    "周瑜": ["zhouyu", 3, 3, 1],
    "大乔": ["daqiao", 3, 3, 1],
    "陆逊": ["luxun", 3, 3, 1],
    "孙尚香": ["sunshangxiang", 3, 3, 1],
    "祖茂": ["zumao", 4, 4, 1],
    "华佗": ["huatuo", 3, 3, 1],
    "吕布": ["lvbu", 4, 4, 1],
    "貂蝉": ["diaochan", 3, 3, 1],
    "董卓": ["dongzhuo", 4, 4, 1],
    "张绣": ["zhangxiu", 4, 4, 1],
    "刘表": ["liubiao", 4, 4, 1],
    "曹仁": ["caoren", 4, 4, 1],
    "魏延": ["weiyan", 4, 4, 1],
    "祝融": ["zhurong", 4, 4, 1],
    "孙坚": ["sunjian", 4, 4, 1],
    "鲁肃": ["lusu", 3, 3, 1],
    "张角": ["zhangjiao", 3, 3, 1],
    "陈宫": ["chengong", 3, 3, 1],
    "邓艾": ["dengai", 4, 4, 1],
    "荀彧": ["xunyu", 3, 3, 1],
    "孟获": ["menghuo", 4, 4, 1],
    "法正": ["fazheng", 3, 3, 1],
    "孙策": ["sunce", 4, 4, 1],
    "贾诩": ["jiaxu", 3, 3, 1],
    "庞德": ["pangde", 4, 4, 1],
    "高顺": ["gaoshun", 4, 4, 1],
    "华雄": ["huaxiong", 4, 4, 1],
    "夏侯渊": ["xiahouyuan", 4, 4, 1],
    "姜维": ["jiangwei", 4, 4, 1],
    "小乔": ["xiaoqiao", 3, 3, 1],
    "乐进&李典": ["yuejin&lidian", 4, 4, 1],
    "关兴&张苞": ["guanxing&zhangbao", 4, 4, 1],
    "张昭&张纮": ["zhangzhao&zhanghong", 4, 4, 1],
    "颜良&文丑": ["yanliang&wenchou", 4, 4, 1],
    "程普": ["chengpu", 4, 4, 1],
    "张郃": ["zhanghe", 4, 4, 1],
    "徐晃": ["xuhuang", 4, 4, 1],
    "于禁": ["yujin", 4, 4, 1],
    "庞统": ["pangtong", 3, 3, 1],
    "太史慈": ["taishici", 4, 4, 1],
    "周泰": ["zhoutai", 4, 4, 1],
    "韩当": ["handang", 4, 4, 1],
    "程昱": ["chengyu", 3, 3, 1],
    "袁绍": ["yuanshao", 4, 4, 1],
    "刘协": ["liuxie", 3, 3, 1],
    "卑弥呼": ["beimihu", 3, 3, 1],
    "王异": ["wangyi", 3, 3, 1],
    "左慈": ["zuoci", 3, 3, 1],
}


const redFlag = document.createElement("img");
redFlag.inert = "true";
redFlag.title = "红方帅旗";
redFlag.className = "flag";
redFlag.src = "./assets/Flag/red.png";
var redCarrier = null;

const blueFlag = document.createElement("img");
blueFlag.inert = "true";
blueFlag.title = "蓝方帅旗";
blueFlag.className = "flag";
blueFlag.src = "./assets/Flag/blue.png";
var BlueCarrier = null;

const heroSelect = document.getElementById("heroSelect");
const carrierCheckbox = document.getElementById("carrierCheckbox");
const labelHP = document.getElementById("HP");
const labelMaxHP = document.getElementById("maxHP");
const labelRange = document.getElementById("range");


var jumpingPiece = null; // 正在转移的棋子

var movingPiece = null; // 正在移动的棋子

var selectedPiece = null; // 选中的棋子

var currentPlayer = null; // 当前回合玩家

// 棋子拖动事件
function dragStart(event)
{
    jumpingPiece = event.target.closest(".piece");

    var landableCells = [];
    for (const cell of document.getElementsByClassName("cell"))
    {
        if (isStayable(cell, this))
        {
            landableCells.push(cell);
        }
    }
    highlightCells(landableCells, "landable");
}

function dragEnd()
{
    jumpingPiece = null;
    removeHighlight("landable");
}

function dropPiece(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");
    jump(jumpingPiece, cell);
}

function dropPiece_onPiece(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");
    jump(jumpingPiece, cell);
}

function dropPiece_grave(event)
{
    event.preventDefault();
    const grave = event.target.closest(".grave");
    console.log(`${jumpingPiece.name}死亡`);
    if (jumpingPiece === redCarrier)
    {
        jumpingPiece.parentElement.appendChild(redFlag);
        console.log(`${jumpingPiece.name}掉落帅旗`);
        redCarrier = null;
    }
    else if (jumpingPiece === blueCarrier)
    {
        jumpingPiece.parentElement.appendChild(blueFlag);
        console.log(`${jumpingPiece.name}掉落帅旗`);
        blueCarrier = null;
    }
    grave.appendChild(jumpingPiece);
}



// 棋子点击事件
function clickPiece(event)
{
    event.preventDefault();

    var menu = document.getElementById('menu');
    var heroOption = document.getElementById(this.name)

    if (menu.style.display === 'none' || heroOption.selected === false)
    {
        selectedPiece = this;
        currentPlayer = this;

        // 显示菜单
        menu.style.display = 'block';
        // menu.style.left = event.clientX + 'px';
        // menu.style.top = event.clientY + 'px';
        heroOption.selected = true;
        carrierCheckbox.checked = this.carrier === true;
        activeCheckbox.checked = this.active === true;
        labelHP.textContent = this.hp;
        labelMaxHP.textContent = this.maxhp;
        labelRange.textContent = this.range;
    }
    else
    {
        if (document.getElementsByClassName("reachable").length <= 0 && document.getElementsByClassName("landable").length <= 0 && document.getElementsByClassName("targetable").length <= 0)
        {
            selectedPiece = null;
            currentPlayer = null;

            // 隐藏菜单
            menu.style.display = 'none';
        }

    }
}


function movePhase(piece)
{
    movingPiece = piece;
    removeHighlight("reachable", clickCell_movePhase);
    if (movingPiece && movingPiece.movePoints > 0)
    {
        const distance = distanceMapOf(movingPiece);

        var reachableCells = []
        for (const cell of document.getElementsByClassName("cell"))
        {
            const row = cell.row;
            const col = cell.col;
            if (distance[row][col] > 0 && distance[row][col] <= movingPiece.movePoints && isStayable(cell, movingPiece))
            {
                reachableCells.push(cell);
            }
        }
        highlightCells(reachableCells, "reachable", clickCell_movePhase);
        movingPiece.addEventListener("click", clickPiece_movePhase);
    }
    else
    {
        console.log("移动阶段结束");
        movingPiece.removeEventListener("click", clickPiece_movePhase)
        movingPiece = null;
    }
}

function clickPiece_movePhase(event)
{
    // End movePhase
    console.log("移动阶段结束");
    movingPiece.removeEventListener("click", clickPiece_movePhase);
    removeHighlight("reachable", clickCell_movePhase);
    movingPiece = null;
}

function clickCell_movePhase(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");

    if (movingPiece)
    {
        if (move(movingPiece, cell, true))
        {
            movePhase(movingPiece);
        }
    }
}

function moveSteps(piece, fixed = false)
{
    movingPiece = piece;
    if (fixed)
    {
        removeHighlight("reachable", clickCell_moveSteps_fixed);
    }
    else
    {
        removeHighlight("reachable", clickCell_moveSteps);
    }
    if (movingPiece && movingPiece.moveSteps > 0)
    {
        const distance = distanceMapOf(movingPiece);

        var reachableCells = []
        for (const cell of document.getElementsByClassName("cell"))
        {
            const row = cell.row;
            const col = cell.col;
            if (distance[row][col] > 0 && distance[row][col] <= movingPiece.moveSteps && isStayable(cell, movingPiece))
            {
                reachableCells.push(cell);
            }
        }
        if (fixed)
        {
            highlightCells(reachableCells, "reachable", clickCell_moveSteps_fixed);
        }
        else
        {
            highlightCells(reachableCells, "reachable", clickCell_moveSteps);
            movingPiece.addEventListener("click", clickPiece_moveSteps);
        }
    }
    else
    {
        movingPiece.removeEventListener("click", clickPiece_movePhase)
        movingPiece = null;
    }
}

function clickPiece_moveSteps(event)
{
    event.preventDefault();
    // End moveSteps
    movingPiece.removeEventListener("click", clickPiece_moveSteps);
    removeHighlight("reachable", clickCell_moveSteps);
    movingPiece = null;
}

function clickCell_moveSteps(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");

    if (movingPiece)
    {
        if (move(movingPiece, cell, false))
        {
            moveSteps(movingPiece);
        }
    }
}

function clickCell_moveSteps_fixed(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");

    if (movingPiece)
    {
        if (move(movingPiece, cell, false))
        {
            moveSteps(movingPiece, true);
        }
    }
}

function clickCell_jump(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");
    if (jumpingPiece)
    {
        if (jump(jumpingPiece, cell))
        {
            removeHighlight("landable", clickCell_jump);
            jumpingPiece = null;
        }
    }
}

function clickPiece_exchange(event)
{
    event.preventDefault();
    const piece = event.target.closest(".piece");
    if (jumpingPiece)
    {
        if (exchange(jumpingPiece, piece))
        {
            removeHighlight("targetable", clickPiece_exchange);
            jumpingPiece = null;
        }
    }
}

function clickPiece_control(event)
{
    event.preventDefault();
    const piece = event.target.closest(".piece");
    if (piece)
    {
        removeHighlight("targetable", clickPiece_control);
        piece.moveSteps = 1;
        moveSteps(piece, true);
    }

}


// 高亮显示可放置位置
function highlightCells(cells, className, listener = null)
{
    for (const cell of cells)
    {
        cell.classList.add(className);
        if (className === "reachable" || className === "landable" || className === "targetable")
        {
            cell.addEventListener("click", listener);
        }
    }
}

function highlightPieces(pieces, className, listener = null)
{
    for (const piece of pieces)
    {
        piece.parentElement.classList.add(className);
        if (className === "targetable")
        {
            piece.removeEventListener("click", clickPiece);
            piece.removeEventListener("mouseenter", onMouseEnterPiece);
            piece.removeEventListener("mouseleave", onMouseLeavePiece);
            piece.addEventListener("click", listener);
            piece.addEventListener("drop", dropPiece_onPiece);
        }
    }
}

// 移除可放置高亮显示
function removeHighlight(className, listener = null)
{
    for (const cell of document.getElementsByClassName("cell"))
    {
        cell.classList.remove(className);
        if (className === "reachable" || className === "landable")
        {
            cell.removeEventListener("click", listener);
        }
    }
    if (className === "targetable")
    {
        for (const piece of document.getElementsByClassName("piece"))
        {
            piece.removeEventListener("click", listener);
            piece.addEventListener("click", clickPiece);
            piece.addEventListener("mouseenter", onMouseEnterPiece);
            piece.addEventListener("mouseleave", onMouseLeavePiece);
        }
    }
}

// 计算移动距离
function distanceMapOf(piece)
{
    var distance = new Array(7)
    for (var i = 0; i < 7; i++)
    {
        distance[i] = new Array(7)
        for (var j = 0; j < 7; j++)
        {
            distance[i][j] = 50;
        }
    }

    var queue = [];
    queue.push(piece.parentElement);
    const startRow = piece.parentElement.row;
    const startCol = piece.parentElement.col;
    distance[startRow][startCol] = 0;

    while (queue.length)
    {
        const currentCell = queue.shift();
        const row = currentCell.row;
        const col = currentCell.col;
        for (const cell of adjacentCells(currentCell, piece))
        {
            const nextRow = cell.row;
            const nextCol = cell.col;
            if (distance[nextRow][nextCol] >= 50)
            {
                distance[nextRow][nextCol] = distance[row][col] + 1;
                queue.push(cell);
            }
        }
    }

    for (const cell of document.getElementsByClassName("cell"))
    {
        const row = cell.row;
        const col = cell.col;
        if (!isStayable(cell, piece))
        {
            distance[row][col] = 50;
        }
    }

    // distance[startRow][startCol] = 2; // 从原地移动的距离为2

    return distance;
}

//移动
function move(piece, cell, ifConsumeMovePoints = false)
{
    const row = cell.row;
    const col = cell.col;
    const distance = distanceMapOf(piece);

    if (piece && cell.classList.contains("reachable", clickCell_movePhase) && (distance[row][col] > 0) && isStayable(cell, piece))
    {

        var steps = distance[row][col];

        if (ifConsumeMovePoints)
        {
            if (piece.movePoints >= distance[row][col])
            {
                piece.movePoints = piece.movePoints - distance[row][col];
            }
            else
            {
                return false;
            }
        }
        else
        {
            if (piece.moveSteps >= distance[row][col])
            {
                piece.moveSteps = piece.moveSteps - distance[row][col];
            }
            else
            {
                return false;
            }
        }

        // 步进
        var moveLink = [cell];
        var currentCell = cell;
        for (var i = 0; i < steps; i++)
        {
            const currRow = currentCell.row;
            const currCol = currentCell.col;
            for (const adjacentCell of adjacentCells(currentCell, piece))
            {
                const prevRow = adjacentCell.row;
                const prevCol = adjacentCell.col;
                if (distance[prevRow][prevCol] === distance[currRow][currCol] - 1)
                {
                    moveLink.push(adjacentCell);
                    currentCell = adjacentCell;
                    break;
                }
            }
        }
        moveLink.pop() // 移除起点
        var moveLog = `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1})`;
        for (var i = 0; i < moveLink.length; i++)
        {
            const currentCell = moveLink.pop();
            // TODO: Fix bug
            step(piece, currentCell);
            moveLog += ` -> (${currentCell.row + 1}, ${currentCell.col + 1})`;
        }
        console.log(piece.name, moveLog);

        return true;
    }
    return false;
}

function step(piece, cell)
{
    if (piece && isPassable(cell, piece) && adjacentCells(cell, piece).includes(piece.parentElement))
{
        if (redFlag.parentElement === cell && redCarrier === null && piece.classList.contains("red-piece"))
        {
            redCarrier = piece;
            redCarrier.appendChild(redFlag);
            piece.carrier = true;
            console.log(`${piece.name}成为主帅`);
        }
        if (blueFlag.parentElement === cell && blueCarrier === null && piece.classList.contains("blue-piece"))
        {
            blueCarrier = piece;
            blueCarrier.appendChild(blueFlag);
            piece.carrier = true;
            console.log(`${piece.name}成为主帅`);
        }

        cell.appendChild(piece);
        return true;
    }
    return false;
}

// 转移
function jump(piece, cell)
{
    const row = cell.row;
    const col = cell.col;
    if (piece && cell.classList.contains("landable") && isStayable(cell, piece))
    {
        if (piece.parentElement.classList.contains("grave"))
        {
            console.log(`${piece.name}登场于(${row + 1}, ${col + 1})`);
        }
        else
        {
            console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        }

        if (redFlag.parentElement === cell && redCarrier === null && piece.classList.contains("red-piece"))
        {
            redCarrier = piece;
            redCarrier.appendChild(redFlag);
            piece.carrier = true;
            console.log(`${piece.name}成为主帅`);
        }
        if (blueFlag.parentElement === cell && blueCarrier === null && piece.classList.contains("blue-piece"))
        {
            blueCarrier = piece;
            blueCarrier.appendChild(blueFlag);
            piece.carrier = true;
            console.log(`${piece.name}成为主帅`);
        }
        cell.appendChild(piece);

        return true;
    }
    return false;
}

// 交换
function exchange(pieceP, pieceQ)
{
    const cellP = pieceP.parentElement;
    const cellQ = pieceQ.parentElement;

    // 临时存放于墓地
    const grave = document.getElementsByClassName("grave")[0];
    grave.appendChild(pieceP);
    grave.appendChild(pieceQ);

    // 交换
    if ((pieceP && isStayable(cellQ, pieceP)) && pieceQ && isStayable(cellP, pieceQ))
    {
        console.log(pieceP.name, `(${cellP.row + 1}, ${cellP.col + 1}) |> (${cellQ.row + 1}, ${cellQ.col + 1})`);

        if (redFlag.parentElement === cellQ && redCarrier === null && pieceP.classList.contains("red-piece"))
        {
            redCarrier = pieceP;
            redCarrier.appendChild(redFlag);
            pieceP.carrier = true;
            console.log(`${pieceP.name}成为主帅`);
        }
        if (blueFlag.parentElement === cellQ && blueCarrier === null && pieceP.classList.contains("blue-piece"))
        {
            blueCarrier = pieceP;
            blueCarrier.appendChild(blueFlag);
            pieceP.carrier = true;
            console.log(`${pieceP.name}成为主帅`);
        }
        cellQ.appendChild(pieceP);

        console.log(pieceQ.name, `(${cellQ.row + 1}, ${cellQ.col + 1}) |> (${cellP.row + 1}, ${cellP.col + 1})`);

        if (redFlag.parentElement === cellP && redCarrier === null && pieceQ.classList.contains("red-piece"))
        {
            redCarrier = pieceQ;
            redCarrier.appendChild(redFlag);
            pieceQ.carrier = true;
            console.log(`${pieceQ.name}成为主帅`);
        }
        if (blueFlag.parentElement === cellP && blueCarrier === null && pieceQ.classList.contains("blue-piece"))
        {
            blueCarrier = pieceQ;
            blueCarrier.appendChild(blueFlag);
            pieceQ.carrier = true;
            console.log(`${pieceQ.name}成为主帅`);
        }
        cellP.appendChild(pieceQ);

        return true;
    }
    else
    {
        cellP.appendChild(pieceP);
        cellQ.appendChild(pieceQ);
        return false;
    }
}

function AnDuChenCang(user, limit = 3)
{
    console.log(`${user.name}使用【暗度陈仓】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var landableCells = [];
    landableCells.push(baseOf(user));
    jumpingPiece = user;
    for (const allyPiece of allyPiecesOf(user))
    {
        if (allyPiece != user)
        {
            for (const adjacentCell of adjacentCells(allyPiece.parentElement, user))
            {
                if (isStayable(adjacentCell, user) && (Math.abs(adjacentCell.row - userRow) + Math.abs(adjacentCell.col - userCol)) <= limit)
                {
                    landableCells.push(adjacentCell);
                }
            }
        }
    }
    highlightCells(landableCells, "landable", clickCell_jump);
}

function BingGuiShenSu(user)
{
    console.log(`${user.name}使用【兵贵神速】`);
    user.moveSteps = 2;
    moveSteps(user, true);
}

function QiMenDunJia(user, limit = 2)
{
    console.log(`${user.name}使用【奇门遁甲】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var targetablePieces = [];
    jumpingPiece = user;

    for (const allPiece of allPiecesOf(user))
    {
        if (allPiece != user)
        {
            if (Math.abs(allPiece.parentElement.row - userRow) + Math.abs(allPiece.parentElement.col - userCol) <= limit)
            {
                targetablePieces.push(allPiece);
            }
        }
    }
    highlightPieces(targetablePieces, "targetable", clickPiece_exchange);
}

function YouDiShenRu(user, limit = 4)
{
    console.log(`${user.name}使用【诱敌深入】`);
    const userRow = user.parentElement.row;
    const userCol = user.parentElement.col;
    var targetablePieces = [];

    for (const allPiece of allPiecesOf(user))
    {
        if (Math.abs(allPiece.parentElement.row - userRow) + Math.abs(allPiece.parentElement.col - userCol) <= limit)
        {
            targetablePieces.push(allPiece);
        }
    }
    highlightPieces(targetablePieces, "targetable", clickPiece_control);
}

function isStayable(cell, piece = null)
{
    var hold_by_enemy = false;
    for (const enemyPiece of enemyPiecesOf(piece))
    {
        if (cell.contains(enemyPiece))
        {
            hold_by_enemy = true;
            break;
        }
    }
    var hold_gucheng = false;

    for (const enemyPiece of enemyPiecesOf(piece))
    {
        if (enemyPiece.name === "曹仁")
        {
            hold_gucheng = true;
            break;
        }
    }

    if (hold_by_enemy && hold_gucheng)
    {
        if (cell.classList.contains("base"))
        {
            if (piece.classList.contains("blue-piece") && !cell.classList.contains("Blue"))
            {
                return false;
            }
            if (piece.classList.contains("red-piece") && !cell.classList.contains("Red"))
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
    if (cell.classList.contains("camp") || cell.classList.contains("base"))
    {
        return true;
    }
    if (cell === piece.parentElement)
    {
        return true;
    }
    for (const child of cell.children)
    {
        if (child.classList.contains("piece"))
        {
            return false;
        }
    }
    if (cell.classList.contains("ridge"))
    {
        return false;
    }
    return true;
}

function isPassable(cell, piece = null)
{
    // TODO: 穿越马
    // TODO: 张绣
    return isStayable(cell, piece);
}

function adjacentCells(cell, piece = null)
{
    var adjCells = [];
    const cells = document.getElementsByClassName("cell");
    const row = cell.row;
    const col = cell.col;
    for (var i = 0; i < 4; i++)
    {
        // 下上右左
        const nextRow = row + (i === 0 ? 1 : (i === 1 ? -1 : 0));
        const nextCol = col + (i === 2 ? 1 : (i === 3 ? -1 : 0));
        const nextCell = cells[nextRow * 7 + nextCol];
        if (nextRow >= 0 && nextRow < 7 && nextCol >= 0 && nextCol < 7 && isPassable(nextCell, piece))
        {
            adjCells.push(nextCell);
        }
    }
    if (piece === currentPlayer && piece.name === "吕蒙" && cell.classList.contains("lake"))
    // if (piece.skills.contains("渡江"))
    {
        for (const lakeCell of document.getElementsByClassName("lake"))
        {
            adjCells.push(lakeCell);
        }
    }
    return adjCells;
}

function allPiecesOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        const allPieces = document.getElementsByClassName("piece");
        return Array.from(allPieces).filter(piece => !piece.parentElement.classList.contains("grave"));
    }
    return null;
}

function allyPiecesOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        if (piece.classList.contains("red-piece"))
        {
            const redPieces = document.getElementsByClassName("red-piece");
            return Array.from(redPieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
        else
        {
            const bluePieces = document.getElementsByClassName("blue-piece");
            return Array.from(bluePieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
    }
    return null;
}

function enemyPiecesOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        if (piece.classList.contains("red-piece"))
        {
            const bluePieces = document.getElementsByClassName("blue-piece");
            return Array.from(bluePieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
        else
        {
            const redPieces = document.getElementsByClassName("red-piece");
            return Array.from(redPieces).filter(piece => !piece.parentElement.classList.contains("grave"));
        }
    }
    return null;
}

function baseOf(piece)
{
    if (piece.classList.contains("piece"))
    {
        if (piece.classList.contains("red-piece"))
        {
            return document.getElementsByClassName("Red base")[0];
        }
        else
        {
            return document.getElementsByClassName("Blue base")[0];
        }
    }
    return null;
}

// 棋子悬浮提示
var hoverPiece = null;
var attackableCells = [];

function onMouseEnterPiece(event)
{
    const hoverRow = this.parentElement.row;
    const hoverCol = this.parentElement.col;
    var attackableCells = [];

    for (const cell of document.getElementsByClassName("cell"))
    {
        const row = cell.row;
        const col = cell.col;
        const attackRange = this.range;
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

function decreaseHP()
{
    if (selectedPiece)
    {
        var HP = selectedPiece.hp;
        if (HP > 0)
        {
            labelHP.textContent = HP - 1;
            selectedPiece.hp = HP - 1;

        }
    }
}

function increaseHP()
{
    if (selectedPiece)
    {
        var HP = selectedPiece.hp;
        var MaxHP = selectedPiece.maxhp;
        if (HP < MaxHP)
        {
            labelHP.textContent = HP + 1;
            selectedPiece.hp = HP + 1;
        }
    }
}

function decreaseRange()
{
    if (selectedPiece)
    {
        var range = selectedPiece.range;
        if (range > 1)
        {
            labelRange.textContent = range - 1;
            selectedPiece.range = range - 1;
        }

    }
}

function increaseRange()
{
    if (selectedPiece)
    {
        var range = selectedPiece.range;
        if (range < 9)
        {
            labelRange.textContent = range + 1;
            selectedPiece.range = range + 1;
        }
    }
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
    for (var i = 0; i < 3; i++)
    {
        const redGraveYard = document.getElementById("redgraveyard");
        const grave = document.createElement("div");
        grave.className = "grave Red";
        redGraveYard.appendChild(grave);
    }
    for (var i = 0; i < 3; i++)
    {
        const blueGraveYard = document.getElementById("bluegraveyard");
        const grave = document.createElement("div");
        grave.className = "grave Blue";
        blueGraveYard.appendChild(grave);
    }
}

// 创建棋子
function createPiece(color, name)
{
    const piece = document.createElement("div");
    const avatar = document.createElement("img");
    avatar.src = "./assets/Avatar/active/" + heroes[name][0] + ".png";
    avatar.className = "avatar";
    piece.appendChild(avatar);
    piece.className = "piece";
    piece.classList.add(color === "red" ? "red-piece" : "blue-piece");
    piece.title = name;
    piece.draggable = true;
    piece.name = name;
    piece.maxhp = heroes[name][1];
    piece.hp = heroes[name][2];
    piece.range = heroes[name][3];
    piece.carrier = false;
    piece.active = true;

    // 添加鼠标事件
    piece.addEventListener("dragstart", dragStart);
    // piece.addEventListener("touchstart", dragStart);
    piece.addEventListener("dragend", dragEnd);
    // piece.addEventListener("touchend", dragEnd);
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
    var selectedHeroes = [];
    for (var i = 0; i < 6; i++)
    {
        var index = Math.floor(Math.random() * (heroesList.length - i));
        console.log(index, heroesList[index]);
        selectedHeroes.push(heroesList[index]);
        heroesList[index] = heroesList[heroesList.length - 1 - i];
    }
    for (var i = 0; i < chessboard.children.length; i++)
    {
        if (chessboard.children[i].classList.contains("camp") || chessboard.children[i].classList.contains("base"))
        {
            if (chessboard.children[i].classList.contains("Red"))
            {

                const redPiece = createPiece("red", selectedHeroes.pop());
                chessboard.children[i].appendChild(redPiece);
                if (chessboard.children[i].classList.contains("base"))
                {
                    redPiece.carrier = true;
                    redCarrier = redPiece;
                    console.log(`${redPiece.name}成为主帅`);
                    redCarrier.appendChild(redFlag);
                }

            }
            else
            {
                const bluePiece = createPiece("blue", selectedHeroes.pop());
                chessboard.children[i].appendChild(bluePiece);
                if (chessboard.children[i].classList.contains("base"))
                {
                    bluePiece.carrier = true;
                    blueCarrier = bluePiece;
                    console.log(`${bluePiece.name}成为主帅`);
                    blueCarrier.appendChild(blueFlag);
                }
            }
        }
    }
}

// 初始化游戏
function initializeGame()
{

    createChessboard();
    initializePieces();

    for (const cell of document.getElementsByClassName("cell"))
    {
        cell.addEventListener("dragover", function (event)
        {
            event.preventDefault();
        });
        cell.addEventListener("drop", dropPiece);
    }
    for (const grave of document.getElementsByClassName("grave"))
    {
        grave.addEventListener("dragover", function (event)
        {
            event.preventDefault();
        });
        grave.addEventListener("drop", dropPiece_grave);
    }
    for (var name in heroes)
    {
        const option = document.createElement("option");
        option.id = name;
        option.value = name;
        option.innerText = name;
        heroSelect.appendChild(option);
    }
    heroSelect.addEventListener("change", function (event)
    {
        if (selectedPiece)
        {
            selectedPiece.name = heroSelect.value;
            const avatar = selectedPiece.querySelector(".avatar");
            avatar.src = "./assets/Avatar/active/" + heroes[heroSelect.value][0] + ".png";
            selectedPiece.maxhp = heroes[heroSelect.value][1];
            selectedPiece.hp = heroes[heroSelect.value][2];
            selectedPiece.range = heroes[heroSelect.value][3];
        }
    }
    );
    carrierCheckbox.addEventListener("change", function (event)
    {
        selectedPiece.carrier = carrierCheckbox.checked;
        if (selectedPiece.classList.contains("red-piece"))
        {
            if (carrierCheckbox.checked)
            {
                selectedPiece.appendChild(redFlag);
                console.log(`${selectedPiece.name}成为主帅`);
                redCarrier = selectedPiece;
            }
            else
            {
                selectedPiece.parentElement.appendChild(redFlag);
                console.log(`${selectedPiece.name}掉落帅旗`);
                redCarrier = null;
            }
        }
        else
        {
            if (carrierCheckbox.checked)
            {
                selectedPiece.appendChild(blueFlag);
                console.log(`${selectedPiece.name}成为主帅`);
                blueCarrier = selectedPiece;
            }
            else
            {
                selectedPiece.parentElement.appendChild(blueFlag);
                console.log(`${selectedPiece.name}掉落帅旗`);
                blueCarrier = null;
            }
        }

    }
    );
    activeCheckbox.addEventListener("change", function (event)
    {
        selectedPiece.active = activeCheckbox.checked;
        if (activeCheckbox.checked)
        {
            selectedPiece.src = "./assets/Avatar/active/" + heroes[selectedPiece.name][0] + ".png";
        }
        else
        {
            selectedPiece.src = "./assets/Avatar/inactive/" + heroes[selectedPiece.name][0] + ".png";
            console.log(`${selectedPiece.name}回合结束`);
        }
    }
    );

    var buttonHPDown = document.getElementById("HPMinus");
    buttonHPDown.addEventListener("click", decreaseHP);
    var buttonHPUp = document.getElementById("HPPlus");
    buttonHPUp.addEventListener("click", increaseHP);
    var buttonRangeDown = document.getElementById("rangeMinus");
    buttonRangeDown.addEventListener("click", decreaseRange);
    var buttonRangeUp = document.getElementById("rangePlus");
    buttonRangeUp.addEventListener("click", increaseRange);


    var buttonMovePhase = document.getElementById("movePhase");
    buttonMovePhase.addEventListener("click", function (event)
    {
        if (selectedPiece.active === true)
        {
            console.log("移动阶段开始");
            // 移动阶段开始时

            // 获得移动力
            selectedPiece.movePoints = selectedPiece.hp;

            // 移动阶段
            movePhase(selectedPiece);
        }
    });
    var buttonXunShan = document.getElementById("XunShan");
    buttonXunShan.addEventListener("click", function (event)
    {
        console.log("迅【闪】");
        selectedPiece.moveSteps = 1;
        moveSteps(selectedPiece, true);
    });
    var buttonAnDuChenCang = document.getElementById("AnDuChenCang");
    buttonAnDuChenCang.addEventListener("click", function (event)
    {
        AnDuChenCang(selectedPiece)
    });
    var buttonBingGuiShenSu = document.getElementById("BingGuiShenSu");
    buttonBingGuiShenSu.addEventListener("click", function (event)
    {
        BingGuiShenSu(selectedPiece)

    });
    var buttonQiMenDunJia = document.getElementById("QiMenDunJia");
    buttonQiMenDunJia.addEventListener("click", function (event)
    {
        QiMenDunJia(selectedPiece);

    });
    var buttonYouDiShenRu = document.getElementById("YouDiShenRu");
    buttonYouDiShenRu.addEventListener("click", function (event)
    {
        YouDiShenRu(selectedPiece);
    });
}

// 启动游戏
initializeGame();