import React, { Component } from 'react';
import logo from './logo.svg';
import { 
          compose,
          mapPropsStream,
          withState,
          withHandlers,
          setObservableConfig,
      } from 'recompose'; 
import './App.css';
import Rx from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import rxjsconfig from 'recompose/rxjsObservableConfig'
setObservableConfig(rxjsconfig)


let searchGithub = (term) =>
    fetch(`https://api.github.com/search/users?q=${term}`)
    .then(data => data.json());

let App = ({ onSearch, results, query }) =>
  <div>
    <input type="text" value={ query } onChange={ (event) => onSearch(event.target.value) } />
    <ul>{
      results.items.map((result, key) =>
        <li key={ key }>{result.login}</li>)
    }</ul>
  </div>
      

let enhance = compose(
  mapPropsStream(props$ => {
    let search$ = new Subject();
    let onSearch = v => search$.next(v);

    let query$ =  search$
      .startWith('');

    let results$ = query$
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(query => query ? 
          searchGithub(query) : Promise.resolve({items: []})
        );


    return props$.combineLatest(results$, query$,
      (props, results, query) => ({
        ...props, onSearch, results, query
      })
    )}
  )
);

export default enhance(App);
