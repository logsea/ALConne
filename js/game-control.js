

function gridmap_getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(event.clientX - rect.left),
      y: Math.floor(event.clientY - rect.top)
    };
}

bfsOffset = [[0, 1], [1, 0], [0, -1], [-1, 0]]
function check_player_reachable(pos){
    if(game_GridmapGrid[pos[0]][pos[1]] == 0 || game_GridmapGrid[pos[0]][pos[1]] == 2) return [false, undefined];
    let GridmapStatus = Array(game_MapSize.x).fill().map(()=>Array(game_MapSize.y).fill({distance:100, route:[]}));
    var q = []
    q.push({pos:game_playerPos, len:0})
    GridmapStatus[game_playerPos[0]][game_playerPos[1]] = {distance:0, route:[]}
    while(q.length > 0){
        let nowP = q[0].pos
        let nowDis =q[0].len
        for(let i = 0; i < 4; i++){
            let nextP = [nowP[0]+bfsOffset[i][0], nowP[1]+bfsOffset[i][1]]
            if(nextP[0] == pos[0] && nextP[1] == pos[1]){
                let route = GridmapStatus[nowP[0]][nowP[1]].route
                route.push(i)
                return [true, route]
            }
            if(nextP[0] < 0 || nextP[0] >= game_MapSize.x || nextP[1] < 0 || nextP[1] >= game_MapSize.y ) continue;
            if(game_GridmapGrid[nextP[0]][nextP[1]] == 1){
                if(GridmapStatus[nextP[0]][nextP[1]].distance > nowDis + 1){
                    GridmapStatus[nextP[0]][nextP[1]].distance = nowDis + 1
                    let nowRoute = JSON.parse(JSON.stringify(GridmapStatus[nowP[0]][nowP[1]].route))
                    nowRoute.push(i)
                    GridmapStatus[nextP[0]][nextP[1]].route = nowRoute
                    q.push({pos:nextP, len:nowDis + 1})
                }
            }
        }
        q.shift()
    }
    return [false, undefined]
}

gridPrintToken = ["X", " ", "P", "E", "B"];
function log_map_status(){
    let lineF = "┌";
    for(let j = 0; j < game_MapSize.x; j++){
        if(j == game_MapSize.x - 1){
            lineF += "─┐\n";
            break;
        }
        lineF += "─┬";
    }
    for(let i = 0; i < game_MapSize.y; i++){
        let lineA = "│";
        let lineB = "├";
        for(let j = 0; j < game_MapSize.x; j++){
            var token = gridPrintToken[game_GridmapGrid[j][i]];
            if(j == game_MapSize.x - 1){
                lineA += token+"│";
                lineB += "─┤";
                break;
            }
            lineA += token+"│";
            lineB += "─┼";
        }
        if(i == game_MapSize.y - 1){
            lineB = "└"
            for(let j = 0; j < game_MapSize.x; j++){
                if(j == game_MapSize.x - 1){
                    lineB += "─┘\n";
                    break;
                }
                lineB += "─┴";
            }
        }
        lineF += lineA+"\n";
        lineF += lineB+"\n";
    }
    console.log(lineF);
}

function init_game_gridmap(canvas, gridmsg){
    // this is gridmap, 0 is unreachable, 1 is reachable, 2 is player, 3 is enemy, 4 is boss
    //                  5 is player on enemy, 6 is player on boss
    let mapsize = gridmsg["mapsize"];
    game_GridmapGrid = Array(mapsize[0]).fill().map(()=>Array(mapsize[1]).fill(1));
    game_playerPos = gridmsg["startpos"];
    game_GridmapGrid[game_playerPos[0]][game_playerPos[1]] = 2;
    game_MapSize = { x: gridmsg["mapsize"][0], y:gridmsg["mapsize"][1]}
    game_PlayerElem = $(canvas).siblings(".map-grid-player")[0]
    for(let enemy of gridmsg["enemy"]){
        game_GridmapGrid[enemy.pos[0]][enemy.pos[1]] = 3;
    }
    log_map_status();
    game_MovingFlag = false;
    $(canvas).click(event=>{
        if(game_MovingFlag == true){
            return;
        }
        let mousePos = gridmap_getMousePos(event.target, event);
        let gridX = Math.floor((mousePos.x - game_GridStartPos[0]) / 50);
        let gridY = Math.floor((mousePos.y - game_GridStartPos[1]) / 50);
        if(gridX < 0 || gridX >= game_MapSize.x || gridY < 0 || gridY >= game_MapSize.y) return;
        $(event.target).closest(".game-block").find(".map-grid-dbgmsg").text(String(gridX)+","+String(gridY));
        let reachMsg = check_player_reachable([gridX, gridY]);
        if(reachMsg[0] == true){
            game_MovingFlag = true;
            if(game_GridmapGrid[game_playerPos[0]][game_playerPos[1]] == 2){
                game_GridmapGrid[game_playerPos[0]][game_playerPos[1]] = 1
            }
            else if(game_GridmapGrid[game_playerPos[0]][game_playerPos[1]] == 5){
                game_GridmapGrid[game_playerPos[0]][game_playerPos[1]] = 3
            }
            else if(game_GridmapGrid[game_playerPos[0]][game_playerPos[1]] == 6){
                game_GridmapGrid[game_playerPos[0]][game_playerPos[1]] = 4
            }
            if(game_GridmapGrid[gridX][gridY] == 1){
                game_GridmapGrid[gridX][gridY] = 2
            }
            else if(game_GridmapGrid[gridX][gridY] == 3){
                game_GridmapGrid[gridX][gridY] = 5
            }
            else if(game_GridmapGrid[gridX][gridY] == 4){
                game_GridmapGrid[gridX][gridY] = 6
            }
            game_playerPos = [gridX, gridY];
            // TODO: change from offset to fixed position
            player_move(reachMsg[1]);
        }
    })

}

function game_frame_main(){
    if(game_TimeTick < game_MaxTick){
        // battle continue
        if(game_BattlePlay == false){
            window.requestAnimationFrame(game_frame_main);
            return;
        }
        game_TimeTick += 1;
        for(let char of game_BattlePlayerChar){
            char.update();
        }
        for(let char of game_BattleEnemyChar){
            char.update();
        }
        for(let dmg of game_damageNumberList){
            dmg.pos[1] -= 1;
            dmg.tick += 1;
        }
        game_BattleEnemyChar = game_BattleEnemyChar.filter(obj=>{
            return !(obj.dead == true && obj.tick > 60);
        })
        game_damageNumberList = game_damageNumberList.filter(function( obj ) {
            return obj.tick < 60;
        });
        draw_battle();
        window.requestAnimationFrame(game_frame_main);
    }
    // battle end
}

class GameChar{
    constructor(char, imageFile){
        this.char = char;
        this.imageFile = imageFile;
        this.image = new Image();
        this.image.src = imageFile;
        this.tick = 0;
        this.attackCD = 2000;
        this.attacking = false;
        this.dead = false;
        this.SpiritPosX = 0;
        this.SpiritPosY = 0;
    }
    draw(context, width, height, xUnit){
        let imgWidth = this.image.naturalWidth;
        let imgHeight = this.image.naturalHeight;
        let needHeight = imgHeight * (75 / imgWidth);
        let posYC = height - needHeight - 10 + 5 * Math.sin(this.tick / 6 * Math.PI / 12);
        this.SpiritPosY = posYC;
        if(this.dead == true){
            if(this.tick < 15) var atkPosYOff = -this.tick;
            else var atkPosYOff = (this.tick - 15) * 3;
        }
        if(this.attacking == true){
            if(this.tick < 30) var atkPosXOff = this.tick;
            else var atkPosXOff = 60 - this.tick;
        }
        if(this.alignment == "self"){
            var posX = width / 2 - xUnit * this.char.pos - 50;
            if(atkPosXOff != undefined){
                posX += atkPosXOff;
            }
            if(atkPosYOff != undefined){
                posYC += atkPosYOff;
            }
            this.SpiritPosX = posX;
            context.drawImage(this.image, posX, posYC, 75, needHeight);
        }
        if(this.alignment == "enemy"){
            var posX = width / 2 + xUnit * this.char.pos
            if(atkPosXOff != undefined){
                posX += atkPosXOff;
            }
            if(atkPosYOff != undefined){
                posYC += atkPosYOff;
            }
            this.SpiritPosX = posX;
            context.drawImage(this.image, posX, posYC, 75, needHeight);
        }

        let hpPercent = this.char.hp / this.char.hpmax;
        context.strokeRect(posX, height - 110, 75, 10);
        if(hpPercent > 0.75) context.fillStyle = "mediumseagreen";
        else if(hpPercent > 0.25) context.fillStyle = "yellow";
        else context.fillStyle = "red";
        context.fillRect(posX+1, height - 109, 73*hpPercent, 8);
        context.fillStyle = "black";
    }
    update(){
        this.tick += 1;
        if(this.attacking == false) this.attackCD -= this.char.reload;
        if(this.alignment == "self"){
            if(this.hpChanged == true){
                let exp_per = String((this.char.hp/this.char.hpmax*100).toFixed(1))+"%";
                this.control.find(".battle-character-hp").css("background", 
                    "linear-gradient(to right,mediumseagreen,mediumseagreen "+ 
                    exp_per + ", transparent " + exp_per + ", transparent)");
                this.control.find(".battle-character-hp").text(String(this.char.hp)+"/"+String(this.char.hpmax));
                this.hpChanged = false;
            }
            if(this.tpChanged == true){
                let exp_per = String((this.char.tp/this.char.tpmax*100).toFixed(1))+"%";
                this.control.find(".battle-character-tp").css("background", 
                    "linear-gradient(to right,cornflowerblue,cornflowerblue "+ 
                    exp_per + ", transparent " + exp_per + ", transparent)");
                this.control.find(".battle-character-tp").text(String(this.char.tp)+"/"+String(this.char.tpmax));
                this.tpChanged = false;
            }
        }
        if(this.char.hp > this.char.hpmax) this.char.hp = this.char.hpmax;
        if(this.char.tp > this.char.tpmax) this.char.tp = this.char.tpmax;

        if(this.attackCD <= 0){
            this.attacking = true;
            this.attackCD = 2000;
            this.tick = 0;
            // todo: now attack frame is frame 0, maybe change to bind animation after
            this.attack();
        }
        if(this.attacking == true){
            if(this.tick >= 60){
                this.attacking = false;
                this.tick = 0;
            }
        }
    }
    attack(){
        let attack = {};
        let closest = 1000;
        attack.baseDmg = this.char.firepower;
        let AttackAimList = game_BattlePlayerChar
        if(this.alignment == "self") AttackAimList = game_BattleEnemyChar
        for(let ch of AttackAimList){
            if(ch.dead == false && closest > ch.char.pos){
                closest = ch.char.pos;
                var aim = ch;
            }
        }
        if(aim == undefined) return;
        aim.get_attack(attack);
        this.char.tp += 250;
        this.tpChanged = true;
    }
    get_attack(attack){
        let getDmg = attack.baseDmg
        this.char.hp -= getDmg;
        if(this.char.hp <= 0){
            this.char.hp = 0;
            this.dead = true;
            this.tick = 0;
        }
        this.hpChanged = true;
        let dropHpRate = getDmg/this.char.hpmax;
        let getTp = Math.floor(dropHpRate * 1000 * 1.5);
        this.char.tp += getTp;
        this.tpChanged = true;

        game_damageNumberList.push(
            {"number": getDmg, "tick": 0, "pos": [this.SpiritPosX, this.SpiritPosY]});
    }
}

function link_char_and_contrle($charctrl, char){
    imageFile = "yukikaze.png";
    let charDrawMsg = new GameChar(char, game_QcharImagePath + imageFile);
    charDrawMsg.alignment = "self";
    charDrawMsg.control = $charctrl;
    charDrawMsg.hpChanged = false;
    charDrawMsg.tpChanged = false;
    game_BattlePlayerChar.push(charDrawMsg);
    $charctrl.find(".battle-character-hp").text(String(char.hp)+"/"+String(char.hpmax));
}

function init_game_battle(canvas, battlemsg){
    game_TimeTick = 0;
    game_MaxTick = 3600;
    game_BattlePlay = true;
    game_BattleCanvas = canvas;
    game_BattlePlayerChar = [];
    game_BattleEnemyChar = [];
    game_damageNumberList = [];
    game_QcharImagePath = "pages_data/charQ/";
    let QcharEnemyImagePath = "pages_data/enemyQ/";
    // for(let char of battlemsg.player.playerchar){
    //     imageFile = "yukikaze.png";
    //     let charDrawMsg = new GameChar(char, QcharImagePath + imageFile);
    //     charDrawMsg.alignment = "self";
    //     game_BattlePlayerChar.push(charDrawMsg);
    // }
    for(let char of battlemsg.enemy.enemy){
        imageFile = "yukikaze.png";
        let charDrawMsg = new GameChar(char, QcharEnemyImagePath + imageFile);
        charDrawMsg.alignment = "enemy";
        game_BattleEnemyChar.push(charDrawMsg);
    }

    window.requestAnimationFrame(game_frame_main)
}

function pause_game(){
    game_BattlePlay = !game_BattlePlay;
    return game_BattlePlay
}