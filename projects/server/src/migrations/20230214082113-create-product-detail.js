'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      qty: {
        type: Sequelize.INTEGER
      },
      price:{
        type:Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER
      },
      memory_storage : {
        type: Sequelize.INTEGER
      },
      color:{
        type: Sequelize.STRING
      },
      connectivity:{
        type:Sequelize.STRING
      },
      screen_size:{
        type:Sequelize.STRING
      },  
      processor:{
        type:Sequelize.STRING
      },    
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_details');
  }
};