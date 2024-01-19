const CRUDRepository=require('./crud-repository');

const {User}=require('../models');

class UserRepository extends CRUDRepository{
    constructor(){
        super(User);
    }
}

module.exports=UserRepository;