import React, { Component } from 'react'
import { Card, Image, Icon, Header, Loader, Segment, Dimmer } from 'semantic-ui-react'
export default class Home extends Component {
    render() {
        if (this.props.proyect){
            let {members} = this.props.proyect
            let { team } = members
            members = Object.keys(members).map(i => members[i])
            team = Object.keys(team).map(i => team[i])
            delete members[2]
            return(
                <div className='container'>
                    <Header as='h1' icon textAlign='center' dividing>
                        <Icon name='file code outline'/>
                        <Header.Content>{this.props.proyect.name}</Header.Content>
                    </Header>
                    <Header as='h3' icon textAlign='center' >
                        <Icon name='user secret' />
                        <Header.Content>Product Owner y Scrum master</Header.Content>
                    </Header>
                    <Card.Group centered>
                        {members.map(member => (
                            <Card key={member.key}>
                                <Image src={member.photoURL} />
                                <Card.Content>
                                <Card.Header>{member.displayName}</Card.Header>
                                <Card.Meta>
                                    <span className='date'>{member.key}</span>
                                </Card.Meta>
                                <Card.Description>System enginer</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                <a>
                                    <Icon name='user' />
                                    22 Ps
                                </a>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                    <Header as='h3' icon textAlign='center'>
                        <Icon name='users ' />
                        <Header.Content>Team Scrum</Header.Content>
                    </Header>
                    <Card.Group centered>
                        {team.map(team => (
                            <Card key={team.key}>
                                <Image src={team.photoURL} />
                                <Card.Content>
                                <Card.Header>{team.displayName}</Card.Header>
                                <Card.Meta>
                                    <span className='date'>{team.key}</span>
                                </Card.Meta>
                                <Card.Description>System enginer</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                <a>
                                    <Icon name='user' />
                                    22 Ps
                                </a>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </div>   
            )    
        }
        else {
            return (
                <Segment>
                    <Dimmer active>
                        <Loader />
                    </Dimmer>
                </Segment>
            )
        }
        
    }
}