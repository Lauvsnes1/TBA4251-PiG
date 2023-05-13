import { commonStyles } from './commonStyle';

export const differenceSteps = [
  {
    title: 'Difference',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>Finally, lets find the out where you can catch your favourite fish from land.</p>
      </div>
    ),
    target: '#difference-header',
    styles: commonStyles,
  },
  {
    title: 'Difference',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Select "fiskeområder" as layer one. </p>
      </div>
    ),
    target: '#select-layer-1',
    styles: commonStyles,
  },
  {
    title: 'Difference',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>Select "trondheimsfjorden" as layer two</p>
      </div>
    ),
    target: '#select-layer-2',
    styles: commonStyles,
  },
  {
    title: 'Difference',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Name the output layer "my_fishingmap_land". </p>
      </div>
    ),
    target: '#custom-name',
    styles: commonStyles,
  },
  {
    title: 'Difference',
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
