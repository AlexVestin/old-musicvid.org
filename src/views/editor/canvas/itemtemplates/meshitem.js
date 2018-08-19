
import BaseItem from './item'

export default class MeshItem extends BaseItem {
    constructor(config) {
        super(config)
        const positionGroup = {
            title: "Positioning",
            items: {
                x: {value: 0, type: "Number",  tooltip: "X position"},
                y: {value: 0, type: "Number", tooltip: "Y Position"},
                z: {value: 0, type: "Number",  tooltip: "Z Position"},
            }
        }
        
        this.config.defaultConfig.push(positionGroup)
        this.getConfig()
    }
}