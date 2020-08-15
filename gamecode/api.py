from __future__ import print_function
import json
from thrift.transport import TSocket, TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

from pygen.mp import MsgPass

import main as gamemain
import game_text.exchanger as retText
import sys

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

class GameMessagePass:
    def send(self, res):
        msg = json.loads(res)
        print(msg)
        code = msg["type"]
        action, code = code.split('-', 1)
        if(action == "script"):
            ret = retText.ReturnText(code)
        elif(action == "main"):
            ret = gamemain.ret_main_msg(code)
        elif(action == "chardetail"):
            ret = gamemain.ret_chardetail_msg(code)
        elif(action == "battle"):
            ret = gamemain.ret_battle_msg(code, msg)
        else:
            ret = {
                "type":"error"
            }
        return json.dumps(ret)

def main():
    port = 4242
    ip = '127.0.0.1'
    handler = GameMessagePass()
    processor = MsgPass.Processor(handler)
    transport = TSocket.TServerSocket(host=ip, port=port)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()
    server = TServer.TThreadedServer(processor, transport, tfactory, pfactory)

    print("Start Server")
    server.serve()
    print("Server Done")

if __name__ == '__main__':
    main()