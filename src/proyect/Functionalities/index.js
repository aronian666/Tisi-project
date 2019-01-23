import React, { Component } from 'react'
import { Card, Icon, Button, Header, Divider, Modal, Checkbox, TextArea, Loader, Dimmer, Form, Menu, Label, Table, List, Image} from 'semantic-ui-react'
import firebase from 'firebase/app'
import 'firebase/database'
import './func.css'

var ref_fuc, scrum, owner
export default class Funcionalities extends Component {
    state = {
        open: false,
        load: false,
        edit: {},
        add: {},
        openf: false,
        conditions: {},
        condition: '',
        loadf: false,
        column: null,
        data: [],
        direction: null,
        users: {},
        time: {
            pesimista: 0,
            optimista: 0,
            normal: 0
        },
    }
    open = (f = null) => this.setState(() => ({openf: !this.state.openf, add: f, time: f.time=== undefined? {
        pesimista: 0,
        optimista: 0,
        normal: 0
    }: f.time, conditions : f.conditions===undefined? {}: f.conditions, aprobado: f.aprobado}))
    closef = () => this.setState({openf: false})
    addHistory(e) {
        e.preventDefault()
        this.setState({load: true})
        ref_fuc.child(this.state.add.id).update({
            como: e.target.como.value,
            content: e.target.quiero.value,
            para: e.target.para.value,
            conditions: this.state.conditions,
            time: this.state.time,
            state: false,
            priority: parseInt(e.target.priority.value),
            aprobado: this.state.aprobado || false
        }).then(() => {
            this.setState({conditions: {}, condition: '', loadf: false, openf: false})
        })
    }
    
    uploadCondition(e){
        const { name, value } = e.target
        let {conditions} = this.state
        conditions[name] = value
        this.setState({conditions})
    }
    addCondition(e){
        if (e.keyCode === 13){
            let {conditions, condition} = this.state
            let len = Object.keys(conditions).length
            if (condition !== ''){
                conditions[len] = condition
                this.setState({conditions, condition: ''})
            }
        }
        
    }
    condition(e){
        const {value} = e.target
        this.setState({condition: value})
    }
    componentDidMount(){
        if (!this.props.rama){
            this.props.getFuncionalities()
        }
        ref_fuc = firebase.database().ref(`functionalities/${this.props.proyect}`) 
    }
    addNewFunctionality(e) {
        this.setState({load: true})
        e.preventDefault()
        if (typeof this.state.edit.id === 'string'){
            ref_fuc.child(this.state.edit.id).update({content: e.target.functionality.value, users: this.state.users}).then(this.close())
        }
        else{
            ref_fuc.push({
                content: e.target.functionality.value,
                date: Date.now(),
                state: false,
                users: this.state.users
            }).then(this.close())
        }
    }
    show = (c = null, id = null, users={}) => this.setState({open: true, edit: {c: c, id: id}, users: users})
    close = () => this.setState({open: false, load: false, edit: {}})
    time(e) {
        let { name, value } = e.target
        let { time } = this.state
        time[name] = parseInt(value)
        this.setState({time})
    }
    addUsers(key){
        let users = this.state.users || {}
        users[key] = users[key]? null : true
        this.setState({users})
    }
    addAprobado(e) {
        let aprobado = this.state.aprobado || false
        this.setState({aprobado: !aprobado})
    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
    deleteFunc(key){
        ref_fuc.child(key).set(null)
    }
    render() {
        const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
        let { open, load, edit, conditions, time, activeItem } = this.state
        conditions = Object.keys(conditions).map(i => conditions[i])
        let { funcionalities, team } = this.props
        if (funcionalities === undefined){
            funcionalities = []
        }
        
        try {
            scrum = team.members.scrum.key === this.props.user
            owner = team.members.owner.key === this.props.user
            console.log(scrum)
        }
        catch{
            scrum = true
            owner = true
        }
        team = team? Object.keys(team.members.team).map(i => {
            try{
                team.members.team[i].key = i
            }
            catch(err){
                console.log('ocurrio un error')
            }
            return team.members.team[i]
        }) : []
        return(
            <div className='container'>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='file' circular/>
                    <Header.Content>Requerimientos del proyecto</Header.Content>
                </Header>
                <Menu>
                    <Menu.Item
                        name='editorials'
                        active={activeItem === 'editorials'}
                        onClick={this.show}
                        disabled={!scrum && !owner}
                    >
                        Nuevo
                    </Menu.Item>

                    <Menu.Item name='reviews' active={activeItem === 'reviews'} onClick={this.handleItemClick}>
                        Mis Requerimientos
                    </Menu.Item>
                    <Modal size='mini' open={open} onClose={this.close}>
                        <Dimmer active={load}>
                            <Loader/>
                        </Dimmer>
                        <Modal.Header>Funcionalidad {funcionalities.length + 1}</Modal.Header>
                        <form onSubmit={this.addNewFunctionality.bind(this)}>
                            <Modal.Content>
                                <TextArea autoHeight rows={5} name='functionality' placeholder='Ingrese nueva funcionalidad' className='unborder' maxLength='100' autoFocus defaultValue={(typeof edit.id == 'string')? edit.c : '' }></TextArea>
                                <Header as='h3' content='Responsables'/>
                                <List selection verticalAlign='middle'>
                                    {team.map(t => (
                                        <List.Item>
                                            <List.Content floated='right'>
                                                <Checkbox toggle onChange={this.addUsers.bind(this, t.key)} defaultChecked={this.state.users[t.key]} />
                                            </List.Content>
                                            <Image avatar src={t.photoURL} />
                                            <List.Content>
                                                <List.Header>{t.displayName}</List.Header>
                                            </List.Content>
                                        </List.Item>
                                    ))}                     
                                </List>
                            </Modal.Content>
                            <Modal.Actions style={{margin: '10px'}}>
                                <Button.Group>
                                    <Button positive type='submit'>Guardar</Button>
                                    <Button.Or />
                                    <Button onClick={this.close}>Cancelar</Button>
                                </Button.Group>
                            </Modal.Actions>    
                        </form>
                    </Modal>
                </Menu>
                <Divider/>
                <Modal size='large' dimmer='blurring' open={this.state.openf} onClose={this.closef}>
                    <Dimmer active={this.state.loadf}>
                        <Loader/>
                    </Dimmer>
                    <Modal.Header>Nueva historia de usuario</Modal.Header>
                    {scrum && <Modal.Header as='h3'>
                        Aprobar
                        <Checkbox toggle onChange={this.addAprobado.bind(this)} defaultChecked={this.state.add.aprobado}/>
                    </Modal.Header>}
                    <Modal.Content as={Form} onSubmit={this.addHistory.bind(this)}>
                        <Header as='h3' content='Informacion general'/>
                        <Form.Group>
                            <Form.Input width={12} label='Nombre del requerimiento' name='quiero' defaultValue={this.state.add.content} placeholder='Nombre del requerimiento' />
                            <Form.Input type='number' min='1' max='10' fluid width={4} name='priority' label='Prioridad' defaultValue={this.state.add.priority} placeholder='Prioridad' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input  name='como' label='Solicitante' placeholder='Usuario experto' defaultValue={this.state.add.como} />
                            <Form.Input  name='para' label='Para' placeholder='Para...' defaultValue={this.state.add.para}/>
                            <Form.Input label='Subir archivo' type='file'/>    
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input type='number' label='Tiempo pesimista' onChange={this.time.bind(this)} name='pesimista' defaultValue={this.state.time.pesimista}/>
                            <Form.Input type='number' label='Tiempo normal' onChange={this.time.bind(this)} name='normal' defaultValue={this.state.time.normal}/>
                            <Form.Input type='number' label='Tiempo optimista' onChange={this.time.bind(this)} name='optimista' defaultValue={this.state.time.optimista}/>
                            <Form.Input label='Tiempo promedio' value={(time.optimista + time.pesimista + 4 * time.normal)/6}/>
                        </Form.Group>
                        <Header as='h3' content='Condiciones'/>
                        <Table celled padded>
                            <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width='two'>Numero</Table.HeaderCell>
                                <Table.HeaderCell width='14'>Descripcion</Table.HeaderCell>
                            </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {conditions.map((condition, k) => (
                                <Table.Row key={k}>
                                    <Table.Cell>
                                        {k}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {condition}
                                    </Table.Cell>
                                </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        <Form.TextArea autoHeight rows={1} value={this.state.condition} onKeyDown={this.addCondition.bind(this)} label='Condicion' onChange={this.condition.bind(this)} placeholder='Escribir condicion'/>
                        <Button negative onClick={this.closef}>Cancelar</Button>
                        <Button primary type='submit'>Agregar</Button>
                    </Modal.Content>
                </Modal>
                <Card.Group itemsPerRow={4}>
                    {funcionalities.map((f, k) => {
                        
                        return(
                            <Card key={k} color={colors[k % colors.length]}>
                                <Label><Icon name='x'style={{cursor: 'pointer'}} onClick={this.deleteFunc.bind(this, f.id)}/></Label>
                                <Label attached='top right' color={f.aprobado? 'green': 'red'}>{f.aprobado? 'Aprobado': 'Sin aprobar'}</Label>
                                <Card.Content header={`Funcionalidad ${k+1}`} />
                                <Card.Content description={f.content}/>
                                <Card.Content extra as={Button.Group}>
                                    <Button color='teal' disabled={!scrum && !owner } basic onClick={this.show.bind(this, f.content, f.id, f.users)}>Editar</Button>
                                    <Button color='olive' disabled={!scrum && !owner && !f.access} basic onClick={this.open.bind(this, f)}>Aniadir</Button>
                                </Card.Content>
                            </Card>
                        )
                    })}
                </Card.Group>
            </div>
        )
    }
}
