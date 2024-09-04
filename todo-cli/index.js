/* eslint-disable no-unused-vars */
const Todo=require('./TodoModel');
const {connect}=require('./connectdb')

const addRecord=async()=>{
    await connect();
    try{const todos=await Todo.createRec({
        title:"third todo",
        dueDate:new Date,
        completed:false
    })
    console.log(`Created with id ${todos.id}`)}
    catch(err){console.log(err)}
}

const readRecord=async()=>{
    await connect();
    try{
        const todos=await Todo.findAll({order:[['id','DESC']]});
        todos.map((todo)=>{
            const todoitem=todo.displayTodos();
            console.log(todoitem)
        })
    }
    catch(err){
        console.log(err);
    }
}
const queryRecord=async()=>{
    await connect();
    try{
        const todos=await Todo.findAll({where:{
            id:3
        }},{order:[['id','DESC']]});
        todos.map((todo)=>{
            const todoitem=todo.displayTodos();
            console.log(todoitem)
        })
    }
    catch(err){
        console.log(err);
    }
}

const updateRecord=async()=>{
    await connect();
    try{
        const todos=await Todo.update({completed:true},{
            where:{
                id:1
                }})
            console.log(todos.id,todos.title)
    }
    catch(err){
        console.log(err);
    }
}

const deleteRecord=async()=>{
    await connect();
    try{
        const todos=await Todo.destroy({where:{
            id:2}})
            console.log(`deleted id ${todos.id}`)
        }
        catch(err){
            console.log(err);
        }
}



(async()=>{
    //await addRecord();
    // await deleteRecord();
    //await updateRecord();
    //await readRecord();
    await queryRecord();
})();