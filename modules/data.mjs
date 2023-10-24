import hero_data from "../assets/hero-data.json" assert { type: 'json' };
import map from "../assets/map.json" assert { type: 'json' };
import terrain_info from "../assets/terrain-info.json" assert { type: 'json' };

// 地形
const TERRAIN = map;

// 地形信息
const TERRAIN_INFO = terrain_info;
// 英雄数据
const HERO_DATA = hero_data;

function format_skill(text)
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

    // text = text.replace("黑桃", "<span class='skill-suit spade'>♠</span>");
    // text = text.replace("红桃", "<span class='skill-suit heart'>♥</span>");
    // text = text.replace("梅花", "<span class='skill-suit club'>♣</span>");
    // text = text.replace("方块", "<span class='skill-suit diamond'>♦</span>");

    text = text.replace("黑桃", '<i class="fas fa-spade" style="color: #000000;"></i>');
    text = text.replace("红桃", '<i class="fas fa-heart" style="color: #ff2e2e;"></i>');
    text = text.replace("梅花", '<i class="fas fa-club" style="color: #000000;"></i>');
    text = text.replace("方块", '<i class="fas fa-diamond" style="color: #ff2e2e;"></i>');

    text = text.replace("若结果为黑色", "若结果为<span class='skill-color-black'>黑色</span>");
    text = text.replace("若结果为红色", "若结果为<span class='skill-color-red'>红色</span>");

    return text;
}

// format every skill
for (let name in HERO_DATA)
{
    for (let skillName in HERO_DATA[name]["技能"])
    {
        HERO_DATA[name]["技能"][skillName] = format_skill(HERO_DATA[name]["技能"][skillName]);
    }
}

function format_terrain(text)
{
    const terrain_names = Object.keys(terrain_info);
    for (let name of terrain_names)
    {
        text = text.replace(name, `<span style="color: ${terrain_info[name]["color"]}">` + name + "</span>");
    }

    text = text.replace(/“([\u4e00-\u9fa5]+)”/g, "“<span class='skill-term'>$1</span>”");

    text = text.replace("黑桃", '<i class="fas fa-spade" style="color: #000000;"></i>');
    text = text.replace("红桃", '<i class="fas fa-heart" style="color: #ff2e2e;"></i>');
    text = text.replace("梅花", '<i class="fas fa-club" style="color: #000000;"></i>');
    text = text.replace("方块", '<i class="fas fa-diamond" style="color: #ff2e2e;"></i>');

    text = text.replace("若结果为黑色", "若结果为<span class='skill-color-black'>黑色</span>");
    text = text.replace("若结果为红色", "若结果为<span class='skill-color-red'>红色</span>");

    text = text.replace("。", "。<br>")

    return text;
}

// format every terrain info
for (let name in TERRAIN_INFO)
{
    TERRAIN_INFO[name]["地形效果"] = format_terrain(TERRAIN_INFO[name]["地形效果"]);
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
    "的卢":    "穿越",
    "绝影":    "穿越",
    "爪黄飞电": "穿越",
    "赤兔":    "移动",
    "大宛":    "移动",
    "紫骅":    "移动",
    "乌云踏雪": "阻动",
    "燎原火":   "阻动",
}

export { TERRAIN, TERRAIN_INFO, HERO_DATA, weapons, armors, horses };