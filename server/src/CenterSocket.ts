import Log from './Logger'
import { Socket } from './Socket'
import {InPacket, OutPacket} from './Packet'
import {CENTER_TO_ADMIN_TOOL, ADMIN_TOOL_PACKET} from './Protocol_AdminTool'

export const MS_VER_ADMINTOOL = 0x00000001;

interface AsyncObject  {
    iPacket:InPacket|null;
    called:boolean;
}

export class CenterSocket extends Socket {    
    static s_reqSN = 0;
    userCnt = 0
    userDBCnt = 0

    mAsync:Map<number/* reqSN */, AsyncObject> = new Map()

    constructor(conf: { host:string, port:number, name: string, worldId: number }) {
        super(conf)
    }

    init() {
        const cb = async ()=> {
            Log.addLog(`Center Server Connected`,this.conf.name,this.conf.worldId)
            this.isConnecting = true
            this.setListener()
            const buffer = new ArrayBuffer(4);
            const arr:Uint32Array = new Uint32Array(buffer);            
            const arr2:Uint8Array = new Uint8Array(arr.buffer);
            arr[0] = MS_VER_ADMINTOOL;
            this.sock.write(arr2);
        }

        this.tryToConnect(cb)
        setInterval(()=>this.tryToConnect(cb), 3000)
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
        switch(iPacket.type) {
            case CENTER_TO_ADMIN_TOOL.CTA_AdminPacketRet: this.onAdminPacketRet(iPacket); break;
            case CENTER_TO_ADMIN_TOOL.CTA_GetServerInfoRet: this.onGetServerInfoRet(iPacket); break;
            case CENTER_TO_ADMIN_TOOL.CTA_CheckUserConnectionRet: this.onCheckUserConnectionRet(iPacket); break;
        }
    }

    sendPacketAsync(oPacket: OutPacket): Promise<InPacket|null> {
        const tStart = new Date()
        return new Promise((res,rej)=> {
            const reqSN = CenterSocket.s_reqSN
            CenterSocket.s_reqSN++
            if( !this.isConnecting ) {
                res(null)
                return
            }            
            if( this.mAsync.has(reqSN) ) {
                Log.addErrorLog(`Duplicated ReqSN`, reqSN)
                throw `Duplicated ReqSN ${reqSN}`
            }            
            const obj = {iPacket:null, called: false}
            this.mAsync.set(reqSN, obj)
            oPacket.Encode4(reqSN)
            this.sendPacket(oPacket)
            

            const t = setInterval(()=> {
                if( Date.now() - Number(tStart) >= 5000 ) {
                    res(null)
                    this.clearAsyncObject(reqSN)
                    clearInterval(t)
                    return
                }
                if( !obj.called ) return
                
                res(obj.iPacket!)
                this.clearAsyncObject(reqSN)
                clearInterval(t)
            }, 10)
        })
    }

    clearAsyncObject(reqSN:number) {
        if( !this.mAsync.has(reqSN) ) return
        this.mAsync.delete(reqSN)
    }

    GetAsyncObject(reqSN:number) : AsyncObject | undefined {
        return this.mAsync.get(reqSN)
    }

    onAdminPacketRet(iPacket:InPacket) {
        const reqSN = iPacket.Decode4()
        const obj = this.GetAsyncObject(reqSN)        
        if( obj ) {
            obj.iPacket = iPacket
            obj.called = true
        }        
    }

    onGetServerInfoRet(iPacket:InPacket) {
        const nCnt = iPacket.Decode4()
        const nDBCnt = iPacket.Decode4()
        this.userCnt = nCnt
        this.userDBCnt = nDBCnt
    }

    onCheckUserConnectionRet(iPacket:InPacket) {
        const reqSN = iPacket.Decode4()
        const obj = this.GetAsyncObject(reqSN)        
        if( obj ) {
            obj.iPacket = iPacket
            obj.called = true
        }        
    }
}