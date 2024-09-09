/* eslint-disable no-unused-vars */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
    static addTodo(title, dueDate, userId) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }
    static async getTodos() {
      return this.findAll();
    }
    markAsCompleted() {
      return this.update({ completed: true });
    }
    markAsIncompleted() {
      return this.update({ completed: false });
    }
    static async getOverdueTodos(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
          userId,
        },
      });
    }
    static async getdueTodayTodos(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
          userId,
        },
      });
    }
    static async getdueLaterTodos(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
          userId,
        },
      });
    }
    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
        },
      });
    }
    static async completedItems(userId) {
      try {
        const Completed = await this.findAll({
          where: {
            completed: true,
            userId,
          },
        });
        return Completed;
      } catch (error) {
        console.error("Error!!!", error);
        throw error;
      }
    }
    setCompletionStatus(receiver) {
      return this.update({ completed: receiver });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
