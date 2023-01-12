import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls'

//import * as THREE from 'three'
//import {OrbitControls} from 'three'  //not compatible    
import * as dat from 'dat.gui'


const gui = new dat.GUI()

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

const raycaster = new THREE.Raycaster()
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

new OrbitControls(camera, renderer.domElement)


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
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading,
  vertexColors: true
})

const planeMesh = new THREE.Mesh(
  planeGeometry, planeMaterial
)
scene.add(planeMesh) 

const {array} = planeMesh.geometry
.attributes.position
// changing back to 'let i = 0' (vice 3)
for( let i = 0; i < array.length; i+=3)
  {
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    
    array[i + 2] = Math.random()
  }

const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(1, 0, 0)
}
console.log(colors)

planeMesh.geometry.
  setAttribute('color', new THREE.BufferAttribute(new 
      Float32Array(colors), 3)

  ) 

const light = new THREE.DirectionalLight(
  0xffffff, 1
)
light.position.set(0, 0, 1)
scene.add(light)


const backLight = new THREE.DirectionalLight(
  0xffffff, 1
)
backLight.position.set(0, 0, -1)
scene.add(backLight)

const mouse = {
  x: undefined,
  y: undefined
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  /// next two are for the yellow box; comment out if not needed ///
  ///mesh.rotation.x += 0.01
  ///mesh.rotation.y += 0.01
  /// and stop rotation the red plane too
  ///planeMesh.rotation.x += 0.01    // if you don't want the plane to rotate

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster
    .intersectObject(planeMesh)
  if (intersects.length > 0) {
    // 363 pieces
    //console.log(intersects[0].face)

    //console.log(intersects[0].object.geometry)

    // float32array structed as 121 x 3
    //console.log(intersects[0].object.geometry.attributes.color)

    // setting values; easier to use 1 (as red) to confirm it works
    //intersects[0].object.geometry.attributes.color.setX(0, 1)  
    // and intersects[0].face give you the three vertexes, so
    // you can change all three, instead of just one.
    // And setting it zero doesn't work yet, but setting it 1 (for red) does work.
    // Keeping next three to document it
    //intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0)
    //intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, 0)
    //intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, 0)

    // shorten above code with color variable:
    /*
    const {color} = intersects[0].object.geometry.attributes
    color.setX(intersects[0].face.a, 0)
    color.setX(intersects[0].face.b, 0)
    color.setX(intersects[0].face.c, 0)  */

    const {color} = intersects[0].object.geometry.attributes
    // vertex 1
    color.setX(intersects[0].face.a, 0)
    color.setY(intersects[0].face.a, 0)
    color.setZ(intersects[0].face.a, 1)
    // vertex 2
    color.setX(intersects[0].face.b, 0)
    color.setY(intersects[0].face.b, 0)
    color.setZ(intersects[0].face.b, 1)
    //vertex 3
    color.setX(intersects[0].face.c, 0)
    color.setY(intersects[0].face.c, 0)
    color.setZ(intersects[0].face.a, 1)

    color.needsUpdate = true
  }
  
} 

renderer.render(scene, camera)

animate()


window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1
  //console.log(mouse)
})
