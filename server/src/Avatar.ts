import crypto from 'crypto-js'
import rij from 'rijndael-js'
import {DBWrapper} from './DB'
import Log from './Logger'

const ms_abKey = [ 0x10, 0x04, 0x3F, 0x11, 0x17, 0xCD, 0x12, 0x15, 0x5D, 0x8E, 0x7A, 0x19, 0x80, 0x11, 0x4F, 0x14 ]
const ms_abIV = [ 0x11, 0x17, 0xCD, 0x10, 0x04, 0x3F, 0x8E, 0x7A, 0x12, 0x15, 0x80, 0x11, 0x5D, 0x19, 0x4F, 0x10 ]    

const ms_ItemIDKey = [ 0xA, 0x5, 0xF, 0x2, 0xB, 0x7, 0xE, 0x1 ];
const ms_SkillIDKey = [ 0xA, 0x5, 0xF, 0x2, 0xB, 0x7, 0xE, 0x1, 0xC, 0x0 ];
const ms_NPCIDKey = [ 0x5, 0xF, 0x2, 0xB, 0x7, 0xE, 0x1 ];
const ms_GuildMarkKey = [ 0x4, 0xC, 0x8, 0xB, 0x1, 0x3, 0xF, 0x7, 0xA, 0x1 ];

function hexToBytes(hex:any) {
    const bytes = []
    for (let c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function convertWordArrayToUint8Array(wordArray:any) {
    const len = wordArray.words.length
    const u8_array = new Uint8Array(len << 2)
    let offset = 0

    for (let i = 0; i < len; i++) {
        const word = wordArray.words[i];                

        u8_array[offset++] = word >> 24;
        u8_array[offset++] = (word >> 16) & 0xff;
        u8_array[offset++] = (word >> 8) & 0xff;
        u8_array[offset++] = word & 0xff;                                              
    }
    return u8_array;
}


export async function getAvatarURL(worldId:number, characterId:number, dbmode:string) {
    try {        
        const [avatar] = await DBWrapper.query_gw(worldId,`select CharacterLook from avatar with(nolock) where characterid = ?`, [characterId], dbmode)        

        if( !avatar ) return ''
        const lResult: number[] = []

        const r = new rij(Buffer.from(ms_abKey), 'cbc')        

        for( const it of avatar.CharacterLook) {
            lResult.push(it & 0x000000ff)
        }

        const md5_list = convertWordArrayToUint8Array(crypto.MD5(avatar.CharacterLook))
        let cnt = 0;
        for( const it of md5_list ) {
            lResult.push(it & 0x000000ff)
            cnt++
            if( cnt >= 8 ) break;
        }

        const buf = r.encrypt(Buffer.from(lResult), '128', Buffer.from(ms_abIV))     
        
        let s = ''
        for( const _t of buf) {
            let nVal = _t
            if( nVal < 0 ) nVal += 256            
            s += String.fromCharCode(((nVal >> 4) + 'A'.charCodeAt(0)))
            s += String.fromCharCode(((nVal & 0xF) + 'A'.charCodeAt(0)))
        }

        return `http://avatar.maplestory.nexon.co.kr/Character/${s}.png`;        
    } catch(e) {
        Log.addErrorLog(e)
        return ``
    }       
}

export function getItemIcon(itemId: number) {
    const LEN = 8
    const convert:number[] = new Array(LEN)
    let nDiv = 1
    for( let i = 1 ; i < LEN ; ++i ) {
        nDiv *= 10
    }

    for( let i = 0 ; i < LEN ; ++i, nDiv /= 10 ) {        
        convert[i] = 'A'.charCodeAt(0)
        let nDigit;
        nDigit = itemId / nDiv ^ ms_ItemIDKey[i]        

        itemId %= nDiv
        while( nDigit-- > 0 ) convert[i]++
    }

    let s = ''
    for( const it of convert) {
        s += String.fromCharCode(it)
    }

    return `http://avatar.maplestory.nexon.co.kr/ItemIcon/${s}.png`
}

export function getSkillIcon(skillId: number) {
    const LEN = 10
    const convert:number[] = new Array(LEN)
    let nDiv = 1
    for( let i = 1 ; i < LEN ; ++i ) {
        nDiv *= 10
    }

    for( let i = 0 ; i < LEN ; ++i, nDiv /= 10 ) {        
        convert[i] = 'A'.charCodeAt(0)
        let nDigit;
        nDigit = skillId / nDiv ^ ms_SkillIDKey[i]        

        skillId %= nDiv
        while( nDigit-- > 0 ) convert[i]++
    }

    let s = ''
    for( const it of convert) {
        s += String.fromCharCode(it)
    }

    return `http://avatar.maplestory.nexon.co.kr/SkillIcon/${s}.png`
}