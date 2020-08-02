import numlimit as lmt

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

        chars = save["char"]
        self.char = {}
        for char in chars:
            ch = {}
            ch["id"] = char["id"]
            ch["level"] = char["level"]
            ch["exp"] = char["exp"]
            ch["star"] = char["star"]
            ch["refine"] = char["refine"]
            ch["equip"] = char["equip"]
            ch["slotenhence"] = char["slotenhence"]
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
        self.item = {}
        self.item["equip"] = {}
        for item in items["equip"]:
            it = {
                "id":item["id"],
                "number":item["number"]
            }
            self.item["equip"][it["id"]] = it

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

    def ret_msg(self, cate):
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
        return ret


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