import InfoIcon from '@mui/icons-material/Info';
import trondheimClip from './clip_demo.png';
import { commonStyles } from './commonStyle';
import polygon_button from './polygon-button.png';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const getSteps = [
  {
    title: 'Introduction',

    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Welcome to QGEE's! In this tutorial, you will learn how to use the basic tools. But first,
          here's some quick info:
        </p>
        <ul style={{ textAlign: 'left', margin: 'auto', width: '70%' }}>
          <li>Run this application in Google Chrome.</li>
          <li>
            The tutorial is step-based, so if you don't know what to do, go back to the menu where
            you initially started the tutorial.
          </li>
          <li>
            You can start, stop, and restart this tutorial anytime you want under the settings wheel
            in the top right corner.
          </li>
          <li>
            If you refresh the page, you will{' '}
            <span style={{ textDecoration: 'underline' }}>lose</span> your work.
          </li>
          <li>
            Make sure that the menu on the left is{' '}
            <span style={{ textDecoration: 'underline' }}>open</span> before you continue the
            tutorial further.
          </li>
          <li>
            If you have problems with the tutorial, a walkthrough guide can be found here:
            "youtube".
          </li>
        </ul>
      </div>
    ),
    placement: 'center' as const,
    target: 'body',
    styles: {
      options: {
        ...commonStyles.options,
        width: '100%',
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
          In this tutorial, we will try to find the best spots near Trondheim for sea fishing.{' '}
          <br />
          <br />
          <span style={{ fontWeight: 'bold' }}>Good luck!🎣</span>
        </p>
      </div>
    ),
    placement: 'center' as const,
    target: 'body',
    styles: commonStyles,
  },
  {
    title: 'Load data',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Firstly, we need some datasets to work with. Please go to GitHub and download the zip file
          from{' '}
          <a
            href="https://github.com/Lauvsnes1/TBA4251-PiG/blob/main/src/data/demo_data/data.zip"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            this folder
          </a>
          . The download button can be found on the right hand side of the screen. Once you have
          downloaded the file, unpack the files on your computer and proceed to the next step.
        </p>
      </div>
    ),
    placement: 'center' as const,
    target: 'body',
    styles: commonStyles,
  },
  {
    title: 'Load data',
    disableBeacon: false,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now, click on the "Load data" button and upload the files you just downloaded from GitHub.
          Once you return to the main screen, you will find the next step of the tutorial under the
          settings menu in the top right corner.
        </p>
      </div>
    ),
    target: '#load-data',
    offset: -10,
    styles: commonStyles,
  },
  {
    title: 'Clipping',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          As you can see, the datasets are quite large, so we need to clip them to smaller datasets.
          Now, click on the polygon-draw
          <img
            src={polygon_button}
            style={{ marginBottom: '-4px' }}
            height="20px"
            width="20px"
            alt=""
          />
          button located in the bottom left corner of the map. Draw a reasonable polygon around
          Trondheim. The size should be similar to the photo below. Name your new layer "my_clip".
        </p>
        <div>
          <img src={trondheimClip} width="425px" height="233px" alt="trondheim_cut" />
        </div>
        <p></p>
      </div>
    ),
    target: '#header',
    placement: 'bottom' as const,
    styles: {
      options: {
        ...commonStyles.options,
        width: 550,
        zIndex: 1,
        arrowColor: 'transparent',
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
          Open the clipping tool and look for the{' '}
          <InfoIcon sx={{ paddingTop: '6px', marginBottom: '-4px' }} /> button to continue the
          guide.
        </p>
      </div>
    ),
    target: '#clip',
    offset: -10,
    styles: commonStyles,
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
    styles: commonStyles,
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
    styles: commonStyles,
  },
  {
    title: 'Feature extractor',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now let's find the fish species we are looking for. Click on the feature extractor button
          in the menu. Once again, look for the{' '}
          <InfoIcon sx={{ paddingTop: '6px', marginBottom: '-4px' }} /> button to continue the
          guide.
        </p>
      </div>
    ),
    target: '#feature-extractor',
    offset: -10,
    styles: commonStyles,
  },
  {
    title: 'Buffer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now that we have our desired fish species, let's create a buffer to determine the fishing
          areas. Click on the buffer button and search for the{' '}
          <InfoIcon sx={{ paddingTop: '6px', marginBottom: '-4px' }} /> button to continue the
          guide.
        </p>
      </div>
    ),
    target: '#buffer',
    offset: -10,
    styles: commonStyles,
  },
  {
    title: 'Union',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          You may notice that the ocean layer, Trondheimsfjorden, is divided into two separate
          layers. We need to fix that. Click on the 'Union' button and search for the{' '}
          <InfoIcon sx={{ paddingTop: '6px', marginBottom: '-4px' }} /> button to continue the
          guide.
        </p>
      </div>
    ),
    target: '#union',
    offset: -10,
    styles: commonStyles,
  },
  {
    title: 'Intersect',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now, we want to find the fishing spots that are located in the ocean. Click on the
          'Intersect' button and search for the{' '}
          <InfoIcon sx={{ paddingTop: '6px', marginBottom: '-4px' }} /> button to continue the
          guide.
        </p>
      </div>
    ),
    target: '#intersect',
    offset: -10,
    styles: commonStyles,
  },
  {
    title: 'Difference',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          The last thing we want to do is find the best spots for fishing in the ocean from the land
          side. Click on the 'Difference' button and search for the{' '}
          <InfoIcon sx={{ paddingTop: '6px', marginBottom: '-4px' }} /> button to continue the
          guide.
        </p>
      </div>
    ),
    target: '#difference',
    offset: -10,
    styles: commonStyles,
  },
  {
    title: 'Download layer',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Now, press the <MoreVertIcon sx={{ paddingTop: '6px', marginBottom: '-6px' }} /> - menu
          and download your two fishing maps.
        </p>
      </div>
    ),
    target: '#layer-list',
    offset: 0,
    styles: commonStyles,
  },
  {
    title: 'Finished!',
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p>
          Congratulations! 🥳 You have completed the tutorial and found the best places to fish in
          Trondheimsfjorden. Don't forget to bring the maps with you the next time you go fishing.
        </p>
        <p style={{ fontWeight: 'bold', paddingTop: '20px' }}>Skitt fiske! 🎣</p>
      </div>
    ),
    placement: 'center' as const,
    target: 'body',
    offset: 0,
    styles: commonStyles,
  },
];
