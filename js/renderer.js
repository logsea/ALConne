const thrift = require('thrift');
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
            // console.log(res)
            add_block(res)
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
    link_client_pagemain = link_client
})