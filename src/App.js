import React, { Component } from 'react';
import logo from './logo.svg';
import { 
          compose 
      } from 'recompose'; 
import './App.css';

let AppDumb = () =>
      <h1>Test</h1>

let App = compose()(AppDumb)

export default App;
