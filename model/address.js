const { DataTypes } =  require('sequelize');
const db = require('../db/conn');
const User = require('./User');

const Address = db.define('Address', {

    street:{
        type: DataTypes.STRING,
        require:true,
    },
    number:{
        type: DataTypes.STRING,
        require:true,
    },
    city:{
        type: DataTypes.STRING,
        require:true,
    },
});

//relacionamento entre tabelas precisa ter o mapeamento unidirecional onde uma tabela enchergue a outra
User.hasMany(Address); // aqui acontece o mapeamento da tabela do User com a tabela Address
Address.belongsTo(User); // aqui é o mapeamento da tabela do address com a tabela do User


module.exports = Address;

