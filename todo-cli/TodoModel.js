const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("./connectdb.js");

class Todo extends Model {
    static async createRec(params){
        return await Todo.create(params);
    }

    displayTodos(){
        return `${this.id} ${this.title} ${this.completed}`;
    }
}
Todo.init(
  {
    // Model attributes are defined here
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    completed: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
  }
);

Todo.sync();
module.exports = Todo;