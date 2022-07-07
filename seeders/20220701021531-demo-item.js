'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('Items', [
      {
        name: 'Iphone 5',
        barcode: '1111',
        costPrice: 1000,
        sellingPrice: 2000,
        inventoryQuantity: 100,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Iphone 6',
        barcode: '1112',
        costPrice: 1100,
        sellingPrice: 2100,
        inventoryQuantity: 100,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Samsung Galaxy A03',
        barcode: '1113',
        costPrice: 900,
        sellingPrice: 1800,
        inventoryQuantity: 6,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Realme C35',
        barcode: '1114',
        costPrice: 850,
        sellingPrice: 1600,
        inventoryQuantity: 10,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Xiaomi 11T',
        barcode: '1115',
        costPrice: 1100,
        sellingPrice: 1900,
        inventoryQuantity: 1,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Samsung Galaxy Z',
        barcode: '1116',
        costPrice: 1200,
        sellingPrice: 2300,
        inventoryQuantity: 10,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'OPPO A55',
        barcode: '1117',
        costPrice: 700,
        sellingPrice: 1500,
        inventoryQuantity: 10,
        categoryId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dell Latitude 7470',
        barcode: '1118',
        costPrice: 2000,
        sellingPrice: 3000,
        inventoryQuantity: 10,
        categoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Acer Nitro 5',
        barcode: '1119',
        costPrice: 2200,
        sellingPrice: 3200,
        inventoryQuantity: 10,
        categoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MSI Gaming',
        barcode: '1120',
        costPrice: 2000,
        sellingPrice: 3100,
        inventoryQuantity: 10,
        categoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lenevo Gaming',
        barcode: '1121',
        costPrice: 2100,
        sellingPrice: 3000,
        inventoryQuantity: 10,
        categoryId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Items', null, {});
  },
};
