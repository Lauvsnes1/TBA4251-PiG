import { ElementType } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ScienceIcon from '@mui/icons-material/Science';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import JoinFullIcon from '@mui/icons-material/JoinFull';
import RemoveIcon from '@mui/icons-material/Remove';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SVGDissolve from '../icons/dissolve-features-svgrepo-com';
import SVGVoronoi from '../icons/svgviewer-react-output';

import FileInput from '../components/fileInput';
import Buffer from '../components/buffer';
import Intersect from '../components/intersect';
import Union from '../components/union';
import Difference from '../components/differece';
import Clip from '../components/clip';
import Voronoi from '../components/voronoi';
import Dissolve from '../components/dissolve';
import FeatureExtractor from '../components/featureExtractor';
import { AlertColor } from '@mui/material';

interface Tool {
  id: number;
  name: string;
  icon: ElementType;
  component: JSX.Element;
}

const getToolsList = (
  closeModal: () => void,
  passAlert: (status: AlertColor, message: string) => void
): Tool[] => {
  return [
    {
      id: 1,
      name: 'Load data',
      icon: FileUploadIcon,
      component: <FileInput handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 2,
      name: 'Feature extracor',
      icon: ScienceIcon,
      component: <FeatureExtractor handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 3,
      name: 'Buffer',
      icon: RemoveCircleIcon,
      component: <Buffer handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 4,
      name: 'Intersect',
      icon: JoinInnerIcon,
      component: <Intersect handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 5,
      name: 'Union',
      icon: JoinFullIcon,
      component: <Union handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 6,
      name: 'Difference',
      icon: RemoveIcon,
      component: <Difference handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 7,
      name: 'Clip',
      icon: ContentCutIcon,
      component: <Clip handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 8,
      name: 'Dissolve',
      icon: SVGDissolve,
      component: <Dissolve handleCloseModal={closeModal} showAlert={passAlert} />,
    },
    {
      id: 9,
      name: 'Voronoi',
      icon: SVGVoronoi,
      component: <Voronoi handleCloseModal={closeModal} showAlert={passAlert} />,
    },
  ];
};
export default getToolsList;
