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


def ret_msg(cate, cate_id = None):
    if(cate == "chapter"):
        msg = area_msg(cate_id)
        return "mapselect", msg