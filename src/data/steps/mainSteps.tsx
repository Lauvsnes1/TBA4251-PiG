import InfoIcon from '@mui/icons-material/Info';
import trondheimClip from '../clip_demo.png';

export const getSteps = [
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

    disableBeacon: false,
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
    styles: {
      options: {
        zIndex: 100000,
      },
    },
  },
  {
    title: 'Open the drawer',

    disableBeacon: false,
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

    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          We need some datasets to work with, go to GitHub and download all the files from{' '}
          <a
            href="https://github.com/Lauvsnes1/TBA4251-PiG/tree/main/src/data/demo_data"
            target="_blank"
            rel="noopener noreferrer"
            color="blue"
          >
            {' '}
            this
          </a>{' '}
          folder.
          <br /> <span style={{ fontWeight: 'bold' }}>NB:</span> You have to enter into each file
          and press the download button.
        </p>
      </div>
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
    title: 'Load data',

    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>Now press the load data button and upload the files you downloaded from GitHub.</p>
      </div>
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
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          You can see that the datasets are very big, so we want to clip them to smaller datasets.
          Now, press the polygon-draw button in the left bottom corner, and draw a reasonable
          polygon around Trondheim, the size should be something like this:
        </p>
        <div>
          <img src={trondheimClip} width="365px" height="200px" alt="trondheim_cut" />
        </div>
        <p>Name your new layer my_clip.</p>
      </div>
    ),
    target: '#basemap',
    placement: 'bottom' as 'bottom',
    styles: {
      options: {
        zIndex: 10000,
        width: 450,
      },
    },
  },
  {
    title: 'Clipping',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Open the clipping tool and look for the <InfoIcon sx={{ paddingTop: '6px' }} /> button to
          continue the guide.
        </p>
      </div>
    ),
    target: '#clip',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Delete layers',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>Now we want to get rid of the big datasets as we don't need them any more.</p>
      </div>
    ),
    target: '#layer-list',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Delete layers',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>Delete all the unclipped datasets here.</p>
      </div>
    ),
    target: '#drop-down-menu',
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Feature extractor',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now lets find the fish species we are looking for, press the feature extractor button in
          the menu. Again, look for the <InfoIcon sx={{ paddingTop: '6px' }} /> button to continue
          the guide.
        </p>
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
    title: 'Buffer',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now that we have our desired fish spots, let's make a buffer to find out where we can
          fish. Press the buffer button and look for the <InfoIcon sx={{ paddingTop: '6px' }} />{' '}
          button to continue the guide.
        </p>
      </div>
    ),
    target: '#buffer',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Intersect',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Last thing we want to do is to extract the spots which are on the ocean. Press the
          'Intersect' button and look for the <InfoIcon sx={{ paddingTop: '6px' }} /> button to
          continue the guide.
        </p>
      </div>
    ),
    target: '#intersect',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Download layer',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Congratulations! You have completed the tutorial and found your best places to fish in
          Trondheimsfjorden. Don't forget to download your final layer from the drop down menu and
          bring it next time you go out fishing.
        </p>
        <p>
          <span style={{ fontWeight: 'bolder', paddingTop: '20px' }}>Skitt fiske!</span>
        </p>
      </div>
    ),
    target: '#layer-list',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
];
