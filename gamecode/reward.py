import typing
import random
def battle_end_reward(rewardList, rewardMulti):
    reward = []
    for item in rewardList:
        if(isinstance(item["value"], typing.List)):
            value = random.randrange(item["value"][0], item["value"][1])
        else:
            value = item["value"]
        # money ect. can directly increase amount, but other increase chance
        if(item["id"] == "exp" or item["id"] == "money"):
            value *= rewardMulti
        else:
            chance = item["chance"] * rewardMulti
            if(chance > 1):
                if(random.random() > 0.5):
                    value *= 2
            else:
                if(random.random() > chance):
                    value = 0
        if(value > 0):
            reward.append({"id": item["id"], "type": item["type"], "value": value})
    return reward