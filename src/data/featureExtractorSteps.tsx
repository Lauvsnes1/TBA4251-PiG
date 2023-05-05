export const featureExtractorSteps = [
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: <p> Now we will try to extract your favorite fish species from the dataset. </p>,
    target: '#feature-ex-header',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: <p> Choose the fisk-trondheimsimrådet as input layer. </p>,
    target: '#select-layer',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: <p> Choose the property "Norsk Navn". </p>,
    target: '#select-prop',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: <p> Choose the operation "=" </p>,
    target: '#select-operation',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: <p> Type in "kveite" in the text input. </p>,
    target: '#rule-0-value',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
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
        <ul style={{ textAlign: 'left', margin: 'auto', width: '50%' }}>
          <li>sei</li>
          <li>torsk</li>
          <li>laks</li>
          <li>lyr</li>
          <li>hvitting</li>
          <li>breiflabb</li>
          <li>hyse</li>
          <li>ål</li>
          <li>gråsteinbit</li>
        </ul>
      </div>
    ),
    placement: 'left' as 'left',
    target: '#add-rule-button',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
];
