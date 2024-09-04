"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overDue = await this.overdue();
      overDue.forEach((overD) => {
        console.log(overD);
      });
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const dueToday = await this.dueToday();
      dueToday.forEach((dueT) => {
        console.log(dueT.displayableString());
      });

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLater = await this.dueLater();
      dueLater.forEach((dueL) => {
        console.log(dueL.displayableString());
      });
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const overdue = await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
        },
      });
      return overdue;
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      try {
        const dueToday = await Todo.findAll({
          where: {
            dueDate: { [Op.eq]: new Date() },
          },
        });
        return dueToday;
      } catch (err) {
        console.log(err);
      }
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      try {
        const dueLater = await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(),
            },
          },
        });
        return dueLater;
      } catch (error) {
        console.log(error);
      }
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      try {
        await Todo.update(
          { completed: true },
          {
            where: {
              id: id,
            },
          },
        );
      } catch (err) {
        console.log(err);
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      if (this.dueDate === new Date().toLocaleDateString("en-CA")) {
        return `${this.id}. ${checkbox} ${this.title}`;
      }
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
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
