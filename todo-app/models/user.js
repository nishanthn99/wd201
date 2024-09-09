"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      firstname: {
        type:DataTypes.STRING,
      allowNull:false},
      lastname: DataTypes.STRING,
      email: {
        type:DataTypes.STRING,
      allowNull:false},
      password: {
        type:DataTypes.STRING,
      allowNull:false},
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
