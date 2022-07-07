import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'
import express from  'express'
import path from 'path'
import moment from 'moment'

const logRoot = path.join('.', 'logs')
const {combine, timestamp, printf} = winston.format
const logFormat = printf(info=>`${info.timestamp} ${info.level} ${info.message}`)

const basic_format_info = {
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: logRoot,
    maxFiles: 60,
    zippedArchive: false
}

const basic_format_error = {
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(logRoot, 'error'),
    maxFiles: 60,
    zippedArchive: false
}


const option_info = {
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: logRoot,
    filename: '%DATE%.log',
    maxFiles: 30,
    zippedArchive: true
}

const option_error = {
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(logRoot, 'error'),
    filename: '%DATE%-error.log',
    maxFiles: 30,
    zippedArchive: true
}
const logFormat_audit = printf(info=>`${info.message}`)
const option_audit_info = {
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: logRoot,
    filename: 'Opertool_Audit_%DATE%.log',
    maxFiles: 30,
    zippedArchive: true
}

const option_audit_error = {
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(logRoot, 'error'),
    filename: 'Opertool_Audit_%DATE%.log',
    maxFiles: 30,
    zippedArchive: true
}

export enum ILogType {
    NORMAL = 0,
    ADMIN
}

export class Log {
    type: ILogType = ILogType.NORMAL;
    log!: winston.Logger;

    constructor(_type: ILogType) {
        this.type = _type;
        this.log = winston.createLogger({
            format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
            transports: [
                new winstonDaily({ filename: `${ILogType[_type]}_%DATE%.log`, ...basic_format_info }),
                new winstonDaily({ filename: `${ILogType[_type]}_%DATE%_error.log`, ...basic_format_error }),
            ],
        });

        if (process.env.NODE_ENV !== `production`) {
            this.log.add(
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
                })
            );
        }
    }

    addLog(...msgs: any[]) {
        let str = "";
        for (const msg of msgs) {
            try {
                str += JSON.stringify(msg).replace(/"/g, "") + " ";
            } catch (e) {
                str += msg + " ";
            }
        }

        this.log.info(str);
    }

    addErrorLog(...errs: any[]) {
        let str = "";
        for (const err of errs) {
            try {
                str += JSON.stringify(err).replace(/"/g, "") + " ";
            } catch (e) {
                str += err + " ";
            }
        }

        this.log.error(str);
    }
}

export class LogMan {
    private static logs:Log[] = []
    public static init() {
        Object.values(ILogType).filter((v) => !isNaN(Number(v))).forEach((typeVal)=>{
             this.logs.push( new Log(typeVal as ILogType) )
        })        
    }

    public static get(type:ILogType) {
        return this.logs.find(v=>v.type==type)!
    }
}

class Logger {
    private _log_audit!: winston.Logger
    private _log!: winston.Logger
    constructor() {
        this._log = winston.createLogger({
            format: combine( timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat ),
            transports: [
                new winstonDaily( option_info ),
                new winstonDaily( option_error )
            ]
        })

        if( process.env.NODE_ENV !== `production` ) {
            this._log.add( new winston.transports.Console({
                format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
            }))
        }
        

        this._log_audit = winston.createLogger({
            format: combine( logFormat_audit ),
            transports: [
                new winstonDaily( option_audit_info ),
                new winstonDaily( option_audit_error )
            ]
        })

        if( process.env.NODE_ENV !== `production` ) {
            this._log_audit.add( new winston.transports.Console({
                format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
            }))
        }        
    }

    add_audit(req:express.Request, component:string, action_item:string, action:string, action_detail:any, action_result:string) {
        const evt_time = moment().format(`YYYY-MM-DDTHH:mm:ss.SSS`)
        const src_ip = String(req.headers['x-forwarded-for'] ||  req.connection.remoteAddress)
        const req_uri = req.path
        const req_domain = req.get('host')
        const src_username = /*SessionMan.getUserInfo(req)?.id || 'unknown'*/ 'unknown'
        const service_code = `maple_kr`
        this._log_audit.info(JSON.stringify({evt_time, src_ip, src_username, component, action_item, action, action_detail, action_result, req_uri, req_domain, service_code}))
    }
    
    addLog(...msgs:any[]) {
        let str = ''
        for( const msg of msgs ) {
            try {
                str += JSON.stringify(msg).replace(/"/g, "") + ' '
            }catch(e) {
                str += msg + ' '
            }
        }        

        this._log.info(str)    
    }

    addErrorLog(...errs:any[]) {
        let str = ''
        for( const err of errs ) {
            try {
                str += JSON.stringify(err).replace(/"/g, "") + ' '
            }catch(e) {
                str += err + ' '
            }
        }        

        this._log.error(str)
    }
}


const _logger = new Logger()
export default _logger