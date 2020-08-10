db = None

class GameBattle:
    def __init__(self):
        super().__init__()

    def set_battle_msg(self, playerFleet, enemyFleet, db):
        self.enemyGroups = self.enemyGroups[enemyFleet]
        self.enemyWave = len(enemyGroup["battleunit"])
        self.enemys = []
    
    def get_player_fleep_msg(self, fleetId):
        pass

    def get_next_group_msg(self, db):
        if(len(self.enemyGroup) == 0):
            return False

        self.enemys = []
        msg = {"enemy": []}
        enemyGroup = self.enemyGroups[0]
        for enemy in enemyGroup:
            chardata = db.char[enemy["id"]]
            char = BattleChar(chardata, enemy["lv"])
            self.enemys.append(char)
            charmsg = char.get_msg_as_json()
            msg["enemy"].append(charmsg)
        return msg
