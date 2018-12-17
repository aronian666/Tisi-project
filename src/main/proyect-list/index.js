import React, { Component } from 'react'

export default class ProyectList extends Component {
    render() {
        return (
            <div className='proyect flex justify aling'>
                <h2>{this.props.name}</h2>
            </div>
        )
    }
}