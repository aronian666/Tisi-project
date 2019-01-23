import React, { Component } from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import _ from 'lodash'
import { Sidebar, Menu } from 'semantic-ui-react';
import { Route, Link } from 'react-router-dom'
import './project.css'
import Histories from './Histories'
import Functionalities from './Functionalities'
import Home from './Home'
import Sprint from './Sprint'

var ref_fun, ref_his
var funcionalities, histories
export default class Proyect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fuc_rama: false,
            proyect: null,
            loading: true,
            his_rama: false,    
            column: null,
            data: [],
            direction: null,
        }
    } 
    componentDidMount(){
        this.setState({user: this.getCookie('user')})
        let ref = firebase.database() 
        ref.ref(`proyects/${this.props.match.params.proyectId}`).once('value', snapshot => {
            let proyect = snapshot.val()
            ref.ref(`users/${proyect.members.owner}`).once('value', snapshot => {
                let owner = snapshot.val()
                try{
                    owner.key = snapshot.key
                }
                catch(err){
                    console.log('ocurrio un error')
                }
                proyect.members.owner = owner
            })
            ref.ref(`users/${proyect.members.scrum}`).once('value', snapshot => {
                let scrum = snapshot.val()
                try{
                    scrum.key = snapshot.key
                }
                catch(err){
                    console.log('ocurrio un error')
                }
                proyect.members.scrum = scrum
            })
            let team = Object.keys(proyect.members.team)
            for ( let i in team){
                ref.ref(`users/${team[i]}`).once('value', snapshot => {
                    proyect.members.team[team[i]] = snapshot.val()
                })  
            }
            console.log(proyect)
            this.setState({proyect, loading: false})
        })
        firebase.database().ref(`sprints/${this.props.match.params.proyectId}`).on('value', snapshot => {
            this.setState({sprints: snapshot.val()})
        })
    }
    getFunctionalities(){
        this.setState({fuc_rama: true})
        console.log('estoy entrando aqui')
        ref_fun = firebase.database().ref(`functionalities/${this.props.match.params.proyectId}`)
        funcionalities = ref_fun.on('value', snapshot => {
            this.setState({funcionalities: []})
            var funcionalities = snapshot.val()
            if(funcionalities){
                funcionalities = Object.keys(funcionalities).map(i => {funcionalities[i].id = i; funcionalities[i].access = funcionalities[i].users !== undefined? funcionalities[i].users[this.state.user]: false; return funcionalities[i]})               
            }
            else{
                funcionalities = []
            }
            this.setState({funcionalities})
        })
    }
    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state
    
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]),
                direction: 'ascending',
            })
            return
        }
    
        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
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
    getHistories() {
        this.setState({his_rama: true})
        
        ref_his = firebase.database().ref(`functionalities/${this.props.match.params.proyectId}`).orderByChild('priority')
        histories = ref_his.on('value', snapshot => {
            var data = snapshot.val() || {}
            this.setState({data: Object.keys(data).map(i=>{
                data[i].key = i;
                console.log(data[i])
                data[i].state = (data[i].state)? data[i].state: false 
                data[i].time = (data[i].time)? ((data[i].time.pesimista + 4 * data[i].time.normal + data[i].time.optimista) / 6).toFixed(2) : 'No definido';
                return (data[i])}), column: null, direction: null})
        })
    }
    componentWillUnmount(){
        if (this.state.fuc_rama){
            ref_fun.off('value', funcionalities)
        }
        if (this.state.his_rama){
            ref_his.off('value', histories)
        }
    }
    handleItemClick = (e, {name}) => this.setState({ activeItem: name })
    render(){
        const match = this.props.match
        const { activeItem } = this.state || {}
        let sprints = this.state.sprints===undefined ||this.state.sprints===null? {} : this.state.sprints  
        sprints = Object.keys(sprints).map(i => sprints[i])
        return(
            <div>
                <Sidebar.Pushable>
                    <Sidebar size='large' animation='overlay' as={Menu} inverted vertical visible={true}>
                        <Menu.Item>
                            <Menu.Header as={Link} to={'/'} style={{cursor: 'pointer'}}>Product Backlog</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item
                                    as={Link}
                                    to={`${match.url}/functionalities`}
                                    name='Funcionalidades'
                                    active={activeItem === 'Funcionalidades'}
                                    onClick={this.handleItemClick}
                                    icon='file outline'
                                    
                                />
                                <Menu.Item
                                    as={Link}
                                    to={`${match.url}/user-histories`}
                                    name='Historias de usuario'
                                    active={activeItem === 'Historias de usuario'}
                                    onClick={this.handleItemClick}
                                    icon='users'
                                />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Sprints</Menu.Header>
                            <Menu.Menu>
                                {sprints.map((sprint, key) => (
                                    <Menu.Item
                                        as={Link}
                                        to={`${match.url}/sprint/${sprint.key}`}
                                        name={`Sprint ${key+1}`}
                                        active={activeItem === `Sprint ${key+1}`}
                                        onClick={this.handleItemClick}
                                    />
                                ))}
                            </Menu.Menu>
                        </Menu.Item>

                    
                    </Sidebar>
                    <Sidebar.Pusher>
                        <div style={{minHeight: '100vh', paddingLeft: '256px'}}>
                            <Route
                                exact
                                path={match.path}
                                render={() => <Home proyect={this.state.proyect}/>}
                            />
                            <Route path={`${match.url}/functionalities`} render={()=>(
                                <Functionalities getFuncionalities={this.getFunctionalities.bind(this)} team={this.state.proyect} user={this.state.user} rama={this.state.fuc_rama} funcionalities={this.state.funcionalities} proyect={match.params.proyectId}/>
                            )}/>
                            <Route path={`${match.url}/user-histories`} render={()=>(
                                <Histories
                                    user={this.state.user}
                                    getHistories={this.getHistories.bind(this)} 
                                    rama={this.state.his_rama}      
                                    proyect={match.params.proyectId}
                                    handleSort={this.handleSort.bind(this)}
                                    data={this.state.data}
                                    column={this.state.column}
                                    direction={this.state.direction}/>
                            )}/>
                            <Route path={`${match.url}/sprint/:id`} render={({match}) => (
                                <Sprint />
                            )}/>
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

