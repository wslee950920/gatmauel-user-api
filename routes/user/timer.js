module.exports=async(req, res, next)=>{
    await res.set({
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        "Access-Control-Allow-Origin":'https://www.gatmauel.com',
        'X-Accel-Buffering': 'no'
    });
    
    const timer=setInterval(()=>{
        return res.write(`id: ${Math.random().toString().substring(2, 8)}\ndata: ${new Date().valueOf().toString()}\n\n`);
    }, 300);

    res.on('close', ()=>{
        clearInterval(timer);
    });
}