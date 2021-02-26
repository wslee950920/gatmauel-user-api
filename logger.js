const {createLogger, format, transport}=require('winston');

const logger=createLogger({
    level:'info',
    format:format.json(),
    transport:[
        new transport.defaultMaxListeners({filename:'combined.log'}),
        new transport.File({filename:'error.log', level:'error'})
    ]
});

if(process.env.NODE_ENV!=='production'){
    logger.add(new transports.Console({format:format.simple()}));
}

module.exports=logger;