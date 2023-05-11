import InfoIcon from '@mui/icons-material/Info';
import trondheimClip from './clip_demo.png';

export const getSteps = [
  {
    title: 'Introduction',

    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Welcome to QGEE´s! In this tutorial you will learn how to use the basic tools. But first,
          some quick info:
        </p>
        <ul style={{ textAlign: 'left', margin: 'auto', width: '70%' }}>
          <li>Run this application in Google Chrome.</li>
          <li>
            {' '}
            The tutorial is step based, so if you don't know what to do, go back to the menu where
            you initially startet the tutorial.
          </li>
          <li>
            You can start, stop and restart this tutorial any time you want under the settings wheel
            in the top right corner.
          </li>
          <li>
            If you refresh the page you <span style={{ textDecoration: 'underline' }}>will</span>{' '}
            lose your work.
          </li>
          <li>
            Make sure that the menu on the left is{' '}
            <span style={{ textDecoration: 'underline' }}>open</span> before you continue the
            tutorial further.
          </li>
          <li>
            If you have problem with the tutorial, a walk through guide can be found here: "youtube"
          </li>
        </ul>
      </div>
    ),
    placement: 'center' as 'center',
    target: 'body',
    styles: {
      options: {
        zIndex: 100000,
        width: '90%',
      },
    },
  },
  {
    title: 'Mission',

    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          In this tutorial we will try to find the best spots near Trondheim to do sea fishing.{' '}
          <br />
          <span style={{ fontWeight: 'bold' }}> Good luck!</span>
        </p>
      </div>
    ),
    placement: 'center' as 'center',
    target: 'body',
    styles: {
      options: {
        zIndex: 100000,
      },
    },
  },
  // {
  //   title: 'Open the drawer',

  //   disableBeacon: false,
  //   spotlightClicks: true,
  //   content: (
  //     <div>
  //       <p>'Press the menu on the left to open the drawer and discover the GIS tools.'</p>
  //     </div>
  //   ),
  //   target: '#icon-button',
  //   styles: {
  //     options: {
  //       zIndex: 10000,
  //     },
  //   },
  // },
  {
    title: 'Load data',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Firstly, we need some datasets to work with, go to GitHub and download the zip file from{' '}
          <a
            href="https://github.com/Lauvsnes1/TBA4251-PiG/tree/main/src/data/demo_data"
            target="_blank"
            rel="noopener noreferrer"
            color="blue"
          >
            <span style={{ textDecoration: 'underline' }}>this</span>
          </a>{' '}
          folder. Then unpack the files on your computer and press next.
        </p>
      </div>
    ),
    placement: 'center' as 'center',
    target: 'body',
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
          Now, press this "Load data" button and upload the files you just downloaded from GitHub.
          When you return to the main screen, you find the next step of the tutorial under settings
          in the top right corner.{' '}
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
    title: 'Clipping',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          As you can see, that the datasets are huge, so we want to clip them to smaller datasets.
          Now, press the polygon-draw button in the left bottom corner of the map and draw a
          reasonable polygon around Trondheim. The size should be something like this:
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
    disableBeacon: true,
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
    disableBeacon: true,
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
    disableBeacon: true,
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
    disableBeacon: true,
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
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now that we have our desired fish species, let's make a buffer to find out where we can
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
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          You can see that the ocean layer, Trondheimsfjorden is divided into two different layers,
          we want to fix that. Press the 'Union' button and look for the{' '}
          <InfoIcon sx={{ paddingTop: '6px' }} /> button to continue the guide.
        </p>
      </div>
    ),
    target: '#union',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Intersect',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now, we want to find the fishing spots which are on the ocean. Press the 'Intersect'
          button and look for the <InfoIcon sx={{ paddingTop: '6px' }} /> button to continue the
          guide.
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
    title: 'Difference',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Last thing we want to do is to find the best spots to fish the ocean from land side. Press
          the 'Difference' button and look for the <InfoIcon sx={{ paddingTop: '6px' }} /> button to
          continue the guide.
        </p>
      </div>
    ),
    target: '#difference',
    offset: -10,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
  },
  {
    title: 'Download layer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Congratulations!🥳 You have completed the tutorial and found your best places to fish in
          Trondheimsfjorden. Don't forget to download your final layers from the drop down menu and
          bring them next the time you go fishing.
        </p>
        <p style={{ fontWeight: 'bolder', paddingTop: '20px' }}>Skitt fiske 🎣</p>
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
