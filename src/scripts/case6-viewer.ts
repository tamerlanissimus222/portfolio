import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type ModelPart = { node: string; label: string; color: number };
type ModelConfig = { file: string; title: string; parts: ModelPart[] };

const models: Record<'left' | 'right' | 'case1' | 'case7' | 'case8' | 'case9', ModelConfig> = {
  case1: {
    file: 'case1-assembly.glb',
    title: 'Case 01 · scan and socket assembly',
    parts: [
      { node: 'Scan', label: 'Residual-limb scan', color: 0xd4a68a },
      { node: 'metki', label: 'Anatomical markers', color: 0xb9d679 },
      { node: 'IS V3 max Pom', label: 'Inner socket', color: 0x87cfd6 },
      { node: 'OS V3 Pom', label: 'Outer socket', color: 0x648fd9 },
    ],
  },
  left: {
    file: 'case6-left.glb',
    title: 'Left hand · six model elements',
    parts: [
      { node: 'ExtSock', label: 'Outer socket', color: 0x547ee6 },
      { node: 'InnSock', label: 'Inner socket', color: 0x9ad8ec },
      { node: 'Palm', label: 'Palm', color: 0x42b6bf },
      { node: 'Pinch', label: 'Pinch', color: 0x9c80df },
      { node: 'Strape', label: 'Strap', color: 0xb7c5de },
      { node: '№1.obj', label: 'Fingers', color: 0x718ce1 },
    ],
  },
  right: {
    file: 'case6-right.glb',
    title: 'Right hand · six model elements',
    parts: [
      { node: 'Pinch.obj', label: 'Pinch', color: 0xc96775 },
      { node: 'Palm.obj', label: 'Palm', color: 0xe5886d },
      { node: 'ExtSock', label: 'Outer socket', color: 0xf0a458 },
      { node: 'fingers', label: 'Fingers', color: 0xd27b59 },
      { node: 'InnSock', label: 'Inner socket', color: 0xf2cf98 },
      { node: 'Strap', label: 'Strap', color: 0xb9a59b },
    ],
  },
  case7: {
    file: 'case7-assembly.glb',
    title: 'Case 07 · eight model elements',
    parts: [
      { node: 'Fingers', label: 'Fingers', color: 0xde8261 },
      { node: 'FingersBend', label: 'FingersBend', color: 0xf0ad66 },
      { node: 'Fist', label: 'Fist', color: 0xa96e96 },
      { node: 'Forearm IS', label: 'Forearm IS', color: 0x94c7d6 },
      { node: 'Forearm OS', label: 'Forearm OS', color: 0x6187d1 },
      { node: 'Palm', label: 'Palm', color: 0xd4a68a },
      { node: 'Wrist IS', label: 'Wrist IS', color: 0x6dbaba },
      { node: 'Wrist OS', label: 'Wrist OS', color: 0x8f87cc },
    ],
  },
  case8: {
    file: 'case8-assembly.glb',
    title: 'Case 08 · three model elements',
    parts: [
      { node: 'Scan', label: 'Scan', color: 0xd4a68a },
      { node: 'Inner socket', label: 'Inner socket', color: 0x87cfd6 },
      { node: 'Outer socket', label: 'Outer socket', color: 0x648fd9 },
    ],
  },
  case9: {
    file: 'case9-assembly.glb',
    title: 'Case 09 · interactive assembly',
    parts: [
      { node: 'Scan', label: 'Scan', color: 0xd4a68a },
      { node: 'Outer socket', label: 'Outer socket + forearm', color: 0x618bd6 },
      { node: 'Inner socket', label: 'Inner socket + forearm', color: 0x87cfd6 },
      { node: 'Battery', label: 'Battery', color: 0xeaa65c },
      { node: 'Button', label: 'Button', color: 0xf2c772 },
      { node: 'EMGPlate', label: 'EMG plate', color: 0x96bddf },
      { node: 'FingersPinch', label: 'Fingers · pinch', color: 0xc275a6 },
      { node: 'FingersPalm', label: 'Fingers · open', color: 0xde8261 },
      { node: 'FinersFist', label: 'Fingers · fist', color: 0x998acc },
      { node: 'HealthyHand', label: 'Healthy hand', color: 0xbaa196 },
      { node: 'Tiny', label: 'Small component', color: 0x7dbba6 },
    ],
  },
};

const viewer = document.querySelector<HTMLElement>('[data-case-model-viewer]');
const viewport = viewer?.querySelector<HTMLElement>('[data-viewer-canvas]');
const status = viewer?.querySelector<HTMLElement>('[data-viewer-status]');
const title = viewer?.querySelector<HTMLElement>('[data-viewer-title]');
const parts = viewer?.querySelector<HTMLElement>('[data-viewer-parts]');
const reset = viewer?.querySelector<HTMLButtonElement>('[data-viewer-reset]');

if (viewer && viewport && status && title && parts && reset) {
  const modelId = viewer.dataset.model === 'case1'
    ? 'case1'
    : viewer.dataset.model === 'case9'
    ? 'case9'
    : viewer.dataset.model === 'case8'
    ? 'case8'
    : viewer.dataset.model === 'case7'
    ? 'case7'
    : new URLSearchParams(location.search).get('hand') === 'right' ? 'right' : 'left';
  const config = models[modelId];
  const assetBase = viewer.dataset.assetBase ?? '/media/case6/';
  const decoderBase = viewer.dataset.decoderBase ?? '/vendor/draco/';
  title.textContent = config.title;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08192d);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 10000);
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch {
    status.textContent = '3D viewing is not available in this browser.';
    throw new Error('WebGL renderer unavailable');
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.localClippingEnabled = modelId === 'case8';
  viewport.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xe7f0ff, 0x556780, 2.4));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.9);
  keyLight.position.set(4, 6, 8);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(modelId === 'left' ? 0x74aaff : 0xffad79, 1.8);
  rimLight.position.set(-5, 3, -5);
  scene.add(rimLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.screenSpacePanning = true;

  const homePosition = new THREE.Vector3();
  const homeTarget = new THREE.Vector3();
  const objects = new Map<string, THREE.Object3D>();
  const buttons = new Map<string, HTMLButtonElement>();
  const sliders = new Map<string, HTMLInputElement>();
  const sectionPanel = viewer.querySelector<HTMLElement>('[data-viewer-section]');
  const axisFieldset = sectionPanel?.querySelector<HTMLFieldSetElement>('[data-section-axes]');
  const axisInputs = sectionPanel ? [...sectionPanel.querySelectorAll<HTMLInputElement>('[data-section-axis]')] : [];
  const depthSlider = sectionPanel?.querySelector<HTMLInputElement>('[data-section-depth]');
  const depthValue = sectionPanel?.querySelector<HTMLOutputElement>('[data-section-value]');
  const reverseButton = sectionPanel?.querySelector<HTMLButtonElement>('[data-section-reverse]');
  const sectionPlane = new THREE.Plane();
  let sectionBounds: THREE.Box3 | undefined;
  let sectionReversed = false;
  let clippingActive = false;
  const eye = '<svg class="viewer__eye" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12c2.6-4 6-6 10-6s7.4 2 10 6c-2.6 4-6 6-10 6S4.6 16 2 12Z"/><circle cx="12" cy="12" r="3"/><line x1="3" y1="21" x2="21" y2="3"/></svg>';
  const initiallyVisible = new Set(modelId === 'case1'
    ? ['IS V3 max Pom', 'OS V3 Pom']
    : [modelId === 'case9' ? 'Scan' : modelId === 'case8' ? 'Outer socket' : 'Palm']);

  const updateSection = () => {
    if (!sectionBounds || !depthSlider) return;
    const axis = axisInputs.find((input) => input.checked)?.value as 'x' | 'y' | 'z' | undefined;
    depthSlider.disabled = !axis;
    if (reverseButton) reverseButton.disabled = !axis;
    if (depthValue) depthValue.textContent = `${depthSlider.value}%`;

    if (axis) {
      const min = sectionBounds.min[axis];
      const max = sectionBounds.max[axis];
      const span = Math.max(max - min, 1e-6);
      const depth = Number(depthSlider.value) / 100;
      const threshold = sectionReversed
        ? max - span * depth - (depth === 1 ? span * 0.001 : 0)
        : min + span * depth + (depth === 1 ? span * 0.001 : 0);
      const direction = sectionReversed ? -1 : 1;
      sectionPlane.normal.set(axis === 'x' ? direction : 0, axis === 'y' ? direction : 0, axis === 'z' ? direction : 0);
      sectionPlane.constant = sectionReversed ? threshold : -threshold;
    }

    const enabled = Boolean(axis);
    if (enabled !== clippingActive) {
      for (const object of objects.values()) {
        object.traverse((child) => {
          if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshStandardMaterial)) return;
          child.material.clippingPlanes = enabled ? [sectionPlane] : [];
          child.material.needsUpdate = true;
        });
      }
      clippingActive = enabled;
    }
  };

  axisInputs.forEach((input) => input.addEventListener('change', () => {
    if (input.checked) axisInputs.forEach((other) => { if (other !== input) other.checked = false; });
    updateSection();
  }));
  depthSlider?.addEventListener('input', updateSection);
  reverseButton?.addEventListener('click', () => {
    sectionReversed = !sectionReversed;
    reverseButton.setAttribute('aria-pressed', String(sectionReversed));
    updateSection();
  });

  config.parts.forEach((part, index) => {
    const isVisible = initiallyVisible.has(part.node);
    const row = document.createElement('div');
    row.className = 'viewer__part';
    row.style.setProperty('--part-color', `#${part.color.toString(16).padStart(6, '0')}`);
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(isVisible));
    button.setAttribute('aria-label', `${isVisible ? 'Hide' : 'Show'} ${part.label}`);
    button.innerHTML = `${eye}<span class="viewer__swatch" aria-hidden="true"></span><span>${part.label}</span>`;
    button.addEventListener('click', () => {
      const visible = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(visible));
      button.setAttribute('aria-label', `${visible ? 'Hide' : 'Show'} ${part.label}`);
      const object = objects.get(part.node);
      if (object) object.visible = visible;
      if (modelId === 'case1' && part.node === 'Scan') frameCase1();
    });
    const opacityLabel = document.createElement('label');
    opacityLabel.className = 'viewer__opacity';
    const opacityId = `case-model-opacity-${modelId}-${index}`;
    opacityLabel.htmlFor = opacityId;
    opacityLabel.innerHTML = '<span>Opacity</span>';
    const value = document.createElement('output');
    value.textContent = '100%';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = opacityId;
    slider.min = '0';
    slider.max = '100';
    slider.step = '5';
    slider.value = '100';
    slider.setAttribute('aria-label', `${part.label} opacity`);
    slider.addEventListener('input', () => {
      const opacity = Number(slider.value) / 100;
      value.textContent = `${slider.value}%`;
      objects.get(part.node)?.traverse((child) => {
        if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.MeshStandardMaterial)) return;
        child.material.opacity = opacity;
        child.material.transparent = opacity < 1;
        child.material.depthWrite = opacity === 1;
        child.material.needsUpdate = true;
      });
    });
    opacityLabel.append(value, slider);
    row.append(button, opacityLabel);
    parts.appendChild(row);
    buttons.set(part.node, button);
    sliders.set(part.node, slider);
  });

  const resize = () => {
    const width = viewport.clientWidth || 1;
    const height = viewport.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(viewport);
  resize();

  const frameModel = (root: THREE.Object3D | THREE.Box3) => {
    const box = root instanceof THREE.Box3 ? root : new THREE.Box3().setFromObject(root);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const span = Math.max(size.x, size.y, size.z);
    const distance = span / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    homeTarget.copy(center);
    const zoom = modelId === 'case9'
      ? 1.1 * Math.max(1, 0.75 / camera.aspect)
      : modelId === 'case8' ? 0.75 * Math.max(1, 0.75 / camera.aspect)
      : modelId === 'case1' && objects.get('Scan')?.visible ? 1.3 : 1;
    homePosition.copy(center).add(new THREE.Vector3(distance * 0.6 * zoom, distance * 0.32 * zoom, distance * 1.25 * zoom));
    camera.position.copy(homePosition);
    camera.near = Math.max(span / 10000, 0.01);
    camera.far = Math.max(span * 100, 100);
    camera.updateProjectionMatrix();
    controls.target.copy(homeTarget);
    controls.minDistance = Math.max(span * 0.35, 0.01);
    controls.maxDistance = Math.max(span * 8, 10);
    controls.update();
  };

  const frameCase1 = () => {
    const box = new THREE.Box3();
    for (const object of objects.values()) if (object.visible) box.expandByObject(object);
    if (!box.isEmpty()) frameModel(box);
  };

  reset.addEventListener('click', () => {
    camera.position.copy(homePosition);
    controls.target.copy(homeTarget);
    controls.update();
  });

  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  const draco = new DRACOLoader();
  draco.setDecoderPath(decoderBase);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.loadAsync(`${assetBase}${config.file}`, (event) => {
    if (event.total > 0) status.textContent = `Loading 3D model… ${Math.round(100 * event.loaded / event.total)}%`;
  }).then(({ scene: root }) => {
    scene.add(root);
    const frameObject = modelId === 'case1'
      ? root.getObjectByName('OS_V3_Pom') ?? root.getObjectByName('OS V3 Pom') ?? root.children[5] ?? root
      : modelId === 'case9' ? root.getObjectByName('Scan') ?? root : root;
    frameModel(frameObject);
    if (modelId === 'case1') root.children.forEach((child) => { child.visible = false; });
    config.parts.forEach((part, index) => {
      // GLTFLoader normalises punctuation in node names (notably "№1.obj").
      // The exported scene has one top-level node per ordered part.
      const object = root.getObjectByName(part.node)
        ?? root.getObjectByName(part.node.replaceAll(' ', '_'))
        ?? (modelId === 'case1' ? undefined : root.children[index]);
      if (!object) {
        const button = buttons.get(part.node);
        if (button) button.disabled = true;
        const slider = sliders.get(part.node);
        if (slider) slider.disabled = true;
        return;
      }
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.material = new THREE.MeshStandardMaterial({
          color: part.color,
          roughness: 0.52,
          metalness: part.label === 'Fingers' ? 0.23 : 0.08,
          side: THREE.DoubleSide,
        });
      });
      object.visible = buttons.get(part.node)?.getAttribute('aria-pressed') === 'true';
      objects.set(part.node, object);
    });
    if (modelId === 'case1' && objects.get('Scan')?.visible) frameCase1();
    if (sectionPanel) {
      sectionBounds = new THREE.Box3().setFromObject(root);
      if (axisFieldset) axisFieldset.disabled = false;
      updateSection();
    }
    status.hidden = true;
  }).catch(() => {
    status.textContent = 'The 3D model could not be loaded.';
  });
}
