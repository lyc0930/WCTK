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
var draggingPieceParent = null;

var jumpingPiece = null; // 正在转移的棋子

var movingPiece = null; // 正在移动的棋子

var selectedPiece = null; // 选中的棋子

var currentPlayer = null; // 当前回合玩家

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


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
        const grave = document.getElementById("grave" + index);
        if (player.alive)
        {
            grave.style.display = "none";
            actedCheckbox.disabled = false;

            const HPPanel = document.getElementById("HPPanel" + index);
            const weaponPanel = document.getElementById("weaponPanel" + index);
            const armorPanel = document.getElementById("armorPanel" + index);
            const horsePanel = document.getElementById("horsePanel" + index);
            HPPanel.style.display = "block";
            weaponPanel.style.display = "block";
            armorPanel.style.display = "block";
            horsePanel.style.display = "block";

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
            carrierCheckbox.disabled = false;
            carrierCheckbox.checked = player.carrier;

            const cell = document.getElementsByClassName("cell")[player.position[0] * 7 + player.position[1]];
            cell.appendChild(player.piece);
        }
        else
        {
            grave.style.display = "block";
            actedCheckbox.disabled = true;

            const HPPanel = document.getElementById("HPPanel" + index);
            const weaponPanel = document.getElementById("weaponPanel" + index);
            const armorPanel = document.getElementById("armorPanel" + index);
            const horsePanel = document.getElementById("horsePanel" + index);
            HPPanel.style.display = "none";
            weaponPanel.style.display = "none";
            armorPanel.style.display = "none";
            horsePanel.style.display = "none";

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
        const cell = document.getElementsByClassName("cell")[state.blueFlagPosition[0] * 7 + state.blueFlagPosition[1]];
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

function piecePositionChange(piece, cell)
{
    // 帅旗逻辑
    if (redFlag.parentElement === cell && redCarrier === null && piece.classList.contains("red-piece"))
    {
        redCarrier = piece;
        redCarrier.appendChild(redFlag);
        piece.carrier = true;
        const checkBox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(piece) + 1));
        checkBox.checked = true;
        console.log(`${piece.name}成为主帅`);
    }
    if (blueFlag.parentElement === cell && blueCarrier === null && piece.classList.contains("blue-piece"))
    {
        blueCarrier = piece;
        blueCarrier.appendChild(blueFlag);
        piece.carrier = true;
        const checkBox = document.getElementById("carrierCheckbox" + (Pieces.indexOf(piece) + 1));
        checkBox.checked = true;
        console.log(`${piece.name}成为主帅`);
    }

    // 保存状态
    saveState();
}

// 任意拖动
function leap(piece, cell, isDraw=false)
{
    const row = cell.row;
    const col = cell.col;

    if (isDraw)
    {
        draw([[piece.parentElement.row, piece.parentElement.col], [row, col]], piece.classList.contains("red-piece") ? 'rgb(255,0,0)': 'rgb(0,0,255)');
    }

    if (piece)
    {
        // 复活逻辑
        if (piece.parentElement.classList.contains("grave"))
        {
            const index = Pieces.indexOf(piece) + 1;
            const grave = document.getElementById("grave" + index);
            grave.style.display = "none";

            const carrierCheckbox = document.getElementById("carrierCheckbox" + index);
            const actedCheckbox = document.getElementById("actedCheckbox" + index);
            carrierCheckbox.disabled = false;
            actedCheckbox.disabled = false;

            const HPPanel = document.getElementById("HPPanel" + index);
            const weaponPanel = document.getElementById("weaponPanel" + index);
            const armorPanel = document.getElementById("armorPanel" + index);
            const horsePanel = document.getElementById("horsePanel" + index);
            HPPanel.style.display = "block";
            weaponPanel.style.display = "block";
            armorPanel.style.display = "block";
            horsePanel.style.display = "block";

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

// 死亡逻辑
function bury(piece)
{
    if (!piece.parentElement.classList.contains("grave"))
    {
        const index = Pieces.indexOf(piece) + 1;
        const grave = document.getElementById("grave" + index);
        grave.style.display = "block";

        const carrierCheckbox = document.getElementById("carrierCheckbox" + index);
        carrierCheckbox.disabled = true;

        console.log(`${piece.name}死亡`);
        if (piece === redCarrier)
        {
            piece.parentElement.appendChild(redFlag);
            console.log(`${piece.name}掉落帅旗`);
            carrierCheckbox.checked = false;
            redCarrier = null;
        }
        else if (piece === blueCarrier)
        {
            piece.parentElement.appendChild(blueFlag);
            console.log(`${piece.name}掉落帅旗`);
            carrierCheckbox.checked = false;
            blueCarrier = null;
        }

        const actedCheckbox = document.getElementById("actedCheckbox" + index);
        actedCheckbox.disabled = true;

        const HPPanel = document.getElementById("HPPanel" + index);
        const weaponPanel = document.getElementById("weaponPanel" + index);
        const armorPanel = document.getElementById("armorPanel" + index);
        const horsePanel = document.getElementById("horsePanel" + index);
        HPPanel.style.display = "none";
        weaponPanel.style.display = "none";
        armorPanel.style.display = "none";
        horsePanel.style.display = "none";

        grave.appendChild(piece);
        saveState();
    }
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

function draw(line, color='rgba(50, 50, 50)', isArrow=true)
{
    var cellSize = canvas.width / 7; // 计算每个单元格的大小
    const width = 20;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    for (var i = 1; i < line.length; i++)
    {

        const Px = line[i - 1][1] * cellSize + cellSize / 2;
        const Py = line[i - 1][0] * cellSize + cellSize / 2;
        const Qx = line[i][1] * cellSize + cellSize / 2;
        const Qy = line[i][0] * cellSize + cellSize / 2;
        if (Px === Qx && Py === Qy)
        {
            continue;
        }

        ctx.moveTo(Px, Py);
        ctx.lineTo(Qx, Qy);
    }
    ctx.stroke();
    if (isArrow)
    {
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        for (var i = 1; i < line.length; i++)
        {

            const Px = line[i - 1][1] * cellSize + cellSize / 2;
            const Py = line[i - 1][0] * cellSize + cellSize / 2;
            const Qx = line[i][1] * cellSize + cellSize / 2;
            const Qy = line[i][0] * cellSize + cellSize / 2;

            if (Px === Qx && Py === Qy)
            {
                continue;
            }

            ctx.moveTo(Px, Py);
            ctx.lineTo(Qx, Qy);

            var dx = Qx - Px;
            var dy = Qy - Py;
            var angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.moveTo((Px + (Qx - Px) * 0.55) - 0.5 * width * Math.cos(angle + Math.PI / 6), (Py + (Qy - Py) * 0.55) - 0.5 * width * Math.sin(angle + Math.PI / 6));
            ctx.lineTo((Px + (Qx - Px) * 0.55), (Py + (Qy - Py) * 0.55));
            ctx.lineTo((Px + (Qx - Px) * 0.55) - 0.5 * width * Math.cos(angle - Math.PI / 6), (Py + (Qy - Py) * 0.55) - 0.5 * width * Math.sin(angle - Math.PI / 6));
            ctx.closePath();
            ctx.stroke();
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
    piece.addEventListener("mousedown", function (event)
    {
        const rect = piece.getBoundingClientRect();

        const shiftX = event.clientX - (rect.left + 0.5 * rect.width);
        const shiftY = event.clientY - (rect.top + 0.5 * rect.height);

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
        }

        document.addEventListener('mousemove', onMouseDragPiece);

        piece.addEventListener('mouseup', function (event)
        {
            event.stopPropagation();
            document.removeEventListener('mousemove', onMouseDragPiece);
            if (draggingPiece != null)
            {
                draggingPiece.removeEventListener('mouseup', arguments.callee);
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPieceParent.appendChild(draggingPiece); // 解决出身问题

                const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();

                if (event.clientX >= chessboardRect.left && event.clientX <= chessboardRect.right && event.clientY >= chessboardRect.top && event.clientY <= chessboardRect.bottom) // 在棋盘范围内
                {
                    var targetCell = null;
                    let min_d_sqr = 100000000;
                    for (const cell of document.getElementsByClassName("cell"))
                    {
                        const { left, top, width, height } = cell.getBoundingClientRect()
                        const centerX = left + width / 2
                        const centerY = top + height / 2
                        const d_sqr = Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
                        if (d_sqr < min_d_sqr)
                        {
                            min_d_sqr = d_sqr;
                            targetCell = cell;
                        }
                    }
                    leap(draggingPiece, targetCell, event.button === 2);
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
    // TODO 屏幕抖动？
    piece.addEventListener("touchstart", function (event)
    {
        const rect = piece.getBoundingClientRect();

        const shiftX = event.touches[0].clientX - (rect.left + 0.5 * rect.width);
        const shiftY = event.touches[0].clientY - (rect.top + 0.5 * rect.height);

        function onTouchDragPiece(event)
        {
            if (draggingPiece === null)
            {
                draggingPiece = piece;
                draggingPieceParent = piece.parentElement;
                document.body.append(piece);
            }

            draggingPiece.style.left = event.touches[0].clientX - shiftX + 'px';
            draggingPiece.style.top = event.touches[0].clientY - shiftY + 'px';
        }

        piece.addEventListener('touchmove', onTouchDragPiece);

        piece.addEventListener('touchend', function (event)
        {
            event.stopPropagation();
            piece.removeEventListener('touchmove', onTouchDragPiece);
            if (draggingPiece != null)
            {
                draggingPiece.removeEventListener('touchend', arguments.callee);
                draggingPiece.style.left = null;
                draggingPiece.style.top = null;
                draggingPieceParent.appendChild(draggingPiece); // 解决出身问题

                const chessboardRect = document.getElementById("chessboard").getBoundingClientRect();

                if (event.changedTouches[0].clientX >= chessboardRect.left && event.changedTouches[0].clientX <= chessboardRect.right && event.changedTouches[0].clientY >= chessboardRect.top && event.changedTouches[0].clientY <= chessboardRect.bottom) // 在棋盘范围内
                {
                    var targetCell = null;
                    let min_d_sqr = 100000000;
                    for (const cell of document.getElementsByClassName("cell"))
                    {
                        const { left, top, width, height } = cell.getBoundingClientRect()
                        const centerX = left + width / 2
                        const centerY = top + height / 2
                        const d_sqr = Math.pow(event.changedTouches[0].clientX - centerX, 2) + Math.pow(event.changedTouches[0].clientY - centerY, 2)
                        if (d_sqr < min_d_sqr)
                        {
                            min_d_sqr = d_sqr;
                            targetCell = cell;
                        }
                    }
                    leap(draggingPiece, targetCell);
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
                    redPiece.carrier = true;
                    const carrierCheckbox = document.getElementById("carrierCheckbox" + (6 - initHeroes.length));
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
                const bluePiece = createPiece("blue", initHeroes.pop(), 6 - initHeroes.length);
                Pieces.push(bluePiece);
                chessboard.children[i].appendChild(bluePiece);
                if (chessboard.children[i].classList.contains("base"))
                {
                    bluePiece.carrier = true;
                    const carrierCheckbox = document.getElementById("carrierCheckbox" + (6 - initHeroes.length));
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
    document.addEventListener('contextmenu', event => event.preventDefault()); // 禁用右键菜单
    document.addEventListener('mouseup', function (event)
    {
        if (event.button === 2)
        {
            event.preventDefault()
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    });
}

// 启动游戏
initializeGame();
saveState();