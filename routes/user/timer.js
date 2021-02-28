module.exports=(req, res, next)=>{
    const timer=setInterval(()=>{
        return res.set({
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            "Access-Control-Allow-Origin":'https://www.gatmauel.com'
        }).write(`id: ${Math.random().toString().substring(2, 8)}\ndata: ${new Date().valueOf().toString()}\n\n`);
    }, 300);

    res.on('close', ()=>{
        clearInterval(timer);
    });
}