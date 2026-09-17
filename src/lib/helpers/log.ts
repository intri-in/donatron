const ALLOWED_LOG_LEVELS = ["production", "debug"]
    
export default function logMessageforAPI(indentifier: string, message:any, level = "debug" ){
    const logLevelFromEnv = (process.env.LOG_LEVEL && ALLOWED_LOG_LEVELS.includes(process.env.LOG_LEVEL)) ? process.env.LOG_LEVEL : "production"
    let shouldLog = true
    if(level=="error") {
        console.error(`[${indentifier}]: ${message}`)
        return
    }
    if(logLevelFromEnv=="production" && level!="error"){
        shouldLog = false 
    }
    if(shouldLog) console.log(`[${indentifier}]: ${message}`)
}