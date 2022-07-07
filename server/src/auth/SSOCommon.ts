import express from 'express'
import rp from 'request-promise'
import {SessionMan} from './SessionMan'
import {DBSPHelper} from '../DBHelper'
import Log from '../Logger'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ssoConfig = require('../../config/SSOConfig.json')

const devUrl =  `http://localhost:19100`

export class SSOCommon {
     public static CLIENT_ID = ''
     public static BASE_URL = ''
     public static BASE_CALLBACK_URL = ''
     public static BDS_GET_PROFILE_URL = ''
     public static REDIRECT_URI = ''

     init() {
         if( process.env.NODE_ENV !== 'production' ) {
             SSOCommon.CLIENT_ID = 'ac099111-5aca-49f2-b825-337fe4ccd5f9'
             SSOCommon.BASE_URL = 'https://dev-nxas.nexon.com'
             SSOCommon.BDS_GET_PROFILE_URL = 'https://dev-nxas.nexon.com/api/service/user/GetProfile'             
             SSOCommon.BASE_CALLBACK_URL = `http://10.10.53.151:9100`
         }
         else {             
             SSOCommon.CLIENT_ID = ssoConfig.client_id
             SSOCommon.BASE_URL = ssoConfig.base_url
             SSOCommon.BDS_GET_PROFILE_URL = `${ssoConfig.base_url}/api/service/user/GetProfile`
             SSOCommon.BASE_CALLBACK_URL = ssoConfig.base_callback_url
         }

         SSOCommon.REDIRECT_URI = `${SSOCommon.BASE_CALLBACK_URL}/auth/sso/callback`
     }

     public static async procLoginCallback(req:express.Request,res:express.Response) {
         // 인증 완료됨  
         const code = req.query.code;

         let options:any = {
            url: `${SSOCommon.BASE_URL}/api/auth/Token`,
            method: 'POST',
            form: {
                grant_type: 'authorization_code',
                code: code,
                client_id: SSOCommon.CLIENT_ID,
                redirect_uri: encodeURI(SSOCommon.REDIRECT_URI)
            }
        }  

        const data = await rp(options)
        const jRes = JSON.parse(data)
        const accessToken = jRes.access_token

        options = {
            url: SSOCommon.BDS_GET_PROFILE_URL,
            method: `GET`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const _profile = await rp(options)
        const profile = JSON.parse(_profile)
        const EMPNO = profile.EMPNO

        const info = (await DBSPHelper.OT.OPTool_GetAccount(EMPNO))
        if( !info ) {
            Log.addErrorLog('auth failed')
            res.redirect( process.env.NODE_ENV !== 'production' ? `${devUrl}/auth/failed` : `/auth/failed`)
            return
        }

        if ( await SessionMan.save(req, info) ) {
            res.redirect( process.env.NODE_ENV !== 'production' ? `${devUrl}/` : `/`)
            return
        }
        else {
            Log.addErrorLog('auth failed')
            res.redirect( process.env.NODE_ENV !== 'production' ? `${devUrl}/auth/failed` : `/auth/failed`)
            return
        }
     }

     // 로그아웃 처리
     public static async procLogout(req:express.Request,res:express.Response) {         
         await SessionMan.delete(req)
         res.redirect('/')
     }

     public static getLoginURL(req:express.Request,res:express.Response) {
         const url = `${SSOCommon.BASE_URL}/api/auth/Authorize?response_type=code&scope=bds_oauth_resource_service&client_id=${SSOCommon.CLIENT_ID}&redirect_uri=${SSOCommon.REDIRECT_URI}`
         res.send({ret: 0, url: url})
     }
 }


 const __obj = new SSOCommon()

 export default __obj