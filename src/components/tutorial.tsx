import React, { useState, ChangeEvent, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Joyride, { CallBackProps, StoreHelpers } from 'react-joyride';

const useStyles = makeStyles({
  hovered: {
    backgroundColor: '#f2f2f2',
    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
  },
});

function Tutorial(props: { runTour: boolean; steps: any; setRunTour: (toggle: boolean) => void }) {
  const joyrideHelpers = useRef<StoreHelpers | null>(null);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    if (type === 'tour:end' || type === 'step:close' || action === 'close') {
      props.setRunTour(false);
    }
  };
  return (
    <>
      <Joyride
        steps={props.steps}
        run={props.runTour}
        getHelpers={(helpers) => {
          joyrideHelpers.current = helpers;
        }}
        callback={handleJoyrideCallback}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
      />
    </>
  );
}
export default Tutorial;
