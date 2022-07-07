import {InPacket, OutPacket} from './Packet'
import CenterSvrMan from "./CenterSvrMan";
import {ADMIN_PACKET, ADMIN_TOOL_PACKET} from  './Protocol_AdminTool'
import moment from 'moment'
import {sleep} from './lib/common'

class InvalidResponseError extends Error {
    constructor(message?:string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype);  
        this.name = `InvalidResponseError`
    }
}

export default class AdminPacketHelper {
	public static async sendSetLimitedTradeBlock(worldId:number, characterID:number) {    
		const oPacket:OutPacket = new OutPacket(ADMIN_PACKET.ASP_SetLimitedUserTradeBlock)                    
		oPacket.Encode4(Number(characterID))
		const iPacket = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		if( !iPacket ) return -99
		else {
			return iPacket.Decode4()
		}
	}
	
	public static async sendKickUsers(worldId:number, cids:number[]) : Promise<boolean> { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_KickUsers)		
		oPacket.Encode4(cids.length)
		for( const cid of cids ) {
			oPacket.Encode4(cid)
		}
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		return !!iPacketRet
	}

    public static async sendCharacterRecoveryReady(worldId:number, accountId:number, characterId:number, isTrunkRecovery:boolean) : Promise<InPacket|null> { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_CharacterRecoveryReady)		
		oPacket.Encode4(accountId)
        oPacket.Encode4(characterId)
        oPacket.Encode1(Number(isTrunkRecovery))
		
		return await CenterSvrMan.sendPacketAsync(worldId, oPacket)		
	}

    public static async sendCharacterRecoveryFinish(worldId:number, accountId:number, characterId:number, characterMeso:bigint, trunkMeso:bigint) : Promise<InPacket|null> { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_CharacterRecoveryFinish)		
		oPacket.Encode4(accountId)
        oPacket.Encode4(characterId)
        oPacket.Encode8(characterMeso)
        oPacket.Encode8(0n)
        oPacket.Encode8(trunkMeso)
        oPacket.Encode1(Number(false))
		
		return await CenterSvrMan.sendPacketAsync(worldId, oPacket)		
	}

	public static async sendPresetKickUsersWithFlush(worldId:number, cids:number[]) : Promise<boolean> { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_PresetKickUsersWithFlush)		
		oPacket.Encode4(cids.length)
		for( const cid of cids ) {
			oPacket.Encode4(cid)
		}
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		return !!iPacketRet
	}

	public static async sendSetCharacterMoney(worldId:number, characterId:number, meso:bigint) : Promise<boolean> { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_SetCharacterMoney)
		oPacket.Encode4(characterId)
		oPacket.Encode8(meso)
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		return !!iPacketRet
	}

	public static async sendResetNewCharacterChecksum(worldId:number, cid:number) : Promise<boolean> { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_ResetNewCharacterChecksum)
		oPacket.Encode4(cid)		
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		return !!iPacketRet
	}

    public static async sendAdminParcel(worldId:number, cid:number) : Promise<boolean> { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_AdminDelivery)
		oPacket.Encode4(cid)		
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		return !!iPacketRet
	}

	public static async sendUserReportReqForCenter(worldId:number) {
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_UserReportReqForCenter)
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		if( !iPacketRet ) throw new InvalidResponseError(`${worldId}`)

		iPacketRet.Decode4()
		iPacketRet.Decode4()
		iPacketRet.Decode4()
		iPacketRet.Decode4()
		iPacketRet.Decode4()
		const channelUserCount = iPacketRet.Decode1()
		iPacketRet.Decode1()

		for( let i = 0 ; i < channelUserCount ; ++i ) {
			iPacketRet.Decode2()
		}
	}

	public static AdminDelivery() : OutPacket { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_AdminDelivery)
		return oPacket
	}

	public static async sendBlockFlush(worldId:number, characterId:number) : Promise<boolean> { 
		const oPacket = AdminPacketHelper.BlockFlush(characterId)
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		return !!iPacketRet
	}

	public static async sendBlockFlushWithCheckConn(worldId:number, characterId:number) : Promise<boolean> { 
		const oPacket = AdminPacketHelper.BlockFlush(characterId)
		const iPacketRet = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
		if( !iPacketRet ) return true
		const isConnection = !!iPacketRet.Decode4()
		if( !isConnection ) return true
		const isRunning = true

		const dtStart = moment()
		while(isRunning) {
			if( moment().diff(dtStart, 'second') > 5 ) return false
			
			const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_CheckUserConnection)   
			oPacket.Encode4(characterId)
			const iPacket = await CenterSvrMan.sendPacketAsync(worldId, oPacket)
			if( !iPacket ) return false

			const isConnection = iPacket.Decode4()
			const isFlushed = iPacket.Decode4()
			if( !isConnection && isFlushed ) return true
			await sleep(50)
		}

		return false
	}

	public static SetCharacterMoneyLevel(cid:number, money:bigint, level:number) : OutPacket { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_SetCharacterMoneyLevel)
		oPacket.Encode4(cid)
		oPacket.Encode8(money)
		oPacket.Encode4(level)
		return oPacket
	}	

	public static BlockFlush(cid:number) : OutPacket { 
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_BlockFlush)
		oPacket.Encode4(cid)		
		return oPacket
	}

	public static opToolJob(type:number, ...args:any[]) : OutPacket {
		const oPacket:OutPacket = new OutPacket(ADMIN_TOOL_PACKET.ATP_AdminPacketRequest)
		oPacket.Encode1(ADMIN_PACKET.ASP_OpToolJob)
		oPacket.Encode1(type)

		if( type == 0 /** Change Maple Point */) {			
			const cid = args[0]
			const maplePoint = args[1]
			oPacket.Encode4(cid)
			oPacket.Encode4(maplePoint)
		}
				
		return oPacket
	}
}