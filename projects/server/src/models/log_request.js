'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.order_status,{
        foreignKey:'order_status_id'
      }),
      this.belongsTo(models.product_detail,{
        foreignKey:'product_detail_id'
      })
    }
  }
  log_request.init({
    location_product_id_origin: DataTypes.INTEGER,
    location_product_id_target: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    location_warehouse_id_origin: DataTypes.INTEGER,
    location_warehouse_id_target: DataTypes.INTEGER,

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
    modelName: 'log_request',
  });
  return log_request;
};