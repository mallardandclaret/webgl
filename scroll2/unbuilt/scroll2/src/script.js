import './style.css'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


console.clear();


/**
 * Loaders
 */
 var loader = new GLTFLoader()
 const cubeTextureLoader = new THREE.CubeTextureLoader()
 
 /**
  * Base
  */
 // Debug
 const gui = new dat.GUI()
 const debugObject = {}








//===================================================== canvas
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

 /**
 * Update all materials
 */
  const updateAllMaterials = () =>
  {
      scene.traverse((child) =>
      {
          if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
          {
              //child.material.envMap = environmentMap
              child.material.envMapIntensity = debugObject.envMapIntensity
              child.material.needsUpdate = true
              child.castShadow = true
              child.receiveShadow = true
          }
      })
  }
  
  /**
   * Environment map
   */
  const environmentMap = cubeTextureLoader.load([
      'textures/environmentMaps/3/px.jpg',
      'textures/environmentMaps/3/nx.jpg',
      'textures/environmentMaps/3/py.jpg',
      'textures/environmentMaps/3/ny.jpg',
      'textures/environmentMaps/3/pz.jpg',
      'textures/environmentMaps/3/nz.jpg'
  ])
  
  environmentMap.encoding = THREE.sRGBEncoding
  
  scene.background = environmentMap
  scene.environment = environmentMap
  
  debugObject.envMapIntensity = 2.5
  gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)




//===================================================== camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;
camera.position.y = 0;



/**
 * Lights
 */
 const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
 directionalLight.castShadow = true
 directionalLight.shadow.camera.far = 15
 directionalLight.shadow.mapSize.set(1024, 1024)
 directionalLight.shadow.normalBias = 0.05
 directionalLight.position.set(0.25, 3, - 2.25)
 scene.add(directionalLight)
 
 gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
 gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
 gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
 gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')




/**
 * Renderer
 */
/*  const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
}) */
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
//renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

gui
  .add(renderer, 'toneMapping', {
      No: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      Reinhard: THREE.ReinhardToneMapping,
      Cineon: THREE.CineonToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping
  })
  .onFinishChange(() =>
  {
      renderer.toneMapping = Number(renderer.toneMapping)
      updateAllMaterials()
  })
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)





//===================================================== resize
window.addEventListener("resize", function () {
  //let width = window.innerWidth;
  //let height = window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});



/* renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize( window.innerWidth, window.innerHeight );
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

} */


//===================================================== model
var mixer;
var model;


loader.load(
  'models/GAS9a.gltf',
  function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.material.side = THREE.DoubleSide;
      }
    });
    

    model = gltf.scene;
    model.scale.set(5, 5, 5);
    model.position.set(0, -10, 5);
    model.rotation.z += 0.3;
    model.rotation.x += 0.3;
    scene.add(model);


    mixer = new THREE.AnimationMixer(model);
    // mixer.clipAction(gltf.animations[1]).play();
    var action = mixer.clipAction(gltf.animations[0]);
    //action.clampWhenFinished = true;
    action.play();

    createAnimation(mixer, action, gltf.animations[0]);
  }
);

var clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);
  if (model) model.rotation.y += 0.01;

  renderer.render(scene, camera);
}

render();
gsap.registerPlugin(ScrollTrigger);

function createAnimation(mixer, action, clip) {
  let proxy = {
    get time() {
      return mixer.time;
    },
    set time(value) {
      action.paused = false;
      mixer.setTime(value);
      action.paused = true;
    }
  };

  let scrollingTL = gsap.timeline({
    scrollTrigger: {
      trigger: renderer.domElement,
      start: "top top",
      end: "+=500%",
      pin: true,
      scrub: true,
      onUpdate: function () {
        camera.updateProjectionMatrix();
      }
    }
  });

  scrollingTL.to(proxy, {
    time: clip.duration,
    repeat: 0
  });
}