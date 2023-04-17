'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user,{
        foreignKey:'user_id'
      })
    }
  }
  user_address.init({
    user_address: DataTypes.STRING,
    value:DataTypes.INTEGER,
    subdistrict: DataTypes.STRING,
    city:DataTypes.STRING,
    city_id:DataTypes.INTEGER,
    province: DataTypes.STRING,
    province_id:DataTypes.INTEGER,
    latitude:DataTypes.STRING,
    longitude:DataTypes.STRING,
    receiver_name:DataTypes.STRING,
    phone_number: {
      type: DataTypes.STRING,
      validate: {
        len: [8, 13],
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'user_address',
  });
  return user_address;
};