import React from 'react'
import Delete from '@material-ui/icons/Delete'

const styles = {
    margin: 5, 
    marginTop: 10, 
    display: "flex", 
    justifyContent:"space-between", 
    flexDirection:"row", 
    width: "100%", 
    height: 24, 
    overflow: "hidden"
}

const NameInput = (props) => {
    return (
        <div style={styles}>
            <div style={{height: "100%", marginTop: 2}}>{"Name:"}</div>
            
            <div style={{display: "flex", justifyContent: "row"}}>
                <input style={{height: 18, padding:0, marginTop: 1}} onChange={props.edit} value={props.value} type="text"></input>
                <div style={{color:"#F50057", minWidth: 10, minHeight: 10 }}>
                    <Delete onClick={props.onDelete}  style={{cursor: "pointer", marginRight: 10}}></Delete>
                </div>
            </div>
        </div>
    )
}

export default NameInput