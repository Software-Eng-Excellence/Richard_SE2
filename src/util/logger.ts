
import winstom from "winston";

const logDir = './logs';  // Define log directory
const isDev = process.env.NODE_ENV !== 'production';




const logFileformat = winstom.format.combine(
    winstom.format.timestamp(),
    winstom.format.json(),
    winstom.format.splat(),
    winstom.format.errors({stack:true}),
)
const logConsoleFormat = winstom.format.combine(
    winstom.format.colorize(),
    winstom.format.timestamp({format:"HH:mm:ss"}),
     winstom.format.errors({stack:true}),
    winstom.format.splat(),
    winstom.format.printf(
        ({timestamp, level, message, stack}) => { 
            return `[${timestamp}] ${level}: ${message} ${stack || ""}`;   

        }
    )
);

const logger = winstom.createLogger({
    level:"info",
    transports: [
     
        new winstom.transports.File({ filename: "error.log",dirname:logDir, level: "error",format:logFileformat}),
        new winstom.transports.File({ filename: "ruri489494.log",dirname:logDir,format:logFileformat }),
    ],
    exceptionHandlers: [
        new winstom.transports.File({ filename: "exceptions.log" ,dirname: logDir})
    ]
});
if(isDev){
    logger.add(new winstom.transports.Console({format: logConsoleFormat})); 
    logger.level = "debug";
}


export default logger;
