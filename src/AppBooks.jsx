import { useState, useEffect } from 'react';
import './App.css'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';


import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import AddBooks from './AddBooks';

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    { headerName: 'Title', field: 'title', sortable: true, filter: true, suppressMovable:true},
    { headerName: 'Author', field: 'author', sortable: true, filter: true, suppressMovable:true},
    { headerName: 'Year', field: 'year', sortable: true, filter: true, suppressMovable:true},
    { headerName: 'ISBN', field: 'isbn', sortable: true, filter: true, suppressMovable:true},
    { headerName: 'Price', field: 'price', sortable: true, filter: true, suppressMovable:true},
    { 
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: params => (
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      )
    }
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch('https://todolist-4c681-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
      .then(response => response.json())
      .then(data => {
        const bookArray = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setBooks(bookArray);
      })
      .catch(err => console.error(err));
  };

  const addBook = (newBook) => {
    fetch('https://todolist-4c681-default-rtdb.europe-west1.firebasedatabase.app/books/.json', {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`https://todolist-4c681-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`, {
      method: 'DELETE',
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBooks addBook={addBook} />
      <div className="ag-theme-material" style={{ height: 400, width: '90vw' }}>
        <AgGridReact
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </>
  );
}

export default App;
