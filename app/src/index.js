import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Collection from './main/Collection';
import Item from './main/Item';
import AddNewFile from './main/AddNewFile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <App /> }></Route>
          <Route path="/showCollection/collectionID=:collectionID/address=:address/account=:account" element={ <Collection /> }></Route>
          <Route path="/showItem/itemID=:itemID/collectionID=:collectionID/address=:address/account=:account" element={ <Item /> }></Route>
          <Route path="/addNewFile/collectionID=:collectionID/address=:address/account=:account" element={ <AddNewFile /> }></Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
