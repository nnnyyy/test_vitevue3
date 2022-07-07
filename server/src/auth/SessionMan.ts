import Log from '../Logger'

export interface IAccountInfo {
    EMPName:string;
    EMPNO:number;
    DEPTName:string;
    PriorityFlag:number;    
}

//  dev-server 가 프록싱 하는 과정에서 세션을 제대로 못가져오기 때문에
//  개발모드에서는 그냥 혼자 객체를 가지고 체크하도록 한다.
let userinfoForDev:IAccountInfo|null = null

export class SessionMan {
    public static async save(req:any, userinfo: IAccountInfo) : Promise<boolean> {
        return new Promise((res)=>{
            const session:any = req.session
            session.userinfo = userinfo
            session.save((err:any)=>{
                if( err ) {
                    Log.addErrorLog(`session save failed`)
                    Log.addErrorLog(err)
                    return res(false)
                }
                if( process.env.NODE_ENV !== 'production' ) {
                    userinfoForDev = userinfo
                }
                return res(true)
            })
        })
    }

    public static async delete(req:any) : Promise<boolean> {
        return new Promise((res)=>{
            const session:any = req.session
            delete session.userinfo
            session.save((err:any)=>{
                if( err ) {
                    Log.addErrorLog(`session delete failed`)
                    Log.addErrorLog(err)
                    return res(false)
                }
                if( process.env.NODE_ENV !== 'production' ) {
                    userinfoForDev = null
                }
                return res(true)
            })
        })
    }

    public static getUserInfo(req:any) : IAccountInfo | null {
        const session:any = req.session
        if( process.env.NODE_ENV !== 'production' ) {
            return userinfoForDev
        }
        return session.userinfo
    }
}