import Log from './Logger'
import { Socket } from './Socket'
import {InPacket, OutPacket} from './Packet'

// interface AsyncObject  {
//     iPacket:InPacket|null;
//     called:boolean;
// }

export class LogCopierSocket extends Socket {    
    // static s_reqSN:number = 0;

    // mAsync:Map<number/* reqSN */, AsyncObject> = new Map()

    constructor(conf: { host:string, port:number, name: string }) {
        super({...conf, worldId: -1})
    }
    
    async initAsync() {
        return new Promise((res,rej)=> {
            const cb = async ()=> {
                Log.addLog(`LogCopier Server Connected`,this.conf.name,this.conf.worldId)
                this.isConnecting = true
                this.setListener()
                res(0)
            }

            const cb_err = (ex:any) => {
                console.log('연결 오류')
                rej(ex)
            }

            this.tryToConnect(cb, cb_err)
        })        
    } 

    onReceive(data:Uint8Array) {
        const iPacket:InPacket = new InPacket(this.packet_data)
        this.packet_data = new Uint8Array()
        this.packet_len = 0
        this.processPacket(iPacket)
    }

    onError(){
        Log.addErrorLog(`${this.conf.name} socket error`)
    }

    onclose() {
        Log.addLog(`${this.conf.name} socket closed`)
    }

    processPacket(iPacket:InPacket) {
        // switch(iPacket.type) {
        //     case CENTER_TO_ADMIN_TOOL.CTA_AdminPacketRet: this.onAdminPacketRet(iPacket); break;
        //     case CENTER_TO_ADMIN_TOOL.CTA_GetServerInfoRet: this.onGetServerInfoRet(iPacket); break;
        //     case CENTER_TO_ADMIN_TOOL.CTA_CheckUserConnectionRet: this.onCheckUserConnectionRet(iPacket); break;
        // }
    }

    // sendPacketAsync(oPacket: OutPacket): Promise<InPacket|null> {
    //     const tStart = new Date()
    //     return new Promise((res,rej)=> {
    //         const reqSN = CenterSocket.s_reqSN
    //         CenterSocket.s_reqSN++
    //         if( !this.isConnecting ) {
    //             res(null)
    //             return
    //         }            
    //         if( this.mAsync.has(reqSN) ) {
    //             Log.addErrorLog(`Duplicated ReqSN`, reqSN)
    //             throw `Duplicated ReqSN ${reqSN}`
    //         }            
    //         const obj = {iPacket:null, called: false}
    //         this.mAsync.set(reqSN, obj)
    //         oPacket.Encode4(reqSN)
    //         this.sendPacket(oPacket)
            

    //         const t = setInterval(()=> {
    //             if( Date.now() - Number(tStart) >= 15000 ) {
    //                 res(null)
    //                 this.clearAsyncObject(reqSN)
    //                 clearInterval(t)
    //                 return
    //             }
    //             if( !obj.called ) return
                
    //             res(obj.iPacket!)
    //             this.clearAsyncObject(reqSN)
    //             clearInterval(t)
    //         }, 10)
    //     })
    // }

    // clearAsyncObject(reqSN:number) {
    //     if( !this.mAsync.has(reqSN) ) return
    //     this.mAsync.delete(reqSN)
    // }

    // GetAsyncObject(reqSN:number) : AsyncObject | undefined {
    //     return this.mAsync.get(reqSN)
    // }

    // onAdminPacketRet(iPacket:InPacket) {
    //     const reqSN = iPacket.Decode4()
    //     const obj = this.GetAsyncObject(reqSN)        
    //     if( obj ) {
    //         obj.iPacket = iPacket
    //         obj.called = true
    //     }        
    // }
}