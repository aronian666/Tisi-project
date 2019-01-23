import React, { Component } from 'react'
import { Form, Icon, Button, Message, Divider } from 'semantic-ui-react'
import firebase from 'firebase/app'
import 'firebase/database'
//import { Link } from 'react-router-dom'
import './login.css'
//import { register } from '../serviceWorker';
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.onChangeSignUp = this.onChangeSignUp.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.onChangeEmail = this.onChangeEmail.bind(this)
        this.state = {
            signup: false,
            displayName: '',
            password: '',
            password_re: '',
            password_has_error: false,
            email: '',
            emailValidate: false,
        }
    }
    onChangeSignUp() {
        this.setState(()=> ({
            signup: !this.state.signup
        }))
    }
    onChangeEmail(e) {
        this.setState({email: e.target.value})
        firebase.database().ref('users').orderByChild('email').equalTo(e.target.value).on('value', snapshot => {
            if(snapshot.exists()){
                this.setState({emailValidate: true})
            }
            else {
                this.setState({emailValidate: false})
            }
        })
    }
    handleChange(event) {
        const { name, value } = event.target
      
        this.setState({
            [name] : value 
          }, () => {
            if (name === 'password' || name === 'password_re')
              this.checkPassword();
            }
        );
    }
    checkPassword() {
        if(!this.state.password || this.state.password !== this.state.password_re) {
           this.setState({password_has_error:true});
       }
       else {
           this.setState({password_has_error:false});
       }
    }
    /*onChangePassword(e){
        this.setState({password: e.target.value})
        if (this.state.password === this.state.newPassword){
            this.setState({passwordValidate: false})
        }
        else {
            this.setState({passwordValidate: true})
        }
    }
    onChangeNewPassword(e){
        this.setState({newPassword: e.target.value})
        if (this.state.password === this.state.newPassword){
            this.setState({passwordValidate: false})
        }
        else {
            this.setState({passwordValidate: true})
        }
    }*/
    render() {
        return(
            <div className='flex space-between width height login'>
                <div className='flex justify aling height info'>
                    <div className='margin bold'><Icon name='file alternate'/>Sigue tus proyectos</div>
                    <div className='margin bold'><Icon name='book'/>Enterate de nuevas practicas</div>
                    <div className='margin bold'><Icon name='users'/> Unete a la comunidad</div>
                </div>
                <div className='login-derecha'>
                    <div className='flex justify'>
                        {this.state.signup?(
                            <SignUp 
                                signUp={this.props.signUp}
                                handleChange={this.handleChange}
                                password_has_error={this.state.password_has_error}
                                onChangeEmail={this.onChangeEmail}
                                emailValidate={this.state.emailValidate}
                                displayName={this.state.displayName}
                                email={this.state.email}
                                password={this.state.password}
                                password_re={this.state.password_re}
                                onChangeSignUp={this.onChangeSignUp}
                                signInWithGoogle={this.props.signInWithGoogle}/>
                        ):(
                            <SignIn 
                                onChangeSignUp={this.onChangeSignUp}
                                signIn={this.props.signIn}
                                signInWithGoogle={this.props.signInWithGoogle}
                            />
                        )}
                        
                    </div>
                </div>
            </div>
        )
    }
}

class SignUp extends Component {
    render() {
        let password = this.props.password !== ''? (true):(false)
        let email = this.props.email !== ''? (true):(false)
        return(
            <div className='signup'>
                <Button color='green' basic className='width' type='submit' onClick={this.props.onChangeSignUp}>Iniciar Sesion</Button>
                <h2>Registrate</h2>
                <Form onSubmit={this.props.signUp} error>
                    <Form.Input label='Nombre' placeholder='Nombre' name='displayName' value={this.props.displayName} onChange={this.props.handleChange}/>
                    <Form.Input type='email' label='Correo Electronico' value={this.props.email} placeholder='Correo Electronico' name='newemail' onChange={this.props.onChangeEmail}/>
                    <Form.Input type='text' label='DNI' maxlength='8' placeholder='DNI'/>
                    <Form.Input type='text' label='Especialidad' placeholder='Especialidad' />
                    {this.props.emailValidate && 
                        <Message 
                            error
                            size='mini'
                            floating
                            content='email ya existente'/>
                    }
                    <Form.Input type='password' label='Contrasenia' placeholder='Contrasenia' value={this.props.password} name='password' onChange={this.props.handleChange}/>
                    <Form.Input type='password' label='Repita la contrasenia' name='password_re' value={this.props.password_re} placeholder='Contrasenia' onChange={this.props.handleChange} />
                    {this.props.password_has_error && 
                        <Message 
                            error
                            size='mini'
                            floating
                            content='Las contrasenias no coinciden'/>
                    } 
                    <Button className='width' color='green' type='submit' disabled={this.props.password_has_error || this.props.passwordValidate || !this.props.displayName || !email || !password}>Registrarse</Button>
                </Form>
                <Divider horizontal> OR </Divider>
                <Button className='width' color='google plus' onClick={this.props.signInWithGoogle}>
                    <Icon name='google plus' /> Google
                </Button>
                <Divider horizontal></Divider>
                <Button color='grey' className='width'>
                    <Icon name='github'/> GitHub
                </Button>
            </div>
        )
    }
}

class SignIn extends Component {
    render() {
        return(
            <div className='signup width'>
                <div className='flex width justify'>
                    <div className='login-form'>
                        <Form onSubmit={this.props.signIn}>
                            <Form.Group widths='equal'>
                                <Form.Input fluid name='email' type='email' placeholder='Correo electronico o usuario' />
                                <Form.Input fluid name='password' type='password' placeholder='Password' />
                                <Form.Field>
                                    <Button color='green' basic className='width' type='submit'>Iniciar Sesion</Button>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                        <Button color='google plus' className='width' onClick={this.props.signInWithGoogle}>
                            <Icon name='google plus'/> Google
                        </Button>
                        <Divider></Divider>
                        <Button color='grey' className='width'>
                            <Icon name='github'/> GitHub
                        </Button>   
                    </div>
                </div>
                <div className='sign-up'>
                    <div className='sign'><Icon name='code' size='big' loading color='green' /></div>
                    <h1 className='bold'>Crea y unete a proyectos en linea, y mata a esa perra</h1>
                    <h3 className='bold'>Unete a KendyApp ahora</h3>
                    <div>
                        <Button onClick={this.props.onChangeSignUp} className='width' color='green'>Registrate</Button>
                    </div>
                </div>
            </div>
        )
    }
}