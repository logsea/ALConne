# -*- coding: utf-8 -*-

import os
import json

import database
import character
import chapter
import player as playerclass
from game_map import GameMap

import game_battle
from game_battle import GameBattle

db = database.DataBase()
character.db = db
playerclass.db = db
chapter.db = db
game_battle.db = db

playerdata = playerclass.Player()
chapter.player = playerdata

gameMap = None
gameBattle = None

print("Game Start")

def ret_plain_text(msg):
    return str(msg)

def load_savedata():
    with open("save/save.json", encoding='UTF-8') as f:
        savedata = json.load(f)
        playerdata.readsave(savedata)
    pass

load_savedata()

def new_game_grid():
    global gameMap
    gameMap = GameMap()

def new_game_battle():
    global gameBattle
    gameBattle = GameBattle()

def ret_main_msg(cate):
    if('-' in cate):
        cate, cateId = cate.split('-', 1)
    else:
        cateId = None
    if(cate == "mainpage" or cate == "charlist" or cate == "chardetail"):
        retType, retMsg = playerdata.ret_msg(cate, cateId)
    elif(cate == "chapter" or cate == "map"):
        retType, retMsg = chapter.ret_msg(cate, cateId)
    elif(cate == "gridmapstart"):
        new_game_grid()
        retType, retMsg = chapter.ret_msg_and_setup_gridmap(cate, cateId, gameMap, playerdata.fleet)
    elif(cate == "battlestart"):
        new_game_battle()
        x, y = cateId.split('-', 1)
        cate = [int(x), int(y)] # x, y
        retType, retMsg = chapter.ret_msg_and_setup_battle(gameMap, cate, gameBattle)
    else:
        retType = None
        retMsg = None
    msg = {
        "type": retType,
        "msg": retMsg
    }
    return msg

chardetailNoReply = [
    "getequip"
]

def ret_chardetail_msg(cate, receiveMsg):
    action, charid = cate.split('-', 1)
    if(action in chardetailNoReply):
        retType, retMsg = playerdata.receive_detail_msg(action, receiveMsg)
        retMsg["noreply"] = True
    else:
        retType, retMsg = playerdata.ret_detail_msg(action, charid)
    msg = {
        "type": retType,
        "msg": retMsg
    }
    return msg

def ret_battle_msg(cate, res):
    if(cate == "gridmapstart"):
        new_game_grid()
        retType, retMsg = chapter.ret_msg_and_setup_gridmap(cate, res["areaId"], res["mapId"], gameMap, playerdata.fleet)
    elif(cate == "battlestart"):
        new_game_battle()
        x = res["x"]
        y = res["y"]
        pos = [int(x), int(y)] # x, y
        retType, retMsg = chapter.ret_msg_and_setup_battle(gameMap, pos, gameBattle)
    elif(cate == "battlenextgroup"): # nextgroup means one battle have multi group enemy
        retType, retMsg = chapter.ret_battle_next_group(gameBattle)
        if("finish" in retMsg):
            chapter.enemyKilled()
    elif(cate == "battlecontinue"): # continue means in standard time, player can't kill enemy, for boss
        pass
    else:
        retType = ""
        retMsg = ""
    msg = {
        "type": retType,
        "msg": retMsg
    }
    return msg

def ret_item_msg(code, msg):
    # print(code, msg)
    if(code == "equip"):
        categories = msg
        retType, retMsg = playerdata.equipWithCategory(categories)
    else:
        retType = ""
        retMsg = ""
    msg = {
        "type": retType,
        "msg": retMsg
    }    
    return msg