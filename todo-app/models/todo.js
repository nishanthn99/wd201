/* eslint-disable no-unused-vars */
'use strict';
const {
  Model,
Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addTodo(title,dueDate){
      return this.create({title: title, dueDate: dueDate, completed: false});
    }
    static async getTodos(){
      return this.findAll();
    }
    markAsCompleted() {
      return this.update({completed: true});
    }
    markAsIncompleted() {
      return this.update({completed: false});
    }
    static async getOverdueTodos(){
        return this.findAll({
          where: {
            dueDate:{
              [Op.lt]: new Date().toLocaleDateString('en-CA'),
            },
          },
        });
    }
    static async getdueTodayTodos(){
        return this.findAll({
          where: {
            dueDate:{
              [Op.eq]:new Date().toLocaleDateString('en-CA'),
            },
          },
        });
    }
    static async getdueLaterTodos(){
      return this.findAll({
          where: {
            dueDate:{
              [Op.gt]: new Date().toLocaleDateString('en-CA'),
            },
          },
        });
    }
    static async remove(id) {
      return this.destroy({
        where:{
          id,
        }
      })
    }
    static async completedItems(){
      try{
        const Completed = await this.findAll({
          where:{
          completed: true,
        }
      })
      return Completed
    }catch(error){
      console.error('Error!!!' , error);
      throw error;
    }
  }
  setCompletionStatus(receiver){
    return this.update({completed: receiver});
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