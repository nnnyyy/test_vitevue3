export async function sleep(ms:number) {
    return new Promise((res=>{
        setTimeout(()=>{
            res(100)
        }, ms)
    }))
}

export const DATETIME_FORMAT = `YYYY-MM-DD HH:mm:ss`
export const DATE_FORMAT = `YYYY-MM-DD`