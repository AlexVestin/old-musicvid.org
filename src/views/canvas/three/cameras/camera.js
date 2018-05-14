
export default class Camera {
    constructor() {

      this.config = {type: "ortho", near: 0, far: 1, x: 0, y: 0, z: 0, pointAtX: 0, pointAtY: 0, pointAtZ: 0, id: Math.floor(Math.random() * 10000000)}
      const defaultConfig = [
          {
              title: "config",
              hide: false,
              items: {
                  type: {value: 0, type: "String"},
                  near: {value: 0, type: "Number"},
                  x: {value: 0, type: "Number"},
                  y: {value: 0, type: "Number"},
                  z: {value: 0, type: "Number"},
                  pointAtX: {value: 0, type: "Number"},
                  pointAtY: {value: 0, type: "Number"},
                  pointAtZ: {value: 0, type: "Number"},
              }
          }
        ]

    this.config.defaultConfig = defaultConfig
    }
}