import random
import copy
from character import BattleChar

class GameMap:
    def __init__(self):
        super().__init__()
        self.clear = False
        self.enemyPosList = []
        self.enemyDestoryPosList = []
        self.mapSize = [0, 0]
        self.killedEnemy = 0

    def set_map_msg(self, msg):
        _msg = copy.deepcopy(msg)
        self.mapSize = _msg["mapsize"]
        self.enemyLevel = _msg["enemylevel"]
        self.dropitem = _msg["dropitem"]
        self.mapdrop = _msg["mapdrop"]
        self.occurenemy = _msg["occurenemy"]
        self.enemyAppearControl = _msg["grid"]["enemy"]
        self.bossAppearControl = _msg["grid"]["boss"]
        self.playerAppearControl = _msg["grid"]["player"]
        self.enemyGroups = _msg["enemy"]

        self.playerfleet = None
    
    def get_map_msg_newmap(self):
        msg = {}
        msg["enemy"] = []
        # set new map
        newEnemyNum = self.enemyAppearControl["appear"][self.killedEnemy]
        random.shuffle(self.enemyAppearControl["pos"])
        for i in range(newEnemyNum):
            newP = self.enemyAppearControl["pos"].pop()
            enemy = random.choice(range(len(self.enemyGroups)))
            self.enemyPosList.append({"pos":newP, "enemy": enemy})
            msg["enemy"].append(
                {"pos": newP, "enemyid": enemy, "enemyintensity": self.enemyGroups[enemy]["battleitensity"]})

        # return msg
        msg["mapsize"] = self.mapSize
        msg["startpos"] = self.playerAppearControl["startpos"]
        return msg

    def set_map_msg_refresh(self, res):
        pass

    def get_map_msg_refresh(self):
        pass
