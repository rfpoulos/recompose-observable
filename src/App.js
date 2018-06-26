import React, { Component } from 'react';
import logo from './logo.svg';
import { 
          compose,
          withState,
          withHandlers, 
      } from 'recompose'; 
import './App.css';

let AppDumb = ({ input, setInput }) =>
      <input type='text' value={input} onChange={setInput}></input>

let App = compose(
  withState('input', 'updateInput', ''),
  withHandlers({
    setInput: ({ updateInput }) => event =>
      updateInput(event.target.value),
  })
)(AppDumb)

export default App;
