import BaseItem from '../item'
import * as THREE from 'three'
import PBR from './pbr'
import SharedRenderer from './sharedrenderer'
import Shader from '../shaders/noiseblob/shader'


var ThreePointLight = function(){
	this.shadow_buffer = new THREE.WebGLRenderTarget( 2048., 2048. );
	this.shadow_buffer.depthBuffer = true;
	this.shadow_buffer.depthTexture = new THREE.DepthTexture();
    
	var _ratio = this.shadow_buffer.width / this.shadow_buffer.height;
	this.light = new THREE.PerspectiveCamera( 35., _ratio, .1, 1000. );

	this.light.position.set(new THREE.Vector3(3., 3., 3.))
	this.light.lookAt = new THREE.Vector3(0., 0., 0.);
};

ThreePointLight.prototype.ziggle = function(_frame){
	var _e = _frame*10.;
    var _n_loc = new THREE.Vector3(
        this.light.position.x * Math.sin(_e),
        this.light.position.y,
        this.light.position.z * Math.cos(_e)
    )
    
    this.light.position.copy(_n_loc);
    this.light.lookAt = new THREE.Vector3(0.,0.,0.);  

    this.light.updateProjectionMatrix(); 
};

ThreePointLight.prototype.get_light = function(){
	return this.light;
};

ThreePointLight.prototype.get_light_pos = function(){
	return this.light.position;
};

ThreePointLight.prototype.get_shadow_frame_buffer = function(){
	return this.shadow_buffer;
};

ThreePointLight.prototype.get_shadow_map = function(){
	return this.shadow_buffer.depthTexture;
};


ThreePointLight.prototype.set_light_pos = function(_val){
	this.light.position.copy(_val);
	this.light.updateProjectionMatrix();
};
 
ThreePointLight.prototype.set_light_lookat = function(_val){
	this.light.lookAt = _val;
	this.light.updateProjectionMatrix();
};

export default class NoiseBlob extends BaseItem {
    constructor(config) {
        super(config)
        this.camera = config.sceneConfig.camera
        this.is_init = false;
        this.show_hdr = true;
    
        this.renderer = new SharedRenderer(true, config.renderer)
        //this.audio_analyzer = _analyzer;
        this.light = new ThreePointLight();
    
        this.w = config.width;
        this.h = config.height;
        
        this.mesh = new THREE.Group();
        
        this.initTextures();
        this.initShaders();
        this.initScene();

        this.pbr = new PBR()
        this.set_PBR()
        
        this.frame = 0
        this.history = 0
        this.bass = 0
        this.mid = 0
        this.high = 0
        this.level = 0
        this.timer = 0.0

        this.addItem()
    }

    analyzeAudio = (audioBuffer) => {
        var _bass = 0., _mid = 0., _high = 0.;
        if(audioBuffer.length > 10) {
            if(!this.is_pulse){            
                var _pass_size = audioBuffer.length/3.;
                for(var i = 0; i < audioBuffer.length; i++){
                    var _val = Math.pow(audioBuffer[i] / 128, 2.);
    
                    if(i < _pass_size)
                        _bass += _val;
                    else if(i >= _pass_size && i < _pass_size*2)
                        _mid += _val;
                    else if(i >= _pass_size*2)
                        _high += _val;  
                }
    
                _bass /= _pass_size;
                _mid /= _pass_size;
                _high /= _pass_size;
            } else {
                if(this.frame % 40 === (Math.floor (Math.random() * 40.))){
                    _bass = Math.random();
                    _mid = Math.random();
                    _high = Math.random();
                }
            }
    
            this.bass = this.bass > _bass ? this.bass * .96 : _bass;
            this.mid = this.mid > _mid ? this.mid * .96 : _mid;
            this.high = this.high > _high ? this.high * .96 : _high;
    
            this.level = (this.bass + this.mid + this.high)/3.;
    
            this.history += this.level * .01 + .005; 
            this.frame++;
        }
    }

    animate = (time, audioData) => {
        this.analyzeAudio(audioData.bins)
        this.updatePBR()
        this.update(time)

        this.pbr.exposure = 5. + 30. * this.level;
    }

    update = (time) => {
        var _shdrs = [
            this.shdr_mesh, 
            this.shdr_wire, 
            this.shdr_points, 
            this.shdr_pop_points, 
            this.shdr_pop_wire, 
            this.shdr_pop_points_out, 
            this.shdr_pop_wire_out, 
            this.shdr_shadow
        ];

        var _shdrs_size = _shdrs.length;
        for(var i = 0; i < _shdrs_size; i++){
            _shdrs[i].uniforms.u_is_init.value = this.is_init;
            _shdrs[i].uniforms.u_t.value = this.timer;
            
            _shdrs[i].uniforms.u_audio_high.value = this.high;
            _shdrs[i].uniforms.u_audio_mid.value = this.mid;
            _shdrs[i].uniforms.u_audio_bass.value = this.bass;
            _shdrs[i].uniforms.u_audio_level.value = this.level;
            _shdrs[i].uniforms.u_audio_history.value = this.history;
        }
    
        this.updateShadowMap();
    
        //var _cam = this.renderer.get_camera();
        //this.renderer.renderer.render( this.scene, _cam);
    
        if(!this.is_init){ 
            this.is_init = true;
    
            console.log("NoiseBlob : is initiated");
        }
    
        this.timer += 0.001
    }

    updateShadowMap = () => {
        var _shadow_cam = this.light.get_light();
        var _shdow_fbo = this.light.get_shadow_frame_buffer();
    
        this.renderer.renderer.render(this.shadow_scene, _shadow_cam, _shdow_fbo);
    
        var _light_pos = this.light.get_light_pos();
        _light_pos.applyMatrix4(this.camera.modelViewMatrix);
        
        var _shadow_matrix = new THREE.Matrix4();
        _shadow_matrix.identity();
        _shadow_matrix.multiplyMatrices ( 
            this.light.get_light().projectionMatrix, 
            this.light.get_light().modelViewMatrix 
        );
    
        this.shdr_mesh.uniforms.u_light_pos.value = _light_pos;
        this.shdr_mesh.uniforms.u_shadow_matrix.value = _shadow_matrix;
        this.shdr_mesh.uniforms.u_shadow_map.value = this.light.get_shadow_map();
    }

    initShaders = () => {
        var screen_res = 'vec2( ' + this.w.toFixed( 1 ) +', ' + this.h.toFixed( 1 ) + ')';
    
        function load(_vert, _frag){
            return new THREE.ShaderMaterial( 
            { 
                defines: {
                    SCREEN_RES: screen_res
                },
                uniforms: {
                    u_t: {value: 0},
                    u_is_init: {value: false},
                    u_audio_high: {value: 0.},
                    u_audio_mid: {value: 0.},
                    u_audio_bass: {value: 0.},
                    u_audio_level: {value: 0.},
                    u_audio_history: {value: 0.}
                },
                vertexShader:   _vert,
                fragmentShader: _frag
            });
        };


        // scene shdr
        this.shdr_mesh = load(Shader.vertexShader, Shader.fragmentShader);
        this.shdr_wire = load(Shader.vertexShader, Shader.fragmentShader);
        this.shdr_points = load(Shader.vertexShader, Shader.fragmentShader);
        this.shdr_shadow = load(Shader.vertexShader, Shader.fragmentShader);
        this.shdr_pop_points = load(Shader.vertexShader, Shader.fragmentShader);
        this.shdr_pop_wire = load(Shader.vertexShader, Shader.fragmentShader);
        this.shdr_pop_points_out = load(Shader.vertexShader, Shader.fragmentShader);
        this.shdr_pop_wire_out = load(Shader.vertexShader, Shader.fragmentShader);
        
        this.shdr_mesh.extensions.derivatives = true;

        this.shdr_mesh.defines.IS_MESH = 'true';
        this.shdr_mesh.defines.HAS_SHADOW = 'true';
        this.shdr_wire.defines.IS_WIRE = 'true';
        this.shdr_points.defines.IS_POINTS = 'true';
        this.shdr_shadow.defines.IS_SHADOW = 'true';
        
        this.shdr_pop_points.defines.IS_POINTS = 'true';
        this.shdr_pop_points.defines.IS_POP = 'true';
        this.shdr_pop_wire.defines.IS_WIRE = 'true';
        this.shdr_pop_wire.defines.IS_POP = 'true';
        this.shdr_pop_points_out.defines.IS_POINTS = 'true';
        this.shdr_pop_points_out.defines.IS_POP_OUT = 'true';
        this.shdr_pop_wire_out.defines.IS_WIRE = 'true';
        this.shdr_pop_wire_out.defines.IS_POP_OUT = 'true';


        var _light_pos = this.light.get_light_pos();
        _light_pos.applyMatrix4(this.camera.modelViewMatrix);
        
        var _shadow_matrix = new THREE.Matrix4();
        _shadow_matrix.identity();
        _shadow_matrix.multiplyMatrices ( 
            this.light.get_light().projectionMatrix, 
            this.light.get_light().modelViewMatrix 
        );

        this.shdr_mesh.uniforms.u_light_pos = {value: _light_pos};
        this.shdr_mesh.uniforms.u_shadow_matrix = {value: _shadow_matrix};
        this.shdr_mesh.uniforms.u_shadow_map = {value: this.light.get_shadow_map()};
        this.shdr_mesh.uniforms.u_debug_shadow = {value: false};
        this.shdr_points.uniforms.tex_sprite = {value: this.tex_sprite};
        this.shdr_pop_points.uniforms.tex_sprite = {value: this.tex_sprite};
        this.shdr_pop_wire.uniforms.tex_sprite = {value: this.tex_sprite};
        this.shdr_pop_points_out.uniforms.tex_sprite = {value: this.tex_sprite};
        this.shdr_pop_wire_out.uniforms.tex_sprite = {value: this.tex_sprite};
        
        this.shdr_points.blending = THREE.AdditiveBlending;
        this.shdr_wire.blending = THREE.AdditiveBlending;
        this.shdr_pop_points.blending = THREE.AdditiveBlending;
        this.shdr_pop_wire.blending = THREE.AdditiveBlending;
        this.shdr_pop_points_out.blending = THREE.AdditiveBlending;
        this.shdr_pop_wire_out.blending = THREE.AdditiveBlending;
        
        this.shdr_wire.transparent = true;
        this.shdr_points.transparent = true;
        this.shdr_pop_points.transparent = true;
        this.shdr_pop_wire.transparent = true;
        this.shdr_pop_points_out.transparent = true;
        this.shdr_pop_wire_out.transparent = true;


        this.shdr_wire.depthTest = false;
        this.shdr_points.depthTest = false;
        this.shdr_pop_points.depthTest = false;
        this.shdr_pop_wire.depthTest = false;
        this.shdr_pop_points_out.depthTest = false;
        this.shdr_pop_wire_out.depthTest = false;
    }

    initTextures = () => {
        this.tex_sprite = new THREE.TextureLoader().load( "img/sprite_additive_rect.png" );
        this.tex_sprite.wrapS = THREE.ClampToEdgeWrapping;
        this.tex_sprite.wrapT = THREE.ClampToEdgeWrapping;
        this.tex_sprite.magFilter = THREE.LinearFilter;
        this.tex_sprite.minFilter = THREE.LinearFilter;
    }

    initScene = () => {
        var _sphere_size = 20;
        var _geom = new THREE.SphereBufferGeometry(_sphere_size, 128, 128);
        var _geom_lowres = new THREE.SphereBufferGeometry(_sphere_size, 64, 64);

       
        this.shadow_scene = new THREE.Scene();

        var _mesh = new THREE.Mesh(_geom, this.shdr_mesh);
        var _wire = new THREE.Line(_geom_lowres, this.shdr_wire);
        var _points = new THREE.Points(_geom, this.shdr_points);
        var _shadow_mesh = new THREE.Mesh(_geom, this.shdr_shadow);

        var _pop_points = new THREE.Points(_geom_lowres, this.shdr_pop_points);
        var _pop_wire = new THREE.Line(_geom_lowres, this.shdr_pop_wire);

        var _pop_points_out = new THREE.Points(_geom_lowres, this.shdr_pop_points_out);
        var _pop_wire_out = new THREE.Line(_geom_lowres, this.shdr_pop_wire_out);
        
        
        this.mesh.add(_mesh);
        this.mesh.add(_wire);
        this.mesh.add(_points);

        this.mesh.add(_pop_points);
        this.mesh.add(_pop_wire);
        this.mesh.add(_pop_points_out);
        this.mesh.add(_pop_wire_out);

        this.mesh.position.set(0,0,-40)

        this.shadow_scene.add(_shadow_mesh);
    }

    setRetina = () => {
        this.w *= .5;
        this.h *= .5;
    }

    set_PBR = () => {
    
        this.shdr_mesh.uniforms.tex_normal = {value: this.pbr.get_normal_map()};
        this.shdr_mesh.uniforms.tex_roughness = {value: this.pbr.get_roughness_map()};
        this.shdr_mesh.uniforms.tex_metallic = {value: this.pbr.get_metallic_map()};
        
        this.shdr_mesh.uniforms.u_normal = { value: this.pbr.get_normal() };
        this.shdr_mesh.uniforms.u_roughness = { value: this.pbr.get_roughness() };
        this.shdr_mesh.uniforms.u_metallic = { value: this.pbr.get_metallic() };
        
        this.shdr_mesh.uniforms.u_exposure = {value: this.pbr.get_exposure()};
        this.shdr_mesh.uniforms.u_gamma = {value: this.pbr.get_gamma()};
    
        this.shdr_mesh.uniforms.u_view_matrix_inverse = {value: this.camera.matrixWorldInverse};
        this.shdr_mesh.defines.IS_PBR = 'true';
    };

    updatePBR = () => {
        this.shdr_mesh.uniforms.u_normal.value = this.pbr.get_normal();
        this.shdr_mesh.uniforms.u_roughness.value = this.pbr.get_roughness();
        this.shdr_mesh.uniforms.u_metallic.value = this.pbr.get_metallic();
        
        this.shdr_mesh.uniforms.u_exposure.value = this.pbr.get_exposure();
        this.shdr_mesh.uniforms.u_gamma.value = this.pbr.get_gamma();
    
        this.shdr_mesh.uniforms.u_view_matrix_inverse.value = this.camera.matrixWorldInverse;
    }
}
