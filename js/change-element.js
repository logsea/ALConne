

function change_chardetail_icon($equipicon, equip){
    let equipImageUrl = "url('../pages_data/equip/" + String(equip["id"]) + ".png')";
    $equipicon.find(".char-equip-image").css({"background-image": equipImageUrl});
    $equipicon.find(".char-equip-image").on("click", (event)=>{
        if($(event.target).siblings(".char-equip-brief").hasClass("active")){
            $(event.target).closest(".char-equip-list").find(".char-equip-brief").removeClass("active");
            $(event.target).siblings(".char-equip-brief").addClass("active");
        }
    });
    $equipicon.find(".char-equip-name").text(equip.name);
    $equipicon.find(".char-equip-origin").text(equip.origin);
}

function set_chardetail_equip_attrs($elem, equip){
    $elem.find(".char-equip-attrs").empty();
    if(equip.id != 0){
        for(const k of _equipAttributeShowOrder){
            if(k in equip.attrs){
                let v = equip.attrs[k]
                let [title, text] = attributeText(k, v, equip.attrs);
                let $attrdiv = $("<div/>", { "class": "char-equip-attr" });
                $attrdiv.append($("<div/>", { "class": "char-equip-attrname" }).text(title));
                $attrdiv.append($("<div/>", { "class": "char-equip-value" }).text(text));
                $elem.find(".char-equip-attrs").append($attrdiv);
            }
        }
    }
    else{
        let $attrdiv = $("<div/>", { "class": "char-equip-attr" });
        $attrdiv.append($("<div/>", { "class": "char-equip-attrname" }).text("无详细信息"));
        $attrdiv.append($("<div/>", { "class": "char-equip-value" }).text(""));
        $elem.find(".char-equip-attrs").append($attrdiv);
        $elem.find(".char-equip-detail-choose .reinforce").css({"display": "none"});
    }
}


/****************************************/
/*****************POPUP******************/
/****************************************/

function set_popup_equip_attrs($elem){
    $attrs = $elem.find(".popup-equip-attrs");
    $attrs.empty();
    for(let k of _equipAttributeShowOrder){
        if(k in nowEquipList[popupSelectEquip].attrs){
            let v = nowEquipList[popupSelectEquip].attrs[k]
            let [title, text] = attributeText(k, v, nowEquipList[popupSelectEquip].attrs);
            let $attr = $("<div>", { "class": "popup-equip-attr"});
            $attr.append($("<div>", { "class": "popup-equip-attr-attrname"}).text(title));
            $attr.append($("<div>", { "class": "popup-equip-attr-value"}).text(text));
            $attrs.append($attr);
        }
    }
}