'use strict';
const { Model } = require('sequelize');
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
      const overDueItems = overDue.displayableString();
      console.log(overDueItems);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const dueToday = await this.dueToday()
      const dueTodayItems = dueToday.displayableString();
      console.log(dueTodayItems);

      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLater = await this.dueLater()
      const dueLaterItems = dueLater.displayableString();
      console.log(dueLaterItems);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const overdue = await Todo.findAll({
        where: {
          dueDate: { [sequelize.Op.lt]: new Date() }
        }
      });
      return overdue;
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const dueToday = await Todo.findAll({
        where: {
          dueDate: {[sequelize.Op.eq]: new Date()}
        }
      });
      return dueToday;
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const dueLater = await Todo.findAll({
        where: {
          dueDate: {
            [sequelize.Op.gt]: new Date()
          }
        }
      });
      return dueLater;
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      await Todo.update({ completed: true }, {where:{
        id:id
        } })

    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};