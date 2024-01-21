const {StatusCodes}=require('http-status-codes');
const {UserRepository,RoleRepository}=require('../repositories');
const { AppError } = require('../utils/errors/app-error');
const {AUTH,ENUMS}=require('../utils/common');
const axios=require('axios');
const db=require('../models');
const userRepository=new UserRepository();
const roleRepository=new RoleRepository();
const {ServerConfig}=require('../config');

async function createUser(data){
    try {
        const user=await userRepository.create(data);
        const role=await roleRepository.getRoleByName(ENUMS.USER_ROLES_ENUMS.CUSTOMER);
        user.addRole(role);
        return user;
    } catch (error) {
        if(error.name=='SequelizeValidationError' || error.name=='SequelizeUniqueConstraintError'){
            let explaination=[];
            error.errors.forEach((err) => {
                explaination.push(err.message);
            });
            throw new AppError(explaination,StatusCodes.BAD_REQUEST);
        }
        console.log(error);
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
       if(error.name=== 'TokenExpiredError'){
        throw new AppError(' JWT token Expired',StatusCodes.BAD_REQUEST);
       }
   }    
}

async function addRoletoUser(data){
   try {
    const user=await userRepository.get(data.id);
    if(!user){
        throw new AppError('User not found by given id',StatusCodes.BAD_REQUEST);
    }
    const role=await roleRepository.getRoleByName(data.role);
    if(!role){
        throw new AppError('Role not found by given role data',StatusCodes.BAD_REQUEST);
    }
    user.addRole(role);
    return user;
   } catch (error) {
    if(error instanceof AppError){throw error;}
    console.log(error);
    throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}


async function isAdmin(id){
    try {
        const user=await userRepository.get(id);
        if(!user){
            throw new AppError('User not found by given id',StatusCodes.BAD_REQUEST);
        }
        const adminRole=await roleRepository.getRoleByName(ENUMS.USER_ROLES_ENUMS.ADMIN);
        return user.hasRole(adminRole);
    } catch (error) {
        if(error instanceof AppError){throw error;}
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isFlightCompany(id){
    try {
        const user=await userRepository.get(id);
        if(!user){
            throw new AppError('User not found by given id',StatusCodes.BAD_REQUEST);
        }
        const flightComapnyRole=await roleRepository.getRoleByName(ENUMS.USER_ROLES_ENUMS.FLIGHT_COMPANY);
        return user.hasRole(flightComapnyRole);
    } catch (error) {
        if(error instanceof AppError){throw error;}
        console.log(error);
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function destroyFlight(data){
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}api/v1/flights/${data.flightId}`);  
        if(!flight){
            throw new AppError('No such flight found',StatusCodes.BAD_REQUEST);
        }
        const response=await axios.delete(`${ServerConfig.FLIGHT_SERVICE}api/v1/flights/${data.flightId}`);
        await transaction.commit();
        return flight;
    } catch (error) {
        await transaction.rollback();
        console.log(error);
        throw error;
    }
}



module.exports={
    createUser,
    signIn,
    isAuthenticated,
    addRoletoUser,
    isAdmin,
    isFlightCompany,
    destroyFlight
}