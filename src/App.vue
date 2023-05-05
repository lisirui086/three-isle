<template>
  <div class='container' ref="container"></div>
</template>

<script setup>
// 引入组合式API
import { ref, onMounted, onUnmounted } from 'vue'

// 引入threejs
import * as THREE from 'three'

// 引入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 引入水面
import { Water } from "three/examples/jsm/objects/Water2"

// 引入gltf库
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

// 压缩模型
import { DRACOLoader  } from 'three/examples/jsm/loaders/DRACOLoader'

// 引入环境纹理HDR
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 引入颜色贴图。
import sky from './assets/image/texture/sky.jpg'
import skyVideo from './assets/image/texture/sky.mp4'

// 引入水波贴图
import waterTexture from './assets/image/texture/waternormals.jpg'

// 引入小岛模型
// import Island from './assets/model/island2.glb'

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000)
// camera.position.z = 5
camera.position.set(-50, 50, 130);
scene.add(camera)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,

  // 对数深度缓冲区
  logarithmicDepthBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

// 创建颜色贴图。
const skyMap = new THREE.TextureLoader().load(sky)

// 添加平行光
const directionalLight = new THREE.DirectionalLight()
directionalLight.position.set(-100, 100, 10)
scene.add(directionalLight)

// 创建球体
const sphereGeometry = new THREE.SphereGeometry(1000, 60, 40)
sphereGeometry.scale(1, 1, -1)
const meshBasicMaterial = new THREE.MeshBasicMaterial({
  map: skyMap
})
const sphere = new THREE.Mesh(sphereGeometry, meshBasicMaterial)
scene.add(sphere)

// 载入环境纹理 hdr
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('/image/hrd/050.hdr').then(texture=>{
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture
})

// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 64);
const water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  color: 0xeeeeff,
  waterNormals: new THREE.TextureLoader().load(waterTexture, texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  }),
  flowDirection: new THREE.Vector2(1, 1)
})
// 水面漫过石头一部分
water.position.y = 3
water.rotation.x = - Math.PI / 2;
scene.add(water);

// 创建小岛模型
// 实例化GLTF载入库
const gltfLoader = new GLTFLoader()
// 实例化DRACO载入库
const dracoLoader = new DRACOLoader()

//  设置解压库文件路径
dracoLoader.setDecoderPath('/draco/')

//  gltfloader使用dracoLoader
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('/model/island2.glb', (gltf) => {
  scene.add(gltf.scene)
})

// 获取节点
const container = ref(null)


// 创建video节点 创建视频贴图
const video = document.createElement('video')
video.src = skyVideo
  
// 开启视频循环播放
video.loop = true

// 封装一个渲染函数
const renderFn = () => {
  requestAnimationFrame(renderFn)
  renderer.render(scene, camera)
}

// 封装当屏幕宽高改变时，更新摄像机、渲染器的宽高
const onWindowResize = () => {
  // 更新摄像机视锥体的长宽比
  camera.aspect = (window.innerWidth / window.innerHeight)

  // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
  camera.updateProjectionMatrix()

  // 将输出canvas的大小修改
  renderer.setSize(window.innerWidth, window.innerHeight)

  // 重新渲染场景
  renderer.render(scene, camera)
}

// 鼠标移动页面时播放视频
const playVideo = () =>{
  if(video.paused) {
    const skyMapByVideo = new THREE.VideoTexture(video)
    meshBasicMaterial.map = skyMapByVideo
    // 纹理被更新后调用
    meshBasicMaterial.map.needsUpdate = true
    video.play()
  }
}

// 组件挂载完毕
onMounted(() => {
  // 创建控制器
  const controls = new OrbitControls(camera, container.value)
  controls.update()

  // 开启阻尼
  container.enableDamping = true

  // 将渲染器添加到HTML元素上
  container.value.appendChild(renderer.domElement)
  container.value.appendChild(video)

  // window绑定 侦听屏幕宽高改变 事件
  window.addEventListener('resize', onWindowResize)

  // window绑定 鼠标经过屏幕时自动播放视频纹理
  window.addEventListener('click', playVideo)

  renderFn()
})

// 组件卸载完毕
onUnmounted(()=>{
  // window卸载 侦听屏幕宽高改变 事件
  window.removeEventListener('resize', onWindowResize)

  // window卸载 鼠标经过屏幕时自动播放视频纹理
  window.removeEventListener('mousemove', playVideo)
})
</script>

<style>
  /* 确保容器具有高度和宽度 */
  .container {
  width: 100%;
  height: 100vh;
}
</style>
