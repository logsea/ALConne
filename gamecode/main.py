# -*- coding: utf-8 -*-

import os
import json

import database
import character
import chapter
import player as playerclass

db = database.DataBase()
character.db = db
playerclass.db = db
chapter.db = db
player = playerclass.Player()

print("Game Start")

def ret_plain_text(msg):
    return str(msg)

def load_savedata():
    with open("save/save.json", encoding='UTF-8') as f:
        savedata = json.load(f)
        player.readsave(savedata)
    pass

load_savedata()

def ret_main_msg(cate):
    if('-' in cate):
        cate, cateId = cate.split('-', 1)
    else:
        cateId = None
    if(cate == "mainpage" or cate == "charlist" or cate == "chardetail"):
        retType, retMsg = player.ret_msg(cate, cateId)
    elif(cate == "chapter" or cate == "map" or cate == "gridmapstart"):
        retType, retMsg = chapter.ret_msg(cate, cateId)
    else:
        retType = None
        retMsg = None
    msg = {
        "type": retType,
        "msg": retMsg
    }
    return msg