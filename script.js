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
    // pinyin, MaxHP, HP
    "曹操": ["caocao", 4, 4],
    "司马懿": ["simayi", 3, 3],
    "夏侯惇": ["xiahoudun", 4, 4],
    "张辽": ["zhangliao", 4, 4],
    "许褚": ["xuchu", 4, 4],
    "郭嘉": ["guojia", 3, 3],
    "甄姬": ["zhenji", 3, 3],
    "曹纯": ["caochun", 4, 4],
    "典韦": ["dianwei", 4, 4],
    "刘备": ["liubei", 4, 4],
    "关羽": ["guanyu", 4, 4],
    "张飞": ["zhangfei", 4, 4],
    "诸葛亮": ["zhugeliang", 3, 3],
    "赵云": ["zhaoyun", 4, 4],
    "马超": ["machao", 4, 4],
    "黄月英": ["huangyueying", 3, 3],
    "黄忠": ["huangzhong", 4, 4],
    "孙乾": ["sunqian", 3, 3],
    "孙权": ["sunquan", 4, 4],
    "甘宁": ["ganning", 4, 4],
    "吕蒙": ["lvmeng", 4, 4],
    "黄盖": ["huanggai", 4, 4],
    "周瑜": ["zhouyu", 3, 3],
    "大乔": ["daqiao", 3, 3],
    "陆逊": ["luxun", 3, 3],
    "孙尚香": ["sunshangxiang", 3, 3],
    "祖茂": ["zumao", 4, 4],
    "华佗": ["huatuo", 3, 3],
    "吕布": ["lvbu", 4, 4],
    "貂蝉": ["diaochan", 3, 3],
    "董卓": ["dongzhuo", 4, 4],
    "张绣": ["zhangxiu", 4, 4],
    "刘表": ["liubiao", 4, 4],
    "曹仁": ["caoren", 4, 4],
    "魏延": ["weiyan", 4, 4],
    "祝融": ["zhurong", 4, 4],
    "孙坚": ["sunjian", 4, 4],
    "鲁肃": ["lusu", 3, 3],
    "张角": ["zhangjiao", 3, 3],
    "陈宫": ["chengong", 3, 3],
    "邓艾": ["dengai", 4, 4],
    "荀彧": ["xunyu", 3, 3],
    "孟获": ["menghuo", 4, 4],
    "法正": ["fazheng", 3, 3],
    "孙策": ["sunce", 4, 4],
    "贾诩": ["jiaxu", 3, 3],
    "庞德": ["pangde", 4, 4],
    "高顺": ["gaoshun", 4, 4],
    "华雄": ["huaxiong", 4, 4],
    "夏侯渊": ["xiahouyuan", 4, 4],
    "姜维": ["jiangwei", 4, 4],
    "小乔": ["xiaoqiao", 3, 3],
    "乐进&李典": ["yuejin&lidian", 4, 4],
    "关兴&张苞": ["guanxing&zhangbao", 4, 4],
    "张昭&张纮": ["zhangzhao&zhanghong", 4, 4],
    "颜良&文丑": ["yanliang&wenchou", 4, 4],
    "程普": ["chengpu", 4, 4],
    "张郃": ["zhanghe", 4, 4],
    "徐晃": ["xuhuang", 4, 4],
    "于禁": ["yujin", 4, 4],
    "庞统": ["pangtong", 3, 3],
    "太史慈": ["taishici", 4, 4],
    "周泰": ["zhoutai", 4, 4],
    "韩当": ["handang", 4, 4],
    "程昱": ["chengyu", 3, 3],
    "袁绍": ["yuanshao", 4, 4],
    "刘协": ["liuxie", 3, 3],
    "卑弥呼": ["beimihu", 3, 3],
    "王异": ["wangyi", 3, 3],
    "左慈": ["zuoci", 3, 3],
}

const weapons = {
    "": 1,
    "诸葛连弩": 1,
    "狂歌戟": 2,
    "长柄瓜锤": 2,
    "青缸剑": 2,
    "雌雄双股剑": 2,
    "寒冰剑": 2,
    "青龙偃月刀": 3,
    "丈八蛇矛": 3,
    "钩镰枪": 3,
    "贯石斧": 3,
    "朱雀羽扇": 4,
    "方天画戟": 4,
    "湛金枪": 4
}

const armors = {
    "": "",
    "八卦阵": "",
    "仁王盾": "",
    "护心镜": "",
    "磐石甲": ""
}

const horses = {
    "": "",
    "的卢": "active",
    "绝影": "active",
    "爪黄飞电": "active",
    "赤兔": "cross",
    "大宛": "cross",
    "紫骅": "cross",
    "乌云踏雪": "still",
    "燎原火": "still",
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

var Pieces = [];

var draggingPiece = null; // 正在拖动的棋子

var jumpingPiece = null; // 正在转移的棋子

var movingPiece = null; // 正在移动的棋子

var selectedPiece = null; // 选中的棋子

var currentPlayer = null; // 当前回合玩家

class StateHistory
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
        if (this.currentIndex > 0)
        {
            this.currentIndex--;
            return this.history[this.currentIndex];
        }
        return null; // 没有可以撤销的状态
    }

    // 重做操作
    redo()
    {
        if (this.currentIndex < this.history.length - 1)
        {
            this.currentIndex++;
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

const stateHistory = new StateHistory();

function saveState()
{
    const state = {
        players: [],
    };
    if (redCarrier)
    {
        state.redCarrier = redCarrier;
    }
    else
    {
        red_flag = document.querySelector("img[title='红方帅旗']");
        state.redFlagPosition = [red_flag.parentElement.row, red_flag.parentElement.col];
    }
    if (blueCarrier)
    {
        state.blueCarrier = blueCarrier;
    }
    else
    {
        blue_flag = document.querySelector("img[title='蓝方帅旗']");
        state.blueFlagPosition = [blue_flag.parentElement.row, blue_flag.parentElement.col];
    }

    for (const piece of Pieces)
    {
        let player = {
            piece: piece,
            acted: piece.acted,
        };
        if (piece.parentElement.classList.contains("grave"))
        {
            player.alive = false;
            player.grave = piece.parentElement;
            player.carrier = false;
        }
        else
        {
            player.alive = true;
            player.HP = piece.HP;
            player.position = [piece.parentElement.row, piece.parentElement.col];
            player.acted = piece.acted;
            player.carrier = piece.carrier;
            player.weapons = [];
            player.armors = [];
            player.horses = [];

            for (const weapon of piece.weapons)
            {
                player.weapons.push(weapon);
            }
            for (const armor of piece.armors)
            {
                player.armors.push(armor);
            }
            for (const horse of piece.horses)
            {
                player.horses.push(horse);
            }
        }
        state.players.push(player);
    }
    stateHistory.updateHistory(state);
}

function recoverStatefrom(state)
{
    for (const player of state.players)
    {
        const index = Pieces.indexOf(player.piece) + 1;
        player.piece.acted = player.acted;
        const actedCheckbox = document.getElementById("actedCheckbox" + index);
        actedCheckbox.checked = player.acted;
        const avatar = player.piece.querySelector(".avatar");
        if (player.acted)
        {
            avatar.src = "./assets/Avatar/inactive/" + heroes[player.piece.name][0] + ".png";
        }
        else
        {
            avatar.src = "./assets/Avatar/active/" + heroes[player.piece.name][0] + ".png";
        }
        if (player.alive)
        {
            player.piece.HP = player.HP;
            const labelHP = document.getElementById("HP" + index);
            labelHP.textContent = player.HP;
            labelHP.style.color = HPColor(player.HP, heroes[player.piece.name][1]);

            player.piece.weapons = player.weapons;
            const weaponSelect = document.getElementById("weaponSelect" + index);
            weaponSelect.value = player.weapons[0];

            player.piece.armors = player.armors;
            const armorSelect = document.getElementById("armorSelect" + index);
            armorSelect.value = player.armors[0];

            player.piece.horses = player.horses;
            const horseSelect = document.getElementById("horseSelect" + index);
            horseSelect.value = player.horses[0];

            player.piece.carrier = player.carrier;
            const carrierCheckbox = document.getElementById("carrierCheckbox" + index);
            carrierCheckbox.checked = player.carrier;

            const cell = document.getElementsByClassName("cell")[player.position[0] * 7 + player.position[1]];
            cell.appendChild(player.piece);
        }
        else
        {
            const grave = player.grave;
            grave.appendChild(player.piece);
        }

    }

    if (state.redCarrier)
    {
        redCarrier = state.redCarrier;
        redCarrier.appendChild(redFlag);
    }
    else
    {
        const cell = document.getElementsByClassName("cell")[state.redFlagPosition[0] * 7 + state.redFlagPosition[1]];
        cell.appendChild(redFlag);
    }
    if (state.blueCarrier)
    {
        blueCarrier = state.blueCarrier;
        blueCarrier.appendChild(blueFlag);
    }
    else
    {
        const cell = document.getElementByClassName("cell")[state.blueFlagPosition[0] * 7 + state.blueFlagPosition[1]];
        cell.appendChild(blueFlag);
    }
}

function HPColor(HP, maxHP)
{
    var factor = HP / maxHP;

    var color1 = { r: 255, g: 50, b: 50 }; // 红色
    var color2 = { r: 200, g: 100, b: 0 }; // 黄色
    var color3 = { r: 50, g: 160, b: 50 }; // 绿色

    var result = {};

    if (factor > 0.5)
    {
        // 血量在一半以上，从黄色插值到绿色
        factor = (factor - 0.5) * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color2.r + factor * (color3.r - color2.r));
        result.g = Math.round(color2.g + factor * (color3.g - color2.g));
        result.b = Math.round(color2.b + factor * (color3.b - color2.b));
    } else
    {
        // 血量在一半以下，从红色插值到黄色
        factor = factor * 2; // 调整因子，使其在0到1之间
        result.r = Math.round(color1.r + factor * (color2.r - color1.r));
        result.g = Math.round(color1.g + factor * (color2.g - color1.g));
        result.b = Math.round(color1.b + factor * (color2.b - color1.b));
    }

    return 'rgb(' + result.r + ',' + result.g + ',' + result.b + ')';
}


// 棋子拖动事件
function dragStart(event)
{
    draggingPiece = event.target.closest(".piece");
    // jumpingPiece = event.target.closest(".piece");

    // var landableCells = [];
    // for (const cell of document.getElementsByClassName("cell"))
    // {
    //     if (isStayable(cell, this))
    //     {
    //         landableCells.push(cell);
    //     }
    // }
    // highlightCells(landableCells, "landable");
}

function dragEnd()
{
    draggingPiece = null;
    // removeHighlight("landable");
}

function dropPiece(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");
    // jump(jumpingPiece, cell);
    leap(draggingPiece, cell);
}

function dropPiece_onPiece(event)
{
    event.preventDefault();
    const cell = event.target.closest(".cell");
    // jump(jumpingPiece, cell);
    leap(draggingPiece, cell);
}


// 棋子点击事件
function clickPiece(event)
{
    event.preventDefault();

    if (selectedPiece == null)
    {
        selectedPiece = this;
        // currentPlayer = this;
    }
    else
    {
        if (document.getElementsByClassName("reachable").length <= 0 && document.getElementsByClassName("landable").length <= 0 && document.getElementsByClassName("targetable").length <= 0)
        {
            selectedPiece = null;
            // currentPlayer = null;
        }

    }
}

function moveSteps(piece, fixed = false, ifConsumeMovePoints = false)
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
    if (movingPiece)
    {
        const distance = distanceMapOf(movingPiece);

        var reachableCells = []
        for (const cell of document.getElementsByClassName("cell"))
        {
            const row = cell.row;
            const col = cell.col;
            if (distance[row][col] > 0 && isStayable(cell, movingPiece))
            {
                if (!ifConsumeMovePoints && distance[row][col] <= movingPiece.moveSteps)
                {
                    reachableCells.push(cell);
                }
                if (ifConsumeMovePoints && distance[row][col] <= movingPiece.movePoints)
                {
                    reachableCells.push(cell);
                }
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
        if (move(movingPiece, cell, !(movingPiece.moveSteps && movingPiece.moveSteps > 0)))
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
        if (move(movingPiece, cell, !(movingPiece.moveSteps && movingPiece.moveSteps > 0)))
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

function clickPiece_swap(event)
{
    event.preventDefault();
    const piece = event.target.closest(".piece");
    if (jumpingPiece)
    {
        if (swap(jumpingPiece, piece))
        {
            removeHighlight("targetable", clickPiece_swap);
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

    if (piece && cell.classList.contains("reachable") && (distance[row][col] > 0) && isStayable(cell, piece))
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
        // moveLink.pop() // 移除起点
        var moveLog = `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1})`;
        for (var i = moveLink.length - 2; i >= 0; i--)
        {
            const currentCell = moveLink[i];
            step(piece, currentCell);
            moveLog += ` -> (${currentCell.row + 1}, ${currentCell.col + 1})`;
        }
        console.log(piece.name, moveLog);

        return true;
    }
    return false;
}

// 移动一步
function step(piece, cell)
{
    if (piece && isPassable(cell, piece) && adjacentCells(cell, piece).includes(piece.parentElement))
{
        cell.appendChild(piece);
        piecePositionChange(piece, cell);
        return true;
    }
    return false;
}

function piecePositionChange(piece, cell)
{
    // 帅旗逻辑
    if (redFlag.parentElement === cell && redCarrier === null && piece.classList.contains("red-piece"))
    {
        redCarrier = piece;
        redCarrier.appendChild(redFlag);
        piece.carrier = true;
        const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(redCarrier) + 1));
        oldCheckbox.checked = false;
        console.log(`${piece.name}成为主帅`);
    }
    if (blueFlag.parentElement === cell && blueCarrier === null && piece.classList.contains("blue-piece"))
    {
        blueCarrier = piece;
        blueCarrier.appendChild(blueFlag);
        piece.carrier = true;
        const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(redCarrier) + 1));
        oldCheckbox.checked = false;
        console.log(`${piece.name}成为主帅`);
    }

    // 保存状态
    saveState();
}

// 转移
function jump(piece, cell)
{
    const row = cell.row;
    const col = cell.col;
    if (piece && cell.classList.contains("landable") && isStayable(cell, piece))
    {
        console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        cell.appendChild(piece);
        piecePositionChange(piece, cell);

        return true;
    }
    return false;
}

// 任意拖动
function leap(piece, cell)
{
    const row = cell.row;
    const col = cell.col;
    if (piece)
    {
        // 复活逻辑
        if (piece.parentElement.classList.contains("grave"))
        {
            console.log(`${piece.name}登场于(${row + 1}, ${col + 1})`);
        }
        else
        {
            console.log(piece.name, `(${piece.parentElement.row + 1}, ${piece.parentElement.col + 1}) |> (${row + 1}, ${col + 1})`);
        }

        cell.appendChild(piece);
        piecePositionChange(piece, cell);

        return true;
    }
    return false;
}

// 交换
function swap(pieceP, pieceQ)
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
        cellQ.appendChild(pieceP);
        piecePositionChange(pieceP, cellQ);

        console.log(pieceQ.name, `(${cellQ.row + 1}, ${cellQ.col + 1}) |> (${cellP.row + 1}, ${cellP.col + 1})`);
        cellP.appendChild(pieceQ);
        piecePositionChange(pieceQ, cellP);

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
    highlightPieces(targetablePieces, "targetable", clickPiece_swap);
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
function createPiece(color, name, index)
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
    piece.maxHP = heroes[name][1];
    piece.HP = heroes[name][2];
    piece.weapons = [""];
    piece.armors = [""];
    piece.horses = [""];
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
    labelHP.style.color = HPColor(piece.HP, piece.maxHP);

    const labelMaxHP = document.getElementById("maxHP" + index);
    labelMaxHP.textContent = piece.maxHP;

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
        selectedHeroes.push(heroesList[index]);
        heroesList[index] = heroesList[heroesList.length - 1 - i];
    }
    for (var i = 0; i < chessboard.children.length; i++)
    {
        if (chessboard.children[i].classList.contains("camp") || chessboard.children[i].classList.contains("base"))
        {
            if (chessboard.children[i].classList.contains("Red"))
            {
                const redPiece = createPiece("red", selectedHeroes.pop(), 6 - selectedHeroes.length);
                Pieces.push(redPiece);
                chessboard.children[i].appendChild(redPiece);
                if (chessboard.children[i].classList.contains("base"))
                {
                    redPiece.carrier = true;
                    const carrierCheckbox = document.getElementById("carrierCheckbox" + (6 - selectedHeroes.length));
                    carrierCheckbox.checked = true;
                    redCarrier = redPiece;
                    console.log(`${redPiece.name}成为主帅`);
                    redCarrier.appendChild(redFlag);
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
                const bluePiece = createPiece("blue", selectedHeroes.pop(), 6 - selectedHeroes.length);
                Pieces.push(bluePiece);
                chessboard.children[i].appendChild(bluePiece);
                if (chessboard.children[i].classList.contains("base"))
                {
                    bluePiece.carrier = true;
                    const carrierCheckbox = document.getElementById("carrierCheckbox" + (6 - selectedHeroes.length));
                    carrierCheckbox.checked = true;
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

    // 为body增加dragover事件监听以便全局拖动
    document.body.addEventListener("dragover", function (event)
    {
        event.preventDefault();
    });

    document.body.addEventListener("drop", function (event)
    {
        const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();

        if (event.clientX < chessboardRect.left || event.clientX > chessboardRect.right || event.clientY < chessboardRect.top || event.clientY > chessboardRect.bottom)
        {
            event.preventDefault();
            var grave = null;
            let min_d_sqr = 100000000;
            if (draggingPiece.classList.contains("red-piece"))
            {

                for (const red_grave of document.getElementsByClassName("grave Red"))
                {
                    // 如果red_grave没有child
                    if (red_grave.children.length === 0)
                    {
                        const { left, top, width, height } = red_grave.getBoundingClientRect()
                        const centerX = left + width / 2
                        const centerY = top + height / 2
                        const d_sqr = Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
                        if (d_sqr < min_d_sqr)
                        {
                            min_d_sqr = d_sqr;
                            grave = red_grave;
                        }
                    }
                }
            }
            else if (draggingPiece.classList.contains("blue-piece"))
            {
                for (const blue_grave of document.getElementsByClassName("grave Blue"))
                {
                    if (blue_grave.children.length === 0)
                    {
                        const { left, top, width, height } = blue_grave.getBoundingClientRect()
                        const centerX = left + width / 2
                        const centerY = top + height / 2
                        const d_sqr = Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
                        if (d_sqr < min_d_sqr)
                        {
                            min_d_sqr = d_sqr;
                            grave = blue_grave;
                        }
                    }
                }
            }
            else
            {
                return;
            }
            console.log(`${draggingPiece.name}死亡`);
            if (draggingPiece === redCarrier)
            {
                draggingPiece.parentElement.appendChild(redFlag);
                console.log(`${draggingPiece.name}掉落帅旗`);
                redCarrier = null;
            }
            else if (draggingPiece === blueCarrier)
            {
                draggingPiece.parentElement.appendChild(blueFlag);
                console.log(`${draggingPiece.name}掉落帅旗`);
                blueCarrier = null;
            }
            grave.appendChild(draggingPiece);
            saveState();
        }
    });

    for (const cell of document.getElementsByClassName("cell"))
    {
        cell.addEventListener("dragover", function (event)
        {
            event.preventDefault();
        });
        cell.addEventListener("drop", dropPiece);
    }

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
            piece.maxHP = heroes[heroSelect.value][1];
            piece.HP = heroes[heroSelect.value][2];
            piece.range = heroes[heroSelect.value][3];
        }
        );

        const carrierCheckbox = document.getElementById("carrierCheckbox" + i);
        carrierCheckbox.addEventListener("change", function (event)
        {
            const index = event.target.id.slice(-1);
            const piece = Pieces[index - 1];
            piece.carrier = this.checked;
            if (piece.classList.contains("red-piece"))
            {
                if (this.checked)
                {
                    piece.appendChild(redFlag);
                    console.log(`${piece.name}成为主帅`);
                    if (redCarrier != null && redCarrier != piece)
                    {
                        const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(redCarrier) + 1));
                        oldCheckbox.checked = false;
                        redCarrier.carrier = false;
                    }
                    redCarrier = piece;
                }
                else
                {
                    piece.parentElement.appendChild(redFlag);
                    console.log(`${piece.name}掉落帅旗`);
                    redCarrier = null;
                }
            }
            else
            {
                if (this.checked)
                {
                    piece.appendChild(blueFlag);
                    console.log(`${piece.name}成为主帅`);
                    if (blueCarrier != null && blueCarrier != piece)
                    {
                        const oldCheckbox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(redCarrier) + 1));
                        oldCheckbox.checked = false;
                        blueCarrier.carrier = false;
                    }
                    blueCarrier = piece;
                }
                else
                {
                    piece.parentElement.appendChild(blueFlag);
                    console.log(`${piece.name}掉落帅旗`);
                    blueCarrier = null;
                }
            }
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
            if (HP > 0)
            {
                labelHP.textContent = HP - 1;
                labelHP.style.color = HPColor(HP - 1, piece.maxHP);
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
            var MaxHP = piece.maxHP;
            if (HP < MaxHP)
            {
                labelHP.textContent = HP + 1;
                labelHP.style.color = HPColor(HP + 1, piece.maxHP);
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


    // var buttonMovePhase = document.getElementById("movePhase");
    // buttonMovePhase.addEventListener("click", function (event)
    // {
    //     if (selectedPiece.acted === false)
    //     {
    //         console.log("移动阶段开始");
    //         // 移动阶段开始时

    //         // 获得移动力
    //         selectedPiece.movePoints = selectedPiece.HP;

    //         // 移动阶段
    //         moveSteps(selectedPiece, fixed = false, ifConsumeMovePoints = true);
    //     }
    // });
    // var buttonXunShan = document.getElementById("XunShan");
    // buttonXunShan.addEventListener("click", function (event)
    // {
    //     console.log("迅【闪】");
    //     selectedPiece.moveSteps = 1;
    //     moveSteps(selectedPiece, true);
    // });
    // var buttonAnDuChenCang = document.getElementById("AnDuChenCang");
    // buttonAnDuChenCang.addEventListener("click", function (event)
    // {
    //     AnDuChenCang(selectedPiece)
    // });
    // var buttonBingGuiShenSu = document.getElementById("BingGuiShenSu");
    // buttonBingGuiShenSu.addEventListener("click", function (event)
    // {
    //     BingGuiShenSu(selectedPiece)

    // });
    // var buttonQiMenDunJia = document.getElementById("QiMenDunJia");
    // buttonQiMenDunJia.addEventListener("click", function (event)
    // {
    //     QiMenDunJia(selectedPiece);

    // });
    // var buttonYouDiShenRu = document.getElementById("YouDiShenRu");
    // buttonYouDiShenRu.addEventListener("click", function (event)
    // {
    //     YouDiShenRu(selectedPiece);
    // });

    // 撤销重做
    document.addEventListener("wheel", function (event)
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
    });
}

// 启动游戏
initializeGame();
saveState();