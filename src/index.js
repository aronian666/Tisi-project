import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';
import firebase from 'firebase/app'

var config = {
    apiKey: "AIzaSyAlWQg_gjwn6JYlJomsGRv0irrvJL_aj20",
    authDomain: "tisi-bf8dc.firebaseapp.com",
    databaseURL: "https://tisi-bf8dc.firebaseio.com",
    projectId: "tisi-bf8dc",
    storageBucket: "tisi-bf8dc.appspot.com",
    messagingSenderId: "498955703670"
};
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
