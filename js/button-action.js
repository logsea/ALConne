

function get_main(){
    send = {
        'type':'main-mainpage'
    }
    link_client_pagemain(send)
}

function get_charlist(){
    send = {
        'type':'main-charlist'
    }
    link_client_pagemain(send)
}

function get_chardetail(id){
    send = {
        'type':'main-chardetail-'+String(id)
    }
    link_client_pagemain(send)
}

function get_mapselect(id){
    send = {
        'type':'main-chapter-'+String(id)
    }
    link_client_pagemain(send)
}

function get_noblock_mapselect_changearea(id, func, target){
    send = {
        'type':'main-chapter-'+String(id)
    }
    res = link_client_noblock_pagemain(send, func, target)
    return res
}


$(document).ready(()=>{
    $(".main-action-character").click(function(){
        get_charlist()
    })
    rememberAreaId = 1
    $(".main-battle").click(function(){
        get_mapselect(rememberAreaId)
    })
})