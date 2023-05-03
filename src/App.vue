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

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000)
camera.position.z = 5
scene.add(camera)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

// 创建平面
const planeGeometry = new THREE.PlaneGeometry(1,1)
const meshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00})
const plane = new THREE.Mesh(planeGeometry, meshBasicMaterial)
scene.add(plane)


// 获取节点
const container = ref(null)

// 封装一个渲染函数
const renderFn = () => {
  renderer.render(scene, camera)
  requestAnimationFrame(renderFn)
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



// 组件挂载完毕
onMounted(() => {
  // 创建控制器
  const controls = new OrbitControls(camera, container.value)
  controls.update()

  // 开启阻尼
  container.enableDamping = true

  // 将渲染器添加到HTML元素上
  container.value.appendChild(renderer.domElement)

  // window绑定事件
  window.addEventListener('resize', onWindowResize)

  renderFn()
})

// 组件卸载完毕
onUnmounted(()=>{
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style>
  /* 确保容器具有高度和宽度 */
  .container {
  width: 100%;
  height: 100vh;
}
</style>
