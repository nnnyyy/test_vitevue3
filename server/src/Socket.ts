/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import net from 'net'
import Log from './Logger'
import {InPacket, OutPacket} from './Packet'

type CallbackFunc = (msg:any) => void;

export class Socket {
    conf!: { host:string, port:number, name: string, worldId: number }
    sock: net.Socket = new net.Socket()
    isConnecting = false
    isTryConnecting = false

    packet_data: Uint8Array = new Uint8Array()
    packet_len = 0

    constructor(conf: { host:string, port:number, name: string, worldId: number }) {
        this.conf = conf        
    }    

    tryToConnect(cb:(()=>void), cb_err:CallbackFunc|undefined=undefined) {
        if( this.isConnecting ) return;
        if( this.isTryConnecting ) return;

        this.isTryConnecting = true;

        this.sock = net.createConnection({ port: this.conf.port, host: this.conf.host }, cb)

        // 연결 시도 시에 연결하려는 서버가 죽은 상태일 경우 처리 ( 없으면 크래시 )
        this.sock.on('error', ex=> {            
            this.isTryConnecting = false;
            this.isConnecting = false;
            if( cb_err ) {
                cb_err(ex)
            }
        });
    }

    setListener() {
        this.sock.on('data', async data=>{
            this._onReceive(data)
        })
        this.sock.on('end', ()=>{
            Log.addLog('end...');
        })

        this.sock.on('error', ()=>{
            Log.addErrorLog(`socket  ${this.conf.name} - error`);
            this.isTryConnecting = false;
            this.isConnecting = false;
            this.onError()
        })

        this.sock.on('close', ()=>{
            Log.addLog(`socket ${this.conf.name} - closed`);
            this.isTryConnecting = false;
            this.isConnecting = false;
            this.onClose()
        })

        this.sock.on('timeout', ()=>{
            Log.addErrorLog(`socket  ${this.conf.name} - timeout`);
            this.isTryConnecting = false;
            this.isConnecting = false;
        })
    }

    _onReceive(data:Uint8Array) {
        if(this.packet_data.length <= 0 ) {
            this.packet_data = data
            const len = (new Uint16Array((new Uint8Array([ data[2], data[3] ])).buffer))[0]
            if( len >= 0xff00 ) {
                this.packet_len = (new Uint32Array((new Uint8Array([ data[4], data[5], data[6], data[7] ])).buffer))[0]
            }
            else this.packet_len = len

            if( this.packet_data.length < this.packet_len ) return
        }
        else {
            const tmp = new Uint8Array( this.packet_data.buffer.byteLength + data.buffer.byteLength )
            tmp.set( new Uint8Array(this.packet_data.buffer), 0 )
            tmp.set( new Uint8Array(data.buffer), this.packet_data.buffer.byteLength )            
            this.packet_data = tmp

            if( this.packet_data.length < this.packet_len ) return
        }        

        this.onReceive(data)
    }

    onReceive(data:Uint8Array) {}
    onError() {}
    onClose() {}

    sendPacket(oPacket:OutPacket) {        
        if( !this.isConnecting ) return
        this.sock.write(oPacket.GetBuffer(), err=> {
            if( err != undefined ) {
                Log.addErrorLog('send packet error')
                Log.addErrorLog(err)
            }                
        })
    }

    sendPacketAndClose(oPacket:OutPacket) {        
        if( !this.isConnecting ) return
        this.sock.write(oPacket.GetBuffer(), err=> {
            if( err != undefined ) {
                Log.addErrorLog('send packet error')
                Log.addErrorLog(err)
            }                
            
            this.sock.destroy()
        })
    }    
}   