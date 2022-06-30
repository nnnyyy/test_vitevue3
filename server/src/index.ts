import 'module-alias/register'
import {testFunc} from '@common/common'
const test = ()=> { console.log('test func!')}
console.log('server start')
test()
testFunc()
