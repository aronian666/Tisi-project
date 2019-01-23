import React, { Component } from 'react'
//import _ from 'lodash'
import { Header, Icon, Tab} from 'semantic-ui-react';
//import firebase from 'firebase/app'
//import 'firebase/database'
import Historias from '../TableHistorias'
import './histories.css'
//var ref
export default class Histories extends Component {
    componentDidMount() {
        if (!this.props.rama){
            this.props.getHistories()
        }
    }
    render() {
        const panes = [
            { menuItem: 'Todas las historias', render: ()=> <Tab.Pane attached={false}><Historias handleSort={this.props.handleSort} proyect={this.props.proyect} data={this.props.data} column={this.props.column} direction={this.props.direction}/></Tab.Pane>},
            { menuItem: 'Mis Historias', render: ()=> <Tab.Pane attached={false}><Historias user={this.props.user} handleSort={this.props.handleSort} proyect={this.props.proyect} data={this.props.data} column={this.props.column} direction={this.props.direction}/></Tab.Pane>},
            { menuItem: 'Requerimientos sin asignar', render: ()=> <Tab.Pane attached={false}>Funcionaliadades sin asignar</Tab.Pane>},
        ]
        return(
            <div className='container'>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='users' circular/>
                    <Header.Content>Historias de usuario</Header.Content>
                </Header>
                <Tab menu={{secondary: true, pointing: true}} panes={panes} />
            </div>
        )
    }
}
