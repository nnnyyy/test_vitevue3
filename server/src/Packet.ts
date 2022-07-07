import iconv from 'iconv-lite'
export const ADMIN_TOOL_SEQ = 0x1234;

class Packet {
    data:number[] = []

    GetBuffer() {
        const _buffer = new ArrayBuffer(2);
        const arr:Uint16Array = new Uint16Array(_buffer);
        const arr8:Uint8Array = new Uint8Array(arr.buffer);
        arr[0] = ADMIN_TOOL_SEQ

        const _buffer2 = new ArrayBuffer(2);
        const arr2:Uint16Array = new Uint16Array(_buffer2);
        const arr28:Uint8Array = new Uint8Array(arr2.buffer);
        arr2[0] = this.data.length

        const buffer = new Uint8Array([ ...Array.from(arr8) , ...Array.from(arr28), ...this.data])
        return buffer
    }
}

export class OutPacket extends Packet {
    constructor(type:number) {
        super()
        this.Encode1(type)
    }
    getPacketType() {
        if( this.data.length <= 0 ) throw 'Packet Error'
        return this.data[0]
    }
    
    Encode1(d:number) {
        const buffer = new ArrayBuffer(1);
        const arr:Uint8Array = new Uint8Array(buffer);
        arr[0] = d
        for( const it of arr ) {
            this.data.push(it)
        }
    }

    Encode2(d:number) {
        const buffer = new ArrayBuffer(2);
        const arr:Uint16Array = new Uint16Array(buffer);
        const arr8:Uint8Array = new Uint8Array(arr.buffer);
        arr[0] = d
        for( const it of arr8 ) {
            this.data.push(it)
        }
    }

    Encode4(d:number) {
        const buffer = new ArrayBuffer(4);        
        const arr:Uint32Array = new Uint32Array(buffer);
        const arr8:Uint8Array = new Uint8Array(arr.buffer);
        arr[0] = d
        for( const it of arr8 ) {
            this.data.push(it)
        }        
    }

    Encode8(d:bigint) {
        const buffer = new ArrayBuffer(8);        
        const arr:BigUint64Array = new BigUint64Array(buffer);
        const arr8:Uint8Array = new Uint8Array(arr.buffer);
        arr[0] = d
        for( const it of arr8 ) {
            this.data.push(it)
        }        
    }

    EncodeStr(s:string) {
        this.Encode2(s.length)
        const arr8:Uint8Array = new Uint8Array(iconv.encode(s, "euc-kr"));
        for( const it of arr8 ) {
            this.data.push(it)
        }
    }
}

export class InPacket extends Packet {    
    pos = 0
    len = 0
    type = 0
    constructor(_data:Uint8Array) { 
        super(); 
        this.len = (new Uint16Array((new Uint8Array([ _data[2], _data[3] ])).buffer))[0]

        if( this.len >= 0xff00 ) {
            this.len = (new Uint32Array((new Uint8Array([ _data[4], _data[5], _data[6], _data[7] ])).buffer))[0]
            this.type = (new Uint16Array((new Uint8Array([ _data[8], _data[9] ])).buffer))[0]
            this.pos += 10
        }
        else  {
            this.type = (new Uint16Array((new Uint8Array([ _data[4], _data[5] ])).buffer))[0]
            this.pos += 6
        }
        
        for( const it of _data) {
            this.data.push(it)
        }
    }

    Decode1() : number {
        const n = this.data[this.pos]
        this.pos += 1        
        return n
    }

    Decode2() : number {            
        const arr8 = new Uint8Array([ this.data[this.pos], this.data[this.pos+1] ])
        const n = (new Uint16Array(arr8.buffer))[0]
        this.pos += 2
        return n

    }
    Decode4() : number {
        const n = (new Uint32Array( new Uint8Array([ this.data[this.pos], this.data[this.pos+1], this.data[this.pos+2], this.data[this.pos+3] ]).buffer ))[0]
        this.pos += 4
        return n
    }

    DecodeStr() : string {
        const len = this.Decode2()
        const _d:any[] = []

        for( let i = this.pos ; i < this.pos + len ; ++i ) {
            _d.push(this.data[i])
        }        

        this.pos += len;
        return iconv.decode( Buffer.from(new Uint8Array(_d)), 'euc-kr')
    }
}