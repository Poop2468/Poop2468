// ✨ 로딩 애니메이션
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 1000);
});

// 🌌 별 배경 캔버스
const bgCanvas = document.createElement('canvas');
bgCanvas.id = "bgStars";
document.querySelector(".hero").prepend(bgCanvas);
const ctx = bgCanvas.getContext('2d');

function resizeStars() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = document.querySelector('.hero').offsetHeight;
}
window.addEventListener('resize', resizeStars);
resizeStars();

const stars = Array.from({ length: 80 }, () => ({
  x: Math.random() * bgCanvas.width,
  y: Math.random() * bgCanvas.height,
  r: Math.random() * 1.8 + 0.5,
  speed: Math.random() * 0.2 + 0.1,
  offset: Math.random() * 100
}));

let mouse = { x: 0, y: 0 };
document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX / window.innerWidth - 0.5;
  mouse.y = e.clientY / window.innerHeight - 0.5;
});

function animateStars() {
  ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  for (let s of stars) {
    const twinkle = Math.sin(Date.now() * 0.002 + s.offset) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(s.x + mouse.x * 40, s.y + mouse.y * 20, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, ${180 + Math.random() * 50}, ${220 + Math.random() * 30}, ${twinkle})`;
    ctx.fill();
    s.y += s.speed;
    if (s.y > bgCanvas.height) s.y = 0;
  }
  requestAnimationFrame(animateStars);
}
animateStars();

// 🩷 Three.js Scene 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('cute3d'),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, 300);

// 환경 조명 + 포인트 조명
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const light = new THREE.PointLight(0xffffff, 1.3);
light.position.set(3, 3, 3);
scene.add(light);

camera.position.set(0, 1.2, 2.5);

// 🎀 glTF 모델 로드
let delphiModel = null;
const loaderGLTF = new THREE.GLTFLoader();
loaderGLTF.load(
  'models/delphi_character.glb',
  (gltf) => {
    delphiModel = gltf.scene;
    delphiModel.scale.set(1.2, 1.2, 1.2);
    delphiModel.position.y = -0.8;
    scene.add(delphiModel);
  },
  (xhr) => {
    console.log(`Loading model... ${(xhr.loaded / xhr.total * 100).toFixed(1)}%`);
  },
  (error) => {
    console.error('❌ 모델을 불러오는 중 오류 발생:', error);
  }
);

// 🌀 마우스 반응형 회전
let targetRotX = 0;
let targetRotY = 0;
document.addEventListener('mousemove', (e) => {
  const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
  const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
  targetRotY = xNorm * 0.6;
  targetRotX = yNorm * 0.3;
});

function animateScene() {
  requestAnimationFrame(animateScene);

  if (delphiModel) {
    delphiModel.rotation.y += (targetRotY - delphiModel.rotation.y) * 0.05;
    delphiModel.rotation.x += (targetRotX - delphiModel.rotation.x) * 0.05;
  }

  renderer.render(scene, camera);
}
animateScene();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, 300);
});
