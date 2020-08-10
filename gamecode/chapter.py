import numlimit as lmt

db = None

def area_msg(area_id):
    msg = {}
    needArea = db.area[int(area_id)]
    msg["areaid"] = needArea["areaid"]
    msg["areaname"] = needArea["areaname"]
    msg["areanickname"] = needArea["areanickname"]
    msg["mapnum"] = len(needArea["map"])
    if(int(area_id) == 1):
        msg["prev"] = False
    if(int(area_id) == lmt.max_area_num):
        msg["next"] = False
    msg["map"] = []
    for i in needArea["map"]:
        mapmsg = {}
        mapmsg["mapid"] = i["mapid"]
        msg["map"].append(mapmsg)
    return msg

def map_msg(area_id, map_id):
    msg = {}
    for i in db.area[int(area_id)]["map"]:
        if(int(i["mapid"]) == int(map_id)):
            needMap = i
            break
    # needMap = db.area[int(area_id)]["map"][int(map_id)]
    msg["mapname"] = needMap["mapname"]
    if("intro" not in needMap):
        msg["intro"] = "本关卡暂无介绍信息"
    else:
        msg["intro"] = needMap["intro"]
    msg["areaid"] = db.area[int(area_id)]["areanickname"]
    msg["mapid"] = needMap["mapid"]
    msg["mapnum"] = needMap["mapnum"]
    msg["enemylevel"] = needMap["enemylevel"]
    msg["enemy"] = needMap["occurenemy"]
    itemlist = []
    for item in needMap["dropitem"]:
        itemd = {}
        itemd["id"] = item["id"]
        itemd["rarity"] = db.get_rarity(item["id"])
        itemlist.append(itemd)
    msg["dropitem"] = itemlist
    
    itemlist = []
    for item in needMap["mapdrop"]:
        itemd = {}
        itemd["id"] = item["id"]
        itemd["rarity"] = db.get_rarity(item["id"])
        itemlist.append(itemd)
    msg["mapdrop"] = itemlist
    return msg

def mapgrid_msg(area_id, map_id, gameMap):
    msg = {}
    for i in db.area[int(area_id)]["map"]:
        if(int(i["mapid"]) == int(map_id)):
            needMap = i
            break
    msg["mapname"] = needMap["mapname"]
    msg["areaid"] = db.area[int(area_id)]["areanickname"]
    msg["mapid"] = needMap["mapid"]
    gameMap.set_map_msg(needMap)
    msg["gridmsg"] = gameMap.get_map_msg_newmap()
    return msg

def mapgrid_next_msg():
    msg = {}
    return msg

def init_battle_msg(gameMap, playerFleet, enemyFleet, gameBattle):
    msg = {}
    gameBattle.set_battle_msg(playerFleet, enemyFleet, db)
    msg["player"] = gameBattle.get_player_fleep_msg(playerFleet)
    msg["enemy"] = gameBattle.get_next_group_msg(db)
    pass

def ret_msg(cate, cate_id = None):
    if(cate == "chapter"):
        msg = area_msg(cate_id)
        return "mapselect", msg
    elif(cate == "map"):
        areaid, mapid = cate_id.split("-")
        msg = map_msg(areaid, mapid)
        return "mapdetail", msg
    elif(cate == "gridmapstart"):
        areaid, mapid = cate_id.split("-")
        msg = mapgrid_msg(areaid, mapid)
        return "gridmapstart", msg
    elif(cate == "gridmapnext"):
        over, msg = mapgrid_next_msg(areaid, mapid)
        if(over == True):
            return "gridmapend", msg
        else:
            return "gridmapnext", msg
    elif(cate == "battlescene"):
        pass

def ret_msg_and_setup_gridmap(cate, cate_id, gameMap):
    areaid, mapid = cate_id.split("-")
    msg = mapgrid_msg(areaid, mapid)
    return "gridmapstart", msg

def ret_msg_and_setup_battle(gameMap, playerFleet, enemyFleet, gameBattle):
    msg = init_battle_msg(gameMap, playerFleet, enemyFleet, gameBattle)
    return "battlestart", msg