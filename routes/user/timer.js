module.exports=(req, res, next)=>{
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.set(headers);

    const timer=setInterval(()=>{
        return res.write(`id: ${Math.random().toString().substring(2, 8)}\ndata: ${new Date().valueOf().toString()}\n\n`);
    }, 1000);

    res.on('close', ()=>{
        clearInterval(timer);
    });
}