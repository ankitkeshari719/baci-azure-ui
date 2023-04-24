import * as React from 'react';
import shortid from 'shortid';
import './styles.scss';

import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { ActionInterface } from '../../types';
import ActionsList from './ActionsList';
import { Box } from '@mui/material';
import ActionHeader from './ActionHeader';
import AddAction from './AddAction';
import ZeroActions from './ZeroActions';

export default function ActionMainContainer() {
  const {
    state: { actionsData },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);

  const [allActions, setAllActions] = React.useState<ActionInterface[]>([]);
  const [addedActionValue, setAddActionValue] = React.useState<string>('');

  React.useEffect(() => {
    setAllActions([...actionsData.actions]);
  }, [actionsData]);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const addAction = async (value: string) => {
    const id = shortid.generate();
    await saveAndProcessAction(BoardActionType.Add_NEW_ACTION, {
      id: id,
      value: value,
      createdBy: global.user.id,
      avatar: global.user.avatar,
    }).then(
      res => {
        setAddActionValue('');
      },
      err => {}
    );
  };

  return (
    <Box className="actionsContainer" sx={{ height: 'var(--app-height)' }}>
      <ActionHeader allActions={allActions} />
      <AddAction
        addAction={addAction}
        addedActionValue={addedActionValue}
        setAddActionValue={setAddActionValue}
      />
      {allActions.length > 0 ? (
        <ActionsList allActions={allActions} />
      ) : (
        <ZeroActions />
      )}
    </Box>
  );
}
