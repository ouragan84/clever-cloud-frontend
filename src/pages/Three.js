import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function MyThree({ items }) {
  const refContainer = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, refContainer.current.clientWidth / refContainer.current.clientHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(refContainer.current.clientWidth, refContainer.current.clientHeight);
    refContainer.current.appendChild(renderer.domElement);

    // Axes helper (much easier and more accurate for drawing axes)
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const geometry = new THREE.SphereGeometry(0.1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    items.forEach(item => {
      const { pca_vector } = item;
      if (pca_vector && pca_vector.length === 3) {
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(pca_vector[0]*10, pca_vector[1]*10, pca_vector[2]*10);
        scene.add(sphere);
      }
    });

    let angle = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      angle += 0.005;
      camera.position.x = 5 * Math.sin(angle);
      camera.position.z = 5 * Math.cos(angle);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.remove();
      renderer.dispose();
      scene.clear();
    };
  }, [items]);

  return <div ref={refContainer} style={{ width: '100%', height: '400px' }} />;
}

export default MyThree;
