import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// setting up the scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

camera.position.setZ(30);
camera.position.setX(-30);
renderer.render(scene,camera);

// setting up first object
const geometry = new THREE.TorusGeometry(10,3,16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xC4A26E});
const object = new THREE.Mesh(geometry,material);
scene.add(object);

//adding lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20,5,5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight,ambientLight);

//adding gridHelper to the scene
const gridHelper = new THREE.GridHelper(200,50);
scene.add(gridHelper);

//adding controls
const controls = new OrbitControls(camera, renderer.domElement)

//adding stars to the background
function addStars(){
  const geo = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geo,material);

  const [x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}
Array(200).fill().forEach(addStars)

//adding background to the scene
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background=spaceTexture;

//adding moon object
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalMap = new THREE.TextureLoader().load('normal.jpg'); // this texture gives the appearance of depth to the object, and allows the light to bounce of it, appearing real

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({map:moonTexture, normalMap: normalMap})
);
scene.add(moon);

//adding a scrolling effect
// moon.position.z=30
// moon.position.x=-10
function moveCamera(){
  const t = document.body.getBoundingClientRect().top; //how much has the user already scrolled from the top
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = (t+200)* 0.1;
  camera.position.x = (t+1)* 0.0002;
  camera.position.y = (t+1)* 0.0002;
}
document.body.onscroll = moveCamera;

function animate(){
  requestAnimationFrame(animate);
  object.rotation.x += 0.01;
  object.rotation.y += 0.0005;
  object.rotation.z += 0.01;
  controls.update();
  renderer.render(scene,camera);
}

animate();