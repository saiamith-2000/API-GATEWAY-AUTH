const {StatusCodes}=require('http-status-codes');
const {UserRepository}=require('../repositories');
const { AppError } = require('../utils/errors/app-error');
const {AUTH}=require('../utils/common');

const userRepository=new UserRepository();

async function createUser(data){
    try {
        const user=await userRepository.create(data);
        return user;
    } catch (error) {
        if(error.name=='SequelizeValidationError' || error.name=='SequelizeUniqueConstraintError'){
            let explaination=[];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination,StatusCodes.BAD_REQUEST);
        }
        throw new AppError('can\'t create new user',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(data){
    try {
        const user=await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new AppError('No such user found',StatusCodes.NOT_FOUND);
        }
        const passwordMatch=AUTH.checkPassword(data.password,user.password);
        if(!passwordMatch){
            throw new AppError('Invalid password',StatusCodes.BAD_REQUEST);
        }
        const jwt=AUTH.createToken({id:user.id,email:user.email});
        return jwt;
    } catch (error) {
        if(error instanceof AppError){throw error;}
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function isAuthenticated(token){
   try {
     if(!token){throw new AppError('missing jwt token',StatusCodes.BAD_REQUEST);}
        const response=AUTH.verifyToken(token);
        const user=await userRepository.get(response.id);
        if(!user){throw new AppError('No user, found',StatusCodes.BAD_REQUEST);}
        return user.id;
   } catch (error) {
       if(error instanceof AppError){throw error;}
       if(error.name=== 'JsonWebTokenError'){
        throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST);
       }
   }    
}


module.exports={
    createUser,
    signIn,
    isAuthenticated
}