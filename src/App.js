import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Login from './login';
import './App.css';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import Main from './main'
import Proyect from './proyect'
//import SignUp from './login/SignUp.js'
//import { throws } from 'assert';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      proyects: [],
      finish: false
    }
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.signInWithGoogle = this.signInWithGoogle.bind(this)
  }
  getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
  }
  componentDidMount(){
    this.setState({user: this.getCookie('user')})
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.setState({user})
        this.setCookie('user', user.uid, 30)
        firebase.database().ref(`users/${user.uid}/proyects`).on('value', snapshot => {
          //console.log(snapshot.val())
          this.setState({proyects: []})
          snapshot.forEach(proyect => {
              firebase.database().ref(`proyects/${proyect.key}`).once('value', snapshot=>{
                  let proyect = snapshot.val()
                  proyect.key = snapshot.key
                  this.setState({proyects: this.state.proyects.concat(proyect)})
                })
              }
            )
          this.setState({finish: true})
          /*firebase.database().ref(`proyects/${snapshot.key}`).once('value', snapshot => {
            let proyect = snapshot.val()
            proyect.key = snapshot.key
            this.setState({proyects: this.state.proyects.concat(proyect)})
          })
          console.log(this.state.finish)*/
        })
      }
      else{
        this.setState({user: null})
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        this.setState({proyects: []})
      }
    })
  }
  setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  handleSignIn(e){
    console.log('Correo y contrase;a')
    e.preventDefault()
    let email = e.target.email.value
    let password = e.target.password.value
    firebase.auth().signInWithEmailAndPassword(email, password).then(response=> {this.setCookie('user', response.user.uid, 30)}).catch(error => {alert(error.message)})
  }
  handleSignUp(e) {
    //e.preventDefault()
    console.log('Nuevo usuario')
    let displayName = e.target.displayName.value
    let newemail = e.target.newemail.value
    let password = e.target.password.value
    firebase.auth().createUserWithEmailAndPassword(newemail, password).then(()=>{
      console.log('todo salio bien')
      this.handleUpdateUser(displayName)
    }).catch(error => {alert(error.message)})
  }
  signInWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(response => {
      this.setCookie('user', response.user.uid, 30)
      this.handleCreateNewUser(response.user.uid, response.user.email, response.user.displayName, response.user.photoURL)
    })
  }
  handleUpdateUser(displayName, photoURL){
    let user = firebase.auth().currentUser
    user.updateProfile({
      displayName: displayName,
      photoURL: photoURL
    })
    this.handleCreateNewUser(user.uid, user.email, displayName)
  }
  handleCreateNewUser(id, email, displayName, photoURL = null){
    firebase.database().ref(`users/${id}`).update({
      email: email,
      displayName: displayName,
      photoURL: photoURL
    })
  }
  handleLogOut(){
    firebase.auth().signOut()
  }
  render() {
    return (
      <Router>
        <main>
          <Route path='/' exact render={() => (
            this.state.user? (
              <Main 
                signOut={this.handleLogOut}
                displayName={this.state.user.displayName}
                photoURL={this.state.user.photoURL}
                email={this.state.user.email}
                proyects={this.state.proyects}
                finish={this.state.finish}
              />
            ):(
              <Login
                signIn={this.handleSignIn}
                signUp={this.handleSignUp}
                signInWithGoogle={this.signInWithGoogle}
              />
            )
          )}/>
          <Route path='/proyect/:proyectId' render={({match})=>(
            this.getCookie('user')? (
              <Proyect match={match}/>
            ):(
              <Redirect to='/'/>
            )
          )} />
        </main>
      </Router>
    );
  }
}

export default App;