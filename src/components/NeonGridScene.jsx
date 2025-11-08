import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Simple lens flare-like horizontal glow (anamorphic) shader
const AnamorphicFlaresShader = {
  uniforms: {
    tDiffuse: { value: null },
    intensity: { value: 0.25 },
    direction: { value: new THREE.Vector2(1.0, 0.0) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float intensity;
    uniform vec2 direction;
    varying vec2 vUv;
    void main() {
      vec4 col = texture2D(tDiffuse, vUv);
      // sample horizontally for subtle streaks
      for (int i = -6; i <= 6; i++) {
        float f = float(i);
        col += texture2D(tDiffuse, vUv + direction * f * 0.002) * (0.06 * (1.0 - abs(f)/6.0));
      }
      gl_FragColor = mix(texture2D(tDiffuse, vUv), col, intensity);
    }
  `
};

// Subtle barrel distortion shader
const BarrelDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.06 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main(){
      vec2 uv = vUv * 2.0 - 1.0;
      float r2 = dot(uv, uv);
      vec2 distorted = uv * (1.0 + amount * r2);
      vec2 sampleUv = (distorted + 1.0) * 0.5;
      vec4 color = texture2D(tDiffuse, sampleUv);
      gl_FragColor = color;
    }
  `
};

export default function NeonGridScene() {
  const mountRef = useRef(null);
  const overlayRefs = useRef({});

  // Precompute gradient for grid material
  const palette = useMemo(() => ({
    bg: 0x050a14,
    cyan: 0x00f0ff,
    pink: 0xf000ff,
    white: 0xffffff,
  }), []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Sizes
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(palette.bg, 1);
    container.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

    // Postprocessing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 1.6, 0.4, 0.01);
    composer.addPass(bloom);

    const anamorphic = new ShaderPass(AnamorphicFlaresShader);
    composer.addPass(anamorphic);

    const barrel = new ShaderPass(BarrelDistortionShader);
    composer.addPass(barrel);

    // Grid floor
    const grid = new THREE.GridHelper(1000, 200, palette.cyan, palette.pink);
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    scene.add(grid);

    // Digital rain (points)
    const rainCount = 3000;
    const rainGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400; // x
      positions[i * 3 + 1] = Math.random() * 200 + 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400; // z
    }
    rainGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const rainMat = new THREE.PointsMaterial({ color: palette.white, size: 0.05, transparent: true, opacity: 0.6 });
    const rain = new THREE.Points(rainGeom, rainMat);
    scene.add(rain);

    // Floating 3D text sign (simple box proxy with emissive wireframe look)
    const signGeom = new THREE.BoxGeometry(20, 6, 0.5);
    const signMat = new THREE.MeshBasicMaterial({ color: palette.white, wireframe: true });
    const sign = new THREE.Mesh(signGeom, signMat);
    sign.position.set(0, 50, 0);
    scene.add(sign);

    // Shifting wireframe cubes tower
    const towerGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
      const size = 3 + Math.random() * 4;
      const box = new THREE.BoxGeometry(size, size, size);
      const edges = new THREE.EdgesGeometry(box);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: i % 2 ? palette.cyan : palette.pink })
      );
      line.position.set(20 + Math.sin(i * 0.3) * 3, i * 1.5, -60 + Math.cos(i * 0.2) * 3);
      towerGroup.add(line);
    }
    scene.add(towerGroup);

    // Gallery district shapes
    const gallery = new THREE.Group();
    const ico = new THREE.IcosahedronGeometry(6, 0);
    const icoMesh = new THREE.LineSegments(new THREE.EdgesGeometry(ico), new THREE.LineBasicMaterial({ color: palette.white }));
    icoMesh.position.set(-20, 10, -30);
    gallery.add(icoMesh);
    const torusKnot = new THREE.TorusKnotGeometry(4, 1.2, 120, 16);
    const knot = new THREE.LineSegments(new THREE.EdgesGeometry(torusKnot), new THREE.LineBasicMaterial({ color: palette.cyan }));
    knot.position.set(-28, 8, -20);
    gallery.add(knot);
    scene.add(gallery);

    // Media tower with glitching planes
    const mediaTower = new THREE.Group();
    for (let i = 0; i < 12; i++) {
      const plane = new THREE.PlaneGeometry(8 + Math.sin(i) * 2, 4 + Math.cos(i) * 1.2);
      const mat = new THREE.MeshBasicMaterial({ color: i % 2 ? palette.cyan : palette.pink, wireframe: true, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(plane, mat);
      mesh.position.set(0 + Math.sin(i * 0.5) * 4, i * 1.5 + 8, 20 + Math.cos(i * 0.5) * 4);
      mesh.rotation.y = i * 0.3;
      mediaTower.add(mesh);
    }
    scene.add(mediaTower);

    // Beacon pulse
    const beaconGeom = new THREE.SphereGeometry(2, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: palette.cyan, wireframe: true });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(0, 2, 0);
    scene.add(beacon);

    // Camera path controlled by scroll
    const pathPoints = [
      new THREE.Vector3(0, 120, 0),    // 0%: above city looking down
      new THREE.Vector3(10, 30, -40),  // 25%: diving toward tower
      new THREE.Vector3(-25, 12, -25), // 50%: gallery canyon
      new THREE.Vector3(0, 10, 25),    // 75%: inside media tower
      new THREE.Vector3(0, 80, 80),    // 100%: ascend and look back
    ];

    const lookAtPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(22, 35, -60),
      new THREE.Vector3(-20, 10, -25),
      new THREE.Vector3(0, 15, 25),
      new THREE.Vector3(0, 0, 0),
    ];

    const curve = new THREE.CatmullRomCurve3(pathPoints, false, 'catmullrom', 0.5);
    const lookCurve = new THREE.CatmullRomCurve3(lookAtPoints, false, 'catmullrom', 0.5);

    const sections = [
      { start: 0.0, end: 0.25, id: 'landing' },
      { start: 0.25, end: 0.5, id: 'web' },
      { start: 0.5, end: 0.75, id: 'design' },
      { start: 0.75, end: 1.0, id: 'video' },
    ];

    const setBodyHeight = () => {
      const total = 6000; // virtual scroll distance
      document.body.style.height = `${total}px`;
    };
    setBodyHeight();

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);
      bloom.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    let rafId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = Math.min(1, Math.max(0, window.scrollY / (document.body.scrollHeight - window.innerHeight)));

      // Camera along path
      const pos = curve.getPointAt(t);
      const look = lookCurve.getPointAt(t);
      camera.position.lerp(pos, 0.1);
      camera.lookAt(look);

      // Overlay visibility
      const setOpacity = (id, a) => {
        const el = overlayRefs.current[id];
        if (el) el.style.opacity = a.toString();
      };
      setOpacity('landing', t < 0.15 ? 1 : 0);
      setOpacity('web', t > 0.22 && t < 0.45 ? 1 : 0);
      setOpacity('design', t > 0.47 && t < 0.70 ? 1 : 0);
      setOpacity('video', t > 0.72 && t < 0.95 ? 1 : 0);
      setOpacity('contact', t > 0.96 ? 1 : 0);

      // Animations
      const dt = clock.getDelta();
      rain.rotation.y += dt * 0.02;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= dt * (0.5 + (i % 5) * 0.2);
        if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 200;
      }
      rainGeom.attributes.position.needsUpdate = true;

      towerGroup.children.forEach((c, i) => {
        c.rotation.y += 0.005 + i * 0.0005;
        c.position.x += Math.sin(performance.now() * 0.001 + i) * 0.002;
      });

      gallery.children.forEach((c, i) => {
        c.rotation.x += 0.002 + i * 0.0003;
        c.rotation.y += 0.003 + i * 0.0002;
      });

      mediaTower.children.forEach((m, i) => {
        m.rotation.z += 0.01 + i * 0.001;
        m.material.opacity = 0.6 + Math.sin(performance.now() * 0.01 + i) * 0.3;
      });

      beacon.scale.setScalar(1 + Math.sin(performance.now() * 0.004) * 0.2 + 0.2);

      composer.render();
      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      container.removeChild(renderer.domElement);
      composer.dispose();
      renderer.dispose();
      rainGeom.dispose();
    };
  }, [palette]);

  return (
    <section className="relative h-[200vh] md:h-[250vh] w-full bg-[#050a14]">
      <div ref={mountRef} className="sticky top-0 h-screen w-full" />
      {/* Overlays */}
      <div className="pointer-events-none absolute inset-0">
        <div ref={el => (overlayRefs.current.landing = el)} className="transition-opacity duration-700 ease-out absolute inset-x-0 top-24 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold tracking-wider">NEXUS</h2>
          <p className="mt-2 text-cyan-100/80">Enter the Neon Grid</p>
        </div>
        <div ref={el => (overlayRefs.current.web = el)} className="opacity-0 transition-opacity duration-700 ease-out absolute inset-x-0 top-24 text-center text-white">
          <h3 className="text-2xl md:text-4xl font-semibold tracking-widest">WEB DEVELOPMENT</h3>
          <p className="mt-2 max-w-2xl mx-auto px-6 text-cyan-100/80">We build the immersive digital structures of the future.</p>
        </div>
        <div ref={el => (overlayRefs.current.design = el)} className="opacity-0 transition-opacity duration-700 ease-out absolute inset-x-0 top-24 text-center text-white">
          <h3 className="text-2xl md:text-4xl font-semibold tracking-widest">GRAPHIC & LOGO DESIGN</h3>
          <p className="mt-2 max-w-2xl mx-auto px-6 text-cyan-100/80">Forging iconic identities that command attention in the digital noise.</p>
        </div>
        <div ref={el => (overlayRefs.current.video = el)} className="opacity-0 transition-opacity duration-700 ease-out absolute inset-x-0 top-24 text-center text-white">
          <h3 className="text-2xl md:text-4xl font-semibold tracking-widest">VIDEO EDITING</h3>
          <p className="mt-2 max-w-2xl mx-auto px-6 text-cyan-100/80">Crafting cinematic narratives that cut through the static.</p>
        </div>
        <div ref={el => (overlayRefs.current.contact = el)} className="opacity-0 transition-opacity duration-700 ease-out absolute inset-x-0 bottom-24 text-center text-white">
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-wider">LET'S BUILD YOUR UNIVERSE.</h3>
          <div className="mt-6">
            <a href="#contact" className="inline-block rounded-full border border-cyan-400/60 bg-gradient-to-r from-[#00f0ff]/20 to-[#f000ff]/20 px-6 py-3 text-white backdrop-blur hover:from-[#00f0ff]/30 hover:to-[#f000ff]/30 transition shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
