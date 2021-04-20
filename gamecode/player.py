import numlimit as lmt

db = None

def new_unique_equip():
    ue = []
    for i in range(3):
        ue.append({"level":0, "refine":0, "enhance":0})
    return ue

class Player:
    def __init__(self):
        super().__init__()

    def readsave(self, save):

        player = save["player"]
        self.name = player["name"]
        self.level = player["level"]
        self.exp = player["exp"]
        self.money = player["money"]
        self.diamond = player["diamond"]
        self.oil = player["oil"]
        self.secretary = player["secretary"]

        chars = save["char"]
        self.char = {}
        for char in chars:
            ch = {}
            ch["id"] = char["id"]
            ch["level"] = char["level"]
            ch["exp"] = char["exp"]
            ch["star"] = char["star"]
            ch["rarity"] = char["rarity"]
            ch["refine"] = char["refine"]
            ch["equip"] = char["equip"]
            ch["skill"] = char["skill"]
            ch["unique_equip"] = char["unique_equip"]
            if("unique_equip_detail" in char):
                ch["unique_equip_detail"] = char["unique_equip_detail"]
            else:
                ch["unique_equip_detail"] = new_unique_equip()
            self.char[ch["id"]] = ch

        fleets = save["fleet"]
        self.fleet = []
        for fleet in fleets:
            fl = {}
            fl["id"] = fleet["id"]
            fl["name"] = fleet["name"]
            fl["char"] = fleet["char"]
            self.fleet.append(fl)

        items = save["item"]
        # print(items)
        self.item = {}
        self.item["equip"] = {}
        for item in items["equip"]:
            it = {
                "id":item["id"],
                "enhance":item["enhance"]
            }
            self.item["equip"][item["id"]] = it

        self.item["normal"] = {}
        for item in items["normal"]:
            it = {
                "id":item["id"],
                "number":item["number"]
            }
            self.item["normal"][it["id"]] = it
        
        self.item["blueprint"] = {}
        for item in items["blueprint"]:
            it = {
                "id":item["id"],
                "number":item["number"]
            }
            self.item["blueprint"][it["id"]] = it
        
        self.item["mentalunit"] = {}
        for item in items["mentalunit"]:
            it = {
                "id":item["id"],
                "number":item["number"]
            }
            self.item["mentalunit"][it["id"]] = it


    def ret_msg(self, cate, id = None):
        #TODO: 把大类信息返回的设置放到单独的函数中
        """ 这里返回的是一个大页的信息

        Args:
            cate (string): [description]
            id (int, optional): [description]. Defaults to None.

        Returns:
            object: 返回的信息，后面将会处理为JSON返回
        """
        ret = {}
        if(cate == "mainpage"):
            ret["name"] = self.name
            ret["level"] = self.level
            ret["exp"] = self.exp
            ret["expmax"] = lmt.player_exp_max(self.level)
            ret["money"] = self.money
            ret["moneymax"] = lmt.player_money_max(self.level)
            ret["diamond"] = self.diamond
            ret["oil"] = self.oil
            ret["oilmax"] = lmt.player_oil_max(self.level)
            ret["secretary"] = self.secretary
            return "main", ret
        elif(cate == "charlist"):
            ret = []
            for charid in self.char:
                ch_msg = {}
                # raise(ValueError(str(db.char)+str(char)))
                char_detail = db.char[charid]
                char = self.char[charid]
                ch_msg["id"] = char["id"]
                ch_msg["level"] = char["level"]
                ch_msg["star"] = char["star"]
                ch_msg["rarity"] = char["rarity"]
                ch_msg["refine"] = char["refine"]
                ch_msg["name"] = char_detail.name
                ret.append(ch_msg)
            return "charlist", ret
        elif(cate == "chardetail"):
            id = int(id)
            char_detail = db.char[id]
            char = self.char[id]
            ret["id"] = char["id"]
            ret["level"] = char["level"]
            ret["exp"] = char["exp"]
            ret["expmax"] = lmt.char_exp_need[char["level"]]
            ret["star"] = char["star"]
            ret["rarity"] = char["rarity"]
            ret["refine"] = char["refine"]
            ret["name"] = char_detail.name
            ret["attr"] = self.char_get_attr(id)
            return "chardetail", ret

    def ret_detail_msg(self, action, charid):
        ret = {}
        char = self.char[int(charid)]
        ret["id"] = char["id"]
        if(action == "reinforce"):
            ret["level"] = char["level"]
            ret["exp"] = char["exp"]
            ret["expmax"] = lmt.char_exp_need[char["level"]]
            return "detailreinforce", ret
        if(action == "equip"):
            ret["equip"] = []
            equipable = db.get_char_msg(char["id"], "equipable")
            for i in range(db.equipCount):
                equip = char["equip"][i]
                newequip = {}
                newequip["equipable"] = equipable[i]
                if(equip == 0):
                    newequip["id"] = 0
                else:
                    newequip["id"] = equip["id"]
                    newequip["enhance"] = equip["enhance"]
                    newequip["attr"] = db.get_equip_msg(equip["id"], equip["enhance"])
                ret["equip"].append(newequip)
            return "detailequip", ret

    def receive_detail_msg(self, action, message):
        if(action == "getequip"):
            if(message["prevEquipChar"] == None):
                # 三种情况不更改角色装备，没有该装备，该装备强化等级上限低于指定值
                if((message["equipID"] not in self.item["equip"]) or len(self.item["equip"][message["equipID"]]) <= message["enhance"] or self.item["equip"][message["equipID"]][message["enhance"]] == 0):
                    return "getequip", {"success": False}
                self.item["equip"][message["equipID"]][message["enhance"]] -= 1
                if(self.char[message["char"]]["equip"][message["slot"]] != 0):
                    slot = self.char[message["char"]]["equip"][message["slot"]]
                    self.item["equip"][slot["id"]][slot["enhance"]] += 1
                self.char[message["char"]]["equip"][message["slot"]] == {"id": message["equipID"], "enhance": message["enhance"]}
                return "getequip", {"success": True}
            else:
                # TODO: 只需要检查换装备的角色有没有这装备就行了
                for i in range(len(self.char[message["prevEquipChar"]]["equip"])):
                    equip = self.char[message["prevEquipChar"]]["equip"][i]
                    if(equip != 0 and equip["id"] == message["equipID"]):
                        self.char[message["char"]]["equip"][message["slot"]] = equip
                        self.char[message["prevEquipChar"]]["equip"][i] = 0
                        return "getequip", {"success": True}
                return "getequip", {"success": False}

    def char_get_attr(self, id):
        attr = {}
        char_detail = db.char[id]
        char = self.char[id]
        for attr_name in db.attr:
            attr[attr_name] = char_detail.attrlv(attr_name, char["level"])
        return attr

    def equipWithCategory(self, categories):
        """给定需要的装备类型，返回仓库中有的装备

        Args:
            categories (list): 一般是整形组成的数组，如果里面有all就说明是从物品栏中检索，就会返回所有的。

        Returns:
            object: 包含所有装备的JSON
        """
        ret = []
        for equipID in self.item["equip"]:
            equip = self.item["equip"][equipID]
            if(db.item["equip"][equipID]["type"] in categories or "all" in categories):
                for enhanceNum in range(len(equip["enhance"])):
                    if(equip["enhance"][enhanceNum] != 0):
                        ret.append({"id":equip["id"], "enhance":enhanceNum, "number":equip["enhance"][enhanceNum], "attrs":db.get_equip_attr(equip["id"], enhanceNum)})
                        print(ret)
        return "equipCategory", ret


    def char_message(self, charid):
        star = "★" * self.char[charid]["star"] + "☆" * (5 - self.char[charid]["star"])
        return {"star":star}

    def char_get_exp(self, charid, exp):
        self.char[charid]["exp"] += exp
        while(self.char[charid]["exp"] >= lmt.char_exp_need[self.char[charid]["level"]]):
            if(self.char[charid]["level"] >= lmt.char_level_max):
                break
            self.char[charid]["exp"] -= lmt.char_exp_need[self.char[charid]["level"]]
            self.char[charid]["level"] += 1
    
    def reward_item(self, item):
        if(item["cate"] == "I"):
            warehouse = self.item["normal"]
        elif(item["cate"] == "E"):
            warehouse = self.item["equip"]
        if(item["id"] not in warehouse):
            warehouse[item["id"]] = item["value"]
        else:
            warehouse[item["id"]] += item["value"]
            
    def get_blueprint_num(self, cid):
        if(cid in self.item["blueprint"]):
            return self.item["blueprint"][cid]
        else:
            return 0

    def get_mentalunit_num(self, cid):
        if(cid in self.item["mentalunit"]):
            return self.item["mentalunit"][cid]
        else:
            return 0

    def use_mentalunit(self, cid, num):
        if(cid in self.item["mentalunit"]):
            if(self.item["mentalunit"][cid] >= num):
                self.item["mentalunit"][cid] -= num
                return True
            return False
        else:
            return False

    def char_modern_refine(self, cid):
        self.char[cid]["star"] += 1