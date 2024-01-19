const express=require('express');
const { UserController } = require('../../controllers');

const router=express.Router();

router.post('/signUp',UserController.signUp);
router.post('/signIn',UserController.signIn);

module.exports=router;