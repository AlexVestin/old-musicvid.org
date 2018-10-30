import React, {PureComponent} from 'react'
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography'

import List from '../views/item/list'
const style= {
    position: 'absolute',
    top: `30%`,
    left: `50%`,
};


const models = [
    {title: "Head", posterUrl: "/demos/missing.png", url: "/models/obj/WaltHead/WaltHead.obj"},
]


export default class Model3D extends PureComponent {

    render() {
        return(
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.props.open}
                onClose={this.props.handleClose}>

                <div style={style}>
                    <Typography variant="title" id="modal-title">
                        Choose a 3D-model
                    </Typography>
                    

                    <List addItem={this.props.addItem} onSelect={this.selectItem} items={models}></List>

                </div>
            </Modal>

        )
    }
}