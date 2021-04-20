/****************************************/
/*******GET INFORMATION FROM SERVER******/
/****************************************/

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
    nowCheckCharId = id;
}
function get_chardetail_equip(id){
    send = {
        'type':'chardetail-equip-'+String(id)
    }
    link_client_pagemain(send)
}
function get_chardetail_reinforce(id){
    send = {
        'type':'chardetail-reinforce-'+String(id)
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

function get_equipable_equip(require, func, target){
    msg = 'item-equip';
    send = {
        'type':msg,
        'message': require
    };
    link_client_noblock_pagemain(send, func, target)
}

/****************************************/
/*******SEND INFORMATION TO SERVER*******/
/****************************************/

function send_char_equip(equipID, slot){
    send = {
        'type':'chardetail-getequip',
        'message': {
            'char': nowCheckCharId,
            'slot': slot,
            'equipID': nowEquipList[equipID].id,
            'enhance': nowEquipList[equipID].enhance,
            'prevEquipChar': nowEquipList[equipID].char
        }
    };
    link_client_noreply_pagemain(send)
}




$(document).ready(()=>{
    console.log("PAGE READY");

    $(".main-action-character").click(function(){
        get_charlist()
    })
    rememberAreaId = 1
    $(".main-battle").click(function(){
        get_mapselect(rememberAreaId)
    })

    $(".char-detail-navi .overall").click(()=>{
        get_chardetail(nowCheckCharId)
    })
    $(".char-detail-navi .equip").click(()=>{
        get_chardetail_equip(nowCheckCharId)
    })
    $(".char-detail-navi .reinforce").click(()=>{
        get_chardetail_reinforce(nowCheckCharId)
    })
    $(".char-detail-navi .skill").click(()=>{
    })
    $(".char-detail-navi .refine").click(()=>{
    })
    $(".char-detail-navi .other").click(()=>{
    })

    $(".char-detail-equip").on("click", ()=>{

    })

    $(".char-equip-image").on("click", event=>{
        $block = $(event.target).parent();
        let selectEquipNum = $block.parent().children().index($block);
        if(!$(event.target).siblings(".char-equip-brief").hasClass("active")){
            $(event.target).closest(".char-equip-list").find(".char-equip-brief").removeClass("active");
            $(event.target).siblings(".char-equip-brief").addClass("active");
        }
        if(selectEquipNum != detailEquipSelect){
            detailEquipSelect = selectEquipNum;
            let $elem = $(mainFrame.find(".game-block")).last();
            set_chardetail_equip_attrs($elem);
        }
        else{ // change equip
            get_equipable_equip(detailEquip[detailEquipSelect].equipable, popup_choose_equip);
        }
    })

    $(".char-equip-detail-action").on("click", event=>{
        let $container = $(event.target).closest(".char-detail-attr").find(".char-equip-detail");
        $container.children().removeClass("active");
        $(event.target).siblings().removeClass("active");
        $(event.target).addClass("active");
        if($(event.target).hasClass("attrs")){
            $container.find(".char-equip-attrs").addClass("active");
        }
        if($(event.target).hasClass("reinforce")){
            $container.find(".char-equip-reinforce").addClass("active");
        }
    })


    /****************************************/
    /*****************POPUP******************/
    /****************************************/
    $(".popup-select.choose-cancel").on("click", event=>{
        // 直接关掉这个弹出窗口
        $(event.target).closest(".popup").removeClass("active");
    });

    $(".popup-select.choose-equip-ok").on("click", event=>{
        $(event.target).closest(".popup").removeClass("active");

        // 把装备装到角色上，并返回服务器信息。
        send_char_equip(popupSelectEquip, detailEquipSelect)
        detailEquip[detailEquipSelect] = nowEquipList[popup_choose_equip]
        let $elem = now_activate_block()
        set_chardetail_equip_attrs($elem, detailEquip[detailEquipSelect])
        change_chardetail_icon($elem.find(".char-equip-list .char-equip-block").eq(detailEquipSelect), detailEquip[detailEquipSelect])
    })
})