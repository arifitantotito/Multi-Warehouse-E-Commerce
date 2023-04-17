'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.category,{
        foreignKey:'category_id'
      }),
      this.hasMany(models.product_detail,{
        foreignKey:'product_id'
      }),
      this.hasMany(models.cart,{
        foreignKey:'product_id'
      }),
      this.hasMany(models.product_image,{
        foreignKey:'product_id'
      }),
      this.hasMany(models.transaction_detail,{
        foreignKey:'product_id'
      }),
      this.hasMany(models.log_stock,{
        foreignKey:'product_id'
      })
    }
  }
  product.init({
    name: DataTypes.STRING,
    description:DataTypes.TEXT,
    discount: DataTypes.INTEGER,
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
    modelName: 'product',
  });
  return product;
};