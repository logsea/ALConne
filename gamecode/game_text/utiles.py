import unicodedata

def shipTypeName(stype, subtype):
    shiptype=["驱逐舰", "巡洋舰", "战列舰", "航空母舰", "潜艇", "辅助舰"]
    shipsubtype=[
        ["舰队驱逐舰"],
        ["轻巡洋舰", "重巡洋舰", "大型巡洋舰"],
        ["高速战列舰", "低速战列舰", "战列巡洋舰", "超无畏舰", "无畏舰", "前无畏舰"],
        ["舰队航空母舰", "轻型航空母舰"],
        ["小型潜艇"],
        ["维修舰"],
    ]
    return shiptype[stype-1], shipsubtype[stype-1][subtype-1]

def equipTypeName(etype):   #每类装备（一行）都多留一些空位,0号不要
    equipType = [ "不可装备",
        "驱逐主炮", "轻巡主炮", "重巡主炮", "大巡主炮", "战列主炮", "大口径主炮", "小口径主炮", "", "", "",
        "鱼雷", "轻装药鱼雷", "重装药鱼雷", "", "", "", "", "", "", "",
        "超小口径防空武器", "小口径防空武器", "中口径防空武器", "", "", "", "", "", "", "",
        "火控雷达", "防空雷达", "搜索雷达", "泛用型雷达", "", "", "", "", "", "",
        "抗穿甲弹装甲板", "轻型装甲板", "中型装甲板", "超重型装甲板", "防鱼雷装置", "舰爆反应装甲", "", "", "", "",
        "战斗机", "鱼雷机", "轰炸机", "侦察机", "反潜机", "多用途侦察机", "", "", "", "",
        "舵机", "引擎", "通讯设施", "声纳", "发烟器", "装填装置", "水上飞机", "其他设备"
        ]
    return equipType[etype]

# 从1到15阶装备，分别需要的蓝图数量
def equipRarityNeedBlueprint(rarity):
    return [None, None, 3, 3, 5, 10, 20, 20, 30, 35, 40, 45, 50, 75, 100, 100][rarity - 1]

def AttackTypeName(atype):
    attackType = ["火炮", "鱼雷", "航弹", "航雷"]
    return attackType[atype - 1]

def getEquipStar(star):
    if(star < 6):
        return "◆"*star
    else:
        return "★"*(star//5)+"◆"*(star%5)

def getEquipSlot(now, max):
    if(max == 0):
        return "不可强化"
    else:
        return "★" * now + "☆" * (max-now)
    pass

def skillEffect(sktype):
    return [
        "发射炮弹", "发射鱼雷", "起飞舰载机"
    ][sktype]

def cannotLearnSkillText(skillrank):
    return[
        "volley Burst 初始即可学习",
        "Refine-2",
        "Refine-4",
        "Refine-7",
        "Refine-17，改造6星，装备改进型武备III型"
    ][skillrank]

def Kaitext(kai):
    return [
        "", "改一", "改二", "改三", "改四", "改五", "改六", "终改"
    ][kai]

def uniqueEquipNeedText(ref, star):
    retStr = "Refine-{}".format(ref)
    if(star>0):
        retStr += "需求星级:{}".format(star)
    return retStr