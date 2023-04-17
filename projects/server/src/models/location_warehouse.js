'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class location_warehouse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.location_product,{
        foreignKey:'location_warehouse_id'
      }),
      this.hasOne(models.admin,{
        foreignKey:'location_warehouse_id'
      }),
      this.hasMany(models.transaction,{
        foreignKey:'location_warehouse_id'
      })
    }
  }
  location_warehouse.init({
    city: DataTypes.STRING,
    city_id:DataTypes.INTEGER,
    subdistrict:DataTypes.STRING,
    province:DataTypes.STRING,
    province_id:DataTypes.INTEGER,
    address:DataTypes.STRING,
    latitude:DataTypes.STRING,
    longitude:DataTypes.STRING,
    createdAt:{
      type:DataTypes.DATE,
      defaultValue:sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt:{
      type:DataTypes.DATE,
      defaultValue:sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'location_warehouse',
  });
  return location_warehouse;
};