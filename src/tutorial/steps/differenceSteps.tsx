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
        <p>
          {' '}
          Select <span style={{ fontWeight: 'bold' }}>fiskeområder</span> as layer one.{' '}
        </p>
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
        <p>
          Select <span style={{ fontWeight: 'bold' }}>trondheimsfjorden</span> as layer two
        </p>
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
        <p>
          {' '}
          Name the output layer <span style={{ fontWeight: 'bold' }}>my_fishmap_land</span>.{' '}
        </p>
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
