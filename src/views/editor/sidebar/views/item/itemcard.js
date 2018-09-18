import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import classes from './itemcard.css'
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import Badge from '@material-ui/core/Badge';

import './animations.css'
export default class VideoCard extends PureComponent {

    constructor(props) {
        super(props);

        this.state = { mouseEntered: false, redirect: false, initialMouseEnter: false }
        this.width = props.width;
        this.height = props.height;
        this.videoRef = React.createRef();
    }

    toggleExpanded = () => this.setState({ expanded: !this.state.expanded })

    hover = () => this.setState({ mouseEntered: !this.state.mouseEntered })


    mouseEnter = () => {
        if (!this.state.initialMouseEnter)
            this.setState({ initialMouseEnter: true }, () => {

            })

        if (this.videoRef.current)
            this.videoRef.current.play();
    }

    mouseClick = () => {
        if(this.videoRef.current)this.videoRef.current.play();
    }

    mouseOut = () => {
        if (this.videoRef.current)
            this.videoRef.current.pause();
    }

    render() {
        const { title, videoUrl, posterUrl, audioReactive } = this.props.item

        if (this.state.redirect === true) {
            return <Redirect to='/editor' />
        }

        return (

            <div className={classes.cardWrapper} onMouseEnter={this.mouseEnter} onMouseOut={this.mouseOut} onClick={this.mouseClick}>

                {(this.state.initialMouseEnter && videoUrl) ?

                    <CSSTransitionGroup
                        transitionName="example"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>

                        {audioReactive === true ?
                            <Badge color="secondary" badgeContent={"A"} className={classes.badge}>
                                <video
                                    ref={this.videoRef}
                                    src={videoUrl}
                                    poster={posterUrl}
                                    style={{ width: this.props.width, height: this.props.height }}
                                    autoPlay
                                    loop
                                >
                                </video>
                            </Badge>
                            :
                            <video
                                ref={this.videoRef}
                                src={videoUrl}
                                poster={posterUrl}
                                style={{ width: this.props.width, height: this.props.height }}
                                autoPlay
                                loop
                            >
                            </video>
                        }

                    </CSSTransitionGroup>

                    :
                    <React.Fragment>
                        {audioReactive === true ?
                            <Badge color="secondary" badgeContent={"A"}>
                                <img
                                    style={{ width: this.props.width, height: this.props.height }}
                                    src={this.props.item.posterUrl}
                                    alt={"PREVIEW"}
                                ></img>
                            </Badge>
                            :

                            <img
                                style={{ width: this.props.width, height: this.props.height }}
                                src={this.props.item.posterUrl}
                                alt={"PREVIEW"}
                            ></img>
                        }

                    </React.Fragment>

                }
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