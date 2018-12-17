import React, { Component } from 'react'
import { Card, Icon, Button, Header, Divider, Modal, TextArea, Loader, Dimmer } from 'semantic-ui-react'
import firebase from 'firebase/app'
import 'firebase/database'
import './func.css'
var ref
export default class Funcionalities extends Component {
    state = {
        open: false,
        load: false
    }
    componentDidMount(){
        if (!this.props.rama){
            this.props.getFuncionalities()
        }
        ref = firebase.database().ref(`functionalities/${this.props.proyect}`) 
    }
    addNewFunctionality(e) {
        this.setState({load: true})
        e.preventDefault()
        ref.push({
            content: e.target.functionality.value,
            date: Date.now()
        }).then(this.close())
    }
    show = () => this.setState({open: true})
    close = () => this.setState({open: false, load: false})
    componentWillUnmount(){
    }
    render() {
        const colors = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet', 'purple', 'pink', 'brown', 'grey']
        const { open, load } = this.state
        let { funcionalities } = this.props
        if (funcionalities === undefined){
            funcionalities = []
        }
        return(
            <div className='container'>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='file' circular/>
                    <Header.Content>Requerimientos del proyecto</Header.Content>
                </Header>
                <Button.Group basic size='big'>
                    <Button icon='file' onClick={this.show} />
                    <Modal size='mini' open={open} onClose={this.close}>
                        <Dimmer active={load}>
                            <Loader/>
                        </Dimmer>
                        <Modal.Header>Funcionalidad {funcionalities.length + 1}</Modal.Header>
                        <form onSubmit={this.addNewFunctionality.bind(this)}>
                            <Modal.Content>
                                <TextArea autoHeight rows={5} name='functionality' placeholder='Ingrese nueva funcionalidad' className='unborder' autoFocus></TextArea>
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
                    <Button icon='save' />
                    <Button icon='upload' />
                    <Button icon='download' />
                </Button.Group>
                <Divider/>
                <Card.Group itemsPerRow={4}>
                    {funcionalities.map((f, k) => (
                        <Card key={k} color={colors[k % colors.length]}>
                            <Card.Content header={`Funcionalidad ${k+1}`} />
                            <Card.Content description={f.content}/>
                            <Card.Content extra>
                                <Icon name='user' />
                                4 Friends 
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>
            </div>
        )
    }
}
