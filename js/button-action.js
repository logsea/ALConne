

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

function get_mapdetail(area, mapid){
    send = {
        'type':'main-map-'+String(area)+'-'+String(mapid)
    }
    link_client_pagemain(send)
    rememberAreaId = area
    rememberMapId = mapid
}

function get_mapgrid_initial(){
    send = {
        'type':'battle-gridmapstart',
        'areaId':rememberAreaId,
        'mapId':rememberMapId
    }
    link_client_pagemain(send)
}

function get_battle_start(){
    send = {
        'type': 'battle-battlestart',
        'x': game_playerPos[0],
        'y': game_playerPos[1]
    }
    link_client_pagemain(send)
}

function get_item_image_url(itemid){
    if(itemid == "exp") return "./pages_data/item/exp.png"
    if(itemid == "money") return "./pages_data/item/money.png"
    else return "./pages_data/item/"+String(itemid)+".png"
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