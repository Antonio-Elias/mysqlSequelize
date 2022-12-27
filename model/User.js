const { DataTypes } = require('sequelize'); // para que sequelize entenda os tipos de dados

const db = require( '../db/conn')

const User = db.define('User', {
    name:{
        type: DataTypes.STRING,
        allowNull: false, // campo pode ser null ?
    },
    occupation:{
        type: DataTypes.STRING,
        required: true, // campo obrigatorio
    },
    newsletter:{
        type: DataTypes.BOOLEAN,
    },
});

module.exports = User;