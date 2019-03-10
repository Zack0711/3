import * as d3 from 'd3';
import 'd3-selection-multi';

import './styles/main.scss';
import './utilities/requestAnimationFramePolyfill'

import {
  getSVGString,
} from './utilities/other'

const webGLContainer = document.querySelector('.webgl-container')

const dragstarted = function(d) {
  d3.select(this).raise().classed('active', true);
}

const dragged = function(d) {
  d3.select(this).attr('transform', `translate(${ d.x = d3.event.x},${ d.y = d3.event.y}), scale(${d.scale})`)
}

const dragended = function(d) {
  d3.select(this).classed('active', false);
}

const dragEvent = d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended)

const zoomEvent = d3.zoom()
  .scaleExtent([0.3, 1.5])
  .on('zoom', function(d) {
    d3.select(this).attr('transform', `translate(${ d.x},${ d.y}), scale(${d.scale = d3.event.transform.k})`)
  });

const textZoomEvent = d3.zoom()
  .scaleExtent([1, 3])
  .on('zoom', function(d) {
    d3.select(this).attr('transform', `translate(${ d.x},${ d.y}), scale(${d.scale = d3.event.transform.k})`)
  });

const svgContainer = d3.select('.svg-container').append('svg')
                     .attr('width', 256)
                     .attr('height', 256)

const iconAndroid = svgContainer.append('g');

const svgText = document.querySelector('.svg-text')
const textContainer = svgContainer.append('text');

const iconButtons = document.querySelectorAll('.btn-icon');
const iconData = [
  'M21.005 43.003c-4.053-.002-7.338 3.291-7.339 7.341l.005 30.736c.001 4.064 3.288 7.344 7.342 7.343 4.056 0 7.342-3.28 7.338-7.342v-30.741c-.002-4.049-3.291-7.339-7.346-7.337m59.193-27.602l5.123-9.355c.273-.489.094-1.111-.401-1.388-.5-.265-1.117-.085-1.382.407l-5.175 9.453c-4.354-1.938-9.227-3.024-14.383-3.019-5.142-.005-10.013 1.078-14.349 3.005l-5.181-9.429c-.269-.497-.889-.677-1.378-.406-.498.269-.681.892-.404 1.38l5.125 9.349c-10.07 5.193-16.874 15.083-16.868 26.438l66.118-.008c.002-11.351-6.79-21.221-16.845-26.427m-31.256 14.457c-1.521-.003-2.763-1.241-2.763-2.771 0-1.523 1.238-2.775 2.766-2.774 1.533-.001 2.773 1.251 2.775 2.774 0 1.528-1.243 2.77-2.778 2.771m30.106-.005c-1.528.002-2.772-1.237-2.772-2.771.006-1.52 1.242-2.772 2.773-2.778 1.521.005 2.768 1.258 2.767 2.779.003 1.53-1.24 2.771-2.768 2.77m-47.853 14.537l.011 47.635c-.003 4.333 3.502 7.831 7.832 7.831l5.333.002.006 16.264c-.001 4.05 3.291 7.342 7.335 7.342 4.056 0 7.342-3.295 7.343-7.347l-.004-16.26 9.909-.003.004 16.263c0 4.047 3.293 7.346 7.338 7.338 4.056.003 7.344-3.292 7.343-7.344l-.005-16.259 5.352-.004c4.32.002 7.834-3.5 7.836-7.834l-.009-47.635-65.624.011zm83.134 5.943c-.001-4.055-3.286-7.341-7.341-7.339-4.053-.004-7.337 3.287-7.337 7.342l.006 30.738c-.001 4.058 3.283 7.338 7.339 7.339 4.054-.001 7.337-3.281 7.338-7.343l-.005-30.737z',
  'M124.797 65.636c-.559-2.396-1.734-4.17-3.956-5.316-4.161-2.147-8.577-3.302-13.091-4.333-9.566-2.186-19.235-3.564-28.973-4.706-1.127-.132-2.237-.282-3.363-.424.376-3.143 1.495-4.192 5.271-4.975.391.905.749 1.851 1.214 2.739.172.328.603.738.919.743 5.632.079 10.951-.888 15.265-4.908 3.371-3.144 4.867-7.224 5.693-11.619.3-1.598.588-3.199.825-4.808.739-5.002 3.353-9.002 6.685-12.626.163-.177.308-.369.549-.661-2.649-.822-5.265-.913-7.849-.44-9.892 1.81-17.349 7.015-21.982 16.055l-.16.17c-1.686-.426-3.384-.81-5.046-1.311-.304-.092-.543-.636-.678-1.018-2.718-7.715-7.416-13.725-15.075-16.983-2.281-.972-4.83-.826-7.254-1.465-.132-.035-.241.25-.36.25h-7.332c-1.609 0-3.225.096-4.826.432-19.176 4.013-34.168 18.824-37.677 38.182-3.749 20.675 1.924 38.738 15.541 54.548 2.047 2.377 4.519 4.271 7.37 5.685 5.264 2.608 10.975.695 13.666-4.549l.225-.389c1.151 3.009 2.388 5.919 3.38 8.917.966 2.917 4.453 4.246 6.582 4.105.401-.026.895.338 1.182.12 1.907-1.445 3.41.949 5.067.949h2.688c1.898-1 3.701-1.653 4.943-3.361.152-.211.827-.269 1.252-.225 2.432.253 4.688-.314 6.73-1.679 1.708-1.143 2.779-2.746 2.999-4.811 2.161-.632 3.501-2.286 3.573-4.827.04-1.377-.084-2.93-.674-4.135-1.797-3.678-3.856-7.232-5.813-10.832l-.16-.348.383.15c2.876 1.401 5.9 2.024 9.1 1.758 2.039-.169 3.262-.823 4.288-2.391 2.525 1.783 5.364 2.628 8.458 2.409 3.079-.217 5.973-.876 7.631-3.946 2.188 0 4.432.203 6.615-.069 1.522-.189 3.054-.866 4.421-1.619 2.189-1.205 3.674-2.974 3.206-5.775 2.242-.194 4.304-.748 6.045-2.146 1.409-1.132 2.035-2.607 2.513-4.346.111-.407.193-.793.193-1.188v-3.421c0-.521-.08-1.034-.203-1.562zm-75.322-22.892c-3.582-.006-6.441-2.887-6.408-6.457.032-3.575 2.942-6.479 6.463-6.452 3.576.029 6.392 2.895 6.389 6.502-.005 3.602-2.831 6.414-6.444 6.407zm19.638 5.175c-.817-1.956-1.452-4.001-1.161-6.234-.151-3.359 1.012-6.303 2.974-8.939.256-.342 1.092-.392 1.643-.353 6.281.439 11.744 2.982 16.758 6.634 1.041.759 2.032 1.588 2.924 2.563-1.964-.421-3.92-.882-5.893-1.255-2.969-.562-5.908-.449-8.703.799-3.019 1.348-6.17 1.301-9.355 1.08 1.735 1.558 3.833 1.472 5.901 1.16 1.749-.262 3.461-.77 5.265-1.187l.097 1.022-10.45 4.71z',
  'M99.5,112.5c-0.3,0-0.5,0-0.7,0c-4.5,0-9,0-13.5,0c-0.5,0-0.8-0.2-1.1-0.5c-3.2-4-6.7-7.7-10.9-10.6 c-2.1-1.5-4.3-2.8-6.8-3.5c-2-0.6-4.1-0.9-6.2-0.4c-2.1,0.5-3.9,1.7-5.4,3.2c-1.9,1.9-3.2,4.2-4.2,6.7c-0.6,1.5-1.1,3-1.6,4.5 c-0.1,0.2-0.1,0.4-0.2,0.6c-3.8,0-7.5,0-11.4,0c-0.1-0.6-0.2-1.2-0.3-1.9c-0.4-2-1-4-2-5.8c-0.7-1.4-1.6-2.6-2.8-3.6 c-1.3-1.1-2.8-1.7-4.5-1.7c-1.3,0-2.4,0.5-3.5,1.2c-1.5,1-2.7,2.3-3.6,3.8c-1.4,2.2-2.2,4.7-2.9,7.2c-0.1,0.2-0.1,0.5-0.2,0.8 c-5,0-9.9,0-14.9,0c-0.1-0.7-0.2-1.5-0.3-2.2c-0.5-4.7-0.8-9.4-0.7-14.1c0.1-5.5,0.7-10.9,2-16.3C5,75,6.7,70.4,9.3,66.2 c3.6-5.7,8.4-9.8,14.7-12.3c0.2-0.1,0.3-0.1,0.5-0.2c0,0,0.1,0,0.2,0c0.1,0.2,0.2,0.4,0.3,0.6c1.8,4,3.7,7.9,6,11.5 c1.4,2.3,3.4,4,5.9,4.8c2.7,0.9,5.3,0.6,7.9-0.5c2.3-1,4.2-2.5,6-4.2c2.1-2,3.8-4.2,5.5-6.6c0.1-0.1,0.1-0.2,0.1-0.3 c-0.2,0.2-0.4,0.4-0.7,0.6c-2.5,2.5-5.2,4.7-8.3,6.4c-1.5,0.9-3.2,1.6-4.9,1.9c-2.5,0.5-4.8,0.2-6.8-1.6c-0.8-0.7-1.4-1.5-2-2.3 c-3-4.7-5.6-9.6-8-14.6c-0.5-1-0.9-2-1-3.2c-0.2-1.7,0.3-3.2,1.5-4.5c0.9-0.9,1.9-1.6,3.1-2.2c2.2-1.1,4.5-1.9,6.8-2.7 c3.4-1.1,6.9-1.9,10.5-2.4c4.1-0.6,8.3-0.7,12.5-0.2c9,0.9,17,4.2,24.3,9.5c2.5,1.8,5.1,3.3,8.1,4.2c11.9,3.8,21.4-4.4,23.6-12.8 c0.6-2.3,0.8-4.6-0.1-6.8c-1.3-3.4-3.6-6-7.3-7c-2.8-0.7-5.5-0.4-8.1,1c-0.5,0.3-1,0.5-1.5,0.7c-1.2,0.4-2,0.1-2.6-1 c-0.8-1.4-1.4-2.8-2.1-4.3c-0.3-0.6-0.2-1.1,0.1-1.6c0.3-0.7,0.8-1.2,1.4-1.7c1.5-1.2,3.3-2,5.3-2.4c4.9-1.1,9.5-0.4,13.9,1.8 c3.5,1.7,6.2,4.3,8.2,7.7c1.9,3.2,3.2,6.6,3.8,10.3c0.4,2.9,0.4,5.7,0.1,8.6c-0.6,5-2,9.7-4,14.3c-2.6,6-5.6,11.8-9.3,17.2 c-1.8,2.6-3.7,5.1-5.5,7.6c-1.9,2.7-3.8,5.4-5.2,8.4c-1.9,3.9-3,7.9-3.4,12.2c-0.3,3.7-0.1,7.3,0.5,11 C99.4,111.7,99.5,112.1,99.5,112.5z M91.3,61.1c0.3,2.4-0.5,4-2.7,4.9C87,66.6,85,66.1,84,64.7c-1.6-2.1-1.1-4,0.7-5.8 c-1.8-0.6-3.6-1.2-5.3-1.7c-0.4,1-0.6,2.5-0.5,3.7c0.2,2.4,1.1,4.4,3.1,5.7c2.1,1.4,4.5,2,7,1.5c2.6-0.5,4.6-2,6-4.2 c0.3-0.4,0.5-0.8,0.5-1.4C94.1,62.1,92.7,61.6,91.3,61.1z'
  ]

iconButtons.forEach( (iconBtn, i) => {
  iconBtn.onclick = () => {
    if(!iconBtn.classList.contains('btn-selected')){
      triggerBtnSelectedClass(iconBtn, iconButtons)
      iconAndroid.select('path').attr('d', iconData[i])
    }
  }
})

textContainer.attr('transform', 'translate(128, 225), scale(1)')
  .attr('text-anchor', 'middle')
  .attr('font-size', '24px')
  .attr('font-family', 'Helvetica')
  .text(svgText.value)

svgText.onkeyup = (e) => {
  textContainer.text(e.target.value)
}

textContainer.datum({x: 128, y:225, scale:1}).call(dragEvent).call(textZoomEvent);

iconAndroid.append('path').attr('d', iconData[0]);

iconAndroid.attr('transform', 'translate(64, 56), scale(1)');
iconAndroid.datum({x: 64, y:56, scale:1}).call(dragEvent).call(zoomEvent);

const allFillColorButtons = document.querySelectorAll('.btn-fill-color');
const fillColorPlate = [ '#ffffff', '#777777', '#333333', '#4473b5', '#60be86']
let selectedFillColor = fillColorPlate[0]

allFillColorButtons.forEach( (colorBtn, i) => {
  colorBtn.onclick = () => {
    if(!colorBtn.classList.contains('btn-selected')){
      triggerBtnSelectedClass(colorBtn, allFillColorButtons)
      selectedFillColor = fillColorPlate[i]
      setSVGFillColor()
    }
  }
})

const setSVGFillColor = () => {
  iconAndroid.attr('fill', selectedFillColor)
  textContainer.attr('fill', selectedFillColor)  
}

setSVGFillColor();

const canvas = document.createElement('canvas');
canvas.setAttribute('width', 256);
canvas.setAttribute('height', 256);

let context = canvas.getContext('2d');

const drawCanvasBTN = document.querySelector('.btn-draw-canvas');
const clearCanvasBTN = document.querySelector('.btn-clear-canvas');

const clearCanvas = () => {
  context.clearRect(0, 0, 256, 256);  
}

const drawCanvas = () => {
  const DOMURL = window.URL || window.webkitURL || window;
  const svgString = getSVGString(svgContainer.node())
  const image = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });

  let url = DOMURL.createObjectURL(svgBlob);

  image.onload = function() {
    clearCanvas();
    context.drawImage(image, 0, 0);
    DOMURL.revokeObjectURL(url);
    updateMaterialTexture();
  }

  image.src = url;  
}

clearCanvasBTN.onclick = () => {
  clearCanvas();
  updateMaterialTexture();
}

drawCanvasBTN.onclick = () => {
  drawCanvas();
}

const scene = new THREE.Scene()
const geometry = new THREE.BoxBufferGeometry(2,5,3)

let material = new THREE.MeshNormalMaterial({transparent:true, color:0xff0000})

const mesh = new THREE.Mesh( geometry, material);

let iPhoneMesh = null
const iPhoneMaterial = new THREE.MeshLambertMaterial({color:0xff000})

const surfaceMaterial = new THREE.MeshBasicMaterial({opacity:0, transparent:true})
const surfaceMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2.4, 2.4 ), surfaceMaterial);

const camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer({alpha: true})

const controls = new THREE.OrbitControls( camera, renderer.domElement );

const light1 = new THREE.PointLight( 0xFFFFFF , 0.8);
const light2 = new THREE.PointLight( 0xFFFFFF , 0.8);
let ambientLight = new THREE.AmbientLight('#0c0c0c')


const colorPlate = [
  { r: 176/255, g: 40/255, b: 60/255 },
  { r: 210/255, g: 120/255, b: 120/255 },
  { r: 180/255, g: 135/255, b: 90/255 },
  { r: 150/255, g: 150/255, b: 150/255 },
  { r: 68/255, g: 115/255, b: 181/255 },
  { r: 51/255, g: 51/255, b: 51/255 }
]
const allColorButtons = document.querySelectorAll('.btn-color');
let selectedColor = colorPlate[0];

const triggerBtnSelectedClass = (activeBTN, btnArray) => {
  btnArray.forEach( (btn, i) => { btn.classList.remove('btn-selected')})
  activeBTN.classList.add('btn-selected')
}

allColorButtons.forEach( (colorBtn, i) => {
  colorBtn.onclick = () => {
    if(!colorBtn.classList.contains('btn-selected')){
      triggerBtnSelectedClass(colorBtn, allColorButtons)
      selectedColor = colorPlate[i]
      setIPhoneColor()      
    }
  }
})

const onProgress = xhr => {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};
const onError = (xhr) => { console.log(xhr); };

const setIPhoneColor = () => {
  if(iPhoneMesh){
    for(let m of iPhoneMesh.material){
      if(m.name === '_Product__Red' || m.name === 'Logo' || m.name === 'M_0021_DarkRed'){
        m.color = selectedColor
      }
    }
  }  
}

const hideIcon = () => {
  if(iPhoneMesh){
    const mNameCount = {}
    for(let m of iPhoneMesh.material){
      if( !mNameCount[m.name]) mNameCount[m.name] = 0
      mNameCount[m.name] += 1
      if(m.name === 'Logo') m.map = null
      if(m.name === 'M_0021_DarkRed'){
        m.color = {r:1, g:1, b:0}
      }
    }
  }  
}

const mtlLoader = new THREE.MTLLoader();

mtlLoader.setPath('./3d_model/');
mtlLoader.load('Apple+iPhone+7+Plus+PRODUCT+RED.mtl', materials => {
 
  const objLoader = new THREE.OBJLoader();

  materials.preload();
  objLoader.setMaterials(materials);
  objLoader.setPath('./3d_model/');
  objLoader.load('Apple+iPhone+7+Plus+PRODUCT+RED.obj', object => {
 
    iPhoneMesh = object.children[0]
    iPhoneMesh.position.set(0,0,0)

    const box = new THREE.Box3().setFromObject( iPhoneMesh );

    iPhoneMesh.translateX((box.min.x-box.max.x)/2)
    iPhoneMesh.translateY((box.min.y-box.max.y)/2)
    iPhoneMesh.translateZ((box.min.z-box.max.z)/2)

    hideIcon();
    setIPhoneColor();
    scene.add(iPhoneMesh) 
    drawCanvas();

  }, onProgress, onError); 

})

light1.position.set( 25, 25, 1000 );
light2.position.set( 25, 25, -1000);

camera.position.set(45,45,-90)
camera.lookAt(scene.position)

surfaceMesh.position.set(0,0,-0.50)
surfaceMesh.rotation.y += Math.PI

scene.add(surfaceMesh)
scene.background = new THREE.Color( 0xDDDDCD );
scene.add(ambientLight)
scene.add(light1)
scene.add(light2)

const updateMaterialTexture = () => {
  const dataURL = canvas.toDataURL('image/png', 1);
  const imgTexture = new THREE.TextureLoader().load( dataURL );
  surfaceMesh.material = new THREE.MeshBasicMaterial( { map: imgTexture, transparent:true} )  
}

webGLContainer.appendChild(renderer.domElement)

const reSize = () => {
  const {
    width,
    height,
  } = webGLContainer.getBoundingClientRect();

  renderer.setSize(width, height)
  camera.aspect = width / height;
  camera.updateProjectionMatrix();  
}

const render = () => {
  renderer.render(scene, camera)
}

const animatesRender = () => {
  window.requestAnimationFrame(animatesRender)
  render();
}

const colseModal = () => {
  document.querySelector('.modal').classList.remove('show');
  document.querySelector('.modal').classList.remove('fade');
  document.body.classList.remove('modal-open');
}

const openModal = () => {
  document.querySelector('.modal').classList.add('show');
  document.querySelector('.modal').classList.add('fade');
  document.body.classList.add('modal-open');
}

const modalCloseBtn = document.querySelector('.modal .close');
const modalConfirmBtn = document.querySelector('.modal .btn-primary');

modalCloseBtn.onclick = () => { colseModal() };
modalConfirmBtn.onclick = () => { colseModal() };

reSize()
render();
animatesRender();

window.addEventListener('resize', e => { reSize();});
