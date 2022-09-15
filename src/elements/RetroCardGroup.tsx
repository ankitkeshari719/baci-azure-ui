import {
  Button,
  Card,
  CardActions,
  Grid, styled, TextField,
  Typography
} from '@mui/material';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { CardGroup, Column } from '../types';

import { ThumbUpOffAlt } from '@mui/icons-material';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { UNGROUPED } from '../constants';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { GlobalContext } from '../contexts/GlobalContext';

const TextFieldNoBorderWrapper = styled('div')({
  '.MuiInputBase-multiline': {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  alignItems: 'center',
  display: 'flex',
  fieldset: {
    border: 'none',
  },
  paddingTop: '10px',
  paddingLeft: '15px',
  input: {
    padding: 0,
  },
});

export function RetroCardGroup({
  group,
  column,
  children,
  showCollapse,
  onCollapse,
}: {
  group: CardGroup;
  column: Column;
  children: React.ReactNode;
  showCollapse: boolean;
  onCollapse: () => void;
}) {
  const [global] = React.useContext(GlobalContext);
  const {
    state: { ended },
    commitAction,
  } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [name, setName] = React.useState(group.name);
  const [nameSet, setNameSet] = React.useState(!!group.name);
  const [reactGroups, setReactGroups] = React.useState<any>({});
  const [myReact, setMyReact] = React.useState<boolean>(false);

  React.useEffect(() => {
    setName(group.name);
    if (group.name) {
      setNameSet(true);
    }
  }, [group.name]);

  const deleteGroup = async (groupId: string) => {
    setConfirmAction({
      action: 'Delete',
      title: 'Delete a grouping',
      text: 'Are you sure you want to delete this grouping?',
      onConfirm: () => {
        saveAndProcessAction(BoardActionType.DELETE_GROUP, { groupId }).then(() => {
          setConfirmAction(undefined);
        });
      },
    });
  };

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const lockGroup = async (groupId: string, lock: boolean) => {
    await saveAndProcessAction(BoardActionType.LOCK_CARD, { groupId, lock });
  };
  const setGroupName = async (groupId: string, name: string) => {
    await saveAndProcessAction(BoardActionType.SET_GROUP_NAME, {
      groupId,
      name,
    });
  };
  const addReactToGroup = async (groupId: string, react: string) => {
    await saveAndProcessAction(BoardActionType.ADD_REACT_TO_GROUP, {
      react,
      groupId,
    });
  };

  React.useEffect(() => {
    const reactGroups = {} as any;
    if (group.reactions) {
      group.reactions.forEach(reaction => {
        if (reactGroups[reaction.react]) {
          reactGroups[reaction.react]++;
        } else {
          reactGroups[reaction.react] = 1;
        }
      });
    }
    setReactGroups(reactGroups);
    setMyReact(
      !!group.reactions?.find(react => react.userId === global.user.id)
    );
  }, [group.reactions]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          margin: '0',
          borderRadius: 0,
          background: group.name !== UNGROUPED ? 'rgb(220 220 225)' : 'none',
          border: 'none',
          marginBottom: 0,
          paddingBottom: '5px',
        }}
      >
        {group.name !== UNGROUPED ? (
          <Grid container>
            <Grid item xs={10}>
              <TextField
                type="text"
                sx={{
                  flexGrow: 22,
                  fontStyle: nameSet ? 'normal' : 'italic',
                  textarea: {
                    fontWeight: '600',
                    padding: 0,
                    color: nameSet ? '#4D555A' : '#8D858A',
                  },
                  fieldset: { border: 'none' },
                  px: 2,
                  py: 2,
                  paddingBottom: 0,
                  paddingRight: 0,
                  width: '100%',
                  div: { padding: 0, position: 'initial', width: '100%' },
                  position: 'initial',
                }}
                maxRows={2}
                value={nameSet ? name : 'Name grouping'}
                multiline
                onChange={event => {
                  setName(event.target.value);
                }}
                InputProps={{
                  readOnly: ended,
                }}
                onFocus={async event => {
                  setNameSet(true);
                  await lockGroup(group.id, true);
                }}
                onBlur={async () => {
                  lockGroup(group.id, false);
                  if (!name) {
                    setNameSet(false);
                  } else {
                    await setGroupName(group.id, name);
                  }
                }}
              />
            </Grid>
            {showCollapse ? (
              <Grid item xs={2}>
                <Button onClick={onCollapse} sx={{ position: 'initial' }}>
                  <CloseFullscreenIcon
                    style={{ color: '#727D84', width: '20px' }}
                  />
                </Button>
              </Grid>
            ) : null}
          </Grid>
        ) : null}
        {group.cards.length === 0 && group.name !== UNGROUPED ? (
          <div>
            <div
              style={{
                padding: '40px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                sx={{ position: 'initial', color: '#727D84' }}
                onClick={() => deleteGroup(group.id)}
              >
                <DeleteIcon />
              </Button>
            </div>
          </div>
        ) : (
          children
        )}
        {group.name !== UNGROUPED ? (
          <>
            <CardActions style={{ justifyContent: 'space-around', padding: 0 }}>
              <span style={{ minWidth: '0px' }}>
                <Typography
                  style={{
                    background: column.cardColour,
                    padding: '3px 14px',
                    marginLeft: '10px',
                    fontSize: '0.85rem',
                  }}
                  color="black"
                >
                  {group.cards.length}
                </Typography>
              </span>
              <div style={{ flexGrow: 2 }}>&nbsp;</div>
              <Button
                sx={{ minWidth: '0px', position: 'initial' }}
                disabled={ended}
                onClick={() =>
                  !ended
                    ? myReact
                      ? addReactToGroup(group.id, '')
                      : addReactToGroup(group.id, '👍')
                    : null
                }
              >
                <ThumbUpOffAlt
                  sx={{
                    height: '20px',
                    color: myReact ? '#1D5C98' : '#9EA7AC',
                  }}
                />
                <Typography color="black" style={{ fontSize: '0.85rem' }}>
                  {group.reactions?.length ? group.reactions?.length : ''}
                </Typography>
              </Button>
            </CardActions>
          </>
        ) : null}
      </Card>
    </>
  );
}
