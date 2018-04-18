import * as THREE from 'three'

export default class Text {
    constructor(scene) {
        var data = {
            text: "TextGeometry",
            size: 5,
            height: 2,
            curveSegments: 12,
            font: "helvetiker",
            weight: "regular",
            bevelEnabled: false,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 3
        };
    
        var fonts = [
            "helvetiker",
            "optimer",
            "gentilis",
            "droid/droid_serif"
        ];
    
        var weights = [
            "regular", "bold"
        ];
        
        this.characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]

        var loader = new THREE.FontLoader();
        this.group = new THREE.Group()
        this.mesh = new THREE.Mesh()
        this.numbers = {}
        scene.add(this.group)
        loader.load( 'optimer_regular.typeface.json', (font) =>  {
            
            for(var i = 0; i <  this.characters.length; i++) {
                var geometry = new THREE.TextGeometry( 
                    this.characters[i], {
                    font: font,
                    size: data.size,
                    height: data.height,
                    curveSegments: data.curveSegments,
                    bevelEnabled: data.bevelEnabled,
                    bevelThickness: data.bevelThickness,
                    bevelSize: data.bevelSize,
                    bevelSegments: data.bevelSegments
                });

                let num = new THREE.Mesh()
                num.geometry = geometry
                this.numbers[this.characters[i]] = num
            }

            let pos = ["0",".","0","0"]
            let start = []
            for(var i =0; i < 4; i++) {
                let num = this.numbers[pos[i]].clone()
                num.position.x = i * 3 + 20
                start.push(num)
            }
            
            this.group.add(...start)
            this.groupLoaded = true
        });
    }

    animate = (time) => {
        
        if(this.groupLoaded) {
            let nums = String(time).split("").slice(0, 4)
            nums.forEach((e, i) => {
                let t = this.group.children[i].geometry.parameters.text
                if( e != t ){

                    let n = this.group.children[i]
                    n.geometry.dispose()

                    let num = this.numbers[e].clone()
                    num.position.x = i * 3 + 20
                    this.group.children[i] = num
                }
            })
        }
    }
}