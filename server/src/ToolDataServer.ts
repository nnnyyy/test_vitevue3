// 'net' 에러 핸들링
// https://stackoverflow.com/questions/25846475/node-js-handling-tcp-socket-error-econnrefused
const configFile = require('../config/ServerConf.json');
import net from 'net'
import GameData from './GameData'
import {InPacket, OutPacket} from './Packet'
import Logger from './Logger'
import {TOOL_DATA_SERVER_PACKET, MAPLE_SEARCH_SERVER_PACKET} from './Protocol_ToolDataServer'

export const MS_VER_ADMINTOOL = 0x00000001;

class ToolDataServer {
    constructor() {}
    client: net.Socket = new net.Socket()
    isTrying: boolean = false
    isConnecting: boolean = false

    packet_data: Uint8Array = new Uint8Array()
    packet_len: number = 0

    async init() {
        //  connection error handling       
        
        this.tryToConnect();
        setInterval(()=>this.tryToConnect(), 3000);
    }

    tryToConnect() {
        if( this.client.connecting ) return;
        if( this.isTrying ) return;

        //console.log('try to connect tooldata server');
        this.isTrying = true;
        
        const servConf = configFile.toolDataServer
        this.client = net.createConnection({port: servConf.port, host: servConf.host}, async ()=> {
            console.log('ToolDataServer connected...!!')
            this.isConnecting = true
            this.setListener()
            const buffer = new ArrayBuffer(4);
            const arr:Uint32Array = new Uint32Array(buffer);            
            const arr2:Uint8Array = new Uint8Array(arr.buffer);
            arr[0] = MS_VER_ADMINTOOL;
            this.client.write(arr2);            
            
            await GameData.sleep(500);
            GameData.loadImgList();
        });

        //console.log('try to connect tooldata server - 2');

        this.client.on('error', ex=> {
            //console.log("handled error");
            //console.log(ex);
            this.isTrying = false;
            this.isConnecting = false;
        });
    }

    setListener() {
        this.client.on('data', async data=>{
            this.onReceive(data)
        })
        this.client.on('end', ()=>{
        })

        this.client.on('error', ()=>{
            Logger.addErrorLog('tool data server - error');
            this.isTrying = false;
            this.isConnecting = false;
        })

        this.client.on('close', ()=>{
            Logger.addErrorLog("tool data server - closed");
            this.isTrying = false;
            this.isConnecting = false;
        })

        this.client.on('timeout', ()=>{
            Logger.addErrorLog("tool data server - timeout");
            this.isTrying = false;
            this.isConnecting = false;
        })
    }

    sendPacket(oPacket:OutPacket) {        
        this.client.write(oPacket.GetBuffer(), err=> {
            //console.log('send packet callback', err)
            if( err != undefined ) {
                console.log('send packet error', err)
            }                
        })
    }

    onReceive(data:Uint8Array) {
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

        const iPacket:InPacket = new InPacket(this.packet_data)
        this.packet_data = new Uint8Array()
        this.packet_len = 0
        this.processPacket(iPacket)
    }

    processPacket(iPacket:InPacket) {                
        switch(iPacket.type) {
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetSkillInfoRet: this.onGetSkillInfo(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetEquipInfoRet: this.onGetEquipInfo(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetBundleItemInfoRet: this.onGetBundleItemInfo(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetQuestDataRet: this.onGetQuestData(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetSkillListRet: this.onGetSkillList(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetInstanceTableRet: this.onGetInstanceTable(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_LoadImgListRet: this.onLoadImgList(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetImgDataRet: this.onGetImgData(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_GetDamageSkinSaveInfoRet: this.onGetDamageSkinSaveInfoRet(iPacket); break;
            case MAPLE_SEARCH_SERVER_PACKET.MSSP_LoadImgRet: this.onLoadImg(iPacket); break;
        }
    }

    //  스킬 데이터 로딩
    async onGetSkillInfo(iPacket:InPacket) {
        const s = iPacket.DecodeStr()
        try {                
            const skillinfo = JSON.parse(s)
            if( skillinfo.id ) GameData.mSkillInfoDetail.set(skillinfo.id, skillinfo)
        } catch (e) {
            Logger.addErrorLog(JSON.stringify(e));
            return;
        }
    }

    async onGetSkillList(iPacket:InPacket) {
        const size = iPacket.Decode4()
        
        try {                        
            for( let i = 0 ; i < size ; ++i ) {
                const id = iPacket.Decode4();
            }
        } catch (e) {
            Logger.addErrorLog(JSON.stringify(e));
            return;
        }
    }

    //  장비 데이터 로딩
    async onGetEquipInfo(iPacket:InPacket) {        
        const s = iPacket.DecodeStr()                
        try {            
            const equipinfo = JSON.parse(s)
            GameData.mEquipInfoDetail.set(equipinfo.id, equipinfo)
        } catch (e) {
            return;
        }
    }

    //  번들 아이템 데이터 로딩
    async onGetBundleItemInfo(iPacket:InPacket) {      
        const itemId = iPacket.Decode4()  
        const s = iPacket.DecodeStr()                
        try {            
            const iteminfo = JSON.parse(s)
            GameData.mBundleItemInfoDetail.set(itemId, iteminfo)
        } catch (e) {
            Logger.addErrorLog(JSON.stringify(e));
            return;
        }
    }

    async onGetQuestData(iPacket:InPacket) {        
        const s = iPacket.DecodeStr()
        try {            
            const iteminfo = JSON.parse(s)
            GameData.mQuestDataDetail.set(iteminfo.id, iteminfo)
        } catch (e) {
            Logger.addErrorLog(JSON.stringify(e));
            return;
        }
    }

    async onGetInstanceTable(iPacket:InPacket) {
        const tableName = iPacket.DecodeStr();        
        const data = iPacket.DecodeStr();
        const tableDataJson = JSON.parse(data)
        GameData.mInstanceTables.set(tableName, tableDataJson)
    }

    async onLoadImgList(iPacket:InPacket) {
        console.log(`onLoadImgList load complete`);
        GameData.mImgLoaded = []
        GameData.mImgList.clear()
        const cnt = iPacket.Decode4();
        for( let i = 0 ; i < cnt ; ++i ) {            
            const imgUOL = iPacket.DecodeStr();
            GameData.mImgLoaded.push(imgUOL)

            await this.processLoadedImg(imgUOL)
        }
    }

    async onLoadImg(iPacket:InPacket) {        
        const imgUOL = iPacket.DecodeStr()
        const bSucceed = iPacket.Decode4()
        GameData.mImgLoaded.push(imgUOL)

        await this.processLoadedImg(imgUOL)
    }

    async processLoadedImg(imgUOL:string) {
        switch( imgUOL ) {
            case `Skill/RidingSkillInfo.img`:  
            {
                const _rinfo = await GameData.getImgData(imgUOL)
                for( const key in _rinfo ) {
                    GameData.mRidingInfo.set(Number(key), GameData.mSkillInfo.get(Number(key)))
                }    
                console.log(`onLoadImgList - [${imgUOL}] Date Load Complete`)                
            }
        }

        if( imgUOL.indexOf(`Etc/Achievement/AchievementData`) != -1 ) {
            // 업적 데이터 로딩
            const _achieveData = await GameData.getImgData(imgUOL, 25)
            //GameData.mAchieveData.set( ,_achieveData)
            const _t = imgUOL.split('/')
            const id = _t[_t.length-1].split('.')[0]
            GameData.mAchieveData.set(Number(id), _achieveData)           
        }
    }

    async onGetImgData(iPacket:InPacket) {
        const uol = iPacket.DecodeStr();
        const data = iPacket.DecodeStr();
        const jdata = JSON.parse(data)        
        
        GameData.mImgList.set( uol, jdata )
    }

    async onGetDamageSkinSaveInfoRet(iPacket:InPacket) {
        const skinID:number = iPacket.Decode4();
        const data = iPacket.DecodeStr();
        const jdata = JSON.parse(data);        
        
        GameData.mDamageSkinSaveInfo.set( skinID, jdata )        
    }
}

const __obj__ = new ToolDataServer();

export default __obj__;