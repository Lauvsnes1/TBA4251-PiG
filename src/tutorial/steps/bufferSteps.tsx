import { commonStyles } from './commonStyle';
export const bufferSteps = [
  {
    title: 'Buffer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>Now lets make a buffer to find out where you might catch your favourite fish.</p>
      </div>
    ),
    target: '#buffer-header',

    styles: commonStyles,
  },
  {
    title: 'Buffer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          {' '}
          Select <span style={{ fontWeight: 'bold' }}>fisk_clip_ext</span> as input layer.{' '}
        </p>
      </div>
    ),
    target: '#select-layer',
    styles: commonStyles,
  },
  {
    title: 'Buffer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          {' '}
          Select a buffer radius of <span style={{ fontWeight: 'bold' }}>500m</span>.{' '}
        </p>
      </div>
    ),
    target: '#select-buffer-radius',
    styles: commonStyles,
  },
  {
    title: 'Buffer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          {' '}
          Name the output layer <span style={{ fontWeight: 'bold' }}>fiskeområder</span>.{' '}
        </p>
      </div>
    ),
    target: '#custom-name',
    styles: commonStyles,
  },
  {
    title: 'Buffer',
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
