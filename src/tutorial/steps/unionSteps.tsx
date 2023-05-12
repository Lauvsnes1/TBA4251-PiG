export const unionSteps = [
  {
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          {' '}
          As you can see, you have two different layers containg the surface of Trondheimsfjorden.
          Lets make them into one layer.
          <br />
          <span style={{ fontWeight: 'bold' }}>Note:</span> The eccecution of this algorithm may
          take some time, depending on how large your datasets are, so be pacient.
        </p>
      </div>
    ),
    target: '#union-header',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Buffer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Select trdfjorden_vest_clip as the first layer. </p>
      </div>
    ),
    target: '#select-first',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Select trdfjordern_øst_clip as the second layer. </p>
      </div>
    ),
    target: '#select-second',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p> Name the layer "trondheimsfjorden". </p>
      </div>
    ),
    target: '#costum-name',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
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
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
];
