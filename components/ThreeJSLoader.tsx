import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeJSLoaderProps {
  className?: string;
}

const ThreeJSLoader: React.FC<ThreeJSLoaderProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      1, // aspect ratio will be 1:1 for square container
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'low-power' // Better for mobile
    });
    renderer.setSize(200, 200); // Fixed size for consistency
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create floating hexagons background
    const hexagons: THREE.Mesh[] = [];
    const hexagonGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 6);
    
    for (let i = 0; i < 15; i++) {
      const hexagonMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5),
        transparent: true,
        opacity: 0.3 + Math.random() * 0.4,
        shininess: 100
      });
      
      const hexagon = new THREE.Mesh(hexagonGeometry, hexagonMaterial);
      
      // Random position
      hexagon.position.x = (Math.random() - 0.5) * 8;
      hexagon.position.y = (Math.random() - 0.5) * 6;
      hexagon.position.z = (Math.random() - 0.5) * 4;
      
      // Random rotation
      hexagon.rotation.x = Math.random() * Math.PI;
      hexagon.rotation.y = Math.random() * Math.PI;
      hexagon.rotation.z = Math.random() * Math.PI;
      
      hexagons.push(hexagon);
      scene.add(hexagon);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x888888, 0.5);
    pointLight.position.set(-3, -3, 3);
    scene.add(pointLight);

    // Animation
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Animate hexagons
      hexagons.forEach((hexagon, index) => {
        // Slow rotation
        hexagon.rotation.x += 0.005 + index * 0.001;
        hexagon.rotation.y += 0.003 + index * 0.0005;
        hexagon.rotation.z += 0.002 + index * 0.0003;
        
        // Floating movement
        hexagon.position.y += Math.sin(time * 2 + index) * 0.002;
        hexagon.position.x += Math.cos(time * 1.5 + index) * 0.001;
        
        // Pulsing opacity
        const opacity = 0.2 + Math.sin(time * 3 + index) * 0.3;
        (hexagon.material as THREE.MeshPhongMaterial).opacity = Math.max(0.1, opacity);
      });

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (renderer && mountRef.current) {
        const size = Math.min(mountRef.current.clientWidth, mountRef.current.clientHeight, 200);
        renderer.setSize(size, size);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width: '200px', 
        height: '200px',
        margin: '0 auto'
      }}
    />
  );
};

export default ThreeJSLoader;