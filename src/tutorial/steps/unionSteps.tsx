import { commonStyles } from './commonStyle';

export const unionSteps = [
  {
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          As you can see, you have two different layers containing the surface of Trondheimsfjorden.
          Let's merge them into one layer.
          <br />
          <span style={{ fontWeight: 'bold' }}>Note:</span> The execution of this algorithm may take
          some time, depending on the size of your datasets, so please be patient.
        </p>
      </div>
    ),
    target: '#union-header',
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
          Select <span style={{ fontWeight: 'bold' }}>trdfjorden_vest_clip </span>as the first
          layer.{' '}
        </p>
      </div>
    ),
    target: '#select-first',
    styles: commonStyles,
  },
  {
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          {' '}
          Select <span style={{ fontWeight: 'bold' }}>trdfjorden_øst_clip </span> as the second
          layer.{' '}
        </p>
      </div>
    ),
    target: '#select-second',
    styles: commonStyles,
  },
  {
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          {' '}
          Name the layer <span style={{ fontWeight: 'bold' }}>trondheimsfjorden</span>.{' '}
        </p>
      </div>
    ),
    target: '#costum-name',
    styles: commonStyles,
  },
  {
    title: 'Union',
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
