import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AddToDo from './AddToDo';

function App() {
  const [todos, setTodos] = useState([]);

  const columnDefs = [
    { field: 'description', sortable: true, filter: true, suppressMovable:true},
    { field: 'date', sortable: true, filter: true, suppressMovable:true},
    { field: 'priority', sortable: true, filter: true, suppressMovable:true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => 
      <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton> 
    }
  ]

  useEffect(() => {
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch('https://todolist-f614a-default-rtdb.europe-west1.firebasedatabase.app/items/.json')
    .then(response => response.json())
    .then(data => {
      const todoArray = Object.keys(data).map(key => ({ ...data[key], id: key }));
      setTodos(todoArray);
    })
    .catch(err => console.error(err));
  };

  const addTodo = (newTodo) => {
    fetch('https://todolist-f614a-default-rtdb.europe-west1.firebasedatabase.app/items/.json',
    {
      method: 'POST',
      body: JSON.stringify(newTodo)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setTodos(valueKeys);
  }

  const deleteTodo = (id) => {
    fetch(`https://todolist-f614a-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            TodoList
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddToDo addTodo={addTodo}/>
      <div className="ag-theme-material" style={{height: 400, width: 690}}> 
        <AgGridReact 
          rowData={todos}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;