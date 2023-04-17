'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.location_product,{
        foreignKey:'product_detail_id'
      }),
      this.belongsTo(models.product,{
        foreignKey:'product_id'
      }),
        this.hasMany(models.cart, {
          foreignKey: 'product_detail_id'
        }),
        this.hasMany(models.log_request,{
          foreignKey:'product_detail_id'
        }),
        this.hasMany(models.log_stock,{
          foreignKey:'product_detail_id'
        })
    }
  }
  product_detail.init({
    qty: DataTypes.INTEGER,
    price:DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    memory_storage: DataTypes.INTEGER,
    color:DataTypes.STRING,
    colorhex:DataTypes.STRING,
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
    modelName: 'product_detail',
  });
  return product_detail;
};