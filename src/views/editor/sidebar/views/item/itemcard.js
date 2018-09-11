import React, {PureComponent} from 'react'
import { Redirect } from 'react-router-dom'
import classes from './itemcard.css'

export default class VideoCard extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { mouseEntered: false, redirect: false }

        this.width = props.width;
        this.height = props.height;
        this.videoRef = React.createRef();
    }

    toggleExpanded = () => this.setState({expanded: !this.state.expanded})

    hover = () => this.setState({mouseEntered: !this.state.mouseEntered})

    render() {
        const {title } = this.props.item

        if (this.state.redirect === true) {
            return <Redirect to='/editor' />
        }

        return(
            <div className={classes.cardWrapper}>
                <img 
                    style={{width: this.props.width, height: this.props.height}}
                    src={this.props.item.posterUrl}
                    alt={"PREVIEW"}
                ></img>
                

                <div className={classes.cardInfo}>
                    <div className={classes.topGroupWrapper}>
                        <div className={classes.title}> {title} </div>
                        <button onClick={() => this.props.onClick(this.props.item)} >add</button>
                    </div>
                </div>
            </div>
        )
    }
}