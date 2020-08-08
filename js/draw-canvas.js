function draw_gridmap(canvas, gridmsg){
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
    mapsize = gridmsg["mapsize"]
    startposx = canvas.width / 2 - mapsize[0] * 50 / 2
    startposy = canvas.height / 2 - mapsize[1] * 50 / 2
    
    // fill rect as background, delete temporary
    // draw grid
    for (let i = 0; i <= mapsize[0]; i+=1){
        context.moveTo(startposx + i * 50, startposy + 0)
        context.lineTo(startposx + i * 50, startposy + mapsize[1] * 50)
    }
    for (let i = 0; i <= mapsize[1]; i+=1){
        context.moveTo(startposx + 0, startposy + i * 50)
        context.lineTo(startposx + mapsize[0] * 50, startposy + i * 50)
    }
    context.strokeStyle = 'black'
    context.lineWidth = 1
    context.stroke()
    context.beginPath()
}