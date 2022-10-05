/**
 * Loaders
 */
 const gltfLoader = new THREE.GLTFLoader()
 const cubeTextureLoader = new THREE.CubeTextureLoader()
 
 /**
  * Base
  */
 // Debug
 //const gui = new dat.GUI()
 //const debugObject = {}
 
 
 console.clear();
 
 
 
 
 // Canvas
 const canvas = document.querySelector('canvas.webgl')
 
 // Scene
 const scene = new THREE.Scene()
 
 /**
  * Update all materials
  */
 const updateAllMaterials = () =>
 {
     scene.traverse((child) =>
     {
         if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
         {
             child.material.envMap = environmentMap
             //child.material.envMapIntensity = debugObject.envMapIntensity
             child.castShadow = true
             child.receiveShadow = true
         }
     })
 }
 
 /**
  * Environment map
  */
 const environmentMap = cubeTextureLoader.load([
 "https://uploads-ssl.webflow.com/623770397994e0c22341c167/626e910bd608a4fdc6a05c0a_Kback.jpg",
 "https://uploads-ssl.webflow.com/623770397994e0c22341c167/626e910bd608a4fdc6a05c0a_Kback.jpg",
 "https://uploads-ssl.webflow.com/623770397994e0c22341c167/626e910bd608a4fdc6a05c0a_Kback.jpg",
 "https://uploads-ssl.webflow.com/623770397994e0c22341c167/626e910bd608a4fdc6a05c0a_Kback.jpg",
 "https://uploads-ssl.webflow.com/623770397994e0c22341c167/626e910bd608a4fdc6a05c0a_Kback.jpg",
 "https://uploads-ssl.webflow.com/623770397994e0c22341c167/626e910bd608a4fdc6a05c0a_Kback.jpg"
 ])
 
 environmentMap.encoding = THREE.sRGBEncoding
 
 scene.background = environmentMap
 scene.environment = environmentMap
 
 //debugObject.envMapIntensity = 2.5
 //gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
 
 /**
  * Models
  */
 gltfLoader.load(
     "https://raw.githubusercontent.com/mallardandclaret/webgl/staging/scroll2/models/YokologoEn.glb",
     (gltf) =>
     {
         gltf.scene.scale.set(1, 1, 1)
         gltf.scene.position.set(0, - 4, -20)
         //gltf.scene.rotation.y = Math.PI * 0.5
         scene.add(gltf.scene)
 
         //gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')
 
         updateAllMaterials()
     }
 )
 
 // gltfLoader.load(
 //     '/models/hamburger.glb',
 //     (gltf) =>
 //     {
 //         gltf.scene.scale.set(0.3, 0.3, 0.3)
 //         gltf.scene.position.set(0, - 1, 0)
 //         scene.add(gltf.scene)
 
 //         updateAllMaterials()
 //     }
 // )
 
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
 
 //gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
 //gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
 //gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
 //gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
 
 /**
  * Sizes
  */
 const sizes = {
     width: window.innerWidth,
     height: window.innerHeight
 }
 
 window.addEventListener('resize', () =>
 {
     // Update sizes
     sizes.width = window.innerWidth
     sizes.height = window.innerHeight
 
     // Update camera
     camera.aspect = sizes.width / sizes.height
     camera.updateProjectionMatrix()
 
     // Update renderer
     renderer.setSize(sizes.width, sizes.height)
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 })
 
 /**
  * Camera
  */
 // Base camera
 const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
 camera.position.set(4, 1, - 4)
 scene.add(camera)
 
 // Controls
 const controls = new THREE.OrbitControls(camera,canvas)
 controls.enableDamping = true
 
 /**
  * Renderer
  */
 const renderer = new THREE.WebGLRenderer({
     canvas: canvas,
     antialias: true
 })
 renderer.physicallyCorrectLights = true
 renderer.outputEncoding = THREE.sRGBEncoding
 renderer.toneMapping = THREE.ReinhardToneMapping
 renderer.toneMappingExposure = 3
 renderer.shadowMap.enabled = true
 renderer.shadowMap.type = THREE.PCFSoftShadowMap
 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
 
 /* gui
     .add(renderer, 'toneMapping', {
         No: THREE.NoToneMapping,
         Linear: THREE.LinearToneMapping,
         Reinhard: THREE.ReinhardToneMapping,
         Cineon: THREE.CineonToneMapping,
         ACESFilmic: THREE.ACESFilmicToneMapping
     })
 gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
  */
 /**
  * Animate
  */
 const tick = () =>
 {
     // Update controls
     controls.update()
 
     // Render
     renderer.render(scene, camera)
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()