'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Media.belongsTo(models.Item, {
        foreignKey: 'itemId',
      });
    }
  }
  Media.init(
    {
      name: DataTypes.STRING,
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Media',
    }
  );
  return Media;
};
