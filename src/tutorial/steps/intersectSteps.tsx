import { commonStyles } from './commonStyle';

export const intersectSteps = [
  {
    title: 'Intersect',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>Lets find the out where you want to go with your boat to catch your favorite fish.</p>
      </div>
    ),
    target: '#intersect-header',
    styles: commonStyles,
  },
  {
    title: 'Intersect',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Select "trondheimsfjorden" as layer one. </p>
      </div>
    ),
    target: '#select-layer-1',
    styles: commonStyles,
  },
  {
    title: 'Intersect',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>Select "fiskeområder" as layer two</p>
      </div>
    ),
    target: '#select-layer-2',
    styles: commonStyles,
  },
  {
    title: 'Intersect',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Name the output layer "my_fishingmap_sea". </p>
      </div>
    ),
    target: '#custom-name',
    styles: commonStyles,
  },
  {
    title: 'Intersect',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Then press ok. </p>
      </div>
    ),
    target: '#ok-button',
    styles: commonStyles,
  },
];
