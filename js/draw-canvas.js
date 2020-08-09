function draw_gridmap(canvas, gridmsg){
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    let mapsize = gridmsg["mapsize"]
    let startposx = canvas.width / 2 - mapsize[0] * 50 / 2
    let startposy = canvas.height / 2 - mapsize[1] * 50 / 2
    game_GridStartPos = [startposx, startposy] // gamewide global, map draw pos offset
    
    // fill rect as background, delete temporary
    // draw grid
    for(let i = 0; i <= mapsize[0]; i+=1){
        context.moveTo(startposx + i * 50, startposy + 0)
        context.lineTo(startposx + i * 50, startposy + mapsize[1] * 50)
    }
    for(let i = 0; i <= mapsize[1]; i+=1){
        context.moveTo(startposx + 0, startposy + i * 50)
        context.lineTo(startposx + mapsize[0] * 50, startposy + i * 50)
    }
    context.strokeStyle = 'black'
    context.lineWidth = 2
    context.stroke()
    context.beginPath()

    for(let enemy of gridmsg["enemy"]){
        let url = "pages_data/map/enemy-t"+String(enemy["enemyintensity"]+".png")
        let img = new Image();
        img.onload = function() {
            context.fillStyle="rgba(255, 0, 0, 0.5)";
            let spx = game_GridStartPos[0] + enemy["pos"][0] * 50, spy = game_GridStartPos[1] + enemy["pos"][1] * 50
            context.fillRect(spx, spy, 50, 50);
            context.drawImage( img, 
                spx, spy,
                50, 50
            );   
        }
        img.src = url
    }
}