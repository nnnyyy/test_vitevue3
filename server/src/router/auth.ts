import express from 'express'
import {SSOCommon} from '../auth/SSOCommon' 
import {SessionMan} from '../auth/SessionMan'
import Logger, {ILogType, LogMan} from '../Logger'

const router = express.Router()

router.post('/check', check)
router.get('/sso/callback', SSOCommon.procLoginCallback)
router.get('/logout', SSOCommon.procLogout)
router.post('/getLoginURL', SSOCommon.getLoginURL)

async function check(req: express.Request, res: express.Response) {
    const log = LogMan.get(ILogType.ADMIN);
    try {
        const userinfo = SessionMan.getUserInfo(req)        

        try {
            if( userinfo != undefined ) {                
                log.addLog(`Page Access : ${JSON.stringify(userinfo)}[${req.headers['x-forwarded-for']}] - ${JSON.stringify(req.body)}`) 
            }                    
            else {
                log.addLog(`Page Access : ${req.headers["x-forwarded-for"]} - ${JSON.stringify(req.body)}`); 
            }
        } catch (error) {
            console.log(JSON.stringify(error))            
        }
        

        if( process.env.NODE_ENV !== 'production' && userinfo == undefined ) {
            await SessionMan.save(req, { EMPName: '왕예식', EMPNO: 12223, DEPTName: '메이플플랫폼유닛', PriorityFlag: 128 })
            res.send({ret: true, userinfo })
            return
        }
  
        res.send({ret: !!userinfo, userinfo })
    }catch(e) {
        console.log(e)
        res.send(e)
    }
}


export default router