'use strict';

var moment = require('moment'); // require

const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      this.belongsTo(models.user, {
        foreignKey: 'user_id'
      }),
        this.belongsTo(models.order_status, {
          foreignKey: 'order_status_id'
        }),
        this.hasMany(models.transaction_detail, {
          foreignKey: 'transaction_id'
        }),
        this.hasMany(models.status_transaction_log, {
          foreignKey: 'transaction_id'
        }),
        this.belongsTo(models.location_warehouse, {
          foreignKey: 'location_warehouse_id'
        })
    }
  }
  transaction.init({
    id:{
      allowNull:false,
      autoIncrement:false,
      primaryKey:true,
      type: DataTypes.STRING
    },
    ongkir: DataTypes.INTEGER,
    receiver:DataTypes.STRING,
    address:DataTypes.STRING,
    subdistrict:DataTypes.STRING,
    city:DataTypes.STRING,
    province:DataTypes.STRING,
    warehouse_city:DataTypes.STRING,
    courier:DataTypes.STRING,
    user_name:DataTypes.STRING,
    phone_number:DataTypes.STRING,
    upload_payment:DataTypes.STRING,
    exprired:{
      type:DataTypes.DATE
      // defaultValue : moment().add(2, 'hour').toDate()
    }
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};