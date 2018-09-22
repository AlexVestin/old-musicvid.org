import React, { PureComponent } from 'react'
import classes from './freq.css'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'


const GroupHeader = (props) => {

    return(
        <div className={classes.headerWrapper} onClick={props.toggleExpanded}>
            <p style={{ height: 20, margin: 5, fontSize: 16}}>{props.label} </p>
            <div style={{display: "flex", flexDirection: "row"}}>
                { props.expanded ? 
                    <div className={classes.iconWrapper}>
                        <KeyboardArrowUp className={classes.icon}></KeyboardArrowUp>
                    </div>
                :
                    <div className={classes.iconWrapper}>
                        <KeyboardArrowDown className={classes.icon} ></KeyboardArrowDown>
                    </div>
                }
            </div>
        </div>
    )
}

class Card extends PureComponent {

    state = { expanded: false}

    toggleExpanded = () => this.setState({expanded: !this.state.expanded})

    render() {
        return (
            <div className={classes.card}>
                <GroupHeader expanded={this.state.expanded} label={this.props.question} toggleExpanded={this.toggleExpanded}></GroupHeader>
                
                {this.state.expanded && 
                    <React.Fragment>
                        {this.props.children}
                    </React.Fragment>
                }
            </div>
        )
    }
}



export default class FrequentlyAsked extends PureComponent {

    render() {
        return(
            <div className={classes.container}>
                <Card  question="How do I export my video?">
                    <div> 
                        Click the settings in the top of the left sidebar icon and then click the Export Video button  
                        <img src="/tutorial/export.png" alt-text="export image"></img>
                    </div>
                    
                </Card>

                <Card  question="Where can I leave feedback/suggestions?">
                    <div> 
                        Feedback and suggestions can be left in the <a href="https://www.reddit.com/r/edmproduction/comments/9hyv2a/ive_made_a_free_audio_visualizing_website_check/"> reddit thread</a> 
                        , as an email to musicvid.org@gmail.com, or join the discord channel at <a href="https://discord.gg/CnfEeM">https://discord.gg/CnfEeM</a>
                    </div>
                </Card>

                 <Card  question="My added item isn't visible!">
                    <div> There is a renderorder attached to both layers and items, and so it might be rendered behind another item. 
                        <br></br>
                        The item renderorder is under "Base Configurations" -> "zIndex". The item with the highest number will be 
                        rendered on top.
                        <br/>
                        The layers are also ordered after renderOrder under "Settings" -> "zIndex". 
                    </div>
                </Card>

                <Card question="Will transparent video be available?">
                    <div> This is the goal, however having an alpha channel can be quite tricky using the usual encoders </div>
                </Card>

                <Card  question="When will format X be available?">
                    <div> Webm/AAC support is on the docket list, however this is a while away. If you want to see another format being added leave it as a suggestion in the locations mentioned above!</div>
                </Card>

                <Card  question="Can I join the development?">
                    <div> Yes! The project is open source and we would love collaborators. However there are no directions or guidelines set, so contact me if you want to take a stab at it :)</div>
                </Card>


                 <Card  question="The site doesn't work for me">
                    <div> The site is still in early development and hasn't been tested with every systemtype yet. We use chrome and firefox in development so these are recommended, at least for now </div>
                </Card>

                <Card  question="The site crashed/misbehaves">
                    <div> As mentioned the site is still in early development, but we would love the feedback, and we will try to fix the issues as fast as we can. In the meantime
                        try to refresh the site, and have the latest version of either Chrome, Edge, or Firefox installed. 
                    </div>
                </Card>
            </div>
        )
    }
}

