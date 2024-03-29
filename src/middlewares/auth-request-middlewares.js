const {StatusCodes}=require('http-status-codes');

const { ErrorResponse }=require('../utils/common');
const { AppError } = require('../utils/errors/app-error');
const { UserService } = require('../services');

function validateAuthRequest(req, res,next){
    if(!req.body.email){
          ErrorResponse.message="Something went wrong due to authentication of plane";
          ErrorResponse.error=new AppError([' Email not found in incoming form'],StatusCodes.BAD_REQUEST);
          return res.status(StatusCodes.BAD_REQUEST).json({ErrorResponse});
    }
    if(!req.body.password){
        ErrorResponse.message="Something went wrong due to authentication of plane";
        ErrorResponse.error=new AppError(['password not found in  incoming form'],StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json({ErrorResponse});
  }
    next();
}

async function checkAuth(req, res, next) {
    try {
        const response = await UserService.isAuthenticated(req.headers['x-access-token']);
        if (response) {
            req.user = response;
            return next();
        }
        // Handle the case when authentication fails
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized',
            error: new AppError(['Authentication failed'], StatusCodes.UNAUTHORIZED),
        });
    } catch (error) {
        // Handle other errors
        return res.status(error.statusCode).json(error);
    }
}

async function isAdmin(req,res,next){
    const response=await UserService.isAdmin(req.user);
    if(!response){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'User not authorized for this action'
        });
    }
    next();
}

async function isAuthorizedtomodifyFlight(req,res,next){
    const response1=await UserService.isAdmin(req.user);
    const response2=await UserService.isFlightCompany(req.user);
    if(!response1 && !response2){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'User not authorized for this action'
        });
    }
    next();
}

module.exports={
    validateAuthRequest,
    checkAuth,
    isAdmin,
    isAuthorizedtomodifyFlight
}