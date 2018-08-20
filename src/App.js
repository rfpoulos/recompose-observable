import React from 'react';
import { 
  compose,
  mapPropsStream,
  setObservableConfig,
} from 'recompose'; 
import './App.css';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import rxjsconfig from 'recompose/rxjsObservableConfig'
setObservableConfig(rxjsconfig)


let searchGithub = (term) =>
    fetch(`https://api.github.com/search/users?q=${term}`)
    .then(data => data.json());

let App = ({ onSearch, results, query }) =>
  <div>
    <input type="text"
      placeholder="Search Github Users"
      value={ query } 
      onChange={ (event) => onSearch(event.target.value) } 
    />
    <ul>
    {
      results.items.map((result, key) =>
        <li key={ key }>{result.login}</li>)
    }
    </ul>
  </div>
      

let enhance = compose(
  mapPropsStream(props$ => {
    let search$ = new Subject();
    let onSearch = v => search$.next(v);

    let query$ =  search$
      .startWith('');

    let results$ = query$
      .debounceTime(350)
      .distinctUntilChanged()
      .filter(query => query.length >= 2 || query.length === 0)
      .switchMap(query => query ? 
          Observable.from(searchGithub(query)) : 
          Observable.from(Promise.resolve({items: []}))
        );


    return props$.combineLatest(results$, query$,
      (props, results, query) => ({
        ...props, onSearch, results, query
      })
    )}
  )
);

export default enhance(App);
