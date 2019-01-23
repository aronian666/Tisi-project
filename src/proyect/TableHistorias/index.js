import React, { Component } from 'react'
import _ from 'lodash'
import { Table, Button,Checkbox } from 'semantic-ui-react';
import firebase from 'firebase/app'
import 'firebase/database'
var ref, ref_s
export default class Historias extends Component {
    state = {
        open: false,
        conditions: {},
        condition: '',
        load: false,
        column: null,
        data: [],
        direction: null,
    }
    componentDidMount() {
        ref = firebase.database().ref(`functionalities/${this.props.proyect}`)
        ref_s = firebase.database().ref(`sprints/${this.props.proyect}`)
    }
    open = () => this.setState(() => ({open: !this.state.open}))
    addState(key){
        let histories = this.state.histories || {}
        histories[key] = histories[key]? false : true
        this.setState({histories})
    }
    addHistory(e) {
        e.preventDefault()
        this.setState({load: true})
        console.log(e.target.priority.value)
        ref.push({
            como: e.target.como.value,
            quiero: e.target.quiero.value,
            para: e.target.para.value,
            conditions: this.state.conditions,
            state: 'Sin sprint',
            priority: parseInt(e.target.priority.value)
        }).then(() => {
            console.log('estoy entrando qui')
            this.setState({conditions: {}, condition: '', load: false, open: false})
        })
    }
    
    uploadCondition(e){
        const { name, value } = e.target
        let {conditions} = this.state
        conditions[name] = value
        this.setState({conditions})
    }
    addCondition(len){
        let {conditions, condition} = this.state
        if (condition !== ''){
            conditions[len] = condition
            this.setState({conditions, condition: '', focus: true})
        }
    }
    condition(e){
        const {value} = e.target
        this.setState({condition: value})
    }

    createSprint(){
        var key = ref_s.push().key;
        ref_s.child('key').set({
            histories: this.state.histories || null
        }).then(()=> {
            Object.keys(this.state.histories).map(i => {
                firebase.database().ref(`functionalities/${this.props.proyect}/${i}`).update({
                    state: key 
                })
            })
        })
        
    }
    render() {
        let {conditions} = this.state
        conditions = Object.keys(conditions).map(i => conditions[i])
        let {column, data, direction} = this.props
        
        //histories = Object.keys(histories).map(i=>histories[i])       
        return (
            <Table color='teal' sortable celled fixed>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width='1'>

                        </Table.HeaderCell>
                        <Table.HeaderCell width='1'>
                            Numero
                        </Table.HeaderCell>
                        <Table.HeaderCell 
                            sorted={column === 'quiero' ? direction : null}
                            onClick={this.props.handleSort('quiero')}
                            width='8'>
                            Historia
                        </Table.HeaderCell>
                        <Table.HeaderCell 
                            sorted={column === 'state' ? direction : null}
                            onClick={this.props.handleSort('state')}
                            width='2'>
                            Estado
                        </Table.HeaderCell>
                        <Table.HeaderCell 
                            sorted={column === 'priority' ? direction : null}
                            onClick={this.props.handleSort('priority')}
                            width='2'>
                            Prioridad
                        </Table.HeaderCell>
                        <Table.HeaderCell 
                            sorted={column === 'time' ? direction : null}
                            onClick={this.props.handleSort('time')}
                            width='2'>
                            Tiempo promedio
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ key, content, state, priority, time, users, aprobado}, k) => {
                        if (!this.props.user) {
                            return (
                                <Table.Row key={key}  positive={aprobado}>
                                    <Table.Cell>
                                        <Checkbox slider disabled={!aprobado} onChange={this.addState.bind(this, key)}/>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {k+1}
                                    </Table.Cell>
                                    <Table.Cell singleLine>
                                        {content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {state? 'En sprint': 'Sin sprint'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {priority? priority>7? `Alta(${priority})`: priority>4? `Media(${priority})`: `Baja(${priority})`: 'No definido'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {time}
                                    </Table.Cell>
                                </Table.Row>
                            )
                        }
                        else {
                            if(users !== undefined){
                                if(users[this.props.user]){
                                    return (
                                        <Table.Row key={key} positive={state}>
                                            <Table.Cell>
                                                <Checkbox slider disabled={state} onChange={this.addState.bind(this, key)}/>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {k+1}
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {content}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {state? 'En sprint': 'Sin sprint'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {priority? priority>7? `Alta(${priority})`: priority>4? `Media(${priority})`: `Baja(${priority})`: 'No definido'}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {time}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            }
                        }
                    })}
                </Table.Body>
                <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell />
                        <Table.HeaderCell colSpan='5'>
                        <Button size='small' onClick={this.createSprint.bind(this)}>Approve</Button>
                        <Button disabled size='small'>
                            Approve All
                        </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        )
    }
}