import React, { useEffect, useRef, memo } from 'react';
import styled, { useTheme } from 'styled-components/macro';
import {
  Object3D, Vector3, CanvasTexture, LinearFilter, SpriteMaterial, Sprite,
  LineBasicMaterial, BufferGeometry, BufferAttribute, Matrix4, Line,
  PerspectiveCamera, Scene, Color, Fog, AmbientLight, WebGLRenderer } from 'three';
import innerHeight from 'ios-inner-height';
import { Transition } from 'react-transition-group';
import { usePrefersReducedMotion } from 'hooks';
import { reflow, isVisible } from 'utils/transition';
import sceneParams from 'data/sceneParams';

let blockElementCounter = 0, rowBlockCounter = 0, yearBlockCounter = 0;

const Timeline3D = function() {
  this.Components = new Object3D();

  this.map = {
    years: [],
    months: [],
    categories: []
  };

  for (let i = 0; i < sceneParams.tl.numYears; i++) {
    const year = {
      id: i,
      value: 2019 - i,
      position: new Vector3()
    };

    this.map.years.push(year);
  }

  for (let j = 0; j < sceneParams.tl.numYearDivisions; j++) {
    const month = {
      id: j,
      position: new Vector3(),
    };

    this.map.months.push(month);
  }

  for (let k = 0; k < sceneParams.tl.numSections; k++) {
    const category = {
      id: k,
      value: sceneParams.sectionLabels[k],
      position: new Vector3(),
    };

    this.map.categories.push(category);
  }
};

Timeline3D.prototype.build = function(scene) {
  const timelineFloor = this.makeTimelineFloor();

  this.Components.add(timelineFloor);
  this.Components.timelineFloor = timelineFloor;

  const categoryLabels = this.makeCategoryLabels();
  scene.add(categoryLabels);

  this.Components.position.x -= sceneParams.gridElement.width * sceneParams.tl.numSections / 2;
  this.Components.position.z += sceneParams.gridElement.height * sceneParams.tl.numYears * sceneParams.tl.numYearDivisions / 2;
  this.Components.minPositionZ = this.Components.position.z;
  this.Components.maxPositionZ = this.Components.position.z + sceneParams.gridElement.height * (sceneParams.tl.numYears - 1) * sceneParams.tl.numYearDivisions;
};

Timeline3D.prototype.makeTimelineFloor = function() {
  const timelineFloor = new Object3D();
  timelineFloor.years = [];

  for (let i = 0; i < sceneParams.tl.numYears; i++) {
    const year_value = this.map.years[i].value;
    const newYear = this.makeBlockYear(year_value, i);

    this.map.years[i].position.z = newYear.position.z;

    timelineFloor.add(newYear);
    timelineFloor.years.push(newYear);
  }

  return timelineFloor;
};

Timeline3D.prototype.makeBlockYear = function(year_value, index) {
  const YearBlock = new Object3D();

  YearBlock.key = yearBlockCounter++;
  YearBlock.value = year_value;
  YearBlock.size = sceneParams.gridElement.height * sceneParams.tl.numYearDivisions;
  YearBlock.position.z = -index * YearBlock.size;
  YearBlock.bars = [];

  rowBlockCounter = 0;

  for (let i = 0; i < sceneParams.tl.numYearDivisions; i++) {
    const newBar = this.makeBlockBar(index * YearBlock.size, i);

    YearBlock.add(newBar);
    YearBlock.bars.push(newBar);

    this.map.months[i].position.z = newBar.position.z;
  }

  const billboard = new Object3D();
  YearBlock.add(billboard);
  YearBlock.billboard = billboard;

  const newBoard = makeYearBoard(year_value);
  YearBlock.billboard.add(newBoard);

  function makeYearBoard(year) {
    const canvas = document.createElement('canvas');
    canvas.width = sceneParams.yearBillboard.width * 6;
    canvas.height = sceneParams.yearBillboard.height * 6;

    const ctx = canvas.getContext('2d');
    ctx.font = 'bold 75px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(year, canvas.width / 2, canvas.height / 1.3);

    const yearTexture = new CanvasTexture(canvas);
    yearTexture.minFilter = LinearFilter;
    yearTexture.magFilter = LinearFilter;

    const spriteMaterial = new SpriteMaterial({
      map: yearTexture,
      color: 0xffffff,
      transparent: true,
    });

    const mesh = new Sprite(spriteMaterial);
    mesh.scale.set(sceneParams.yearBillboard.width, sceneParams.yearBillboard.height, 1);
    mesh.position.set(-16, 10, 0);
    return mesh;
  }

  const newOutline = makeOutline();
  YearBlock.billboard.add(newOutline);

  function makeOutline() {
    const line_material = new LineBasicMaterial({
      color: sceneParams.linegridColor,
      linewidth: 1,
      transparent: true,
    });

    const line_geometry = new BufferGeometry();
    const vertices = new Float32Array([
      0.0, 0.0, 0.0,
      -30.0, 0.0, 0.0,
    ]);
    line_geometry.addAttribute('position', new BufferAttribute(vertices, 3));
    const outline = new Line(line_geometry, line_material);

    return outline;
  }

  return YearBlock;
};

Timeline3D.prototype.makeBlockBar = function(yearPosZ, index) {
  const Bar = new Object3D();
  Bar.key = rowBlockCounter++;
  Bar.coord = new Vector3();
  Bar.coord.z = yearPosZ - index * sceneParams.gridElement.height - sceneParams.gridElement.height;
  Bar.applyMatrix(new Matrix4().makeScale(1, 1, -1));
  Bar.position.z = -index * sceneParams.gridElement.height - sceneParams.gridElement.height;

  blockElementCounter = 0;
  Bar.sections = [];

  for (let i = 0; i < sceneParams.tl.numSections; i++) {
    const newBlockElement = this.makeBlockElement(i, Bar.coord.z);

    Bar.add(newBlockElement);
    Bar.sections.push(newBlockElement);

    this.map.categories[i].position.x = newBlockElement.position.x;
  }

  return Bar;
};

Timeline3D.prototype.makeBlockElement = function(index, parentCoordZ) {
  const blockElement = new Object3D();
  blockElement.position.x = index * sceneParams.gridElement.width;
  blockElement.coord = new Vector3();
  blockElement.coord.x = blockElement.position.x;
  blockElement.coord.y = 0;
  blockElement.coord.z = parentCoordZ;
  blockElement.key = blockElementCounter++;

  const line_material = new LineBasicMaterial({
    color: sceneParams.linegridColor,
    linewidth: 1,
  });

  const line_geometry = new BufferGeometry();
  const vertices = new Float32Array([
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, -1.0,
    0.0, 0.0, -1.0,
    0.0, 0.0, 0.0
  ]);

  line_geometry.addAttribute('position', new BufferAttribute(vertices, 3));
  line_geometry.scale(sceneParams.gridElement.width, sceneParams.gridElement.height, sceneParams.gridElement.height);

  const lineBlock = new Line(line_geometry, line_material);
  blockElement.add(lineBlock);
  blockElement.lineBlock = lineBlock;

  return blockElement;
};

Timeline3D.prototype.makeCategoryLabels = function() {
  const sectionEndingsGroup = new Object3D();

  for (let i = 0; i < sceneParams.tl.numSections; i++) {
    let spriteMaterial = new SpriteMaterial({
      color: sceneParams.sectionColors[i],
      transparent: true,
    });

    const mesh = new Sprite(spriteMaterial);
    mesh.scale.set(sceneParams.gridElement.width, 4, 1);
    mesh.position.set(i * sceneParams.gridElement.width + sceneParams.gridElement.width / 2, 0, 0);
    sectionEndingsGroup.add(mesh);

    //make category title
    const canvas = document.createElement('canvas');
    canvas.width = sceneParams.gridElement.width * 10;
    canvas.height = 20 * 10;

    const ctx = canvas.getContext('2d');
    ctx.font = '31px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(sceneParams.sectionLabels[i], canvas.width / 2, canvas.height / 2);

    const categoryTexture = new CanvasTexture(canvas);
    categoryTexture.minFilter = LinearFilter;
    categoryTexture.magFilter = LinearFilter;

    spriteMaterial = new SpriteMaterial({
      map: categoryTexture,
      color: 0xffffff,
      transparent: true,
    });

    const label = new Sprite(spriteMaterial);
    label.scale.set(sceneParams.gridElement.width, 20, 1);
    label.position.set(i * sceneParams.gridElement.width + sceneParams.gridElement.width / 2, -8, 1);

    sectionEndingsGroup.add(label);
  }

  sectionEndingsGroup.position.x = -sceneParams.tl.numSections * sceneParams.gridElement.width / 2;
  sectionEndingsGroup.position.y = -1.75;
  sectionEndingsGroup.position.z = sceneParams.tl.numYears * sceneParams.tl.numYearDivisions * sceneParams.gridElement.height / 2 + 1;

  return sectionEndingsGroup;
};

function TimelineScene(props) {
  const { colorBackground, colorWhite } = useTheme();
  const width = useRef(window.innerWidth);
  const height = useRef(window.innerHeight);
  const canvasRef = useRef();
  const renderer = useRef();
  const camera = useRef();
  const scene = useRef();
  const light = useRef();
  const timeline = useRef();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    camera.current = new PerspectiveCamera(35, width.current / height.current, 1, 10000);

    scene.current = new Scene();
    scene.current.background = new Color(colorBackground);

    scene.current.fog = new Fog(colorBackground, 400, 827);

    light.current = new AmbientLight(colorWhite);
    light.current.position.set(0, 1, 0).normalize();
    scene.current.add(light.current);

    timeline.current = new Timeline3D();
    timeline.current.build(scene.current);

    scene.current.add(timeline.current.Components);
    timeline.current.Components.position.y = 0;

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
  }, [colorBackground, colorWhite]);

  useEffect(() => {
    const handleResize = () => {
      const fullHeight = innerHeight();
      const windowWidth = window.innerWidth;
      canvasRef.current.style.height = fullHeight;
      renderer.current.setSize(windowWidth, fullHeight);
      camera.current.aspect = windowWidth / fullHeight;
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
  position: absolute;
  width: 100vw;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${props => isVisible(props.status) ? 1 : 0};
  transition-property: opacity;
  transition-duration: 3s;
  transition-timing-function: ${props => props.theme.curveFastoutSlowin};
`;

export default memo(TimelineScene);
