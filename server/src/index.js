const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Login-tut', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const TodoSchema = new mongoose.Schema({
  title: String,
  description: String,
  time: Date
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { title, description, time } = req.body;
    const todo = new Todo({ title, description, time: new Date(time) }); 
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, time } = req.body;
    const updatedTodo = {
      title,
      description,
      time: new Date(time) 
    };
    const todo = await Todo.findByIdAndUpdate(id, updatedTodo, { new: true });
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
