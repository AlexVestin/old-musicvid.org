import React, {PureComponent} from 'react'
import VideoCard from './itemcard'
import classes from './previews.css'
import { connect } from 'react-redux'
import  withHeader from '../../HOC/withheader';

import Input from '@material-ui/core/Input'
import CollectionsIcon from '@material-ui/icons/Collections'
import ListIcon from '@material-ui/icons/List'


class Previews extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {  listType: 0 }

        this.videoWidth = 195;
        this.videoHeight = 110;
    }



    setPreviewImages = () => {
        this.setState({listType: 0})
    }

    setPreviewList = () => {
        this.setState({listType: 1})
    }


    addItem = (item) => {
        this.props.addItem(item)
    }

    render() {
        let items = this.props.items; 

        return(
            <React.Fragment>
                <div className={classes.optionsWrapper}>
                    <Input ></Input>
                    <div className={classes.iconWrapper} style={{color: this.state.listType === 0 ? "black" : "blue"}} onClick={this.setPreviewList}>
                        <ListIcon  className={classes.icon}></ListIcon>
                    </div>

                    <div className={classes.iconWrapper} onClick={this.setPreviewImages} style={{color: this.state.listType === 1 ? "black" : "blue"}} >
                        <CollectionsIcon className={classes.icon}></CollectionsIcon>
                    </div>
                </div>

                <div className={classes.container}>
                    <div className={this.state.listType ===  0 ? classes.wrapper : classes.listWrapper}>  
                        {this.state.listType ===  0 ?                      
                            <React.Fragment>
                                {Object.keys(items).map(key => 
                                    <VideoCard key={key} onClick={this.addItem} item={items[key]} width={this.videoWidth} height={this.videoHeight}></VideoCard>
                                )}
                            </React.Fragment>
                        : 
                            <React.Fragment>
                                {Object.keys(items).map(key => 
                                    <div key={key} onClick={() => this.addItem(items[key])} className={classes.listItem}>{items[key].title}</div>
                                )}
                            </React.Fragment>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        layer: state.items.layers[state.items.selectedLayerId]
    }
}

export default connect(mapStateToProps)(Previews)
