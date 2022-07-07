import nodemailer from 'nodemailer'
import Log from './Logger'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

class MailHelper {
    sendMail(to:string|string[], subject:string, content:string, cc:string|string[] = []) {
        this._sendMail(to, `maple-platform@nexon.co.kr`, subject, content, cc)
    }

    _sendMail(to:string|string[], from:string, subject:string, content:string, cc:string|string[] = []) {
        const transporter = nodemailer.createTransport({
            host: '192.168.237.14',
            port: 25
        });

        const mailOptions = {
            from: from,    // 발송 메일 주소
            to: to,                     // 수신 메일 주소
            subject: subject,   // 제목
            html: content,  // 내용
            cc: cc
        };

        return new Promise<void>((res,rej)=> {
            if( process.env.NODE_ENV != 'production' ) {
                fs.writeFile(path.join(__dirname, '..', 'temp.html'), content, (err:any)=>{
                    if(err) throw err;
                    exec(`"C:\\Program Files\\Internet Explorer\\iexplore.exe" "${path.join(__dirname, '..', 'temp.html')}"`, (err:any)=>{
                        Log.addErrorLog(err);
                    });
                });
                Log.addLog(`[Mailer] To: ${mailOptions.to} // 디버그 모드에서는 메일을 보내지 않습니다`);
                res();
            }

            transporter.sendMail(mailOptions, (error:any) => {
                if (error) {
                    rej(error)
                }
                else {
                    res()
                }
            });
        })        
    }
}

const __obj__ = new MailHelper

export default __obj__