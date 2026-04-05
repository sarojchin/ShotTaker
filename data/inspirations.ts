export interface InspirationPhoto {
  id: string;
  title: string;
  photographer: string;
  year: string;
  backgroundColor: string;
  gradientColors: [string, string, string];
  history: string;
  technique: string;
}

const inspirations: InspirationPhoto[] = [
  {
    id: '1',
    title: 'The Tetons and the Snake River',
    photographer: 'Ansel Adams',
    year: '1942',
    backgroundColor: '#4a5a42',
    gradientColors: ['transparent', 'rgba(18,22,14,0.65)', 'rgba(8,10,6,0.96)'],
    history:
      'Captured in Grand Teton National Park for the U.S. National Park Service, this image became one of the most reproduced photographs in history. It was among the 116 images chosen for the Voyager Golden Record launched into interstellar space in 1977.',
    technique:
      'Adams applied his Zone System to hold detail across an extreme tonal range—from luminous clouds to dark river. A deep red filter blackened the sky while preserving cloud texture. Shot on large-format 8×10 film, every tonal decision was made before the shutter opened.',
  },
  {
    id: '2',
    title: 'Behind the Gare Saint-Lazare',
    photographer: 'Henri Cartier-Bresson',
    year: '1932',
    backgroundColor: '#2e2e36',
    gradientColors: ['transparent', 'rgba(12,12,16,0.65)', 'rgba(4,4,6,0.96)'],
    history:
      'Taken through a gap in a fence at Paris\'s busiest train station, this image defines Cartier-Bresson\'s concept of the "Decisive Moment"—the razor-thin instant when geometry, movement, and meaning converge into a single perfect frame.',
    technique:
      'Cartier-Bresson used a compact Leica 35mm, allowing him to work unseen. He could not fully see the scene; he simply thrust the camera through the fence. The leaping man\'s perfect reflection in the puddle below was pure chance, caught in a fraction of a second.',
  },
  {
    id: '3',
    title: 'Migrant Mother',
    photographer: 'Dorothea Lange',
    year: '1936',
    backgroundColor: '#5a4a38',
    gradientColors: ['transparent', 'rgba(22,16,10,0.65)', 'rgba(8,6,4,0.96)'],
    history:
      'Photographed for the U.S. Farm Security Administration during the Great Depression, Florence Owens Thompson\'s portrait became the defining face of an era\'s suffering. Lange made five exposures in under ten minutes at a migrant pea-pickers\' camp in Nipomo, California.',
    technique:
      'Lange worked entirely in natural light, moving progressively closer with each frame. The final, tightest composition fills the frame with face and gesture, stripping away context to create a universal image of dignified endurance rather than passive defeat.',
  },
];

export default inspirations;
