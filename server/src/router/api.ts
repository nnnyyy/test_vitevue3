import express from "express";

const router = express.Router();

router.post('/test', (req,res)=>{
    res.send({ret: 0, msg: 'test!', list: ['test', 'test2', 'test3']})
})

export default router;