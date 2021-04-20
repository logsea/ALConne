const thrift = require('thrift');
const {ipcRenderer} = require('electron');
let userService = require('../MsgPass')
let npType = require('../mp_types')
let thriftConnection = thrift.createConnection('127.0.0.1', 4242, {
    connect_timeout: 100
})
let thriftClient = thrift.createClient(userService, thriftConnection)

thriftConnection.on("error",function(e) {
    console.log(e);
})

function link_client(msg){
    send_msg = JSON.stringify(msg)
    console.log(send_msg)
    thriftClient.send(send_msg, (err, res) => {
        if(err){
            console.error(err)
        }
        else{
            console.log(res)
            add_block(res)
        }
    })
}

function link_client_noblock(msg, func, target){
    send_msg = JSON.stringify(msg)
    console.log(send_msg)
    res_ = undefined
    return thriftClient.send(send_msg, (err, res) => {
        if(err){
            console.error(err)
        }
        else{
            // res_ = res
            // return res_
            res = JSON.parse(res);
            console.log(res)
            func(res["msg"], target)
        }
    })
}

function link_client_noreply(msg){
    send_msg = JSON.stringify(msg)
    console.log(send_msg)
    return thriftClient.send(send_msg, err => {
        if(err){
            console.error(err)
        }
    })
}

function gamestart(){
    send = {
        // 'type':'script-introduction-intro=1'
        'type':'main-mainpage'
    }
    link_client(send)
}

$(document).ready(()=>{
    $("#gamestart").click(function(){ // click game start and set class
        $("#gamebody").removeClass("height-no-active")
        $("#gametitle").addClass("height-no-active")
        gamestart()
    })
    $("#gameend").click(()=>{
        ipcRenderer.send("close-app");
    })
    link_client_pagemain = link_client;
    link_client_noblock_pagemain = link_client_noblock;
    link_client_noreply_pagemain = link_client_noreply;
})