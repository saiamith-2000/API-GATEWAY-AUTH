const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");

async function signUp(req, res) {
  try {
    const user = await UserService.createUser({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.success.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}


async function signIn(req, res) {
  try {
    const response = await UserService.signIn({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.success.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function addRoletoUser(req, res) {
  try {
    const response = await UserService.addRoletoUser({
      id:req.body.id,
      role:req.body.role
    });
    SuccessResponse.success.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}


module.exports={
    signUp,
    signIn,
    addRoletoUser
}