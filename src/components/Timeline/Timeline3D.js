import {
  Object3D, Vector3, CanvasTexture, LinearFilter, SpriteMaterial, Sprite,
  LineBasicMaterial, BufferGeometry, BufferAttribute, Line, Matrix4,
  IcosahedronBufferGeometry, MeshPhongMaterial, Mesh
} from 'three';
import { formatList, timelineData, params } from 'data/timeline';

let blockElementCounter = 0, rowBlockCounter = 0, yearBlockCounter = 0;

const Timeline3D = function() {
  this.Components = new Object3D();

  this.map = {
    years: [],
    months: [],
    categories: []
  }

  for (let i = 0; i < params.tl.numYears; i++) {
    const year = {
      id: i,
      value: 2019 - i,
      position: new Vector3()
    };

    this.map.years.push(year);
  }

  for (let j = 0; j < params.tl.numYearDivisions; j++) {
    const month = {
      id: j,
      position: new Vector3(),
    };

    this.map.months.push(month);
  }

  for (let k = 0; k < params.tl.numSections; k++) {
    const category = {
      id: k,
      value: formatList[k],
      position: new Vector3(),
    };

    this.map.categories.push(category);
  }
}

Timeline3D.prototype.build = function(scene) {
  const timelineFloor = this.makeTimelineFloor();

  this.Components.add(timelineFloor);
  this.Components.timelineFloor = timelineFloor;

  const bansLayer = this.makeTimelineBansLayer();
  this.Components.add(bansLayer);
  this.Components.bansLayer = bansLayer;

  const categoryLabels = this.makeCategoryLabels();
  scene.add(categoryLabels);

  this.Components.position.x -= params.gridElement.width * params.tl.numSections / 2;
  this.Components.position.z += params.gridElement.height * params.tl.numYears * params.tl.numYearDivisions / 2;
  this.Components.minPositionZ = this.Components.position.z;
  this.Components.maxPositionZ = this.Components.position.z + params.gridElement.height * (params.tl.numYears - 1) * params.tl.numYearDivisions
}

Timeline3D.prototype.makeTimelineFloor = function() {
  const timelineFloor = new Object3D();
  timelineFloor.years = [];

  for (let i = 0; i < params.tl.numYears; i++) {
    const year_value = this.map.years[i].value;
    const newYear = this.makeBlockYear(year_value, i);

    this.map.years[i].position.z = newYear.position.z;

    timelineFloor.add(newYear);
    timelineFloor.years.push(newYear);
  }

  return timelineFloor;
}

Timeline3D.prototype.makeBlockYear = function(year_value, index) {
  const YearBlock = new Object3D();

  YearBlock.key = yearBlockCounter++;
  YearBlock.value = year_value;
  YearBlock.size = params.gridElement.height * params.tl.numYearDivisions;
  YearBlock.position.z = -index * YearBlock.size;
  YearBlock.bars = [];

  rowBlockCounter = 0;

  for (let i = 0; i < params.tl.numYearDivisions; i++) {
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
    canvas.width = params.yearBillboard.width * 6;
    canvas.height = params.yearBillboard.height * 6;

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
    mesh.scale.set(params.yearBillboard.width, params.yearBillboard.height, 1)
    mesh.position.set(-16, 10, 0);
    return mesh;
  }

  const newOutline = makeOutline();
  YearBlock.billboard.add(newOutline);

  function makeOutline() {
    const line_material = new LineBasicMaterial({
      color: params.linegridColor,
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
}

Timeline3D.prototype.makeBlockBar = function(yearPosZ, index) {
  const Bar = new Object3D();
  Bar.key = rowBlockCounter++;
  Bar.coord = new Vector3();
  Bar.coord.z = yearPosZ - index * params.gridElement.height - params.gridElement.height;
  Bar.applyMatrix(new Matrix4().makeScale(1, 1, -1));
  Bar.position.z = -index * params.gridElement.height - params.gridElement.height;

  blockElementCounter = 0;
  Bar.sections = [];

  for (let i = 0; i < params.tl.numSections; i++) {
    const newBlockElement = this.makeBlockElement(i, Bar.coord.z);

    Bar.add(newBlockElement);
    Bar.sections.push(newBlockElement);

    this.map.categories[i].position.x = newBlockElement.position.x;
  }

  return Bar;
}

Timeline3D.prototype.makeBlockElement = function(index, parentCoordZ) {
  const blockElement = new Object3D();
  blockElement.position.x = index * params.gridElement.width;
  blockElement.coord = new Vector3();
  blockElement.coord.x = blockElement.position.x;
  blockElement.coord.y = 0;
  blockElement.coord.z = parentCoordZ;
  blockElement.key = blockElementCounter++;

  const line_material = new LineBasicMaterial({
    color: params.linegridColor,
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
  line_geometry.scale(params.gridElement.width, params.gridElement.height, params.gridElement.height);

  const lineBlock = new Line(line_geometry, line_material);
  blockElement.add(lineBlock);
  blockElement.lineBlock = lineBlock;

  return blockElement;
}

Timeline3D.prototype.makeCategoryLabels = function() {
  const sectionEndingsGroup = new Object3D();

  for (let i = 0; i < params.tl.numSections; i++) {
    let spriteMaterial = new SpriteMaterial({
      color: params.sectionColors[i],
      transparent: true,
    });

    const mesh = new Sprite(spriteMaterial);
    mesh.scale.set(params.gridElement.width, 4, 1);
    mesh.position.set(i * params.gridElement.width + params.gridElement.width / 2, 0, 0);
    sectionEndingsGroup.add(mesh);

    //make category title
    const canvas = document.createElement('canvas');
    canvas.width = params.gridElement.width * 10;
    canvas.height = 20 * 10;

    const ctx = canvas.getContext('2d');
    ctx.font = '31px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(formatList[i], canvas.width / 2, canvas.height / 2);

    const categoryTexture = new CanvasTexture(canvas);
    categoryTexture.minFilter = LinearFilter;
    categoryTexture.magFilter = LinearFilter;

    spriteMaterial = new SpriteMaterial({
      map: categoryTexture,
      color: 0xffffff,
      transparent: true,
    });

    const label = new Sprite(spriteMaterial);
    label.scale.set(params.gridElement.width, 20, 1);
    label.position.set(i * params.gridElement.width + params.gridElement.width / 2, -8, 1);

    sectionEndingsGroup.add(label);
  }

  sectionEndingsGroup.position.x = -params.tl.numSections * params.gridElement.width / 2;
  sectionEndingsGroup.position.y = -1.75;
  sectionEndingsGroup.position.z = params.tl.numYears * params.tl.numYearDivisions * params.gridElement.height / 2 + 1;

  return sectionEndingsGroup;
}

Timeline3D.prototype.makeTimelineBansLayer = function() {
  const bansLayer = new Object3D();
  this.banItemArray = [];

  for(let i = 0; i < timelineData.length - 1; i++) {
    const newBanItem = this.makeBanItem(timelineData[i]);

    const gridAddress = this.getGridElementBySourceData_map(timelineData[i]);
    if (gridAddress === undefined) continue;

    const category = gridAddress.category;
    const month = gridAddress.month;
    const year = gridAddress.year;
    const bans = gridAddress.bans;

    const gridObject = this.Components.timelineFloor.years[year.id].bars[month.id].sections[category.id];

    const monthObject = this.Components.timelineFloor.years[year.id].bars[month.id];
    monthObject.hasEntry = true;

    gridObject.userData.numBanItems = 1;
    gridObject.userData.banItems = [];
    gridObject.userData.banItems.push(newBanItem);

    newBanItem.position.x = category.position.x + params.gridElement.width / 2;
    newBanItem.position.y = 10;
    newBanItem.position.z = category.position.z + month.position.z + year.position.z;
    newBanItem.position.z += params.gridElement.height / 2;

    const banScale = 1 / (bans - 0.25);
    newBanItem.scale.set(banScale, banScale, banScale)

    bansLayer.add(newBanItem);

    this.banItemArray.push(newBanItem);
  }

  return bansLayer;
}

Timeline3D.prototype.getGridElementBySourceData_map = function(itemData) {
  const { date, category, bans } = itemData;
  const [month, year] = date.split('.');

  return {
    year: this.map.years[this.getYearIdByValue(Number(year))],
    month: this.map.months[Number(month)],
    category: this.map.categories[Number(category)],
    bans: Number(bans)
  };
}

Timeline3D.prototype.getYearIdByValue = function(value) {
  for (let i = 0; i < this.map.years.length; i++) {
    if (value === this.map.years[i].value) return i;
  }
}

Timeline3D.prototype.makeBanItem = function(data) {
  const geometry = new IcosahedronBufferGeometry(params.banItem.radius, 2);

  geometry.computeBoundingSphere();

  const material = new MeshPhongMaterial({
    color: params.sectionColors[Number(data.category)],
    transparent: true
  });

  const mesh = new Mesh(geometry, material);

  mesh.userData = data;
  mesh.name = 'entry';

  mesh.setSelected = function() {
    this.currentHex = this.material.emissive.getHex();
    this.material.emissive.setHex(0xff0000);
  }
  mesh.setDeselected = function() {
    this.material.emissive.setHex(this.currentHex);
  }

  return mesh;
}

export default Timeline3D;
