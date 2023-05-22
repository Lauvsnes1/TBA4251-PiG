import { commonStyles } from './commonStyle';

export const clipSteps = [
  {
    title: 'Clip',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Let's clip your datasets so they become easier to work with. </p>
      </div>
    ),
    target: '#clip-header',
    styles: commonStyles,
  },
  {
    title: 'Clip',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Select all the layers you have uploaded from Github. </p>
      </div>
    ),
    target: '#multiple-layer-select',
    styles: commonStyles,
  },
  {
    title: 'Clip',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Select the "my_clip" layer that you have just created to align it with the other layers.
        </p>
      </div>
    ),
    target: '#select-clip-layer',
    styles: commonStyles,
  },
  {
    title: 'Clip',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Then press ok and return to the tutorial on the main page. </p>
      </div>
    ),
    target: '#ok-button',
    styles: commonStyles,
  },
];
