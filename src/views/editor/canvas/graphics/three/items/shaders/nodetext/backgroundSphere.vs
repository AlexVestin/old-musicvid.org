attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

const vec3 hsv1 = vec3(0.0, 0.6, 0.4);
const vec3 hsv2 = vec3(0.24, 0.6, 0.4);

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main(void) {
  // calculate gradation with position.y
  vec3 rgb = convertHsvToRgb(mix(hsv1, hsv2, (normalize(position).y + 1.0) / 2.0));

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vPosition = position;
  vUv = uv;
  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
