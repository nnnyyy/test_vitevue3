import 'module-alias/register'
import express from 'express'
import path from 'path'
import history from 'connect-history-api-fallback'
console.log('server start')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(history())

const publicPath = process.env.NODE_ENV !== 'production' ? path.join(__dirname, '..', 'public') : path.join(__dirname, '..', '..', '..', 'public')
app.use(express.static(publicPath))

app.listen(3100, ()=> console.log('listening...'))