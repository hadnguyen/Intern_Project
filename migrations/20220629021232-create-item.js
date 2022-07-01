'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      costPrice: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      sellingPrice: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
      },
      inventoryQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      soldQuantity: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  },
};
