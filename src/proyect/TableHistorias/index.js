import React, { Component } from 'react'
import _ from 'lodash'
import { Header, Icon, Table, Button, Modal, Form, TextArea, Grid, Segment, Label, Dimmer, Loader } from 'semantic-ui-react';
import firebase from 'firebase/app'
import 'firebase/database'
var ref
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
        ref = firebase.database().ref(`histories/${this.props.proyect}`)
    }
    open = () => this.setState(() => ({open: !this.state.open}))
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
    render() {
        let {conditions} = this.state
        conditions = Object.keys(conditions).map(i => conditions[i])
        let {column, data, direction} = this.props
        
        //histories = Object.keys(histories).map(i=>histories[i])       
        return (
            <Table color='teal' celled padded sortable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell singleLine>
                            Numero
                        </Table.HeaderCell>
                        <Table.HeaderCell 
                            sorted={column === 'quiero' ? direction : null}
                            onClick={this.props.handleSort('quiero')}>
                            Historia
                        </Table.HeaderCell>
                        <Table.HeaderCell 
                            sorted={column === 'state' ? direction : null}
                            onClick={this.props.handleSort('state')}>
                            Estado
                        </Table.HeaderCell>
                        <Table.HeaderCell 
                            sorted={column === 'priority' ? direction : null}
                            onClick={this.props.handleSort('priority')}>
                            Prioridad
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {_.map(data, ({ key, quiero, state, priority}, k) => (
                        <Table.Row key={key}>
                            <Table.Cell>
                                {k+1}
                            </Table.Cell>
                            <Table.Cell singleLine>
                                {quiero}
                            </Table.Cell>
                            <Table.Cell>
                                {state}
                            </Table.Cell>
                            <Table.Cell negative={priority>=6} positive={priority<6}>
                                {priority}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.HeaderCell colSpan='4'>
                            <Button onClick={this.open} floated='right' icon labelPosition='left' primary size='small'>
                                <Icon name='user'/> Agregar historia
                            </Button>
                            <Modal size='tiny' dimmer='blurring' open={this.state.open} onClose={this.open}>
                                <Dimmer active={this.state.load}>
                                    <Loader/>
                                </Dimmer>
                                <Modal.Header>Nueva historia de usuario</Modal.Header>
                                <Modal.Content as={Form} onSubmit={this.addHistory.bind(this)}>
                                    <Form.Group>
                                        <Form.TextArea autoHeight  width={12} rows={1} name='como' label='Como' placeholder='Yo como...' />
                                        <Form.Input type='number' min='1' max='10' fluid width={4} name='priority' label='Prioridad' placeholder='Prioridad' />
                                    </Form.Group>
                                    <Form.TextArea autoHeight rows={1} name='quiero' label='Quiero' placeholder='Quiero...' />
                                    <Form.TextArea autoHeight rows={1} name='para' label='Para' placeholder='Para...' />
                                    <Header as='h4' content='Condiciones'/>
                                    {conditions.length > 0 && 
                                        <Grid columns='equal'>
                                            {conditions.map((condition, k) => (
                                                <Grid.Row key={k}>
                                                    <Grid.Column width={4}>
                                                        <Segment>
                                                            Condicion {k+1}
                                                        </Segment> 
                                                    </Grid.Column>
                                                    <Grid.Column width={12}>
                                                        <TextArea autoHeight rows={1} className='unborder-condition' key={k} value={condition} name={k} onChange={this.uploadCondition.bind(this)}/>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            ))}
                                        </Grid>
                                    }
                                    <Form.Group>
                                        <Form.TextArea autoHeight rows={1} value={this.state.condition} onChange={this.condition.bind(this)} width={14}/>
                                        <Label onClick={this.addCondition.bind(this, conditions.length)} color='teal'>
                                            Agregar
                                        </Label>
                                    </Form.Group>
                                    <Button negative onClick={this.open}>Cancelar</Button>
                                    <Button primary type='submit'>Agregar</Button>
                                </Modal.Content>
                            </Modal>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        )
    }
}