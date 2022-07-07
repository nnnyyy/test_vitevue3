import 'module-alias/register'
import express from 'express'
import path from 'path'
import history from 'connect-history-api-fallback'
import compression from "compression";
import cors from "cors";

import sso from './auth/SSOCommon'
import Log, {LogMan} from './Logger'
import db from './DB'

import fs from 'fs'

(async function(){
    try {        
        sso.init();
        LogMan.init();
        await db.init();
        await db.initBackup();

        const app = express();

        app.use(compression());
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        
        for (const dir of fs.readdirSync(path.resolve(__dirname, "./router"))) {
            const res = await import(`./router/${dir}`);
            app.use(`/${dir.split('.')[0]}`, res.default);
        }

        app.use(history());

        const publicPath =
            process.env.NODE_ENV !== "production"
                ? path.join(__dirname, "..", "public")
                : path.join(__dirname, "..", "..", "..", "public");
        app.use(express.static(publicPath));

        app.use((err: any, req: express.Request, res: express.Response) => {
            Log.addErrorLog(err);
            res.send(err);
        });

        app.listen(3100, () => Log.addLog("listening..."));        
    } catch (error) {
        console.log(error)
        Log.addErrorLog(error)        
    }
})()


process.on("exit", code => {
    Log.addLog(`program exit`, code);
});

process.on("uncaughtException", function (err) {
    // handle the error safely
    Log.addErrorLog(err)
});