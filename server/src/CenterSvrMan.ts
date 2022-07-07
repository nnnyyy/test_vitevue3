import {CenterSocket} from './CenterSocket'
import { OutPacket, InPacket } from './Packet'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ServerConf = require('../config/ServerConf.json')

class CenterSvrMan {
    lSocketList:CenterSocket[] = []
    mSocketList:Map<number, CenterSocket> = new Map()    

    init() {
        for( const center of ServerConf.centerList ) {
            const centerSrv = new CenterSocket({host: center.host, port: center.port, name: center.name, worldId: center.worldId})
            centerSrv.init()
            this.lSocketList.push(centerSrv)
            this.mSocketList.set(center.worldId, centerSrv)
        }        
    }

    sendPacket(worldId:number, oPacket:OutPacket) {
        this.mSocketList.get(worldId)?.sendPacket(oPacket)
    }

    sendPacketAsync(worldId:number, oPacket:OutPacket) : Promise<InPacket|null> {        
        if( !this.mSocketList.has(worldId) ) throw "sendPacketAsync Error"
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.mSocketList.get(worldId)!.sendPacketAsync(oPacket)
    }

    broadcastPacket(oPacket:OutPacket) {
        this.lSocketList.forEach(sock=>this.sendPacket(sock.conf.worldId, oPacket))
    }
}

const __obj__ = new CenterSvrMan()
export default __obj__