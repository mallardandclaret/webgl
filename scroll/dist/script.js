

console.clear();



//===================================================== canvas
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

//===================================================== camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;
camera.position.y = 0;


//===================================================== lights
var light = new THREE.DirectionalLight(0xefefff, 10);
light.position.set(3, 3, 3).normalize();
scene.add(light);
var light = new THREE.DirectionalLight(0xffefef, 10);
light.position.set(-8, 0, 0).normalize();
scene.add(light);


// Loaders

const cubeTextureLoader = new THREE.CubeTextureLoader()
const gltfLoader = new GLTFLoader()
//const debugObject = {}



//debugObject.envMapIntensity = 2.5
//gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)






//===================================================== resize
window.addEventListener("resize", function () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//===================================================== model
var loader = new THREE.GLTFLoader();
var mixer;
var model;


loader.load(
  "mod/GAS18.gltf",
  function (gltf) {
    gltf.scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
        node.material.side = THREE.DoubleSide;
      }
    });
    

    model = gltf.scene;
    model.scale.set(0.3, 0.3, 0.3);
    scene.add(model);


    mixer = new THREE.AnimationMixer(model);
    // mixer.clipAction(gltf.animations[1]).play();
    var action = mixer.clipAction(gltf.animations[1]);
    action.play();

    createAnimation(mixer, action, gltf.animations[1]);
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