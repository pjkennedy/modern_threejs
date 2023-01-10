//import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

// Import the entire three.js core library, if needed
import * as THREE from 'three';
import * as dat from 'dat.gui'

const gui = new dat.GUI()
console.log(gui)
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10
  }  
}
gui.add(world.plane, 'width', 1, 20).
  onChange(generatePlane)  

  gui.add(world.plane, 'height', 1, 20).
  onChange(generatePlane)

  gui.add(world.plane, 'widthSegments', 1, 50).
  onChange(generatePlane)

  gui.add(world.plane, 'heightSegments', 1, 50).
  onChange(generatePlane)

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry
    (world.plane.width, 
     world.plane.height, 
     world.plane.widthSegments, 
     world.plane.heightSegments)

    const {array} = planeMesh.geometry
    .attributes.position
    for( let i = 3; i < array.length; i+=3)
      {
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]
        
        array[i + 2] = Math.random()
      }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer(
                          )

//console.log(scene);
//console.log(camera);
//console.log(renderer);

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)


/// removing the yellow box; next two ///
///const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
///const material = new THREE.MeshBasicMaterial({ color: 0x00ff00})
//console.log(boxGeometry)
//console.log(material)

///const mesh = new THREE.Mesh( boxGeometry, material)
//console.log(mesh)
/// removing the yellow box code ///
//scene.add(mesh)
/// end removing the yellow box code ///


camera.position.z = 5

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000, 
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading
})

const planeMesh = new THREE.Mesh(
  planeGeometry, planeMaterial
)
scene.add(planeMesh) 


const {array} = planeMesh.geometry
.attributes.position
for( let i = 3; i < array.length; i+=3)
  {
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    
    array[i + 2] = Math.random()
  }

const light = new THREE.DirectionalLight(
  0xffffff, 1
)
light.position.set(0, 0, 1)
scene.add(light)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  /// next two are for the yellow box; comment out if not needed ///
  ///mesh.rotation.x += 0.01
  ///mesh.rotation.y += 0.01
  /// and stop rotation the red plane too
  ///planeMesh.rotation.x += 0.01    // if you don't want the plane to rotate
  
} 

animate()

renderer.render(scene, camera)
