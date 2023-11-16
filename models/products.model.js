"use strict";
const { Model } = require("sequelize");
const { Status } = require("../utils/constants");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      Products.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "user"
      });
    }
  }
  Products.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: Status.SELLING
      }
    },
    {
      sequelize,
      modelName: "Products",
      timestamps: true
    }
  );
  return Products;
};
