import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    try {
      const formattedTime = time ? new Date(time).toISOString() : ''; 
      const response = await axios.post('http://localhost:5000/api/todos', { title, description, time: formattedTime });
      setTodos([...todos, response.data]);
      setTitle('');
      setDescription('');
      setTime('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const updateTodo = async (id) => {
    try {
      const formattedTime = time ? new Date(time).toISOString() : ''; 
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, { title, description, time: formattedTime });
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
      setTitle('');
      setDescription('');
      setTime('');
      setEditId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editId) {
      updateTodo(editId);
    } else {
      addTodo();
    }
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="input"
        />
        <button type="submit" className="button">{editId ? 'Update' : 'Add'}</button>
      </form>
      <div className="todo-list">
        {todos.map((todo) => (
          <div key={todo._id} className="todo-card">
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>
            <p>Time: {new Date(todo.time).toLocaleString()}</p>
            <button onClick={() => { setEditId(todo._id); setTitle(todo.title); setDescription(todo.description); setTime(todo.time ? todo.time : ''); }} className="button">Edit</button>
            <button onClick={() => deleteTodo(todo._id)} className="button delete-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
