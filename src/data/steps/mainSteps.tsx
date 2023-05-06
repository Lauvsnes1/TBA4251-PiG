export const getSteps = [
  //   {
  //     content: 'test',
  //     disableBeacon: true,
  //     disableOverlayClose: true,
  //     hideCloseButton: true,
  //     spotlightClicks: true,
  //     styles: {
  //       options: {
  //         zIndex: 10000,
  //       },
  //     },
  //     target: '#icon-btn',
  //     title: 'Menu',
  //   },

  {
    title: 'Introduction',

    disableBeacon: true,
    spotlightClicks: true,
    content:
      'Welcome to QGEE´s! In this tutorial you will learn how to use the basic tools. But first, if you are not running this application on Google Chrome, please change to Google Chrome. ',
    target: '#qgees',
  },
  {
    title: 'Mission',

    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          In this tutorial we will try to find the best sea fishing spots in near Trondheim. So lets
          start!
        </p>
      </div>
    ),

    target: '#qgees',
  },
  {
    title: 'Open the drawer',

    disableBeacon: true,
    spotlightClicks: true,
    content: 'Press the menu on the left to open the drawer full of GIS tools.',
    target: '#icon-button',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Load data',

    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <p>
        'Now we have to upload some data, go to GitHub and download all the files from{' '}
        <a
          href="https://github.com/Lauvsnes1/TBA4251-PiG"
          target="_blank"
          rel="noopener noreferrer"
          color="blue"
        >
          {' '}
          this
        </a>{' '}
        folder. After you have done that, press the Load Data button and upload the files you just
        downloaded from github'
      </p>
    ),
    target: '#load-data',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Clipping',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>You can see that the datasets are very big, lets clip them to more approachable size.</p>
      </div>
    ),
    target: '#feature-extractor',
    offset: -10,
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
    content:
      'Now lets find the fish species we are looking for, press the feature extractor button in the menu.',
    target: '#feature-extractor',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Clipping',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now, press the polygon-draw button in the left bottom corner, and draw a polygon around
          Trondheim, the size should be something like this:
        </p>
        <img src="" placeholder="image cut to come" />
        <p>Name your new layer my-clip.</p>
      </div>
    ),
    target: '#basemap',
    placement: 'bottom' as 'bottom',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
];
