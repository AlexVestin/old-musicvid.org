import * as THREE from 'three'

var ThreePBR = function(){
	this.normal_map = new THREE.TextureLoader().load( "img/normal.jpg" );
    this.normal_map.wrapS = THREE.ClampToEdgeWrapping;
    this.normal_map.wrapT = THREE.ClampToEdgeWrapping;
    this.normal_map.magFilter = THREE.LinearFilter;
    this.normal_map.minFilter = THREE.LinearFilter;

    this.roughness_map = new THREE.TextureLoader().load( "img/roughness.jpg" );
    this.roughness_map.wrapS = THREE.ClampToEdgeWrapping;
    this.roughness_map.wrapT = THREE.ClampToEdgeWrapping;
    this.roughness_map.magFilter = THREE.LinearFilter;
    this.roughness_map.minFilter = THREE.LinearFilter;

    this.metallic_map = new THREE.TextureLoader().load( "img/metallic.jpg" );
    this.metallic_map.wrapS = THREE.ClampToEdgeWrapping;
    this.metallic_map.wrapT = THREE.ClampToEdgeWrapping;
    this.metallic_map.magFilter = THREE.LinearFilter;
    this.metallic_map.minFilter = THREE.LinearFilter;

	this.normal = 1.;
	this.roughness = .0;
	this.metallic = 1.;

	this.exposure = 2.;
	this.gamma = 2.2;
};

ThreePBR.prototype.get_normal_map = function(){
	return this.normal_map;
};

ThreePBR.prototype.get_roughness_map = function(){
	return this.roughness_map;
};

ThreePBR.prototype.get_metallic_map = function(){
	return this.metallic_map;
};

ThreePBR.prototype.get_normal = function(){
	return this.normal;
};

ThreePBR.prototype.get_roughness = function(){
	return this.roughness;
};

ThreePBR.prototype.get_metallic = function(){
	return this.metallic;
};

ThreePBR.prototype.get_exposure = function(){
	return this.exposure;
};

ThreePBR.prototype.get_gamma = function(){
	return this.gamma;
};

export default ThreePBR