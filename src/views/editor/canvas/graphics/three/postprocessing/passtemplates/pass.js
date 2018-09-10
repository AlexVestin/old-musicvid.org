import { addEffect } from '@redux/actions/items'
import ItemSkeleton from '../../../itemtemplates/itemskeleton'


export default class Pass extends ItemSkeleton {
    constructor(config) {
        super();

        this.enabled = true;
        this.needsSwap = true;
        this.clear = false;
        this.renderToScreen = false;

        if(config)this.config.name = config.name
        this.config.id = Math.floor(Math.random() * 10000000)
        this.addEffect = addEffect
    }

    edit = (key, value) => {
        this.config[key] = value
    }

    update = () => {}

    setSize(width, height) { }

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        console.error('THREE.Pass: .render() must be implemented in derived pass.');
    }
};

