import json
import glob
import os
from character import Character
from game_text.utiles import equipRarityNeedBlueprint

root = os.path.dirname(os.path.abspath(__file__))

class DataBase:
    def __init__(self):
        super().__init__()

        self.read()

    def read(self):
        self.char = {}
        # all attr
        self.attr = [
            "hp", "firepower", "torpedo", "planebomb", "planetorp", "planeaa",
            "aim", "flexibility", "torpflex", "aa", "armor", "antitorp", "antiair",
            "reload", "tpreload", "repair", "fastrepair"
        ]

        self.area = {}
        self.item = {}
        
        file = open(os.path.join(root,"data/char/all_char.txt"))
        lines = [line.rstrip('\n') for line in file]
        for id in lines:
            char = self.read_char(id)
            self.char[char.id] = char

        file = open(os.path.join(root,"data/map/all_area.txt"))
        lines = [line.rstrip('\n') for line in file]
        for id in lines:
            area = self.read_area(id)
            self.area[area["areaid"]] = area

        # read all item
        self.item["blueprint"] = {}
        self.read_items(["equip", "normal"])

        self.char_equipslot_rarity = [
            [1, 1, 1, 1, 1, 1],
            [2, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 2],
            [3, 2, 2, 2, 2, 2],
            [3, 3, 3, 3, 3, 3],
            [4, 3, 3, 3, 3, 3],
            [4, 4, 4, 4, 4, 4],
            [5, 5, 5, 4, 4, 4],
            [5, 5, 5, 5, 5, 5],
            [6, 6, 6, 5, 5, 5],
        ]
        self.rarity_enhence = [
            None,
            [],
            [10],
            [10],
            [10],
            [20, 20, 60],
            [30, 30, 80, 110],
        ]
        self.exp_core = [
            11, 12, 13, 14, 15
        ]
        self.exp_add = [
            100, 300, 1000, 3000, 10000
        ]
        self.unique_equip_materia = [
            [10, 0, 20, 5, 0],
            [15, 0, 20, 50, 5],
            [15, 5, 20, 150, 50]
        ]

    def read_char(self, id):
        file = open(os.path.join(root,"data/char/"+id+".json"), encoding='UTF-8')
        char = json.load(file)
        return Character(char)

    def read_area(self, id):
        file = open(os.path.join(root,"data/map/"+id+".json"), encoding='UTF-8')
        area = json.load(file)
        area_ = {}
        area_["areaid"] = area["areaid"]
        area_["areaname"] = area["areaname"]
        area_["areanickname"] = area["areanickname"]
        area_["map"] = []
        for i in area["map"]:
            map = {}
            map["mapid"] = i["mapid"]
            map["mapnum"] = (int)(i["mapnum"])
            map["enemy"] = []
            for j in range(map["mapnum"]):
                enemy = i["enemy"][j]
                mapenemy = []
                for ey in enemy:
                    mapenemy.append({"id":ey["id"], "level":ey["level"]})
                map["enemy"].append(mapenemy)
            area_["map"].append(map)

        return area_
        
    def read_items(self, types):
        for itype in types:
            self.item[itype] = {}
            url = os.path.join(root,"data/item/"+itype)
            files = glob.glob(url+"/*.json")
            for file in files:
                f = open(file, encoding='UTF-8')
                items = json.load(f)
                for item in items["item"]:
                    itemobj = self.read_item(item, itype)
                    self.item[itype][itemobj["id"]] = itemobj

    def read_item(self, item, itype):
        if(itype == "equip"):
            itemobj = {
                "id":item["id"],
                "name":item["name"],
                "rarity":item["rarity"],
                "type":item["type"],
                "lv":item["lv"],
                "attr":{}
                }
            if("desc" in item):
                itemobj["desc"] = item["desc"]
            for k, v in item["attr"].items():
                itemobj["attr"][k] = v
            needBlueprint = equipRarityNeedBlueprint(item["rarity"])
            if(needBlueprint != None):
                self.item["blueprint"][item["id"]] = {
                    "id": item["id"],
                    "num": needBlueprint,
                    "rarity":item["rarity"],
                }
            return itemobj
        elif(itype == "normal"):
            itemobj = {
                "id":item["id"],
                "name":item["name"] + "设计图",
                "rarity":item["rarity"],
            }
            if("desc" in item):
                itemobj["desc"] = item["desc"]
            return itemobj

