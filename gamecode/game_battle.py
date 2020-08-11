db = None

from character import BattleChar

class GameBattle:
    def __init__(self):
        super().__init__()

    def set_battle_msg(self, playerFleet, enemyFleet, db):
        self.playerFleet = playerFleet

        self.enemyGroups = enemyFleet
        self.enemyWave = len(enemyFleet["battleunit"])
        self.enemys = []
    
    def get_player_fleet_msg(self, player, fleetId):
        msg = {"playerchar": []}
        for i in player.fleet[fleetId]["char"]:
            if(i == 0):
                continue
            chardata = db.char[i]
            char = BattleChar(chardata, player.char[i]["level"])
            char.name = chardata.name
            msg["playerchar"].append(char.get_msg_as_json())
        return msg


    def get_next_group_msg(self, db):
        if(len(self.enemyGroups) == 0):
            return False

        self.enemys = []
        msg = {"enemy": []}
        enemyGroup = self.enemyGroups["battleunit"][0]
        self.enemyGroups["battleunit"].pop(0)
        for enemy in enemyGroup:
            chardata = db.char[enemy["id"]]
            char = BattleChar(chardata, enemy["level"])
            if("pos" in enemy):
                char.pos = enemy["pos"]
            self.enemys.append(char)
            charmsg = char.get_msg_as_json()
            msg["enemy"].append(charmsg)
        return msg