<script type="module">

			


const settings = {
metalness: 1.0,
roughness: 0.1,
//ambientIntensity: 0.2,
//aoMapIntensity: 1.0,
envMapIntensity: 1.0,
//displacementScale: 0.1, // from original model
normalScale: 1
};


function initGui() {
const gui = new GUI();
//let gui = gui.addFolder( "Material" );
gui.add( settings, 'metalness' ).min( 0 ).max( 1 ).onChange( function ( value ) {
material.metalness = value;
} );
gui.add( settings, 'roughness' ).min( 0 ).max( 1 ).onChange( function ( value ) {
material.roughness = value;
} );
gui.add( settings, 'aoMapIntensity' ).min( 0 ).max( 1 ).onChange( function ( value ) {
material.aoMapIntensity = value;
} );
gui.add( settings, 'ambientIntensity' ).min( 0 ).max( 1 ).onChange( function ( value ) {
ambientLight.intensity = value;
} );
gui.add( settings, 'envMapIntensity' ).min( 0 ).max( 3 ).onChange( function ( value ) {
clothMaterial.envMapIntensity = value;
} );
gui.add( settings, 'normalScale' ).min( - 1 ).max( 1 ).onChange( function ( value ) {
material.normalScale.set( 1, - 1 ).multiplyScalar( value );
} );
gui.add( settings, 'displacementScale' ).min( 0 ).max( 3.0 ).onChange( function ( value ) {
material.displacementScale = value;
} );

} */


			/**
			 * 
			 * 
            * Loaders
            */
            //var loader = new GLTFLoader()
            const cubeTextureLoader = new THREE.CubeTextureLoader()
            
            /**
             * Base
             */
            // Debug
            //const gui = new dat.GUI()
            //const debugObject = {}



			// Graphics variables
			let container, stats;
			let camera, controls, scene, renderer;
			let textureLoader;
			const clock = new THREE.Clock();

			// Physics variables
			const gravityConstant = -9.8;
			let physicsWorld;
			const rigidBodies = [];
			const margin = 0.05;
			let hinge;
			let cloth;
			let transformAux1;
			let light;

			let armMovement = 0;

			Ammo().then( function ( AmmoLib ) {

				Ammo = AmmoLib;

				init();
				animate();

			} );


			function init() {

				initGraphics();

				initPhysics();

				createObjects();

				initInput();

			}


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
                 'textures/environmentMaps/3H/px.jpg',
                 'textures/environmentMaps/3H/nx.jpg',
                 'textures/environmentMaps/3H/py.jpg',
                 'textures/environmentMaps/3H/ny.jpg',
                 'textures/environmentMaps/3H/pz.jpg',
                 'textures/environmentMaps/3H/nz.jpg'
             ])
             
             environmentMap.encoding = THREE.sRGBEncoding
			 envMapIntensity = 3
             
             
             
             //debugObject.envMapIntensity = 2.5
             //gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials)
        






			function initGraphics() {

				container = document.getElementById( 'container' );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

				scene = new THREE.Scene();
				//scene.background = new THREE.Color( 0xbfd1e5 );

				camera.position.set( - 20, 2, -5 );
				//camera.lookAt(new THREE.Vector3(0, 2, -5));

				scene.background = environmentMap
                scene.environment = environmentMap

				renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.shadowMap.enabled = true;
				
				renderer.physicallyCorrectLights = true
                renderer.outputEncoding = THREE.sRGBEncoding
                renderer.toneMapping = THREE.ReinhardToneMapping
                renderer.toneMappingExposure = 3
                
                renderer.shadowMap.type = THREE.PCFSoftShadowMap

				container.appendChild( renderer.domElement );


				controls = new OrbitControls( camera, renderer.domElement );
				controls.target.set( 0, 2, -5 );
				controls.enableDamping = true;
				//controls.dampingFactor = 0.5;
				controls.enableZoom = false;
				controls.update();

				textureLoader = new THREE.TextureLoader();

				//const ambientLight = new THREE.AmbientLight( 0xffffff );
				//scene.add( ambientLight );

				light = new THREE.DirectionalLight( 0xffffff, 1 );
				light.position.set( - 7, 10, 15 );
				light.castShadow = true;
				const d = 10;
				light.shadow.camera.left = - d;
				light.shadow.camera.right = d;
				light.shadow.camera.top = d;
				light.shadow.camera.bottom = - d;

				light.shadow.camera.near = 2;
				light.shadow.camera.far = 50;

				light.shadow.mapSize.x = 1024;
				light.shadow.mapSize.y = 1024;

				light.shadow.bias = - 0.003;
				scene.add( light );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				window.addEventListener( 'resize', onWindowResize );

			}



           
			








			function initPhysics() {

				// Physics configuration

				const collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
				const dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
				const broadphase = new Ammo.btDbvtBroadphase();
				const solver = new Ammo.btSequentialImpulseConstraintSolver();
				const softBodySolver = new Ammo.btDefaultSoftBodySolver();
				physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
				physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
				physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );

				transformAux1 = new Ammo.btTransform();

			}

			function createObjects() {

				const pos = new THREE.Vector3();
				const quat = new THREE.Quaternion();

				// Ground
				pos.set( 0, - 0.5, 0 );
				quat.set( 0, 0, 0, 1 );
				const ground = createParalellepiped( 60, 1, 60, 0, pos, quat, new THREE.MeshStandardMaterial( { color: 0xFFFFFF, visible: false } ) );
				ground.castShadow = true;
				ground.receiveShadow = true;
				ground.visable = false;
				textureLoader.load( 'textures/grid.png', function ( texture ) {

					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.repeat.set( 40, 40 );
					ground.material.map = texture;
					ground.material.needsUpdate = true;

	} );

				// Wall
				const brickMass = 5;
				const brickLength = 1.2;
				const brickDepth = 0.6;
				const brickHeight = brickLength * 0.5;
				const numBricksLength = 20;
				const numBricksHeight = 8;
				const z0 = - numBricksLength * brickLength * 0.5;
				pos.set( 0, brickHeight * 0.5, z0 );
				quat.set( 0, 0, 0, 1 );
				for ( let j = 0; j < numBricksHeight; j ++ ) {

					const oddRow = ( j % 2 ) == 1;

					pos.z = z0;

					if ( oddRow ) {

						pos.z -= 0.25 * brickLength;

					}

					const nRow = oddRow ? numBricksLength + 1 : numBricksLength;

					for ( let i = 0; i < nRow; i ++ ) {

						let brickLengthCurrent = brickLength;
						let brickMassCurrent = brickMass;

						if ( oddRow && ( i == 0 || i == nRow - 1 ) ) {

							brickLengthCurrent *= 0.5;
							brickMassCurrent *= 0.5;

						}

						const brick = createParalellepiped( brickDepth, brickHeight, brickLengthCurrent, brickMassCurrent, pos, quat, createMaterial() );
						brick.castShadow = false;
						brick.receiveShadow = false;
						//brick.visible = false;

						if ( oddRow && ( i == 0 || i == nRow - 2 ) ) {

							pos.z += 0.75 * brickLength;

						} else {

							pos.z += brickLength;

						}

					}

					pos.y += brickHeight;

				}
                
				const testblock = createParalellepiped( 5, 5, 5, 5, 1, 1, new THREE.MeshStandardMaterial( { color: 0xFFFFFF, metalness: 0.9, roughness: 0.1 } ) );
				testblock.castShadow = false;
				testblock.receiveShadow = false;




				const normalMap = textureLoader.load( 'textures/foil6.jpg' );
                //const aoMap = textureLoader.load( 'models/obj/ninja/ao.jpg' );
                //const displacementMap = textureLoader.load( 'textures/golfball.jpg' );


				// The cloth
				// Cloth graphic object
				const clothWidth = 20;
				const clothHeight = 10;
				const clothNumSegmentsZ = clothWidth * 5;
				const clothNumSegmentsY = clothHeight * 5;
				const clothPos = new THREE.Vector3( - 3, 3, 2 );

				const clothGeometry = new THREE.PlaneGeometry( clothWidth, clothHeight, clothNumSegmentsZ, clothNumSegmentsY );
				clothGeometry.rotateZ( Math.PI * 0.5 );
				clothGeometry.translate( clothPos.x, clothPos.y + clothHeight * 0.5, clothPos.z - clothWidth * 0.5 );

				const clothMaterial = new THREE.MeshStandardMaterial( { 
				color: 0xFFFFFF, 
			    roughness: settings.roughness,
                metalness: settings.metalness,
                normalMap: normalMap,
                normalScale: new THREE.Vector2( 1, - 1 ), // why does the normal map require negation in this case?
                //aoMap: aoMap,
                //aoMapIntensity: 1,
                //displacementMap: displacementMap,
                //displacementScale: settings.displacementScale,
                //displacementBias: - 0.428408, // from original model
                //envMap: reflectionCube,
                envMapIntensity: settings.envMapIntensity, 
				side: THREE.DoubleSide } );
				cloth = new THREE.Mesh( clothGeometry, clothMaterial );
				cloth.castShadow = false;
				cloth.receiveShadow = false;
				scene.add( cloth );
				normalMap.wrapS = THREE.RepeatWrapping;
				normalMap.wrapT = THREE.RepeatWrapping;
				normalMap.repeat.set( clothNumSegmentsZ / 10, clothNumSegmentsY / 10 );
				cloth.material.map = normalMap;
				cloth.material.needsUpdate = true;
				/* textureLoader.load( 'textures/grid.png', function ( texture ) {

					texture.wrapS = THREE.RepeatWrapping;
					texture.wrapT = THREE.RepeatWrapping;
					texture.repeat.set( clothNumSegmentsZ, clothNumSegmentsY );
					cloth.material.map = texture;
					cloth.material.needsUpdate = true;

				}  );  */  

				// Cloth physic object
				const softBodyHelpers = new Ammo.btSoftBodyHelpers();
				const clothCorner00 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z );
				const clothCorner01 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z - clothWidth );
				const clothCorner10 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z );
				const clothCorner11 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z - clothWidth );
				const clothSoftBody = softBodyHelpers.CreatePatch( physicsWorld.getWorldInfo(), clothCorner00, clothCorner01, clothCorner10, clothCorner11, clothNumSegmentsZ + 1, clothNumSegmentsY + 1, 0, true );
				const sbConfig = clothSoftBody.get_m_cfg();
				sbConfig.set_viterations( 20 );
				sbConfig.set_piterations( 20 );

				clothSoftBody.setTotalMass( 10, false );
				Ammo.castObject( clothSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin * 3 );
				physicsWorld.addSoftBody( clothSoftBody, 1, - 1 );
				cloth.userData.physicsBody = clothSoftBody;
				// Disable deactivation
				clothSoftBody.setActivationState( 4 );

				// The base
				const armMass = 2;
				const armLength = 3 + clothWidth;
				const pylonHeight = clothPos.y + clothHeight;
				const baseMaterial = new THREE.MeshPhongMaterial( { color: 0x606060 } );
				pos.set( clothPos.x, 0.1, clothPos.z - armLength );
				quat.set( 0, 0, 0, 1 );
				const base = createParalellepiped( 1, 0.2, 1, 0, pos, quat, baseMaterial );
				base.castShadow = false;
				base.receiveShadow = false;
				pos.set( clothPos.x, 0.5 * pylonHeight, clothPos.z - armLength );
				const pylon = createParalellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
				pylon.castShadow = false;
				pylon.receiveShadow = false;
				pos.set( clothPos.x, pylonHeight + 0.2, clothPos.z - 0.5 * armLength );
				const arm = createParalellepiped( 0.4, 0.4, armLength + 0.4, armMass, pos, quat, baseMaterial );
				arm.castShadow = false;
				arm.receiveShadow = false; 
				arm.visible = false;
				pylon.visible = false;
				base.visible = false;

				// Glue the cloth to the arm
				const influence = 0.1;
				clothSoftBody.appendAnchor( 0, arm.userData.physicsBody, false, influence );
				clothSoftBody.appendAnchor( clothNumSegmentsZ, arm.userData.physicsBody, false, influence );

				// Hinge constraint to move the arm
				const pivotA = new Ammo.btVector3( 0, pylonHeight * 0.5, 0 );
				const pivotB = new Ammo.btVector3( 0, - 0.2, - armLength * 0.5 );
				const axis = new Ammo.btVector3( 0, 1, 0 );
				hinge = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true );
				physicsWorld.addConstraint( hinge, true );

			}

			function createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {

				const threeObject = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
				const shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
				shape.setMargin( margin );

				createRigidBody( threeObject, shape, mass, pos, quat );

				return threeObject;

			}

			function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {

				threeObject.position.copy( pos );
				threeObject.quaternion.copy( quat );

				const transform = new Ammo.btTransform();
				transform.setIdentity();
				transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
				transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
				const motionState = new Ammo.btDefaultMotionState( transform );

				const localInertia = new Ammo.btVector3( 0, 0, 0 );
				physicsShape.calculateLocalInertia( mass, localInertia );

				const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
				const body = new Ammo.btRigidBody( rbInfo );

				threeObject.userData.physicsBody = body;

				scene.add( threeObject );

				if ( mass > 0 ) {

					rigidBodies.push( threeObject );

					// Disable deactivation
					body.setActivationState( 4 );

				}

				physicsWorld.addRigidBody( body );

			}

			function createRandomColor() {

				return Math.floor( Math.random() * ( 1 << 1 ) );

			}

			function createMaterial() {

				return new THREE.MeshStandardMaterial( { color: createRandomColor() } );

			}

			// Moving the cloth



            // Mouse position attempt 

			let targetX = 10
            let targetY = 10

        calcTarget = function(event){
            targetX = (event.clientX - windowHalfX) * .014;
            targetY = (event.clientY) * .009;
        }


        /* controls.enabled = false;

        tick = function() {
            if(document.querySelectorAll("canvas.webgl").length > 0){
                tarXNegCamPosX = targetX - camera.position.x
                tarYNegCamPosY = targetY - camera.position.y
    
                if ((Math.abs(tarXNegCamPosX) > .2) || (Math.abs(tarYNegCamPosY) > .2)) {
    
                    camera.position.x += .06 * (tarXNegCamPosX);
                    camera.position.y += .06 * (tarYNegCamPosY);
    
                    directionalLight.position.x += .06 * (targetX - directionalLight.position.x); */






			
            function initInput() {

			window.addEventListener("mousewheel", function(event){
            if(event.wheelDelta >= 0){
			physicsWorld.setGravity( new Ammo.btVector3( 0, 0, 0 ) );
			physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, 0, 0 ) );
            console.log("up")
            }else{
			physicsWorld.setGravity( new Ammo.btVector3( 0, -9.8, 0 ) );
			physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, -9.8, 0 ) );	
            console.log("down")
            }
            })

			//armMovement = targetX;
			//light.position.x += .06 * (targetX - light.position.x);


            window.addEventListener( 'keydown', function ( event ) {
            switch ( event.keyCode ) {

			// G
			case 71:
            physicsWorld.setGravity( new Ammo.btVector3( 0, 0, 0 ) );
			physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, 0, 0 ) );
            break;
			// H
			case 72:
            physicsWorld.setGravity( new Ammo.btVector3( 0, -9.8, 0 ) );
			physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, -9.8, 0 ) );
            break;
            // Q
            case 81:
            armMovement = 1;
            break;
            // A
            case 65:
            armMovement = - 1;
            break;
            }
            } );
            window.addEventListener( 'keyup', function () {
            armMovement = 0;
            } );
            }

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				controls.update();

				render();
				stats.update();

			}

			function render() {

				const deltaTime = clock.getDelta();

				updatePhysics( deltaTime );

				renderer.render( scene, camera );

			}

			function updatePhysics( deltaTime ) {

				// Hinge control
				hinge.enableAngularMotor( true, 0.8 * armMovement, 50 );

				// Step world
				physicsWorld.stepSimulation( deltaTime, 10 );

				// Update cloth
				const softBody = cloth.userData.physicsBody;
				const clothPositions = cloth.geometry.attributes.position.array;
				const numVerts = clothPositions.length / 3;
				const nodes = softBody.get_m_nodes();
				let indexFloat = 0;

				for ( let i = 0; i < numVerts; i ++ ) {

					const node = nodes.at( i );
					const nodePos = node.get_m_x();
					clothPositions[ indexFloat ++ ] = nodePos.x();
					clothPositions[ indexFloat ++ ] = nodePos.y();
					clothPositions[ indexFloat ++ ] = nodePos.z();

				}

				cloth.geometry.computeVertexNormals();
				cloth.geometry.attributes.position.needsUpdate = true;
				cloth.geometry.attributes.normal.needsUpdate = true;

				// Update rigid bodies
				for ( let i = 0, il = rigidBodies.length; i < il; i ++ ) {

					const objThree = rigidBodies[ i ];
					const objPhys = objThree.userData.physicsBody;
					const ms = objPhys.getMotionState();
					if ( ms ) {

						ms.getWorldTransform( transformAux1 );
						const p = transformAux1.getOrigin();
						const q = transformAux1.getRotation();
						objThree.position.set( p.x(), p.y(), p.z() );
						objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

					}

				}

			}

		</script>