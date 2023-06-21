let scene, camera, renderer;
let cluster;
let mouse = new THREE.Vector2();
let spotlights = [];
let pointlights = [];
let stars = [];

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  cluster = new THREE.Group();

  const geometry = new THREE.IcosahedronGeometry(0.5, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 1.0 });
  const separation = 1.5;
  const count = 12;
  const radius = (count * separation) / (2 * Math.PI);

  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count);
    const theta = Math.sqrt(count * Math.PI) * phi;

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = radius * Math.cos(theta) * Math.sin(phi);
    mesh.position.y = radius * Math.sin(theta) * Math.sin(phi);
    mesh.position.z = radius * Math.cos(phi);
    cluster.add(mesh);
  }

  scene.add(cluster);

  const saturnGeometry = new THREE.SphereGeometry(5, 32, 32);
  const saturnMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 1.0 });
  const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
  saturn.position.x = 12;
  saturn.position.z = -9;
  scene.add(saturn);

  const numpointlight = 7;
  for (let i = 0; i < numpointlight; i++) {
    const pointlight = new THREE.SpotLight(Math.random() * 0xffffff, 1, 12, Math.PI / 2, 1);
    pointlight.position.set(24, -2, -4);
    pointlights.push(pointlight);
    scene.add(pointlight);
  }

  const numSpotlights = 12;
  for (let i = 0; i < numSpotlights; i++) {
    const spotlight = new THREE.SpotLight(
      Math.random() * 0xffffff,
      1,
      10,
      Math.PI / 2,
      0.5
    );
    spotlight.position.set(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    );
    spotlights.push(spotlight);
    scene.add(spotlight);
  }

  const starCount = 4000;
  const starGeometry = new THREE.SphereGeometry(0.05);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffe4e1 });

  for (let i = 0; i < starCount; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.set(
      -Math.random() * 140 + 100,
      Math.random() * 200 - 100,
      Math.random() * 200 - 100
    );
    stars.push(star);
    scene.add(star);
  }

  document.addEventListener("mousemove", onDocumentMouseMove, false);
}

const characters = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
  'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я',
  '你', '好', '我', '是', '中', '国', '的', '朋', '友',
  'あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ', 'た', 'ち', 'つ', 'て', 'と', 'な', 'に', 'ぬ', 'ね', 'の', 'は', 'ひ', 'ふ', 'へ', 'ほ'
];

function changeText(element) {
  const originalText = element.textContent;
  let convertedText = "";

  for (let i = 0; i < originalText.length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];
    convertedText += randomCharacter;
  }

  element.textContent = convertedText;
}

function resetText(element) {
  const originalText = element.dataset.originalText;
  element.textContent = originalText;
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

function animate() {
  requestAnimationFrame(animate);

  cluster.position.x = mouse.x * 2;
  cluster.position.y = -mouse.y * 2;

  cluster.rotation.x = mouse.y * 0.5;
  cluster.rotation.y = mouse.x * 0.5;

  cluster.children.forEach((mesh) => {
    mesh.rotation.x += Math.random() * 0.01;
    mesh.rotation.y += Math.random() * 0.02;
    mesh.rotation.z += Math.random() * 0.01;
  });

  stars.forEach((star) => {
    star.position.x += (Math.random() - 0.25) * 0.1;
    star.position.y += (Math.random() - 0.25) * 0.1;
    star.position.z += (Math.random() - 0.25) * 0.1;
  });

  renderer.render(scene, camera);
}


init();
animate();


