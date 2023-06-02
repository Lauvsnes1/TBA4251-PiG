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
        <p>
          {' '}
          Select <span style={{ fontWeight: 'bold' }}>trondheimsfjorden</span> as layer one.{' '}
        </p>
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
        <p>
          Select <span style={{ fontWeight: 'bold' }}>fiskeområder</span> as layer two
        </p>
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
        <p>
          {' '}
          Name the output layer <span style={{ fontWeight: 'bold' }}>my_fishmap_sea</span>.{' '}
        </p>
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
