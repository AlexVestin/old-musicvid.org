import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ClipItem from './clipitem'



class ClipInfoBar extends PureComponent {

    render(){
        const items = this.props.items
        return (
            <div style={{width: "100%"}} >
                <div style={{position: "absolute", width: "20%", height: "100%", backgroundColor: "#434343"}}></div>
                {items && Object.keys(items).map((key, index) => 
                      <ClipItem key={items[key].id} info={this.props.info} item={items[key]} index={index}></ClipItem>
                )}
            </div>
        )
    }
}
const mapStateToProps2 = (state, ownProps) => {
    return {
        items: state.items.items[ownProps.selectedLayerId],
    }
}
export default connect(mapStateToProps2)(ClipInfoBar)




