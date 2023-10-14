import hero_data from "../assets/hero-data.json" assert { type: 'json' };

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

const HERO_DATA = hero_data;

function formatSkill(text)
{
    const skillLabels = ["锁定技", "限定技"];
    for (let label of skillLabels)
    {
        text = text.replace(label, "<span class='skill-label'>" + label + "</span>");
    }

    text = text.replace(/<(\d+)>/g, "＜<span class='skill-range'>$1</span>＞");

    text = text.replace(/“([\u4e00-\u9fa5]+)”/g, "“<span class='skill-term'>$1</span>”");

    text = text.replace(/〖([\u4e00-\u9fa5]+)〗/g, "〖<span class='skill-ref'>$1</span>〗");

    text = text.replace(/(（[\u4e00-\u9fa5]+面技能）)/g, "<span class='skill-side'>$1</span>");

    // text = text.replace(/\d/g, function(match) {
    //     return String.fromCharCode(match.charCodeAt(0) + 0xFEE0);
    // });

    text = text.replace("黑桃", "<span class='skill-suit spade'>♠</span>");
    text = text.replace("红桃", "<span class='skill-suit heart'>♥</span>");
    text = text.replace("梅花", "<span class='skill-suit club'>♣</span>");
    text = text.replace("方块", "<span class='skill-suit diamond'>♦</span>");

    // text = text.replace("黑桃", '<i class="fa-solid fa-spade" style="color: #000000;"></i>');
    // text = text.replace("红桃", '<i class="fa-solid fa-heart" style="color: #ff2e2e;"></i>');
    // text = text.replace("梅花", '<i class="fa-solid fa-club" style="color: #000000;"></i>');
    // text = text.replace("方块", '<i class="fa-solid fa-diamond" style="color: #ff2e2e;"></i>');

    text = text.replace("若结果为黑色", "若结果为<span class='skill-color-black'>黑色</span>");
    text = text.replace("若结果为红色", "若结果为<span class='skill-color-red'>红色</span>");

    return text;
}

// format every skill
for (let name in HERO_DATA)
{
    for (let skillName in HERO_DATA[name]["技能"])
    {
        HERO_DATA[name]["技能"][skillName] = formatSkill(HERO_DATA[name]["技能"][skillName]);
    }
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

export { terrain, HERO_DATA, weapons, armors, horses };