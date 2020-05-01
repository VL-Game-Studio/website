import React, { useEffect, useRef, memo } from 'react';
import styled, { useTheme } from 'styled-components/macro';
import { PerspectiveCamera, Scene, Color, Fog, AmbientLight, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Transition } from 'react-transition-group';
import Timeline3D from './Timeline3D';
import { usePrefersReducedMotion } from 'hooks';
import { reflow, isVisible } from 'utils/transition';

function TimelineScene(props) {
  const { colorBackground, colorWhite } = useTheme();
  const width = useRef(window.innerWidth);
  const height = useRef(window.innerHeight);
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const light = useRef();
  const controls = useRef();
  const timeline = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    camera.current = new PerspectiveCamera(35, width.current / height.current, 1, 10000);

    scene.current = new Scene();
    scene.current.background = new Color(colorBackground);

    scene.current.fog = new Fog(colorBackground, 400, 827);

    timeline.current = new Timeline3D();
    timeline.current.build(scene.current);

    scene.current.add(timeline.current.Components);
    timeline.current.Components.position.y = 0;

    light.current = new AmbientLight(colorWhite);
    light.current.position.set(0, 1, 0).normalize();
    scene.current.add(light.current);

    camera.current.position.x = 0;
    camera.current.position.y = 172;
    camera.current.position.z = 790;

    camera.current.lookAt(0, -100, -66);
    camera.current.updateProjectionMatrix();

    renderer.current = new WebGLRenderer({
      antialias: true
    });
    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize(width.current, height.current);
    canvasRef.current.appendChild(renderer.current.domElement);

    renderer.current.sortObjects = false;

    controls.current = new OrbitControls(camera.current, renderer.current.domElement);

    return function cleanUp() {
      scene.current.remove(timeline.current);
      scene.current.remove(light.current);
      timeline.current.dispose();
      renderer.current.dispose();
      scene.current.dispose();
      camera.current = null;
      light.current = null;
      timeline.current = null;
      renderer.current.domElement = null;
    };
  }, [colorBackground, colorWhite]);

  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      canvasRef.current.style.height = windowHeight;
      renderer.current.setSize(windowWidth, windowHeight);
      camera.current.aspect = windowWidth / windowHeight;
      camera.current.updateProjectionMatrix();

      if (prefersReducedMotion) {
        renderer.current.render(scene.current, camera.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    let animation;

    const animate = () => {
      animation = requestAnimationFrame(animate);
      controls.current.update();
      renderer.current.render(scene.current, camera.current);
    };

    if (!prefersReducedMotion) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
    }

    return function cleanup() {
      cancelAnimationFrame(animation);
    };
  }, [prefersReducedMotion]);

  return (
    <Transition appear in onEnter={reflow} timeout={3000}>
      {status =>
        <TimelineSceneCanvas aria-hidden status={status} ref={canvasRef} {...props} />
      }
    </Transition>
  );
}

const TimelineSceneCanvas = styled.canvas`
  bottom: 0;
  left: 0;
  opacity: ${props => isVisible(props.status) ? 1 : 0};
  position: absolute;
  right: 0;
  top: 0;
  transition-duration: 3s;
  transition-property: opacity;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
  width: 100vw;
`;

export default memo(TimelineScene);
