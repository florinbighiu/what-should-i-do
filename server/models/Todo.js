import mongoose from 'mongoose'; 
const  { Schema, model } = mongoose;

const TodoSchema = new Schema({
    title: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Todo = model('Todo', TodoSchema);

  export default Todo;