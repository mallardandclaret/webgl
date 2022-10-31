//import './style.css'
//import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'lil-gui'
//import * as CANNON from 'cannon-es'


//const gltfLoader = new THREE.GLTFLoader()
//gltfLoader.setDRACOLoader(dracoLoader)
//const cubeTextureLoader = new THREE.CubeTextureLoader()
// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
let scrollease = 1.8
let mscale = 0.65;
var plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 1));
let mixer = null
var Mallard = new THREE.Object3D;
var Claret = new THREE.Object3D;
var raycaster = new THREE.Raycaster();
var brraycaster = new THREE.Raycaster();
var blraycaster = new THREE.Raycaster();
var trraycaster = new THREE.Raycaster();
var corner = new THREE.Vector2();
var brcorner = new THREE.Vector2();
var blcorner = new THREE.Vector2();
var trcorner = new THREE.Vector2();
var cornerPoint = new THREE.Vector3(); 
var brcornerPoint = new THREE.Vector3();
var blcornerPoint = new THREE.Vector3();
var trcornerPoint = new THREE.Vector3();
//Physics
const world = new CANNON.World()
//world.broadphase = new CANNON.SAPBroadphase(world)
world.broadphase = new CANNON.NaiveBroadphase(world) // Detect coilliding objects
world.solver.iterations = 5; // collision detection sampling rate
var spherebody = new CANNON.Body()

const objectsToUpdate = []
//world.allowSleep = true
world.gravity.set(-1, -1, 1)
// Default material
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {friction: 10, restitution: 0.3}
)
world.defaultContactMaterial = defaultContactMaterial
//physics bodies
// physics ball
const sphereShape = new CANNON.Sphere(1)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 0, -4),
    shape: sphereShape
})
world.addBody(sphereBody)
//physics left wall
const leftwallshape = new CANNON.Box(new CANNON.Vec3(0.1 * 0.5, 30 * 0.5, 20 * 0.5))
const leftwallbody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(-10, 0, 0),
        shape: leftwallshape,
        material: defaultMaterial
    })
    //leftwallbody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0)
    world.addBody(leftwallbody)
//physics right wall
const rightwallshape = new CANNON.Box(new CANNON.Vec3(0.1 * 0.5, 30 * 0.5, 20 * 0.5))
const rightwallbody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(10, 0, 0),
        shape: rightwallshape,
        material: defaultMaterial
    })
    //leftwallbody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0)
    world.addBody(rightwallbody)  
//physics bottom wall
const bottomwallshape = new CANNON.Box(new CANNON.Vec3(60 * 0.5, 0.1 * 0.5, 20 * 0.5))
const bottomwallbody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, -10, 0),
        shape: bottomwallshape,
        material: defaultMaterial
    })
    //bottomwallbody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0)
world.addBody(bottomwallbody)
//physics top wall
const topwallshape = new CANNON.Box(new CANNON.Vec3(60 * 0.5, 0.1 * 0.5, 20 * 0.5))
const topwallbody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 10, 0),
        shape: topwallshape,
        material: defaultMaterial
    })
    //bottomwallbody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0)
world.addBody(topwallbody)
//physics Mallard
const mallardshape = new CANNON.Box(new CANNON.Vec3(60 * 0.5, 5 * 0.5, 2 * 0.5))
const mallardbody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, -5, 3),
        shape: mallardshape,
        material: defaultMaterial
    })
    mallardbody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0)
world.addBody(mallardbody)
//visible ball
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({color: 0xe54848})
)
scene.add(sphere)
//visible left wall    
var leftbox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 30, 20), 
new THREE.MeshBasicMaterial({color: "blue" , wireframe: false}));
scene.add(leftbox);
//visible right wall    
var rightbox = new THREE.Mesh(new THREE.BoxGeometry(0.1, 30, 20), 
new THREE.MeshBasicMaterial({color: "yellow" , wireframe: false}));
scene.add(rightbox);
//visible bottom wall
var bottombox = new THREE.Mesh(new THREE.BoxGeometry(60, 0.1, 20), 
new THREE.MeshBasicMaterial({color: "green", wireframe: false}));
scene.add(bottombox);
//visible top wall
var topbox = new THREE.Mesh(new THREE.BoxGeometry(60, 0.1, 20), 
new THREE.MeshBasicMaterial({color: "red", wireframe: false}));
scene.add(topbox);
//visible Mallard box
var mallardbox = new THREE.Mesh(new THREE.BoxGeometry(60, 5, 2),
new THREE.MeshBasicMaterial({color: "black", wireframe: true}));
scene.add(mallardbox);

//Load models
// init loader
const loader = new THREE.GLTFLoader()
// make async loader (look up load Async function and replace as its not needed maybe?)
const loadAsync = url => {
  return new Promise(resolve => {
    loader.load(url, gltf => {
      resolve(gltf)
    })
  })
}
// load both models in parallel
Promise.all([loadAsync("https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/Mallard.glb"), loadAsync("https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/3.0/&Claret.glb")]).then(models => {
  // get what you need from the models array
  Mallard = models[0].scene.children[0]
  Claret = models[1].scene.children[0]

  // add both models to the scene
  scene.add(Mallard)
  scene.add(Claret)
  
  Mallard.scale.set(windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale);
  Claret.scale.set(windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale);
  Mallard.visible = true;
  Claret.visible = true;
  corner.set(-1, 1); // NDC of the top-left corner
  raycaster.setFromCamera(corner, camera);
  raycaster.ray.intersectPlane(plane, cornerPoint);
  Mallard.position.copy(cornerPoint)
  .add(new THREE.Vector3( windowHalfX / windowHalfY / mscale / 1.4, - windowHalfX / windowHalfY / mscale / 1.4, 0));
  
  blcorner.set(-1, -1); // corner (across then down)
  blraycaster.setFromCamera(blcorner, camera);
  blraycaster.ray.intersectPlane(plane, blcornerPoint);
  Claret.position.copy(blcornerPoint)
  .add(new THREE.Vector3( windowHalfX / windowHalfY / mscale / 1.4, windowHalfX / windowHalfY / mscale / 1.4, 0));
         
  var sideMaterial = new THREE.MeshBasicMaterial({color: 0xefe3db});
  var faceMaterial = new THREE.MeshBasicMaterial({color: 0xe54848});
        
scene.traverse(child => {
if (child.material && child.material.name === 'SIDE') {
child.material = sideMaterial;
}
});

scene.traverse(child => {
if (child.material && child.material.name === 'FACE') {
child.material = faceMaterial;
}
});
  
gsap.registerPlugin(ScrollTrigger);

    gsap.to(Mallard.rotation, {
    scrollTrigger: {
    trigger: "#trigger1",
    start: "top top",
    end: "bottom top",
    scrub: scrollease,
    toggleActions: "restart pause resume pause"
  },
    x : Math.PI * 20,
  }); 
  
  gsap.to(Claret.rotation, {
    scrollTrigger: {
    trigger: "#trigger1",
    start: "top top",
    end: "bottom top",
    scrub: scrollease,
    toggleActions: "restart pause resume pause"
  },
    x : -Math.PI * 20,
  }); 
  
  }
) 

//set up of walls

//Bottom       
brcorner.set(1, -1); // corner
brraycaster.setFromCamera(brcorner, camera);
brraycaster.ray.intersectPlane(plane, brcornerPoint);
bottomwallbody.position.copy(brcornerPoint)
//.add(new THREE.Vector3(-15 , -1, -10)); // align the position of the box (width, height, depth (X,Y,Z))
//bottomwallbody.scale.set(15, 1, 10) //width, height, depth (X,Y,Z)//width, height, depth (X,Y,Z)
//Top 
trcorner.set(1, 1); // corner
trraycaster.setFromCamera(trcorner, camera);
trraycaster.ray.intersectPlane(plane, trcornerPoint);
topwallbody.position.copy(trcornerPoint)
//.add(new THREE.Vector3(-15, 1, -10)); // align the position of the box (width, height, depth (X,Y,Z))
//topwallbody.scale.set(15, 1, 10) //width, height, depth (X,Y,Z)
//Left
blcorner.set(-1, 1); // corner (across then down)
blraycaster.setFromCamera(blcorner, camera);
blraycaster.ray.intersectPlane(plane, blcornerPoint);
leftwallbody.position.copy(blcornerPoint);
//.add(new CANNON.Vec3(-1, -15, -10));  // align the position of the box (width, height, depth (X,Y,Z))
//leftwallbody.scale.set(1, 15, 10)
//Right
rightwallbody.position.copy(trcornerPoint)
//.add(new THREE.Vector3(1, -15, -10)); // align the position of the box (width, height, depth (X,Y,Z))
//rightbox.scale.set(1, 15, 10)


gsap.to(leftwallbody.position, {
scrollTrigger: {
trigger: "#trigger1",
start: "top top",
end: "bottom top",
scrub: scrollease,
toggleActions: "restart pause resume pause"
},
x : 5
}); 

gsap.to(bottomwallbody.position, {
scrollTrigger: {
trigger: "#trigger1",
start: "top top",
end: "bottom top",
scrub: scrollease,
toggleActions: "restart pause resume pause"
},
y : 5
}); 
/* 
gsap.to(mallardbody.quaternion, { 
scrollTrigger: {
trigger: "#trigger1",
start: "top top",
end: "bottom top",
scrub: scrollease,
toggleActions: "restart pause resume pause"
},
x : -1 * Math.Pi *10,
y : 0,
z : 0,
w : 0

}); 
*/

let MallardRotation = { val: 0 };
gsap.to( MallardRotation, { duration: 5, val: -5, repeat: -1, yoyo: true, ease: "power1.inOut", onUpdate: updateRotation })
function updateRotation() {
mallardbody.quaternion.setFromAxisAngle(
new CANNON.Vec3(1, 0, 0),
Math.PI * MallardRotation.val
)
}



//sizes
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const sizes = {
width: window.innerWidth,
height: window.innerHeight
        }

// Camera
var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, .1, 100);
camera.position.set(0, 0, 20);
scene.add(camera)
        // Controls
const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = false
controls.minDistance = 20;
controls.maxDistance = 20;
//Responsive code
window.addEventListener('resize', () => {
// Update sizes
sizes.width = window.innerWidth
sizes.height = window.innerHeight

windowHalfX = window.innerWidth / 2;
windowHalfY = window.innerHeight / 2;
            
window.Mallard.scale.set(windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale);
window.Claret.scale.set(windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale, windowHalfX / windowHalfY / mscale);
// Update camera
camera.aspect = sizes.width / sizes.height
camera.updateProjectionMatrix()
            // Update renderer
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))  
      
     corner.set(-1, 1); // NDC of the top-left corner
     raycaster.setFromCamera(corner, camera);
     raycaster.ray.intersectPlane(plane, cornerPoint);
     window.Mallard.position.copy(cornerPoint)
     .add(new THREE.Vector3( windowHalfX / windowHalfY / mscale / 1.4, - windowHalfX / windowHalfY / mscale / 1.4, 0));
  
     blcorner.set(-1, -1); // corner (across then down)
     blraycaster.setFromCamera(blcorner, camera);
     blraycaster.ray.intersectPlane(plane, blcornerPoint);
     window.Claret.position.copy(blcornerPoint)
     .add(new THREE.Vector3( windowHalfX / windowHalfY / mscale / 1.4, windowHalfX / windowHalfY / mscale / 1.4, 0));
     //Bottom       
     brcorner.set(1, -1); // corner
     brraycaster.setFromCamera(brcorner, camera);
     brraycaster.ray.intersectPlane(plane, brcornerPoint);
     bottomwallbody.position.copy(brcornerPoint)
     //.add(new THREE.Vector3(-15 , -1, -10)); // align the position of the box (width, height, depth (X,Y,Z))
     //bottombox.scale.set(15, 1, 10) //width, height, depth (X,Y,Z)
     //Top 
     trcorner.set(1, 1); // corner
     trraycaster.setFromCamera(trcorner, camera);
     trraycaster.ray.intersectPlane(plane, trcornerPoint);
     topwallbody.position.copy(trcornerPoint)
     //.add(new THREE.Vector3(-15, 1, -10)); // align the position of the box (width, height, depth (X,Y,Z))
     //topbox.scale.set(15, 1, 10) //width, height, depth (X,Y,Z)
     //Left
     blcorner.set(-1, 1); // corner (across then down)
     blraycaster.setFromCamera(blcorner, camera);
     blraycaster.ray.intersectPlane(plane, blcornerPoint);
     leftwallbody.position.copy(blcornerPoint);
     //.add(new CANNON.Vec3(-1, -15, -10));  // align the position of the box (width, height, depth (X,Y,Z))
     //leftwallbody.scale.set(1, 15, 10)
     //Right
     rightwallbody.position.copy(trcornerPoint)
     //.add(new THREE.Vector3(1, -15, -10)); // align the position of the box (width, height, depth (X,Y,Z))
     //rightbox.scale.set(1, 15, 10)
            }) 
//Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            //powerPreference: 'high-performance',
            antialias: true,
            alpha: true
        })
        //renderer.physicallyCorrectLights = true
        //renderer.outputEncoding = THREE.sRGBEncoding
        //renderer.toneMapping = THREE.ReinhardToneMapping
        //renderer.toneMappingExposure = 1
        //renderer.shadowMap.enabled = false
        //renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let oldElapsedTime = 0
animate = function() {
var delta = clock.getDelta();
const elapsedTime = clock.getElapsedTime()
const deltaTime = elapsedTime - oldElapsedTime
oldElapsedTime = elapsedTime
// Update physics
world.step(1 / 60, deltaTime, 3)
  //for(const object of objectsToUpdate)
    //{
      //  object.mesh.position.copy(object.body.position)
      //  object.mesh.quaternion.copy(object.body.quaternion)
   // }
sphere.position.copy(sphereBody.position)
leftbox.position.copy(leftwallbody.position)
bottombox.position.copy(bottomwallbody.position)
topbox.position.copy(topwallbody.position)
rightbox.position.copy(rightwallbody.position)
mallardbox.position.copy(mallardbody.position)
mallardbox.quaternion.copy(mallardbody.quaternion)
// Update controls
controls.update()
//camera.lookAt(scene.position);
renderer.render(scene, camera)
requestAnimationFrame(animate)

}
animate()