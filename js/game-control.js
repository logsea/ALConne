function init_game_gridmap(res){
    // this is gridmap, 0 is reachable, 1 is not, 2 is 
    let mapsize = res["mapsize"]
    game_GridmapGrid = Array(mapsize[1]).fill(Array(mapsize[0]).fill(0))
    game_playerPos = res["startpos"]
}