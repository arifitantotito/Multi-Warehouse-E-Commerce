'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.transaction,{
        foreignKey:'transaction_id'
      }),
      this.belongsTo(models.category,{
        foreignKey:'category_id'
      }),
      this.belongsTo(models.product_detail,{
        foreignKey:'product_detail_id'
      }),
      this.belongsTo(models.product,{
        foreignKey:'product_id'
      })
    }
  }
  transaction_detail.init({
    product_name:DataTypes.STRING,
    qty: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    memory_storage: DataTypes.INTEGER,
    product_img:DataTypes.STRING,
    color:DataTypes.STRING,
    connectivity:DataTypes.STRING,
    screen_size:DataTypes.STRING,
    processor:DataTypes.STRING,
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
    modelName: 'transaction_detail',
  });
  return transaction_detail;
};