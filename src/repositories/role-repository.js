const CRUDRepository=require('./crud-repository');

const {Role}=require('../models');

class RoleRepository extends CRUDRepository{
    constructor(){
        super(Role);
    }

    async getRoleByName(name){
        const role=Role.findOne({
            where:{
                name:name
            }
        });
        return role;
    }
}

module.exports=RoleRepository;