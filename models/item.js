'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Item.belongsTo(models.Category, {
        foreignKey: 'categoryId',
      });
      Item.hasMany(models.Media, {
        foreignKey: 'itemId',
      });
      Item.belongsToMany(models.Order, {
        through: models.OrderDetail,
      });
      Item.belongsToMany(models.FlashSale, {
        through: models.FlashSale_Item,
      });
    }
  }
  Item.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      costPrice: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sellingPrice: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
      },
      inventoryQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      soldQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Item',
    }
  );
  return Item;
};
