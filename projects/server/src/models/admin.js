'use strict';
var moment = require('moment'); // require

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.location_warehouse,{
        foreignKey:'location_warehouse_id'
      })
    }
  }
  admin.init({
    id:{
      allowNull:false,
      autoIncrement:false,
      primaryKey:true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    gender:DataTypes.STRING,
    role: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    photo_profile: DataTypes.STRING,
    createdAt:{
      type:DataTypes.DATE,
      defaultValue:moment().format()
    },
    updatedAt:{
      type:DataTypes.DATE,
      defaultValue:moment().format()
    }
    
  }, {
    sequelize,
    modelName: 'admin',
  });
  return admin;
};