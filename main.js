import gsap from 'gsap'
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls'

//import * as THREE from 'three'
//import {OrbitControls} from 'three'  //not compatible    
import * as dat from 'dat.gui'


const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 24,
    heightSegments: 24
  }  
}
gui.add(world.plane, 'width', 1, 500).
  onChange(generatePlane)  

gui.add(world.plane, 'height', 1, 500).
  onChange(generatePlane)

gui.add(world.plane, 'widthSegments', 1, 100).
  onChange(generatePlane)

gui.add(world.plane, 'heightSegments', 1, 100).
  onChange(generatePlane)

// not as performant, but got the code to work this way;
// good for the develop cycle anyway...
let array = []

function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry
    (world.plane.width, 
     world.plane.height, 
     world.plane.widthSegments, 
     world.plane.heightSegments)


  //breaking issue - originalPostion must be here, vice below
  // with randomValues and array

    // vertice position randomization
    array = planeMesh.geometry.attributes.position.array
    const randomValues = []
    for (let i = 0; i < array.length; i++) {
      if (i % 3 === 0) {
        const x = array[i]
        const y = array[i + 1]
        const z = array[i + 2]

        array[i] = x + (Math.random() - 0.5) * 3
        array[i + 1] = y + (Math.random() - 0.5) * 3
        array[i + 2] = z + (Math.random() - 0.5) * 10
      }

      randomValues.push(Math.random() * Math.PI * 2 )
    }
    
    planeMesh.geometry.attributes.position.randomValues = randomValues

    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array

    console.log(planeMesh.geometry.attributes.position)


    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
      colors.push(0, 0.19, 0.4)
    }

    planeMesh.geometry.
      setAttribute('color', new THREE.BufferAttribute(new 
          Float32Array(colors), 3)
      ) 

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


camera.position.z = 40

const planeGeometry = new THREE.PlaneGeometry(
                                world.plane.width, 
                                world.plane.height,
                                world.plane.widthSegments,
                                world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial({ 
  side: THREE.DoubleSide, 
  flatShading: THREE.FlatShading,
  vertexColors: true
})

const planeMesh = new THREE.Mesh(
  planeGeometry, planeMaterial
)
scene.add(planeMesh) 
generatePlane()

const light = new THREE.DirectionalLight(
  0xffffff, 1
)
light.position.set(0, -1, 1)
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

let frame = 0
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)

  frame += 0.01

  // when I moved this from above, it broke
  
  const {
    /* array, */
    originalPosition,
    randomValues
  } = planeMesh.geometry.attributes.position
  
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01

    // y
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.001
  }

  planeMesh.geometry.attributes.position.
    needsUpdate = true  

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

    // also documenting    
    /*
    // vertex 1
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)
    // vertex 2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)
    //vertex 3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.a, 1)

    color.needsUpdate = true
    */
    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }

    const hoverColor = {
      r: 0.1,
      g: 0.18,  /* instead of the suggested 5 */
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b:initialColor.b,
      duration: 1,
      onUpdate: () => {
        // vertex 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)
        // vertex 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)
        //vertex 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        color.needsUpdate = true
        
      }
    })

  }
  
} 

renderer.render(scene, camera)

animate()


window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1
  //console.log(mouse)
})
