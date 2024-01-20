const express=require('express');
const {AuthRequestMiddlewares}=require('../../middlewares');
const { InfoController }=require('../../controllers');
const userRoutes=require('./user-routes');
const router=express.Router();

router.use('/user',userRoutes);
router.get('/info',AuthRequestMiddlewares.checkAuth,InfoController.info);

module.exports=router;