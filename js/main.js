link_client_pagemain = null;
let mainFrame = null;
const max_block_num = 50;

function $paragraph(text){
    let $ret = $("<div/>", {
        "class": "paragraph"
    });
    $ret.text(text);
    return $ret;
}

function $nextblock(code, next_text){
    let $nextblock = $("<div/>", {
        "class": "next-block"
    });
    if(next_text == null) next_text = "继续";
    $nextblock.append($("<div/>", {
        "class": "next-button",
        "title": code
    }).text(next_text));
    $nextblock.click((e)=>{
        code = $(e.target).attr('title')
        send = {
            'type': code
        }
        link_client_pagemain(send)
    });
    return $nextblock;
}

function append_plain_text(res){
    let $elem = $("<div/>", {
        "class": "game-block"
    });
    for (line of res.content.split('\n')){
        $elem.append($paragraph(line))
    };
    if(typeof(res.next_text) !== 'undefined')
        $elem.append($nextblock(res.next, res.next_text));
    else $elem.append($nextblock(res.next, null));
    // $elem.text(res.content)
    return $elem;
}

function append_main(res){
    let $elem = $("#template-block .main-page-block").clone(true, true);

    let money_text =    res["money"]+"/"+res["moneymax"];
    let oil_text =      res["oil"]+"/"+res["oilmax"];
    let ruby_text =     res["diamond"];
    let player_name =   res["name"];
    let player_level =  "Lv."+res["level"];
    let player_exp =    res["exp"]+"/"+res["expmax"];


    $elem.find(".main-resource .resource-money-number").text(money_text);
    $elem.find(".main-resource .resource-oil-number").text(oil_text);
    $elem.find(".main-resource .resource-ruby-number").text(ruby_text);
    $elem.find(".main-name").text(player_name);
    $elem.find(".main-lv").text(player_level);
    $elem.find(".main-exp").text(player_exp);

    exp_per = String((res["exp"]/res["expmax"]*100).toFixed(1))+"%";

    $elem.find(".main-exp").css("background", 
        "linear-gradient(to right,rgb(129, 185, 77),rgb(129, 185, 77) " + 
        exp_per + ", transparent " + exp_per + ", transparent)");
    return $elem;
}

function append_charlist(res){
    let $elem = $("#template-block .char-select").clone(true, true);
    let $charblock = $("#template-block .char-list-block");
    for(char of res){
        let $new_charblock = $charblock.clone()
        $new_charblock.addClass("rarity-"+String(char["rarity"]))
        $new_charblock.find(".char-id").text(char["id"])
        $new_charblock.find(".char-lv").text("Lv."+String(char["level"]))
        $new_charblock.find(".char-star-ready").text("★".repeat(char["star"]))
        $new_charblock.find(".char-star-notready").text("★".repeat(5-char["star"]))
        $new_charblock.find(".char-name").text(char["name"])
        $new_charblock.click(evnet=>{
            get_chardetail($(event.target).find('.char-id').text())
        })
        $elem.find(".char-list").append($new_charblock)
    }
    return $elem;
}

function append_chardetail(res){
    let attr = [
        "hp", "armor", "antitorp", "firepower", "torpedo", "aa", "planebomb", "planetorp", "planeaa",
        "aim", "flexibility", "torpflex", "antiair",
        "reload", "tpreload", "repair", "fastrepair"
    ]
    let attrname = [
        "HP", "装甲", "防雷", "火力", "鱼雷", "对空", "航弹", "航雷", "空战", "命中",
        "闪避", "鱼雷机动", "防空", 
        "装填", "技能装填", "维修", "损管"
    ]
    let $elem = $("#template-block .char-detail").clone(true, true);
    $elem.find(".char-detail-attr-lv").text("Lv."+res["level"])
    $elem.find(".char-detail-attr-exp").text("EXP."+res["exp"]+"/"+res["expmax"])
    exp_per = String((res["exp"]/res["expmax"]*100).toFixed(1))+"%";
    $elem.find(".char-detail-attr-exp").css("background", 
        "linear-gradient(to right,rgb(129, 185, 77),rgb(129, 185, 77) " + 
        exp_per + ", rgba(129, 185, 77, 0.2) " + exp_per + ", rgba(129, 185, 77, 0.2))");
    $elem.find(".char-detail-name").text(res["name"])
    for(const attrid of Array(attr.length).keys()){
        $attrdiv = $("<div/>", {
            "class": "char-detail-attr-item char-detail-attr-short"
        });
        $attrdiv.append($("<div/>", {
            "class": "char-detail-attr-item-name"
        }).text(attrname[attrid]))
        $attrdiv.append($("<div/>", {
            "class": "char-detail-attr-item-value"
        }).text(res["attr"][attr[attrid]]))
        // $attrdiv.text(attrname[attrid]+":"+res["attr"][attr[attrid]])
        $elem.find(".char-detail-attr").append($attrdiv)
    }
    return $elem;
}

function get_add_block(res){
    if(res.type == "plaintext"){
        $newblock = append_plain_text(res);
        
    }
    else if(res.type == "main"){
        $newblock = append_main(res.msg);
    }
    else if(res.type == "charlist"){
        $newblock = append_charlist(res.msg);
    }
    else if(res.type == "chardetail"){
        $newblock = append_chardetail(res.msg);
    }
    else{
        return undefined;
    }
    return $newblock
}
function check_block_overflow(){
    let $elements = mainFrame.find(".game-block")
    if($elements.length > max_block_num){
        $($elements).first().remove()
    }
}

function add_block(resjson){
    res = JSON.parse(resjson);
    $newblock = get_add_block(res);
    mainFrame.append($newblock);
    check_block_overflow()

    window.setTimeout(function(){
        $($newblock).addClass("appear")
    }, 10);
    window.setTimeout(function(){
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    }, 110);
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

$(document).ready(function(){
    mainFrame = $("#gamebody");


})