import React, { PureComponent } from 'react'
import classes from "./playlist.css"
import SimpleTabs from './tabs'

export default class Playlist extends PureComponent {
    constructor(props) {
        super(props)

    }


    render() {
        return (
           <SimpleTabs></SimpleTabs>
        )
    }
}