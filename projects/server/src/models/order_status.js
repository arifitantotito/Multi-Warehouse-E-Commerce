'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaction,{
        foreignKey:'order_status_id'
      }),
      this.hasMany(models.log_request,{
        foreignKey:'order_status_id'
      }),
      this.hasMany(models.status_transaction_log,{
        foreignKey:'order_status_id'
      })
    }
  }
  order_status.init({
    status: DataTypes.STRING,
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
    modelName: 'order_status',
  });
  return order_status;
};