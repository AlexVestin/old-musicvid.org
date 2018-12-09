
import React, { Component} from 'react'
import GroupContent from './groupcontent'
import GroupContainer from './groupcontainer'
import classes from "./input.css"



class ConfigList extends Component {

    handleChange = input => event =>  {
        let value = event.target.value;
        if(input.type === "Boolean")value = !input.prev
        this.props.edit({key: input.key, value: value })
    }

    handleCustomChange = input => {
        let value = input.value;
        console.log(input.key, value)
        this.props.edit({key: input.key, value: value })
    }
    
    render(){
        const defaultConfig = this.props.defaultConfig;
        const funcs = { handleChange: this.handleChange, handleCustomChange: this.handleCustomChange, addAutomation: this.props.addAutomation };
        return(
                <div className={classes.root}>
                    {defaultConfig.map(group =>     
                        <React.Fragment key={group.title}>
                            {group.isSuperGroup 
                                ?
                                <GroupContainer  level={0} label={group.title} key={group.title} expanded={group.expanded}>
                                        {group.items.map(g => (
                                            <GroupContainer level={2} label={g.title} key={g.title} expanded={g.expanded}>
                                                <GroupContent item={this.props.item} group={g} {...funcs} ></GroupContent>
                                            </GroupContainer>
                                        ))}
                                </GroupContainer>
                                :
                                <GroupContainer level={0} label={group.title} key={group.title} expanded={group.expanded}>
                                    <GroupContent item={this.props.item} group={group} {...funcs} ></GroupContent>
                                </GroupContainer>
                            }
                        </React.Fragment>
                    )}
                </div> 
        )
    }
}


export default ConfigList

