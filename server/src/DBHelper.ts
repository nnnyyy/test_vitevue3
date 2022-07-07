import {DATETIME_FORMAT, DATE_FORMAT} from './lib/common'
import {IProcedureResult, IRecordSet} from 'mssql'
import Database, {DBWrapper, DBAlias} from './DB'
import mssql from 'mssql'
import moment from 'moment'

export interface ICharacter {
    AccountID:number, CharacterID:number, CharacterName:string, Gender:number, LogoutDate:string, 
        C_Skin:number, C_Face:number, C_Hair:number, C_PetLockerSN:number, B_Level:number, B_Job:number, B_STR:number, B_DEX:number, B_INT:number, B_LUK:number, S_HP:number, S_MaxHP:number, S_MP:number, S_MaxMP:number, 
        S_AP:number, S_SP:number, S_EXP:number, S_POP:number, S_Money:bigint, P_Map:number, P_Portal:number, CheckSum:number, ItemCountCheckSum:number, GameWorldID:number, S_Fatigue:number, S_CharismaEXP:number, 
        S_InsightEXP:number, S_WillEXP:number, S_CraftEXP:number, S_SenseEXP:number, S_CharmEXP:number, State:number
}

export class DBHelper {
    static async getCharacter(worldId:number, characterId:number) : Promise<ICharacter|undefined> {
        const [row] = await DBWrapper.query_gw(worldId, `SELECT 
        AccountID, CharacterID, CharacterName, Gender, LogoutDate, 
        C_Skin, C_Face, C_Hair, C_PetLockerSN, B_Level, B_Job, B_STR, B_DEX, B_INT, B_LUK, S_HP, S_MaxHP, S_MP, S_MaxMP, 
        S_AP, S_SP, S_EXP, S_POP, S_Money, P_Map, P_Portal, CheckSum, ItemCountCheckSum, GameWorldID, S_Fatigue, S_CharismaEXP, 
        S_InsightEXP, S_WillEXP, S_CraftEXP, S_SenseEXP, S_CharmEXP, State FROM Character WHERE CharacterID = ? AND  GameWorldID = ?`, [characterId, worldId], '')
        return row
    }

    static async GetCharacterIDByName(name:string) : Promise<string | undefined> {
        const [row] = await DBWrapper.query_ga(`SELECT CharacterID FROM Character WHERE CharacterName = ?`, [name], '')
        return row?.CharacterID
    }

    static async GetOID(accountid:number) : Promise<string | undefined> {
        const [row] = await DBWrapper.query_ga(`SELECT OID FROM NexonMembership WHERE AccountID = ? AND OwnerType IN (0, 1)`, [accountid], '')
        return row?.OID
    }

    static async GetMembershipInfo(oid:string) : Promise<any | undefined> {
        const [row] = await DBWrapper.query_ga(`SELECT NxClubID, ChCode FROM NexonMemberShipInfo WHERE OID = ?`, [oid], '')
        return row
    }

    static async GetFarmUserInfo(accountid:number) : Promise<any | undefined> {
        const [row] = await DBWrapper.query_sc(`SELECT AccountID, FarmName, FarmPoint, FarmExp, FarmLevel, DecoPoint, FarmCash, LogoutDate, FarmTheme, SlotExtend, LockerSlotCount, AchieveScore FROM FarmUserInfo WHERE AccountID = ?`, [accountid])
        return row
    }

    public static async getBlockedInfo(accountId:number) : Promise<undefined|{BlockReason:number}>{
        const [row] = await DBWrapper.query_ga(`SELECT BlockReason FROM BlockReason WITH(NOLOCK) WHERE AccountID = ? AND UnblockDate > GETDATE()`, [accountId], '')
        return row
    }

    public static async isBlocked(accountId:number) : Promise<boolean>{
        const [row] = await DBWrapper.query_ga(`SELECT BlockReason FROM BlockReason WITH(NOLOCK) WHERE AccountID = ? AND UnblockDate > GETDATE()`, [accountId], '')
        return row ? true : false
    }

    public static async insertMaplePointIncLog(worldId:number, accountId:number, characterId:number, type:number, incVal:number) {
        if( process.env.NODE_ENV !== 'producution') 
            return await DBWrapper.query_gl(`INSERT MaplePointIncLog SELECT ${worldId}, ${accountId}, ${characterId}, 12, ${incVal}, Getdate()`, [])
        else return await DBWrapper.query_gl(`INSERT MaplePointIncLog_${moment().format('YYYYMM')} SELECT ${worldId}, ${accountId}, ${characterId}, 12, ${incVal}, Getdate()`, [])
    }

    public static async insertGMMemoLog(adminId:number, worldId:number, characterId:number, accountId:number, memo:string) {
        return await DBWrapper.query_ot(`INSERT GMMemoLog VALUES (GETDATE(), ?, ?, ?, ?, ? )`, [adminId, worldId, characterId, accountId, memo])
    }

    public static async insertGMMemoLog_Trans(adminId:number, worldId:number, characterId:number, accountId:number, memo:string, trans:mssql.Transaction) {
        return await DBWrapper.query_trans(`INSERT GMMemoLog VALUES (GETDATE(), ?, ?, ?, ?, ? )`, [adminId, worldId, characterId, accountId, memo], trans)
    }

    public static async isLogined(accountId:number) {
        const _rows = await DBWrapper.query_ga(`SELECT Status FROM UserConnection.dbo.ConnectionStatus WHERE AccountID=?`, [accountId], '')
        if( _rows.length <= 0 ) return false
        return Number(_rows[0].Status) ? true: false
    }

    public static async isLoginedCharacter(accountId:number, characterId: number, worldId:number) {
        let _rows = await DBWrapper.query_ga(`SELECT Status FROM UserConnection.dbo.ConnectionStatus WHERE AccountID=?`, [accountId], '')
        if( _rows.length <= 0 ) return false
        const isLogin = _rows[0].Status
        if( !isLogin ) return false

        _rows = await DBWrapper.query_ga(`SELECT Email FROM Account WITH(NOLOCK) WHERE AccountID=?`, [accountId], '')
        if( _rows.length <= 0 ) return false
        const sEmail = _rows[0].Email

        const ret = await DBSPHelper.GA.OpTool_GetConnectCharacter(sEmail)
        if( ret.recordsets[0].length <= 0 ) return false
        const data = ret.recordsets[0][0]
        if( data.GameWorldID == worldId && data.CharacterID == characterId ) return true

        return false
    }

    public static async hasLoginedCharacter(accountId:number) {
        let _rows = await DBWrapper.query_ga(`SELECT Status FROM UserConnection.dbo.ConnectionStatus WHERE AccountID=?`, [accountId], '')
        if( _rows.length <= 0 ) return false
        const isLogin = _rows[0].Status
        if( !isLogin ) return false

        _rows = await DBWrapper.query_ga(`SELECT Email FROM Account WITH(NOLOCK) WHERE AccountID=?`, [accountId], '')
        if( _rows.length <= 0 ) return false
        const sEmail = _rows[0].Email

        const ret = await DBSPHelper.GA.OpTool_GetConnectCharacter(sEmail)
        if( ret.recordsets[0].length <= 0 ) return undefined
        return ret.recordsets[0][0]
    }

    static GW = class {
        public static async insertItemLocker_Tran(AccountID:number,CharacterID:number,ItemID:number,Number:number,BuyCharacterName:string,ExpiredDate:string,CommodityID:number,PaybackRate:number,
            DiscountRate:number,GameWorldID:number,OwnerID:number,StoreBank:number,OrderNo:number,ProductNo:number,Refundable:number,SourceFlag:number, trans:mssql.Transaction) {
            const ret = await DBWrapper._query_trans(`INSERT INTO ItemLocker 
            ( AccountID,CharacterID,ItemID,Number,BuyCharacterName,ExpiredDate,CommodityID,PaybackRate,DiscountRate,GameWorldID,OwnerID,StoreBank,OrderNo,ProductNo,Refundable,SourceFlag) 
            SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? 
            SELECT @@IDENTITY`, [
                AccountID,CharacterID,ItemID,Number,BuyCharacterName,ExpiredDate,CommodityID,PaybackRate,DiscountRate,GameWorldID,OwnerID,StoreBank,OrderNo,ProductNo,Refundable,SourceFlag
            ], trans)

            return ret.recordset[0]['']
        }

        public static async insertCashItemEqp_Tran(cashItemSN:number, POS:number, RUC:number, CUC:number, I_STR:number, 
            I_DEX:number,I_INT:number,I_LUK:number,I_MaxHP:number,I_MaxMP:number,I_PAD:number,I_MAD:number,I_PDD:number,I_MDD:number,I_ACC:number,I_EVA:number,I_Speed:number,I_Craft:number,I_Jump:number,Attribute:number, trans:mssql.Transaction) {
            const ret = await DBWrapper._query_trans(`INSERT INTO CashItem_EQP 
            (CashItemSN,POS,RUC,CUC,I_STR,I_DEX,I_INT,I_LUK,I_MaxHP,I_MaxMP,I_PAD,I_MAD,I_PDD,I_MDD,I_ACC,I_EVA,I_Speed,I_Craft,I_Jump,Attribute) 
            SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`, [
                cashItemSN,POS,RUC,CUC,I_STR,I_DEX,I_INT,I_LUK,I_MaxHP,I_MaxMP,I_PAD,I_MAD,I_PDD,I_MDD,I_ACC,I_EVA,I_Speed,I_Craft,I_Jump,Attribute
            ], trans)

            return ret.rowsAffected[0]
        }

        public static async insertCashItemPet_Tran(CashItemSN:number,POS:number,PetName:string,PetLevel:number,Tameness:number,Repleteness:number,DeadDate:string,PetAttribute:number,PetSkill:number,
            RemainLife:number,Attribute:number,ActiveState:number,AutoBuffSkill:number,PetHue:number,GiantRate:number,AutoBuffSkill1:number,trans:mssql.Transaction) {
            const ret = await DBWrapper._query_trans(`INSERT INTO CashItem_PET 
            (CashItemSN,POS,PetName,PetLevel,Tameness,Repleteness,DeadDate,PetAttribute,PetSkill,RemainLife,Attribute,ActiveState,AutoBuffSkill,PetHue,GiantRate,AutoBuffSkill1) 
            SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?`, [
                CashItemSN,POS,PetName,PetLevel,Tameness,Repleteness,DeadDate,PetAttribute,PetSkill,RemainLife,Attribute,ActiveState,AutoBuffSkill,PetHue,GiantRate,AutoBuffSkill1
            ], trans)
            
            return ret.rowsAffected[0]
        }

        public static async insertCashItemBundle_Tran(CashItemSN:number,POS:number,Attribute:number, trans:mssql.Transaction) {
            const ret = await DBWrapper._query_trans(`INSERT INTO CashItemBundle (CashItemSN,POS,Attribute) 
            SELECT ?, ?, ?`, [
                CashItemSN,POS,Attribute
            ], trans)          

            return ret.rowsAffected[0]
        }

        public static async insertCharacterRecoveryItemLog_Tran(CharacterID:number,ItemID:number,OldItemSN:number,NewItemSN:number,SnapshotSN:number,Type:number, trans:mssql.Transaction) {
            const ret = await DBWrapper._query_trans(`INSERT INTO Snapshot.dbo.CharacterRecoveryItemLog 
            (CharacterID,ItemID,OldItemSN,NewItemSN,SnapshotSN,[Type]) 
            SELECT ?, ?, ?, ?, ?, ?`, [
                CharacterID,ItemID,OldItemSN,NewItemSN,SnapshotSN,Type
            ], trans)

            return ret.rowsAffected[0]
        }
    }

    static IL = class {
        public static async insertItemMovePath(date_YYYYMMDD:string, worldId:number, itemSN:number, itemId:number, type:number, from:number, to:number, through:number, fieldId:number, exParam:string) {
            const ret = await DBWrapper._query_il(`INSERT INTO ItemMovePath_${date_YYYYMMDD} SELECT GETDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?`, 
            [worldId, itemSN, itemId, type, from, to, through, fieldId, exParam])

            return ret.rowsAffected[0]
        }
    }

    static OT = class {
        public static async insertGiveCashItemLog(requestAdminID:number, targetCharacterName:string, itemSN:number, count:number, bossAdminID:number) {
            const ret = await DBWrapper._query_ot(`INSERT INTO GiveCashItemLog(AdminID, TargetCharacter, ItemSN, Number, BossAdminID, RequestTime)  
            VALUES (?, ?, ?, ?, ?, GETDATE())`, 
            [requestAdminID, targetCharacterName, itemSN, count, bossAdminID])

            return ret.rowsAffected[0]
        }

        public static async insertMaplePointLog(AdminID:number, AccountID:number, BeforePoint:number, AfterPoint:number, Reason:string, BossAdminID:number) {
            const ret = await DBWrapper._query_ot(`INSERT INTO MaplePointLog (AdminID, AccountID, BeforePoint, AfterPoint, Reason, BossAdminID, RequestTime) 
            VALUES (?, ?, ?, ?, ?, ?, GETDATE())`, 
            [AdminID, AccountID, BeforePoint, AfterPoint, Reason, BossAdminID])

            return ret.rowsAffected[0]
        }

        public static async deleteCharacterRecoveryLog(dateExpired:string) {
            const ret = await DBWrapper._query_ot(`DELETE CharacterRecoveryLog WHERE RequestTime < ?`, [dateExpired])

            return ret.rowsAffected[0]
        }
    }
}

export class DBSPHelper {
    static SS = class {
        public static async GetRecoveryCount(worldId:number, snapshotSN:number) : Promise<{nEQP:number, nCON:number, nINS:number, nETC:number, nEntrustedShop:number, nTrunk:number}> {
            const inputParams = [
                {name: 'nSnapshotSN', value: snapshotSN},
            ]

            const outputParams = [                
                {name: 'nEQP', type: mssql.Int},
                {name: 'nCON', type: mssql.Int},
                {name: 'nINS', type: mssql.Int},
                {name: 'nETC', type: mssql.Int},
                {name: 'nEntrustedShop', type: mssql.Int},
                {name: 'nTrunk', type: mssql.Int}
            ]
        
            const ret = await Database.callSP(`GetRecoveryCount`, inputParams, `Snapshot${worldId}`, outputParams)                        
            return { nEQP: ret.output[`nEQP`], nCON: ret.output[`nCON`], nINS: ret.output[`nINS`], nETC:ret.output[`nETC`], nEntrustedShop: ret.output[`nEntrustedShop`], nTrunk: ret.output[`nTrunk`]}
        }
    }

    static GA = class {
        public static async MaplePoint_Inc(accountId:number, incVal:number, type:number) {
            const inputParams = [
                {name: 'nAccountID', value: accountId},
                {name: 'nPoint', value: incVal},
                {name: 'nType', value: type}
            ]
            return await Database.callSP(`MaplePoint_Inc`, inputParams, DBAlias.GlobalAccount,[])
        }

        public static async MaplePoint_Inc_Tran(accountId:number, incVal:number, type:number, trans:mssql.Transaction) {
            const inputParams = [
                {name: 'nAccountID', value: accountId},
                {name: 'nPoint', value: incVal},
                {name: 'nType', value: type}
            ]
            return await Database.callSP_trans(`MaplePoint_Inc`, inputParams, trans,[])
        }

        public static async MaplePoint_Get(accountId:number) {
            const inputParams = [
                {name: 'nAccountID', value: accountId},            
            ]
            const ret = await Database.callSP(`MaplePoint_Get`, inputParams, DBAlias.GlobalAccount)

            return ret.returnValue
        }

        public static async OPTool_InsertMoveLog(targetCode:number, worldId:number, isEquip:boolean, fromCharacterId:number, adminId:number, itemSN:bigint) {
            const inputParams = [
                {name: 'nTargetCode', value: targetCode},
                {name: 'nGameWorldID', value: worldId}, 
                {name: 'bIsEquip', value: isEquip}, 
                {name: 'dwFromCharacterID', value: fromCharacterId}, 
                {name: 'nAdminID', value: adminId}, 
                {name: 'nItemSN', value: itemSN}, 
            ]
            const ret = await Database.callSP(`OPTool_InsertMoveLog`, inputParams, DBAlias.GlobalAccount)

            return ret.returnValue
        }

        public static async OPTool_InsertGivenMoneyLog(characterId:number, worldId:number, itemId:bigint, adminId:number, insertTime:string, bossAdminId:number, requestTime:string) {
            const inputParams = [
                {name: 'nCharacterID', value: characterId},
                {name: 'nGameWorldID', value: worldId}, 
                {name: 'nItemID', value: itemId}, 
                {name: 'nAdminID', value: adminId}, 
                {name: 'sInsertTime', value: insertTime}, 
                {name: 'nBossAdminID', value: bossAdminId}, 
                {name: 'sRequestTime', value: requestTime}
            ]
            const ret = await Database.callSP(`OPTool_InsertGivenMoneyLog`, inputParams, DBAlias.GlobalAccount)

            return ret.returnValue
        }


        public static async SetProtectAccount(accountId:number, type:number,trans:mssql.Transaction|undefined=undefined) : Promise<any> {
            const inputParams = [
                { name: "nAccountID", value: accountId },
                { name: "nType", value: type },
            ];
            if( trans ) return await DBWrapper.callSP_trans(`SetProtectAccount`, inputParams, [], trans)    
            else return await Database.callSP(`SetProtectAccount`, inputParams, DBAlias.GlobalAccount,[])
        }

        public static async SetProtectAccountLevel(accountId:number, level:number,trans:mssql.Transaction|undefined=undefined) : Promise<any> {
            const inputParams = [
                    {name: '_accountId', value: accountId},
                    {name: '_lv', value: level}
                ]
            if( trans ) return await DBWrapper.callSP_trans(`SetProtectAccountLevel`, inputParams, [], trans)    
            else return await Database.callSP(`SetProtectAccountLevel`, inputParams, DBAlias.GlobalAccount,[])
        }

        public static async Account_SetUnBlockedDate( accountId:number, blockReason:number, dtUnblock:string, trans:mssql.Transaction|undefined=undefined) {
            const inputParams = [
                {name: 'nAccountID', value: accountId},
                {name: 'nBlockReason', value: blockReason},
                {name: 'dtUnblockDate', value: dtUnblock}
            ]
            if( trans) return await DBWrapper.callSP_trans(`Account_SetUnBlockedDate`, inputParams , [], trans)
            else return await Database.callSP(`Account_SetUnBlockedDate`, inputParams , DBAlias.GlobalAccount, [])
        }    

        public static async OpTool_GetConnectCharacter(sEmail:string) {
            const inputParams = [
                {name: 'strEmail', value: sEmail}
            ]
            return await Database.callSP(`OpTool_GetConnectCharacter`, inputParams, DBAlias.GlobalAccount,[])
        }

        public static async Account_GetIDByCharacterID(cid:number, worldId:number) {
            const inputParams = [
                {name: 'nCharacterID', value: cid},
                {name: 'nGameWorldID', value: worldId}
            ]
            const ret = await Database.callSP(`Account_GetIDByCharacterID`, inputParams, DBAlias.GlobalAccount,[])
            if( ret.recordsets[0].length > 0 ) return Number(ret.recordsets[0][0].AccountID)
            return -1
        }   

        public static async Account_GetAccountIDFromCharacterName(cname:string) : Promise<number> {
            const ret = await Database.callSP(`GetAccountIDFromCharacterName`, [
                {name: 'strCharacterName', value: cname}
            ], DBAlias.GlobalAccount,
            [
                {name: 'nAccountID', type: mssql.Int}
            ]) 

            return ret.output['nAccountID'] ?? -1
        }

        public static async OpTool_GetAccountInfo(accountid:number, option = 0) : Promise<IRecordSet<any>> {
            const ret = await Database.callSP(`OpTool_GetAccountInfo`, [
                {name: 'nAccountID', value: accountid},
                {name: 'nOption', value: option}
            ], DBAlias.GlobalAccount)
            return ret.recordsets.length > 0 ? ret.recordsets[0][0] : null
        }

        public static async ChatBlockList_SetUnBlockDate(accountId:number,blockReason:number, dtUnblockDate:string) {
            const inputParams = [
                {name: 'nAccountID', value: accountId},
                {name: 'nChatBlockReason', value: blockReason},
                {name: 'dtUnblockDate', value: dtUnblockDate}
            ]
            return await Database.callSP(`ChatBlockList_SetUnBlockDate`, inputParams, DBAlias.GlobalAccount,[])
        }
    }

    static GW = class {
        public static async OpTool_GetNewEQPSN(worldId:number, characterId:number, itemId:number, itemSN:number, sn:number) {
            const inputParams = [
                {name: 'nCharacterID', value: characterId},
                {name: 'nItemID', value: itemId},
                {name: 'nItemSN', value: itemSN},
                {name: 'nSN', value: sn},
            ]
        
            const ret = await Database.callSP(`OpTool_GetNewEQPSN`, inputParams, `GW${worldId}`, [])            
            return ret.recordsets[0][0]['']
        }   

        public static async OpTool_GetNewEQPSN_Tran(characterId:number, itemId:number, itemSN:number, sn:number, trans:mssql.Transaction) {
            const inputParams = [
                {name: 'nCharacterID', value: characterId},
                {name: 'nItemID', value: itemId},
                {name: 'nItemSN', value: itemSN},
                {name: 'nSN', value: sn},
            ]
        
            const ret = await Database.callSP_trans(`OpTool_GetNewEQPSN`, inputParams, trans, [])            
            return ret.recordset[0]['']
        }

        public static async OpTool_InsertAdminParcel(worldId:number, characterId:number, parcelExpired:string, slotType:number, deliveryType:number ) {
            const inputParams = [
                {name: 'nCharacterID', value: characterId},
                {name: 'dtParcelExpired', value: parcelExpired},
                {name: 'nSlotType', value: slotType},
                {name: 'ndeliveryType', value: deliveryType}
            ]
        
            const ret = await Database.callSP(`OpTool_InsertAdminParcel`, inputParams,  `GW${worldId}`, [])
            return ret.returnValue
        }

        public static async OpTool_InsertAdminParcel_Bundle_Tran(parcelSN:number, itemId:number, count:number, expireDate:string, attr:number, title:string, trans:mssql.Transaction ) {
            const inputParams = [
                {name: 'nParcelSN', value: parcelSN},
                {name: 'nItemID', value: itemId},
                {name: 'nNumber', value: count},
                {name: 'dtItemExpired', value: expireDate},
                {name: 'nAttr', value: attr},
                {name: 'sTitle', value: title}
            ]
        
            return await Database.callSP_trans(`OpTool_InsertAdminParcel_Bundle`, inputParams,  trans, [])
        }

        public static async OpTool_MoveItem(worldId:number, itemSN:bigint, characterId:number, pos:number, code:number) {
            const inputParams = [
                {name: 'nItemSN', value: itemSN},
                {name: 'nCharacterID', value: characterId}, 
                {name: 'nPOS', value: pos}, 
                {name: 'nCode', value: code}, 
            ]
            const ret = await Database.callSP(`OpTool_MoveItem`, inputParams, `GW${worldId}`)

            return ret.returnValue
        }

        public static async OpTool_AddCharacterMeso(worldId:number, characterId:number, meso:bigint) {
            const inputParams = [
                {name: 'nCharacterID', value: characterId},
                {name: 'nMoney', value: meso}, 
            ]
            const ret = await Database.callSP(`OpTool_AddCharacterMeso`, inputParams, `GW${worldId}`)

            return ret.returnValue
        }


        public static async OpTool_SendGMMemo(accountid:number, dtReceivedDate:string, worldId:number, memo:string) {
            const inputParams = [
                    {name: 'nAccountID', value: accountid},
                    {name: 'dtReceiveDate', value: dtReceivedDate},
                    {name: 'sContent', value: memo},
                    {name: 'sTitle', value: ''},
                ]
            
            await Database.callSP(`OpTool_SendGMMemo`, inputParams, `GW${worldId}`,[])
        }

        public static async OpTool_SendGMMemo_Trans(accountid:number, dtReceivedDate:string, memo:string, trans:mssql.Transaction) {
            const inputParams = [
                    {name: 'nAccountID', value: accountid},
                    {name: 'dtReceiveDate', value: dtReceivedDate},
                    {name: 'sContent', value: memo},
                    {name: 'sTitle', value: ''},
                ]
            
            await Database.callSP_trans(`OpTool_SendGMMemo`, inputParams, trans, [])
        }

        public static async OpTool_CharacterRecovery_Trans(recoverySN:number, trunkSN:number, characterId:number, worldId:number, accountId:number, sn:number, trans:mssql.Transaction) {
            const inputParams = [
                    {name: 'nRecoverySN', value: recoverySN},
                    {name: 'nTrunkSN', value: trunkSN},
                    {name: 'nCharacterID', value: characterId},
                    {name: 'nGameWorldID', value: worldId},
                    {name: 'nAccountID', value: accountId},
                    {name: 'nSN', value: sn},
                ]
            
            return await Database.callSP_trans(`OpTool_CharacterRecovery`, inputParams, trans, [])
        }

        public static async OpTool_CharacterRecovery_CashItem_Tran( recoverySN:number, cashSN:number, accountId:number, characterId:number, isOwn:boolean, trans:mssql.Transaction) {
            const inputParams = [
                    {name: 'nRecoverySN', value: recoverySN},
                    {name: 'nCashSN', value: cashSN},
                    {name: 'nAccountID', value: accountId},
                    {name: 'nCharacterID', value: characterId},
                    {name: 'bOwn', value: isOwn}
                ]
            
            return await Database.callSP_trans(`OpTool_CharacterRecovery_CashItem`, inputParams, trans, [])
        }

        public static async OpTool_CharacterRecovery_CashItem_Nocheck_Tran( recoverySN:number, cashSN:number, accountId:number, characterId:number, isOwn:boolean, trans:mssql.Transaction) {
            const inputParams = [
                    {name: 'nRecoverySN', value: recoverySN},
                    {name: 'nCashSN', value: cashSN},
                    {name: 'nAccountID', value: accountId},
                    {name: 'nCharacterID', value: characterId},
                    {name: 'bOwn', value: isOwn}
                ]
            
            return await Database.callSP_trans(`OpTool_CharacterRecovery_CashItem_NoCheck`, inputParams, trans, [])
        }

        public static async OpTool_InsertCashItemLog_Tran( newCashSN:number, accountId:number, commodityId:number, itemId:number, number:number, expireDate:string, 
            level:number, job:number, str:number, dex:number, int:number, luk:number, maxHP:number, maxMP:number, exp:number, money:bigint, worldId:number , trans:mssql.Transaction) {
            const inputParams = [
                    {name: 'nNewCashSN', value: newCashSN},
                    {name: 'nAccountID', value: accountId},
                    {name: 'nCommodityID', value: commodityId},
                    {name: 'nItemID', value: itemId},
                    {name: 'nNumber', value: number},
                    {name: 'dtExpiredDate', value: expireDate},
                    {name: 'nLevel', value: level},
                    {name: 'nJob', value: job},
                    {name: 'nStr', value: str},
                    {name: 'nDex', value: dex},
                    {name: 'nInt', value: int},
                    {name: 'nLuk', value: luk},
                    {name: 'nMaxHP', value: maxHP},
                    {name: 'nMaxMP', value: maxMP},
                    {name: 'nExp', value: exp},
                    {name: 'nMoney', value: money},
                    {name: 'nGameWorldID', value: worldId}
                ]
            
            return await Database.callSP_trans(`OpTool_InsertCashItemLog`, inputParams, trans, [])
        }
    }

    static GL = class {
        public static DB = DBAlias.GameLog
        public static async InsertUserMesoMoveExLog(worldId:number, moveType:number, sender:number, receiver:number, moveMeso:bigint, itemId:number, itemCount:number, senderMeso:bigint, receiverMeso:bigint, fieldId:number) {
            const inputParams = [
                {name: 'nGameWorldID', value: worldId},
                {name: 'dtDateTime', value: moment().format(DATETIME_FORMAT)},
                {name: 'nMoveType', value: moveType},
                {name: 'nSender', value: sender},
                {name: 'nReceiver', value: receiver},
                {name: 'nMoveMeso', value: moveMeso},
                {name: 'nItemID', value: itemId},
                {name: 'nItemCount', value: itemCount},
                {name: 'nSenderMeso', value: senderMeso},
                {name: 'nReceiverMeso', value: receiverMeso},
                {name: 'nFieldID', value: fieldId}
            ]
            return await Database.callSP(`InsertUserMesoMoveExLog`, inputParams, this.DB,[])
        }   

        public static async InsertTrunkLog(worldId:number, accountId:number, characterId:number, type:number, itemId:number, itemSN:number, count:bigint, afterCount:number, afterInven:bigint) {
            const inputParams = [
                {name: 'nGameWorldID', value: worldId},
                {name: 'dwAccountID', value: accountId},
                {name: 'dwCharacterID', value: characterId},
                {name: 'nType', value: type},
                {name: 'nItemID', value: itemId},
                {name: 'nItemSN', value: itemSN},
                {name: 'nCount', value: count},
                {name: 'nAfterCount', value: afterCount},
                {name: 'nAfterInven', value: afterInven},
            ]
            return await Database.callSP(`InsertTrunkLog`, inputParams, this.DB,[])
        }   

        public static async OpTool_InsertWorldMoneyLog(worldId:number, characterId:number, money:bigint) {
            const inputParams = [
                {name: 'GameWorldID', value: worldId},
                {name: 'nCharacterID', value: characterId},
                {name: 'Money', value: money},
            ]
            return await Database.callSP(`OpTool_InsertWorldMoneyLog`, inputParams, this.DB,[])
        }

        public static async InsertCharacterMesoInOutInfoLog(accountId:number,worldId:number, characterId:number, level:number, job:number, type:number, incMeso:bigint, incCount:number, decMeso:bigint, decCount:number) {
            const inputParams = [
                {name: 'nAccountID', value: accountId},
                {name: 'nGameWorldID', value: worldId},
                {name: 'nCharacterID', value: characterId},
                {name: 'nLevel', value: level},
                {name: 'nJob', value: job},
                {name: 'nType', value: type},
                {name: 'nIncMeso', value: incMeso},
                {name: 'nIncCount', value: incCount},
                {name: 'nDecMeso', value: decMeso},
                {name: 'nDecCount', value: decCount},
                {name: 'dtInsertDate', value: moment().format('YYYY-MM-DD HH:mm:00')}
            ]
            return await Database.callSP(`InsertCharacterMesoInOutInfoLog`, inputParams, this.DB,[])
        }
    }

    static CL = class {
        public static async OpTool_InsertItemMove(worldId:number, itemSN:bigint, itemId:number, moveFrom:number, moveTo:number) {
            const inputParams = [
                {name: 'nGameWorldID', value: worldId},
                {name: 'nItemSN', value: itemSN},
                {name: 'nItemID', value: itemId}, 
                {name: 'nMoveFrom', value: moveFrom}, 
                {name: 'nMoveTo', value: moveTo}, 
            ]
            return await Database.callSP(`OpTool_InsertItemMove`, inputParams, DBAlias.Claim)
        }

        public static async UpdateClaim(progress:number, adminId:number, sn:number, originProgress=0) {
            const inputParams = [
                {name: 'nProgress', value: progress},
                {name: 'nAdminID', value: adminId},
                {name: 'nSN', value: sn},
                {name: 'nOriginProgress', value: originProgress}
            ]
            const ret = await Database.callSP(`UpdateClaim`, inputParams, DBAlias.Claim,[])
            return ret.returnValue
        }  

        public static async OPTool_InsertChatBlockHistory(worldId:number, targetAccountId:number, targetCharacterName:string, sendAccountId:number, sendCharacterName:string, type:number, adminId:number, result:number, claimSN:number, dtEventDate:string, dtUnblockDate:string, sendCharacterID:number, targetCharacterID:number) {
            const inputParams = [
                {name: 'nGameWorldID', value: worldId},
                {name: 'nTargetAccountID', value: targetAccountId},
                {name: 'sTargetCharacterName', value: targetCharacterName},
                {name: 'nSendAccountID', value: sendAccountId},
                {name: 'sSendCharacterName', value: sendCharacterName},
                {name: 'nType', value: type},
                {name: 'nAdminID', value: adminId},
                {name: 'nResult', value: result},
                {name: 'nClaimSN', value: claimSN},
                {name: 'dtEventDate', value: dtEventDate},
                {name: 'dtUnblockDate', value: dtUnblockDate},
                {name: 'nSendCharacterID', value: sendCharacterID},
                {name: 'nTargetCharacterID', value: targetCharacterID}
            ]
            return await Database.callSP(`OPTool_InsertChatBlockHistory`, inputParams, DBAlias.Claim,[])
        }
    }

    static OT = class {
        public static async MesoPound_Subtract(worldId:number, meso:bigint) {
            const inputParams = [
                {name: 'nGameWorldID', value: worldId},
                {name: 'nMeso', value: meso},
            ]
            return await Database.callSP(`MesoPound_Subtract`, inputParams, DBAlias.OPTool)
        }

        public static async Account_Block(adminId:number, accountId:number, characterName:string, blockReason:number, days:number) {
            const inputParams = [
                {name: 'nAdminID', value: adminId},
                {name: 'nAccountID', value: accountId},
                {name: 'strCharacterName', value: characterName},
                {name: 'nBlockReason', value: blockReason},
                {name: 'nDays', value: days}
            ]
            return await Database.callSP(`Account_Block`, inputParams, DBAlias.OPTool,[])
        }

        public static async Account_TempBlock(adminId:number, accountId:number) {
            const inputParams = [
                {name: 'nAdminID', value: adminId},
                {name: 'nAccountID', value: accountId},
                {name: 'sReason', value: '임시차단'},
            ]
            return await Database.callSP(`Account_TempBlock`, inputParams, DBAlias.OPTool,[])
        }

        public static async account_TempBlockClear(adminId:number, accountId:number) {
            const inputParams = [
                {name: 'nAdminID', value: adminId},
                {name: 'nAccountID', value: accountId},
            ]
            return await Database.callSP(`account_TempBlockClear`, inputParams, DBAlias.OPTool,[])
        }

        public static async Comment_Insert(accountId:number, adminId:number, memo:string, trans:mssql.Transaction|undefined=undefined) {
            const inputParams = [
                    {name: 'AccountID', value: accountId},
                    {name: 'AdminID', value: adminId},
                    {name: 'Content', value: memo}
                ]
            if( trans ) return await DBWrapper.callSP_trans(`Comment_Insert`, inputParams, [], trans)    
            else return await Database.callSP(`Comment_Insert`, inputParams, DBAlias.OPTool,[])
        }

        // 단체 작업하기 관련
        public static async insertAccountBlockCount(adminId:number, accountId:number, worldId:number, characterId:number, characterName:string, blockType:number, blockDays:number, blockReason:number, dtUnblocked:string,trans:mssql.Transaction|undefined=undefined) : Promise<any> {
            const inputParams = [
                    {name: 'nType', value: blockType},
                    {name: 'nAccountID', value: accountId},
                    {name: 'nGameWorldID', value: worldId},
                    {name: 'nCharacterID', value: characterId},
                    {name: 'sCharacterName', value: characterName},
                    {name: 'nBlockCount', value: 1},
                    {name: 'nBlockDays', value: blockDays},
                    {name: 'nRequestAdminID', value: adminId},
                    {name: 'nUnblockedTime', value: dtUnblocked},
                    {name: 'nBlockReason', value: blockReason}
                ]
            if( trans ) return await DBWrapper.callSP_trans(`InsertAccountBlockCount`, inputParams, [], trans)    
            else return await Database.callSP(`InsertAccountBlockCount`, inputParams, DBAlias.OPTool,[])
        }

        public static async account_tradeBlockRequest(adminId:number, accountId:number, worldId:number, characterId:number, characterName:string, blockDays:number, blockReason:number, memo:string,trans:mssql.Transaction|undefined=undefined) : Promise<any> {
            const inputParams = [
                    {name: 'nAdminID', value: adminId},
                    {name: 'nAccountID', value: accountId},
                    {name: 'sCharacterName', value: characterName},
                    {name: 'nWorldID', value: worldId},
                    {name: 'nCharacterID', value: characterId},
                    {name: 'nBlockDays', value: blockDays},
                    {name: 'nBlockReason', value: blockReason},
                    {name: 'sMemo', value: memo},
                ]
            if( trans ) return await DBWrapper.callSP_trans(`Account_TradeBlockRequest`, inputParams, [], trans)    
            else return await Database.callSP(`Account_TradeBlockRequest`, inputParams, DBAlias.OPTool,[])
        }

        public static async OPTool_GetAccounts() : Promise<any> { 
            return await Database.callSP(`AdminTool_Account_Get`, 
            [
                {name: 'nEMPNO', value: -1}
            ], DBAlias.OPTool)
        }

        public static async OPTool_GetAccount(id:number) : Promise<any> { 
            const rows = (await Database.callSP(`AdminTool_Account_Get`, 
            [
                {name: 'nEMPNO', value: id}
            ], DBAlias.OPTool)).recordsets[0]
            return rows.length <= 0 ? null : rows[0]
        }

        public static OPTool_AddAccount(name:string, id:number, dname:string, flag:number) : Promise<IProcedureResult<any>> { 
            return Database.callSP(`AdminTool_Account_Add`, [
                {name: 'nEmpNo', value: id},
                {name: 'sEmpName', value: name},
                {name: 'sDeptName', value: dname},
                {name: 'nPriorityFlag', value: flag}
            ], DBAlias.OPTool) 
        }
        public static OPTool_UpdateAccount(id:number, flag:number) : Promise<IProcedureResult<any>> { 
            return Database.callSP(`AdminTool_Account_Update`, [
                {name: 'nEMPNO', value: id},
                {name: 'nPriorityFlag', value: flag}], DBAlias.OPTool) 
        }

        ////////////////////////////////////////
        //  로그 시스템 관련
        public static async OPTool_LogManAddLog(logKey:string, desc:string) : Promise<IProcedureResult<any>> { 
            return Database.callSP(`AdminTool_LogMan_Add`, [ 
                {name: 'sAlias', value: logKey}, 
                {name: 'sDesc', value: desc} 
            ], DBAlias.OPTool) 
        }
        public static async OPTool_LogManColumnsUpdate(sn:number, colName:string, colDispName:string, dispFormat:string, formatSubData:string, hint:string, hide:boolean, order:number) : Promise<IProcedureResult<any>> { 
            return Database.callSP(`AdminTool_LogManColumns_Update`, [ 
                {name: 'nLogManSN', value: sn}, 
                {name: 'sColName', value: colName}, 
                {name: 'sColDispName', value: colDispName}, 
                {name: 'sDispFormat', value: dispFormat}, 
                {name: 'sFormatSubData', value: formatSubData}, 
                {name: 'sHint', value: hint}, 
                {name: 'nHide', value: hide}, 
                {name: 'nOrder', value: order} 
            ], DBAlias.OPTool) 
        }
        public static async OPTool_LogManColumnsDelete(logmanSN:number, colName:string) : Promise<IProcedureResult<any>> { 
            return Database.callSP(`AdminTool_LogManColumns_Delete`, [ 
                {name: 'nLogManSN', value: logmanSN}, 
                {name: 'sColName', value: colName} 
            ], DBAlias.OPTool) 
        }
    }
}