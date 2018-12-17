import React, { Component } from 'react'
import { Icon, Image } from 'semantic-ui-react';

export default class Header extends Component {
    render(){
        let photo = this.props.photoURL
        if (!photo){
            photo = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png'
        }
        return (
            <div className='flex space-between'>
                <h2>KendyApp</h2>
                <div className='flex'>
                    <div onClick={this.props.signOut} style={{cursor: 'pointer' }} >
                        <Icon name='sign-out'/> Salir
                    </div>
                    <div>
                        <Image avatar src={photo} alt={this.props.displayName}/>
                    </div>
                </div>
            </div>
        )
    }
}