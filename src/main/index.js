import React, { Component } from 'react'
import Header from './header'
import './main.css'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import ProyectList from './proyect-list'
import { Link } from 'react-router-dom'
import { Icon, Form, List, Image, Modal, Button, Dimmer, Loader } from 'semantic-ui-react';

export default class Main extends Component {
    render() {
        return(
            <div className='main'>
                <div className='proyect-header'>
                    <Header 
                        displayName={this.props.displayName} 
                        photoURL={this.props.photoURL}
                        signOut={this.props.signOut}
                    />
                    <div>
                        <div className='proyect-title'>
                            <h1>Bienvenidos a KendyApp</h1>
                            <p>
                                BanditoTask es la herramienta más intuitiva para colaborar y gestionar tareas siguiendo la metodología scrum. 
                            </p>
                        </div>
                    </div>
                </div>
                <div className='proyect-main'>
                    <h2>Proyectos Recientes</h2>
                    <div className='proyects wrap flex'>
                        <FormProyect/>
                        <Loader active={!this.props.finish} size='massive'/>
                        {this.props.proyects.map(proyect => (
                            <Link key={proyect.key} to={`proyect/${proyect.key}`}>
                                <ProyectList name={proyect.name}/>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

class FormProyect extends Component {
    constructor(props){
        super(props)
        this.state = {
            team: [],
            search: [],
            user: '',
            scrum: '',
            owner: '',
            load: false,
            open: false
        }
    }
    onChange(e) {
        const { name, value } = e.target
        this.setState({[name]: value})
        firebase.database().ref('users').orderByChild('displayName').startAt(value).endAt(this.getEnd(value)).once('value', snapshot => {
            let search = []
            snapshot.forEach(snapshot => {
                let user = snapshot.val()
                user.uid = snapshot.key
                search.push(user)
            })
            this.setState({search})
        })
    }
    getEnd(string){
        try{
            return String.fromCharCode(string[0].charCodeAt() +1 )
        }
        catch{
            return ''
        }
    }
    addUser(user, name){
        console.log('se activo esto')
        if(name === 'user'){
            this.setState(()=>({team: this.state.team.concat(user), search: [], user: ''}))
        }
        else{
            this.setState({[name]: [user]})
        }
    }
    searchUser(e){
        e.preventDefault()
        const { name, value } = e.target
        if(name === 'name'){
            this.setState({[name]: value})
        }
        for (let user in this.state.search){
            console.log(this.state.search[user].displayName, value)
            if(this.state.search[user].displayName === value){
                //this.setState({[name]: [this.state.search[user]]})
                this.addUser(this.state.search[user], name)
            }
        }
        console.log(value)
    }
    renderInput(name){
        let label
        if(typeof this.state[name] === 'string'){
            if (name === 'owner'){
                label = 'Product Owner'
            }
            else{
                label = 'Scrum Master'
            }
            return(<Form.Input list='users' label={label} onBlur={this.searchUser.bind(this)} onChange={this.onChange.bind(this)} name={name} placeholder={label}/>)
        }
        else{
            return(this.renderTeam(name))
        }
    }
    renderTeam = (name) => (
        <List>
            {this.state[name].map(user => {
                if(!user.photoURL){
                    user.photoURL = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png'
                }
                return (
                    <List.Item key={user.uid}>
                        <Image avatar src={user.photoURL} alt={user.displayName}/>
                        <List.Content>
                            <List.Header>{user.displayName}</List.Header>
                            Programer
                        </List.Content>
                    </List.Item>
                )
            })}
        </List>
    )
    toObject(arr) {
        var rv = {};
        for (var i = 0; i < arr.length; ++i)
          rv[arr[i].uid] = true;
        return rv;
    }
    createProyect(){
        this.setState({load: true})
        let owner = this.state.owner[0].uid
        let scrum = this.state.scrum[0].uid
        let team = this.state.team
        //console.log(this.state.name, this.state.owner[0], this.state.scrum[0], this.state.team)
        let key = firebase.database().ref(`proyects}`).push().key
        firebase.database().ref(`proyects/${key}`).set({
            name: this.state.name,
            members: {
                owner: owner,
                scrum: scrum,
                team: this.toObject(team)
            }
        }).then(() => {
            let ref = firebase.database()
            ref.ref(`users/${owner}/proyects/${key}`).set(true)
            ref.ref(`users/${scrum}/proyects/${key}`).set(true)
            for ( let i in team) {
                ref.ref(`users/${team[i].uid}/proyects/${key}`).set(true)
            }
            this.setState({team: [], search: [], user: '', scrum: '', owner: '', load: false})
            this.changeModal()
        })
    }
    changeModal(){
        this.setState(()=>({open: !this.state.open}))
    }
    render() {
        return(
            <div>
                <div onClick={this.changeModal.bind(this)} className='proyect flex justify aling height'>
                    <div className=''>
                        <Icon name='plus' size='big'/>
                        <div>Add Proyect</div>
                    </div>
                </div>
                <Modal open={this.state.open} size='tiny' dimmer='inverted' >
                    <Modal.Header>Create a new proyect</Modal.Header>
                    <Dimmer active={this.state.load} inverted>
                        <Loader size='massive'></Loader>
                    </Dimmer>
                    <Modal.Content>
                        <Form>
                            <Form.Input label='Nombre del proyecto' onChange={this.searchUser.bind(this)} name='name' placeholder='Nombre del proyecto'/>
                            <h3>Product Owner</h3>
                            {this.renderInput('owner')}
                            <h3>Scrum Master</h3>
                            {this.renderInput('scrum')}
                            <h3>Team Scrum</h3>
                            <datalist id='users'>
                                {this.state.search.map(user=>(
                                    <option key={user.uid} value={user.displayName}/>
                                ))}
                            </datalist>
                            {this.state.team !==[] && this.renderTeam('team')}
                            <Form.Input list='users' onBlur={this.searchUser.bind(this)} value={this.state.user} label='Buscar Usuario' onChange={this.onChange.bind(this)} name='user' placeholder='Buscar Usuario' type='search' />
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.changeModal.bind(this)}>
                            Cancelar
                        </Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content="Crear"
                            onClick={this.createProyect.bind(this)}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}