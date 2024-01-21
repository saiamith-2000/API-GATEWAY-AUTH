const express=require('express');
const { UserController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');
const { validateAuthRequest } = require('../../middlewares/auth-request-middlewares');

const router=express.Router();

router.post('/signUp',
AuthRequestMiddlewares.validateAuthRequest,
UserController.signUp);


router.post('/signIn',
AuthRequestMiddlewares.validateAuthRequest,
UserController.signIn
);

router.post('/role',
AuthRequestMiddlewares.checkAuth,
AuthRequestMiddlewares.isAdmin,
UserController.addRoletoUser
);



module.exports=router;