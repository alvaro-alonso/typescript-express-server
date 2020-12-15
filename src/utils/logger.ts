import wiston, { format } from "winston";

const  { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    const env = process.env.NODE_ENV?.toUpperCase()
    return `${timestamp} [${env}] ${level}: ${message}`;
});

const options: wiston.LoggerOptions = {
    format: combine(
        timestamp(),
        myFormat,
    ),
    transports: [
        new wiston.transports.Console({
            level: process.env.NODE_ENV === "production" ? "info" : "debug"
        }),
        new wiston.transports.File({ filename: "debug.log", level: "debug" })
    ],
};

const logger = wiston.createLogger(options);

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

export default logger;