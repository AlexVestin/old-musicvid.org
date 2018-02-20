


import '../scss/main.scss';
import initCanvas from './canvas'
import handleResize from "./handleresize"
import Sound from './sound'
window.onload = () =>{
    handleResize();

    
    var sound
    var scene, camera, mesh, geometry, material, renderer
    var canvas, chunks = [], canvasStream;
    let rec, scale = 1, prevScale = 1
    let recording = false
          
    let animate = () => {
        requestAnimationFrame( animate );
        if(scale !== prevScale)
            mesh.scale.set(scale, scale, scale)
            
        mesh.rotation.y += 0.02;
        renderer.render( scene, camera );
        prevScale = scale
    }

    let toggleRecord = ()  =>{
        if(!recording){
            record(new MediaStream())
            .then(recording => {
                let link = document.getElementById("link")
                link.href = URL.createObjectURL(new Blob(recording));
                link.download = "recording.webm";
                link.innerHTML = "Download recording";
            })
            recording = true
            sound.play()
            
        }else{
            stopRecording()
            recording = false
            sound.play()
        }
    }

    let stopRecording = () => {
        rec.stop()
    }

    let record = (stream) => {

      let data = []
        canvasStream = canvas.captureStream(30);
        canvasStream.addTrack(sound.stream.getAudioTracks()[0])
        rec = new MediaRecorder(canvasStream)
        rec.ondataavailable = e => e.data.size && data.push(e.data);
        rec.start();

        var stopped = new Promise((y, n) =>(rec.onstop = y, rec.onerror = e => n(e.error || e.name)));
        return Promise.all([stopped]).then(() => data);
    };


    function init(){
        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        camera.position.z = 1;
        scene = new THREE.Scene();
        geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        canvas = document.getElementById("canvas");
        canvas.width = 1080;
        canvas.height = 720;
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
        mesh.rotation.x += 0.3

        canvas.onclick =  toggleRecord
        sound = new Sound("./assets/brejcha.mp3")
        animate();
    }

    init();
}