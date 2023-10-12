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