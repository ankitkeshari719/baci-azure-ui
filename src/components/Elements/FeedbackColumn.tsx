import { styled, useMediaQuery } from '@mui/material';
import React, { ReactElement } from 'react';
import { FEATURE_FLAGS, FEEDBACK_QUESTIONS } from '../../constants';
import { BoardContext } from '../../contexts/BoardContext';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { ConfirmContext } from '../../contexts/ConfirmContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';

import { useNavigate } from 'react-router';
import theme from '../../helpers/theme/theme';
import { FeedbackEntry } from '../../helpers/types';
import { UserContext } from '../../contexts/UserContext';
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';

const ColumnComponent = styled('div')({
  height: 'calc(var(--app-height) - 120px)',
  display: 'flex',
  flexGrow: 1,
  padding: 0,
});

export function FeedbackColumn({
  noHeader,
  leftHeaderComponent,
  rightHeaderComponent,
}: {
  noHeader: boolean;
  leftHeaderComponent: any;
  rightHeaderComponent: any;
}): ReactElement {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const navigate = useNavigate();

  const [global, dispatch] = React.useContext(GlobalContext);
  const { commitAction } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [showBlankErrors, setShowBlankErrors] = React.useState(false);
  const [scrollDownButton, setScrollDownButton] = React.useState(true);

  const scrollableContainer = React.createRef<HTMLDivElement>();

  const qs = FEEDBACK_QUESTIONS.map(q => React.useState(0));

  const [uncompletedError, setUnCompletedError] = React.useState(false);

  const scrollContainer = isXsUp || !noHeader;
  const [gUser, userDispatch] = React.useContext(UserContext);

  React.useEffect(() => {
    onScroll();
  }, []);

  const scrollDown = () => {
    scrollableContainer.current?.scroll(
      0,
      scrollableContainer.current?.scrollHeight
    );
  };

  const onScroll = () => {
    if (scrollableContainer.current) {
      setScrollDownButton(
        scrollableContainer.current.scrollHeight - 10 >
          scrollableContainer.current.scrollTop +
            scrollableContainer.current?.clientHeight
      );
    }
  };

  const submit = () => {
    const submitter = async () => {
      await saveAndProcessAction(BoardActionType.SUBMIT_FEEDBACK, {
        feedback: qs.map(
          (q, i) =>
            ({
              id: '' + i,
              entry: '' + q[0],
            } as FeedbackEntry)
        ),
      });
      dispatch({
        type: ActionType.SET_SNACK_MESSAGE,
        payload: {
          snackMessage: {
            message:
              'Your feedback has been successfully submitted. Thank you!',
            snackMessageType: 'success',
          },
        },
      });
      setConfirmAction(undefined);
      if (
        FEATURE_FLAGS.report &&
        global.currentRetro?.creatorId === global.user.id
      ) {
        if (gUser?.azureUser?.roleName === ENTERPRISE)
        navigate(
          '/enterprise/sessions/report/' + global.currentRetro.id
        );
        else if (gUser?.azureUser?.roleName === BASIC){
          navigate(
            '/basic/sessions/report/' + global.currentRetro.id
          );
        }
        else
        navigate('/report/' + global.currentRetro.id);
      } else {

        if (gUser?.azureUser?.roleName === ENTERPRISE)
        navigate(
          '/enterprise/sessions/offboarding'
        );
        else if (gUser?.azureUser?.roleName === BASIC){
          navigate(
            '/basic/sessions/offboarding'
          );
        }

        navigate(`/offboarding`);
      }
    };

    if (qs.some(q => q[0] === -1)) {
      setConfirmAction({
        title: 'Submit',
        text: 'Some questions are blank, are you sure you want to submit?',
        action: 'Submit',
        onConfirm: submitter,
      });
      setShowBlankErrors(true);
    } else {
      setUnCompletedError(false);
      setShowBlankErrors(false);
      submitter();
    }
  };

  const skip = () => {
    setConfirmAction({
      title: 'Skip Feedback',
      text: `Don't leave, please help your facilitator understand if this was a good session.`,
      action: 'Skip Feedback',
      onConfirm: () => {
        setConfirmAction(undefined);
        if (
          FEATURE_FLAGS.report &&
          global.currentRetro?.creatorId === global.user.id
        ) {
          if (gUser?.azureUser?.roleName === ENTERPRISE)
          navigate(
            '/enterprise/sessions/report/' + global.currentRetro.id
          );
          else if (gUser?.azureUser?.roleName === BASIC){
            navigate(
              '/basic/sessions/report/' + global.currentRetro.id
            );
          }
          else
          navigate('/report/' + global.currentRetro.id);
        } else {
          if (gUser?.azureUser?.roleName === ENTERPRISE)
          navigate(
            '/enterprise/sessions/offboarding'
          );
          else if (gUser?.azureUser?.roleName === BASIC){
            navigate(
              '/basic/sessions/offboarding'
            );
          }
  
          navigate(`/offboarding`);
        }
      },
    });
  };

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(
      actionName as BoardActionType,
      { parameters, userId: global.user.id },
      true
    );
  };

  return <></>;
}
