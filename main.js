// 🌟 로딩 화면
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => loader.classList.add("hidden"), 1000);
});

// 🌌 별 배경 (기존 코드 유지)
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

// 🩷 Three.js Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('cute3d'),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, 300);

// 조명
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffc0cb, 1.3); // 초기 핑크
pointLight.position.set(3, 3, 3);
scene.add(pointLight);

camera.position.set(0, 1.2, 2.5);

// 🎀 glTF 모델
let delphiModel = null;
let modelLoaded = false;
const loaderGLTF = new THREE.GLTFLoader();
loaderGLTF.load(
  'models/delphi_character.glb',
  (gltf) => {
    delphiModel = gltf.scene;
    delphiModel.scale.set(0.1, 0.1, 0.1); // 작은 상태에서 등장
    delphiModel.position.y = -0.8;
    scene.add(delphiModel);
    modelLoaded = true;
  },
  (xhr) => {
    console.log(`Loading model... ${(xhr.loaded / xhr.total * 100).toFixed(1)}%`);
  },
  (error) => {
    console.error('❌ 모델 불러오기 실패:', error);
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

// 🎶 배경음악 + 볼륨
const bgMusic = document.getElementById('bgMusic');
const volumeSlider = document.getElementById('volumeSlider');
bgMusic.volume = 0.3;
volumeSlider.addEventListener('input', (e) => {
  bgMusic.volume = e.target.value;
});

// 🏮 애니메이션
let startTime = null;

function animateScene(time) {
  requestAnimationFrame(animateScene);

  if (!startTime) startTime = time;
  const elapsed = (time - startTime) / 1000; // 초 단위

  if (delphiModel) {
    // 모델 등장 애니메이션 (0.1 → 1.2 스케일)
    if (delphiModel.scale.x < 1.2) {
      delphiModel.scale.x += 0.01;
      delphiModel.scale.y += 0.01;
      delphiModel.scale.z += 0.01;
    }

    // 마우스 회전
    delphiModel.rotation.y += (targetRotY - delphiModel.rotation.y) * 0.05;
    delphiModel.rotation.x += (targetRotX - delphiModel.rotation.x) * 0.05;
  }

  // 조명 색상 변화 (sin으로 천천히)
  const hue = (Math.sin(elapsed * 0.5) * 0.5 + 0.5) * 360; // 0~360
  const color = new THREE.Color(`hsl(${hue}, 70%, 80%)`);
  pointLight.color = color;

  // 음악 볼륨에 따라 밝기 조정
  pointLight.intensity = 1 + bgMusic.volume * 2;

  renderer.render(scene, camera);
}
animateScene();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, 300);
});
