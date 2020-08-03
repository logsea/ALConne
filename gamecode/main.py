# -*- coding: utf-8 -*-

import os
import json

import database
import character
import player as playerclass

db = database.DataBase()
character.db = db
playerclass.db = db
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
    ret_type, ret_msg = player.ret_msg(cate)
    msg = {
        "type": ret_type,
        "msg": ret_msg
    }
    return msg