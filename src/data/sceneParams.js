const sceneParams = {
  bgColor: 0x302D36,
  linegridColor: 0x616061,
  sectionLabels: [
    'Vintage',
    'Legacy',
    'Commander',
    'Pauper',
    'Modern',
    'Brawl',
    'Standard',
  ],
  sectionColors: [
    0xffa280,
    0xffd001,
    0x6dc8df,
    0x7f92ff,
    0x6f6f6f,
    0x2dc066,
    0xd466dd,
    0xFF823A,
    0xFF687C,
    0x8764F3,
    0x78D7A7
  ],
  tl: {
    numSections: 7,
    numYearDivisions: 12,
    numYears: 5,
  },
  gridElement: {
    width: 40,
    height: 15,
    thickness: 4,
    defaultColor: 0x302D36,
  },
  projectItem: {
    radius: 10,
    shading: 'smooth'
  },
  yearBillboard: {
    width: 30,
    height: 15
  }
};

export default sceneParams;
