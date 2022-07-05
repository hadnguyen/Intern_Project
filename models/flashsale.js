'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FlashSale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FlashSale.belongsToMany(models.Item, { through: models.FlashSale_Item });
    }
  }
  FlashSale.init(
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FlashSale',
    }
  );
  return FlashSale;
};
