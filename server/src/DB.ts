import mssql,{IProcedureResult, IResult} from 'mssql'
import Log from './Logger'
import moment from 'moment'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config/DBConfig.json')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ServerConf = require('../config/ServerConf.json')

export namespace DB {
    export interface IParam {
        name:string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value:any;
    }

    export interface IOutput {
        name:string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type:any;
    }
}

class DB {
    mPools: Map<string, mssql.ConnectionPool> = new Map();
    tLastUpdateDate: moment.Moment = moment();
    bak_list: string[] = [];
    bak_date_list: string[] = [];

    init(): Promise<any> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            //  설정 파일에 있는 DB 서버 연결
            for (const conf of config.db_list) {
                const pool = await new mssql.ConnectionPool({ ...conf, options: { encrypt: false } }).connect();
                this.mPools.set(conf.database, pool);
                //Log.addLog(`DB Connected : ${conf.database} (${conf.server}:${conf.port})`)
            }

            const gwDBIPList = await this.getGWDBIPList();

            for (const info of gwDBIPList) {
                const _ip = info.GameDBIP.split(",")[0];
                const _port = Number(info.GameDBIP.split(",")[1]);
                const pool = await new mssql.ConnectionPool({
                    server: _ip,
                    user: config.gwinfo.id,
                    password: config.gwinfo.pw,
                    database: "GameWorld",
                    port: _port,
                    options: {
                        encrypt: false,
                    },
                }).connect();

                const alias = `GW${info.GameWorldID}`;
                this.mPools.set(alias, pool);
                //Log.addLog(`DB connected : GameWorld - ${alias} (${_ip}:${_port})`)
            }

            Log.addLog(`DB connected!`);

            setInterval(() => this.reloadBackup(), 1000 * 10);
            res(0);
        });
    }

    async initBackup(): Promise<any> {
        Log.addLog("Init Backup DB");
        this.tLastUpdateDate = moment();
        let gwid = "EoRkfn@nda";
        let gwpw = "I4onskeh~!";
        let list: any[] = [];
        let suffixs: any[] = [];
        if (process.env.NODE_ENV !== "production") {
            gwid = "sa";
            gwpw = "Y0ngM@nYMCA";

            list = [];
        } else {
            list = (await DBWrapper.query_mstat(`EXEC Get_BackupDatabaseList`, []))
                .map((it: any) => it.name)
                .filter((name: string) => {
                    return (
                        (name.indexOf("GameWorld") != -1 ||
                            name.indexOf("GlobalAccount") != -1 ||
                            name.indexOf("GlobalGame") != -1 ||
                            name.indexOf("Social") != -1) &&
                        name.split("_").length == 2
                    );
                })
                .filter((name: string) => {
                    return (
                        name.split("_")[1] != moment().format("YYYYMMDD") ||
                        (name.split("_")[1] == moment().format("YYYYMMDD") && moment().hour() >= 12)
                    );
                });

            list.forEach((it: string) => suffixs.push(it.split("_")[1]));
            suffixs = Array.from(new Set(suffixs).values());
        }

        for (const info of list) {
            try {
                const pool = await new mssql.ConnectionPool({
                    server: `10.168.2.68`,
                    port: 7891,
                    user: gwid,
                    password: gwpw,
                    database: info,
                }).connect();
                const alias = info;
                this.mPools.set(alias, pool);
                this.bak_list.push(alias);
                Log.addLog(`[Bak] DB connected`, alias);
            } catch (e) {
                Log.addErrorLog(`[Bak] DB connect failed`, info);
                continue;
            }
        }

        this.bak_date_list = suffixs;
    }

    async reloadBackup(): Promise<any> {
        if (this.tLastUpdateDate.hour() == moment().hour()) return;
        Log.addLog("Reload Backup DB");
        for (const alias of this.bak_list) {
            const pool: mssql.ConnectionPool = this.mPools.get(alias);
            pool.close();
            this.mPools.delete(alias);
        }
        this.bak_date_list = [];
        this.bak_list = [];
        await this.initBackup();
    }

    async getGWDBIPList(): Promise<{ GameWorldID: number; GameDBIP: string }[]> {
        const privateIP = ServerConf.isStageServer ? `10.248` : `10.168`;
        return await this.query(
            `SELECT GameWorldID, REPLACE(GameDBIP, ${
                process.env.NODE_ENV !== "production" ? `'${privateIP}', '175.207'` : `'175.207', '${privateIP}'`
            }) as GameDBIP FROM GameWorld WITH(NOLOCK) WHERE IsBlocked = 0 ORDER BY GameWorldID`,
            [],
            `GlobalAccount`
        );
    }

    query(query: string, params: any[], dbid = "default"): Promise<any> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                const _pool = this.mPools.get(dbid);
                if (!_pool) throw { message: `[mssql] '${dbid}' not found` };
                //let result = await _pool.request().query(query, params)
                const req = _pool.request();
                let nameCnt = 1;
                for (const param of params) {
                    req.input(`val${nameCnt}`, param);
                    query = query.replace("?", `@val${nameCnt}`);
                    nameCnt++;
                }
                const result = await req.query(query);
                res(result.recordset);
            } catch (error) {
                rej(error);
            }
        });
    }

    _query(query: string, params: any[], dbid = "default"): Promise<IResult<any>> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                const _pool = this.mPools.get(dbid);
                if (!_pool) throw { message: `[mssql] '${dbid}' not found` };
                //let result = await _pool.request().query(query, params)
                const req = _pool.request();
                let nameCnt = 1;
                for (const param of params) {
                    req.input(`val${nameCnt}`, param);
                    query = query.replace("?", `@val${nameCnt}`);
                    nameCnt++;
                }
                const result = await req.query(query);
                res(result);
            } catch (error) {
                rej(error);
            }
        });
    }

    beginTrans(dbid = "default"): Promise<mssql.Transaction> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                const _pool = this.mPools.get(dbid);
                if (!_pool) throw { message: `[mssql] '${dbid}' not found` };
                const trans = new mssql.Transaction(_pool);
                await trans.begin();
                res(trans);
            } catch (error) {
                rej(error);
            }
        });
    }

    commit(trans: mssql.Transaction) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                await trans.commit();
                res(0);
            } catch (error) {
                rej(error);
            }
        });
    }

    rollback(trans: mssql.Transaction) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            await trans.rollback();
            res(0);
        });
    }

    query_trans(query: string, params: any[], trans: mssql.Transaction): Promise<any> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                const req = new mssql.Request(trans);
                let nameCnt = 1;
                for (const param of params) {
                    req.input(`val${nameCnt}`, param);
                    query = query.replace("?", `@val${nameCnt}`);
                    nameCnt++;
                }
                const result = await req.query(query);
                res(result.recordset);
            } catch (error) {
                rej(error);
            }
        });
    }

    _query_trans(query: string, params: any[], trans: mssql.Transaction): Promise<IResult<any>> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                const req = new mssql.Request(trans);
                let nameCnt = 1;
                for (const param of params) {
                    req.input(`val${nameCnt}`, param);
                    query = query.replace("?", `@val${nameCnt}`);
                    nameCnt++;
                }
                const result = await req.query(query);
                res(result);
            } catch (error) {
                rej(error);
            }
        });
    }

    callSP(
        sp: string,
        params: DB.IParam[],
        dbid = "default",
        outputs: DB.IOutput[] = []
    ): Promise<IProcedureResult<any>> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                const _pool = this.mPools.get(dbid);
                if (!_pool) throw { message: `[mssql] '${dbid}' not found` };
                //let result = await _pool.request().query(query, params)
                const req = _pool.request();
                for (const param of params) {
                    req.input(param.name, param.value);
                }
                for (const output of outputs) {
                    req.output(output.name, output.type);
                }
                const result = await req.execute(sp);
                res(result);
            } catch (error) {
                rej(error);
            }
        });
    }

    callSP_trans(
        sp: string,
        params: DB.IParam[],
        trans: mssql.Transaction,
        outputs: DB.IOutput[] = []
    ): Promise<IProcedureResult<any>> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (res, rej) => {
            try {
                const req = new mssql.Request(trans);
                for (const param of params) {
                    req.input(param.name, param.value);
                }
                for (const output of outputs) {
                    req.output(output.name, output.type);
                }
                const result = await req.execute(sp);
                res(result);
            } catch (error) {
                rej(error);
            }
        });
    }
}

const __obj = new DB();

export enum DBAlias {
    OPTool = 'opTool',
    GameLog = 'GameLog',
    GameInformation = 'GameInformation',
    UserReport = 'UserReport',
    MapleStats = 'MapleStats',
    GlobalAccount = 'GlobalAccount',
    Social = 'Social',
    Claim = 'Claim',
    ItemLog = 'ItemLog'
}

export class DBWrapper {
    public static async query_ot(q:string, params:any[] = []) : Promise<any> { return __obj.query(q, params,  DBAlias.OPTool) }
    public static async _query_ot(q:string, params:any[] = []) : Promise<any> { return __obj._query(q, params,  DBAlias.OPTool) }
    public static async query_cl(q:string, params:any[] = []) : Promise<any> { return __obj.query(q, params,  DBAlias.Claim) }
    public static async _query_cl(q:string, params:any[] = []) : Promise<IResult<any>> { return __obj._query(q, params,  DBAlias.Claim) }
    public static async begin_trans_ot() : Promise<mssql.Transaction> { return __obj.beginTrans(DBAlias.OPTool) }
    public static async begin_trans_ga() : Promise<mssql.Transaction> { return __obj.beginTrans(DBAlias.GlobalAccount) }
    public static async begin_trans_gw(gwid:number) : Promise<mssql.Transaction> { return __obj.beginTrans(`GW${gwid}`) }
    public static async query_trans(q:string, params:any[] = [], trans:mssql.Transaction) : Promise<any> { return __obj.query_trans(q, params, trans) }
    public static async _query_trans(q:string, params:any[] = [], trans:mssql.Transaction) : Promise<IResult<any>> { return __obj._query_trans(q, params, trans) }
    public static async callSP_trans(sp: string, params: DB.IParam[], outputs:DB.IOutput[], trans:mssql.Transaction) : Promise<any> { return __obj.callSP_trans(sp, params, trans, outputs) }
    public static async commit(trans:mssql.Transaction) : Promise<any> { return __obj.commit(trans) }
    public static async rollback(trans:mssql.Transaction) : Promise<any> { return __obj.rollback(trans) }
    public static async query_ga(query: string, params: any[], dbdate:string) : Promise<any> { return __obj.query(query, params, dbdate == '' ? `GlobalAccount` : `GlobalAccount_${dbdate}`) }
    public static async query_gw(gwid:number, query: string, params: any[], dbdate:string) : Promise<any> { return __obj.query(query, params, dbdate == '' ? `GW${gwid}` : `GameWorld${gwid.toString().padStart(2, '0')}_${dbdate}`) }
    public static async query_snapshot(gwid:number, query: string, params: any[]) : Promise<any> { return __obj.query(query, params, `Snapshot${gwid}`) }
    public static async query_auction(gwid:number, query: string, params: any[]) : Promise<any> { return __obj.query(query, params, `Auction${gwid}`) }
    public static async query_auctionSnapshot(gwid:number, query: string, params: any[]) : Promise<any> { return __obj.query(query, params, `AuctionSnapshot${gwid}`) }
    public static async query_gi(query: string, params: any[]) : Promise<any> { return __obj.query(query, params, DBAlias.GameInformation) }
    public static async query_gl(query: string, params: any[]) : Promise<any> { return __obj.query(query, params, DBAlias.GameLog) }
    public static async query_ur(query: string, params: any[]) : Promise<any> { return __obj.query(query, params, DBAlias.UserReport) }    
    public static async query_mstat(query: string, params: any[]) : Promise<any> { return __obj.query(query, params, DBAlias.MapleStats) }
    public static async query_sc(query: string, params: any[]) : Promise<any> { return __obj.query(query, params, DBAlias.Social) }
    public static async _query_il(query: string, params: any[]) : Promise<IResult<any>> { return __obj._query(query, params, DBAlias.ItemLog) }
}

export default __obj    

export const GADB = DBWrapper.query_ga
export const GWDB = DBWrapper.query_gw
export const OTDB = DBWrapper.query_ot
export const _OTDB = DBWrapper._query_ot
export const CLDB = DBWrapper.query_cl
export const _CLDB = DBWrapper._query_cl
export const GIDB = DBWrapper.query_gi
export const GLDB = DBWrapper.query_gl
export const STATSDB = DBWrapper.query_mstat
export const SSDB = DBWrapper.query_snapshot
export const AUCTIONDB = DBWrapper.query_auction
export const AUCTIONSSDB = DBWrapper.query_auctionSnapshot
export const _ILDB = DBWrapper._query_il