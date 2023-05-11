import React, { useRef } from 'react';
import Joyride, { CallBackProps, StoreHelpers } from 'react-joyride';

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
