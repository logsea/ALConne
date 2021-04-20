
function _getDmgText(key, value, attr){
    let damagePerAmmo = attr["damage"];
    let damageCount = attr["shellnum"] * attr["round"];
    return ["伤害", String(damagePerAmmo)+"x"+String(damageCount)];
}

function _getFireRoundText(key, value, attr){
    return ["射速", String(value/1000.0)+"秒/轮"];
}

function _getDmgFactorText(key, value, attr){
    let valString = "";
    for(let factor of value){
        valString += String(factor)+"-"
    };
    valString = valString.substring(0, valString.length - 1);
    return ["伤害系数", valString];
}

function _getOriginText(key, value, attr){
    return ["阵营", _origin[value]];
}

function _getfireangleText(key, value, attr){
    return ["射角", String(value) + "°"];
}

_normalAttribute = {
    "name": "名称",
    "desc": "描述",
    "hp": "耐久", 
    "armor": "装甲", 
    "firepower": "火力",
    "torpedo": "雷击",
    "plane": "航空",
    "reload": "装填",
    "aa": "防空",
    "aim": "命中",
    "flexibility": "机动",
    "repair": "损管",
    "firerange": "射程",
    "spreadrange": "散布",
    "ammospeed": "弹速",
    "fireangle": "射角",
    "dmgrange": "伤害范围",
    "dmgeffect": "伤害修正",
    "dmgtype": "伤害属性",
    "typeeffect": "属性效率"
}

_notShowAttribute = [
    "dmgeffect", "//", "dmgrange"
]

_equipAttributeShowOrder = [
    "name",
    "damage", "filling", 
    "firepower", "torpedo", "plane", "reload", "aa", "aim", "flexibility", "repair",
    "ammospeed", "dmgfactor",
    "firerange", "fireangle", "spreadrange", "dmgrange", "origin", "dmgeffect",
    "desc"
]

_origin = {
    0: "未知",
    1: "白鹰",
    2: "皇家",
    3: "重樱",
    4: "铁血",
    5: "北方联合",
    6: "东煌",
    7: "自由鸢尾",
    8: "维希教廷",
    9: "萨丁帝国",
    10: "塞壬",
    11: "烬",
}

_characterAttributeShowOrder = [
    "hp", "armor", "firepower", "torpedo", "aa", "plane", "aim", "flexibility", "reload", "repair"
]

function _getNormalAttribute(key, value, attr){
    return [_normalAttribute[key], String(value)];
}

_specialAttributeText = {
    "damage": _getDmgText,
    "filling": _getFireRoundText,
    "dmgfactor": _getDmgFactorText,
    "origin": _getOriginText,
};

function attributeText(key, value, attr){
    if(key in _notShowAttribute) return [undefined, undefined];
    if(key in _normalAttribute) return _getNormalAttribute(key, value, attr);
    if(key in _specialAttributeText) return _specialAttributeText[key](key, value, attr);

    return [String(key)+"*", String(value)]
};