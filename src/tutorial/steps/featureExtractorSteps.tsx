import { commonStyles } from './commonStyle';

export const featureExtractorSteps = [
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: <p> Now we will try to extract your favorite fish species from the dataset. </p>,
    target: '#feature-ex-header',
    styles: commonStyles,
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    scrollDuration: 300,
    content: (
      <p>
        {' '}
        Choose the layer <span style={{ fontWeight: 'bold' }}>fisk_clip</span> as input.{' '}
      </p>
    ),
    target: '#select-layer',
    placement: 'left' as 'left',
    styles: commonStyles,
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <p>
        {' '}
        Choose the property <span style={{ fontWeight: 'bold' }}>Norsk Navn</span>.{' '}
      </p>
    ),
    target: '#select-prop',
    styles: commonStyles,
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <p>
        {' '}
        Choose the operation <span style={{ fontWeight: 'bold' }}>=</span>{' '}
      </p>
    ),
    target: '#select-operation',
    styles: commonStyles,
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <p>
        {' '}
        Type in <span style={{ fontWeight: 'bold' }}>kveite</span> in the text input.{' '}
      </p>
    ),
    target: '#rule-0-value',
    styles: commonStyles,
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          {' '}
          Now, press this button and do the same with at least two more of your favorite fish
          species from the following list(remember to have everything in lowercase):{' '}
        </p>
        <ul style={{ textAlign: 'left', margin: 'auto', width: '60%' }}>
          <li>sei</li>
          <li>torsk</li>
          <li>laks</li>
          <li>lyr</li>
          <li>hvitting</li>
          <li>breiflabb</li>
          <li>hyse</li>
          <li>gråsteinbit</li>
        </ul>
      </div>
    ),
    placement: 'right' as const,
    target: '#add-rule-button',
    styles: commonStyles,
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: <p> Then press the ok button. </p>,
    target: '#ok-button',
    styles: commonStyles,
  },
];
