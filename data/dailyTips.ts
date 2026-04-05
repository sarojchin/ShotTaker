export type TipVisualType =
  | 'ruleOfThirds'
  | 'goldenHour'
  | 'leadingLines'
  | 'framing'
  | 'depth'
  | 'exposureTriangle';

export interface DailyTip {
  id: string;
  title: string;
  description: string;
  visualType: TipVisualType;
}

const dailyTips: DailyTip[] = [
  {
    id: 'rule-of-thirds',
    title: 'The Rule of Thirds',
    description:
      'Place your subject at the intersections of the grid lines to create a more balanced and engaging composition.',
    visualType: 'ruleOfThirds',
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour Light',
    description:
      'Shoot within an hour after sunrise or before sunset for warm, soft, directional light that flatters any subject.',
    visualType: 'goldenHour',
  },
  {
    id: 'leading-lines',
    title: 'Leading Lines',
    description:
      "Use natural lines in your scene — roads, fences, rivers — to guide the viewer's eye toward your main subject.",
    visualType: 'leadingLines',
  },
  {
    id: 'framing',
    title: 'Natural Framing',
    description:
      'Use elements like doorways, arches, or foliage to frame your subject and draw attention to the focal point.',
    visualType: 'framing',
  },
  {
    id: 'depth-of-field',
    title: 'Depth of Field',
    description:
      'A wide aperture (low f-number) isolates your subject against a soft, blurred background for a professional look.',
    visualType: 'depth',
  },
  {
    id: 'exposure-triangle',
    title: 'The Exposure Triangle',
    description:
      'Balance ISO, aperture, and shutter speed together — each affects light and motion differently in your final image.',
    visualType: 'exposureTriangle',
  },
];

export default dailyTips;
