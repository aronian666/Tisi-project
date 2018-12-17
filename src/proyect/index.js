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
        let ref = firebase.database() 
        ref.ref(`proyects/${this.props.match.params.proyectId}`).once('value', snapshot => {
            let proyect = snapshot.val()
            ref.ref(`users/${proyect.members.owner}`).once('value', snapshot => {
                let owner = snapshot.val()
                owner.key = 'Product Owner'
                proyect.members.owner = owner
            })
            ref.ref(`users/${proyect.members.scrum}`).once('value', snapshot => {
                let scrum = snapshot.val()
                scrum.key = 'Scrum Master'
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
    }
    getFunctionalities(){
        this.setState({fuc_rama: true})
        console.log('estoy entrando aqui')
        ref_fun = firebase.database().ref(`functionalities/${this.props.match.params.proyectId}`)
        funcionalities = ref_fun.on('value', snapshot => {
            this.setState({funcionalities: []})
            snapshot.forEach(snapshot => {
                this.setState({funcionalities: this.state.funcionalities.concat(snapshot.val())})
            })
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
    getHistories() {
        this.setState({his_rama: true})
        
        ref_his = firebase.database().ref(`histories/${this.props.match.params.proyectId}`).orderByChild('priority')
        histories = ref_his.on('value', snapshot => {
            var data = snapshot.val() || {}
            this.setState({data: Object.keys(data).map(i=>{data[i].key = i; return (data[i])}), column: null, direction: null})
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
        return(
            <div>
                <Sidebar.Pushable>
                    <Sidebar size='large' animation='overlay' as={Menu} inverted vertical visible={true}>
                        <Menu.Item>
                            <Menu.Header>Product Backlog</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item
                                    as={Link}
                                    to={`${match.url}/functionalities`}
                                    name='Funcionalidades'
                                    active={activeItem === 'Funcionalidades'}
                                    onClick={this.handleItemClick}
                                    icon='file outline'
                                    className='raton'
                                />
                                <Menu.Item
                                    as={Link}
                                    to={`${match.url}/user-histories`}
                                    name='Historias de usuario'
                                    active={activeItem === 'Historias de usuario'}
                                    onClick={this.handleItemClick}
                                    className='raton'
                                    icon='users'
                                />
                            </Menu.Menu>
                        </Menu.Item>
                        <Menu.Item>
                            <Menu.Header>Sprints</Menu.Header>
                            <Menu.Menu>
                                <Menu.Item
                                    name='Sprint 1'
                                    active={activeItem === 'Sprint 1'}
                                    onClick={this.handleItemClick}
                                    className='raton'
                                />
                                <Menu.Item
                                    name='Sprint 2'
                                    active={activeItem === 'Sprint 2'}
                                    onClick={this.handleItemClick}
                                    className='raton'
                                />
                                <Menu.Item 
                                    name='Sprint 3' 
                                    active={activeItem === 'Sprint 3'} 
                                    onClick={this.handleItemClick}
                                    className='raton'
                                />
                            </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Hosting</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item
                            name='shared'
                            active={activeItem === 'shared'}
                            onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            name='dedicated'
                            active={activeItem === 'dedicated'}
                            onClick={this.handleItemClick}
                            />
                        </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item>
                        <Menu.Header>Support</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item name='email' active={activeItem === 'email'} onClick={this.handleItemClick}>
                            E-mail Support
                            </Menu.Item>

                            <Menu.Item name='faq' active={activeItem === 'faq'} onClick={this.handleItemClick}>
                            FAQs
                            </Menu.Item>
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
                                <Functionalities getFuncionalities={this.getFunctionalities.bind(this)} rama={this.state.fuc_rama} funcionalities={this.state.funcionalities} proyect={match.params.proyectId}/>
                            )}/>
                            <Route path={`${match.url}/user-histories`} render={()=>(
                                <Histories 
                                    getHistories={this.getHistories.bind(this)} 
                                    rama={this.state.his_rama}      
                                    proyect={match.params.proyectId}
                                    handleSort={this.handleSort.bind(this)}
                                    data={this.state.data}
                                    column={this.state.column}
                                    direction={this.state.direction}/>
                            )}/>
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

