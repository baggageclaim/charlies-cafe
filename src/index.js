import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

var PRODUCTS = [
  {category: 'Food', price: 1.49, stocked: true, name: 'Latte'},
  {category: 'Food', price: 1.39, stocked: true, name: 'Cappucino'},
  {category: 'Food', price: 1.49, stocked: true, name: 'Mocha'},
  {category: 'Food', price: 1.19, stocked: true, name: 'Macchiato'},
  {category: 'Food', price: 1.10, stocked: true, name: 'Espresso'},
  {category: 'Food', price: 1.00, stocked: false, name: 'Cookie'},
  {category: 'Food', price: 1.50, stocked: true, name: 'Croissant'},
  {category: 'Food', price: 1.50, stocked: true, name: 'Danish'}
];

ReactDOM.render(
  <div>
    <App products={PRODUCTS}/>
  </div>,
  document.getElementById('container'));