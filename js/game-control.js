

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
    game_TimeTick = 0
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
            player_move(reachMsg[1]);
        }
    })

}

function game_frame_main(){

}

function init_game_battle(canvas, battlemsg){
    
}