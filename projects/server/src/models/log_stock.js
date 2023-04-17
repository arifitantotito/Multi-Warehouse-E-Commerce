'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class log_stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.location_warehouse,{
        foreignKey:'location_warehouse_id'
      }),
      this.belongsTo(models.product_detail,{
        foreignKey:'product_detail_id'
      }),
      this.belongsTo(models.product,{
        foreignKey:'product_id'
      })
    }
  }
  log_stock.init({
    qty:DataTypes.INTEGER,
    status:DataTypes.STRING,
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
    modelName: 'log_stock',
  });
  return log_stock;
};