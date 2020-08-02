# -*- coding: utf-8 -*-

import os
import json

import player as playerclass

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
    msg = {
        "type": "main",
        "msg": player.ret_msg(cate)
    }
    return msg