def player_exp_max(level, all = False):
    exp = level * 20
    if level > 20:
        exp += (level - 20) * 20
    if level > 40:
        exp += (level - 40) * 40
    if level > 70:
        exp += (level - 70) * 100
    if level > 100:
        exp += (level - 100) * 300

    return exp
    
def player_money_max(level, all = False):
    money = 10000 + level * 400
    if level > 40:
        money += (level - 40) * 600

    return money

def player_oil_max(level, all = False):
    oil = 5000 + level * 100
    if level > 40:
        oil += (level - 40) * 400

    return oil

char_exp_need = [0]
char_level_max = 100
need_exp = 0
for i in range(90): # until 90->91
    if(i<=40):
        need_exp+=100
    elif(i<=60):
        need_exp+=200
    elif(i<=60):
        need_exp+=200
    elif(i<=70):
        need_exp+=300
    elif(i<=80):
        need_exp+=400
    elif(i<=90):
        need_exp+=500
    char_exp_need.append(need_exp)
#90->91 need 20000
char_exp_need+=[21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 44000] #to100
char_exp_need+=[25000, 25000, 25000, 25000, 25000, 30000, 30000, 30000, 30000, 30000] #to110
char_exp_need+=[40000, 40000, 40000, 40000, 40000, 50000, 50000, 50000, 50000, 50000] #to120

char_exp_need_from1 = []

exp = 0
for i in char_exp_need:
    exp += i
    char_exp_need_from1.append(exp)

def char_exp_max(level):
    if(level >= char_level_max):
        return 0
    return char_exp_need[level]

def char_exp_detail(level, exp):
    return [char_exp_need_from1[level] + exp, char_exp_need_from1[char_level_max - 1] - (char_exp_need_from1[level] + exp)]

charskill_lvup_money = [100]
for i in range(1, char_level_max):
    charskill_lvup_money.append(charskill_lvup_money[i - 1] + (100+i*10)*(i // 15 + 1))

modern_refine_mentalunit = [
    0, 30, 100, 120, 150, 200
]
unlock_mentalunit = [
    10, 45, 145, 185, 225, 300
]
# print(charskill_lvup_money)