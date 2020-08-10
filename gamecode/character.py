import math
import game_text.utiles

db = None

class Character():
    def __init__(self, data):
        super().__init__()

        self.loadData(data)

    def char_message(self):
        return {
            "type":utiles.shipTypeName(self.type,self.subtype)
            }

    def attrlv(self, attr, lv):
        if(attr == "hp"):
            return self.hp + (int)((self.hp100 - self.hp) * lv / 100)
        elif(attr == "firepower"):
            return self.firepower
        elif(attr == "torpedo"):
            return self.torpedo
        elif(attr == "planebomb"):
            return self.planebomb
        elif(attr == "planetorp"):
            return self.planetorp
        elif(attr == "planeaa"):
            return self.planeaa
        elif(attr == "aim"):
            return self.aim
        elif(attr == "flexibility"):
            return self.flexibility
        elif(attr == "torpflex"):
            return self.torpflex
        elif(attr == "aa"):
            return self.aa
        elif(attr == "armor"):
            return self.armor
        elif(attr == "antitorp"):
            return self.antitorp
        elif(attr == "antiair"):
            return self.antiair
        elif(attr == "reload"):
            return self.reload
        elif(attr == "tpreload"):
            return self.tpreload
        elif(attr == "repair"):
            return self.repair
        elif(attr == "fastrepair"):
            return self.fastrepair

    def loadData(self, data):
        self.id = data["id"]
        self.shipclass = data["shipclass"]
        self.name = data["name"]
        self.ename = data["ename"]
        self.type = data["type"]
        self.subtype = data["subtype"]
        self.rarity = data["rarity"]
        self.position = data["position"]
        self.equip = data["equip"]
        self.refine_equip = data["refine_equip"]

        attr = data["attribute"]

        self.hp = attr["hp"]
        self.hp100 = attr["hpmax"]

        if('firepower' in attr):
            self.firepower = attr["firepower"]
        else:
            self.firepower = 0

        if('torpedo' in attr):
            self.torpedo = attr["torpedo"]
        else:
            self.torpedo = 0

        if('planebomb' in attr):
            self.planebomb = attr["planebomb"]
        else:
            self.planebomb = 0

        if('planetorp' in attr):
            self.planetorp = attr["planetorp"]
        else:
            self.planetorp = 0

        if('planeaa' in attr):
            self.planeaa = attr["planeaa"]
        else:
            self.planeaa = 0

        self.aim = attr["aim"]
        
        self.flexibility = attr["flexibility"]

        self.torpflex = attr["torpflex"]

        self.aa = attr["aa"]

        self.armor = attr["armor"]

        self.antitorp = attr["antitorp"]

        self.antiair = attr["antiair"]

        self.reload = attr["reload"]

        self.tpreload = attr["tpreload"]

        self.repair = attr["repair"]

        self.fastrepair = attr["fastrepair"]

        self.skill = []
        for skill in data["skill"]:
            skillobj = {
                "name": skill["name"],
                "desc": skill["desc"]
            }
            self.skill.append(skillobj)

        if("skillrotate" in data):
            self.skillrotate = data["skillrotate"]

        if("unique_equip" in data):
            self.unique_equip = data["unique_equip"]
        else:
            self.unique_equip = [0, 0, 0]


class BattleChar():
    def __init__(self, data, lv):
        super().__init__()
        self.prepare(data, lv)

    def calc_attr_lv(self, attr, attrmax, lv):
        return attr + (int)((attrmax - attr) * lv / 100)
    
    def prepare(self, data, lv):
        self.id = data.id
        self.name = data.name
        self.type = data.type

        self.lv = lv
        self.hpmax = self.calc_attr_lv(data.hp, data.hp100, lv)
        self.hp = self.hpmax
        self.tp = 0
        self.tpmax = 1000
        self.ap = 0
        self.apmax = 400

        self.pos = data.position
        self.firepower = data.firepower
        self.torpedo = data.torpedo
        self.planebomb = data.planebomb
        self.planetorp = data.planetorp
        self.planeaa = data.planeaa
        self.aim = data.aim
        self.torpflex = data.torpflex
        self.aa = data.aa
        self.armor = data.armor
        self.antitorp = data.antitorp
        self.antiair = data.antiair
        self.reload = data.reload
        self.tpreload = data.tpreload
        self.repair = data.repair
        self.fastrepair = data.fastrepair
    
    def get_msg_as_json(self):
        msg = {}
        msg["id"]           = data.id
        msg["name"]         = data.name
        msg["type"]         = data.type
        msg["lv"]           = data.lv
        msg["hpmax"]        = data.hpmax
        msg["hp"]           = data.hp
        msg["tp"]           = data.tp
        msg["tpmax"]        = data.tpmax
        msg["ap"]           = data.ap
        msg["apmax"]        = data.apmax
        msg["pos"]          = data.pos
        msg["firepower"]    = data.firepower
        msg["torpedo"]      = data.torpedo
        msg["planebomb"]    = data.planebomb
        msg["planetorp"]    = data.planetorp
        msg["planeaa"]      = data.planeaa
        msg["aim"]          = data.aim
        msg["torpflex"]     = data.torpflex
        msg["aa"]           = data.aa
        msg["armor"]        = data.armor
        msg["antitorp"]     = data.antitorp
        msg["antiair"]      = data.antiair
        msg["reload"]       = data.reload
        msg["tpreload"]     = data.antitorp
        msg["repair"]       = data.antiair
        msg["fastrepair"]   = data.reload
        return msg

    def timeStemp(self, time = 0):
        if(time == 0):
            return math.ceil((self.apmax-self.ap)/self.reload)
        else:
            self.ap+=time*self.reload
            if(self.ap>=self.apmax):
                self.ap -= self.apmax
                return [True, self.ap]
            else:
                return [False, self.apmax - self.ap]

    def attack(self):
        if(self.type != 4):
            return [1, self.firepower]
        else:
            return [3, self.planebomb]
    
    def get_damage(self, dmg):
        self.hp-=dmg
        if(self.hp <= 0):
            self.hp = 0
            return True
        return False