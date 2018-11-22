
import React, { Component} from 'react'
import GroupContent from './groupcontent'
import GroupContainer from './groupcontainer'
import classes from "./input.css"



class ConfigList extends Component {
    handleChange = input => event =>  {
        var value = event.target.value
        if(input.type === "Boolean")value = !input.prev
        this.props.edit({key: input.key, value: value })
    }
    
    render(){
        const groups = this.props.item._groups;
        const item = this.props.item;
        let g = {};

        console.log(this.props)
        Object.keys(item).forEach(key => {
            if(item[key].group)
                g[item[key].group].push(item[key]); 
        });

        return(
                <div className={classes.root}>
                
                    {groups.map(group =>     
                        <React.Fragment>
                            {group.isSuperGroup 
                                ?
                                <GroupContainer level={1} label={group.name} key={group.name} expanded={group.expanded}>
                                        {group.items.map(g => (
                                            <GroupContainer level={2} label={g.name} key={g.name} expanded={g.expanded}>
                                                <GroupContent item={this.props.item} group={g} addAutomation={this.props.addAutomation} handleChange={this.handleChange} ></GroupContent>
                                            </GroupContainer>
                                        ))}
                                </GroupContainer>
                                :
                                <GroupContainer level={1} label={group.name} key={group.name} expanded={group.expanded}>
                                    <GroupContent item={this.props.item} group={g[group.name]} addAutomation={this.props.addAutomation} handleChange={this.handleChange} ></GroupContent>
                                </GroupContainer>
                            }
                        </React.Fragment>
                    )}
                </div> 
        )
    }
}


export default ConfigList

