import {
  Box,
  Button,
  Card,
  CardActions,
  Grid,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { CardGroup, Column } from '../types';

import { ThumbUpOffAlt } from '@mui/icons-material';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
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
  columnId,
  children,
  showCollapse,
  onCollapse,
}: {
  group: CardGroup;
  column: Column;
  columnId: string;
  children: React.ReactNode;
  showCollapse: boolean;
  onCollapse: (value: any) => void;
}) {
  const [global] = React.useContext(GlobalContext);

  const {
    state: { columns, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [name, setName] = React.useState(group.name);
  const [nameSet, setNameSet] = React.useState(!!group.name);
  const [reactGroups, setReactGroups] = React.useState<any>({});
  const [myReact, setMyReact] = React.useState<boolean>(false);
  const groupColour = columns.find(
    column => column.id === columnId
  )?.groupColour;
  const groupFontColour = columns.find(
    column => column.id === columnId
  )?.groupFontColour;
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
        saveAndProcessAction(BoardActionType.DELETE_GROUP, { groupId }).then(
          () => {
            setConfirmAction(undefined);
          }
        );
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
          background: group.name !== UNGROUPED ? groupColour : 'none',
          optacity: 0.1,
          border: 'none',
          marginBottom: 0,
          paddingBottom: '5px',
          width: '100%',
        }}
      >
        {group.name !== UNGROUPED ? (
          <Grid container>
            <Grid
              item
              xs={10}
              sx={{
                height: '30px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TextField
                type="text"
                sx={{
                  // flexGrow: 22,
                  fontStyle: nameSet ? 'normal' : 'italic',
                  textarea: {
                    fontWeight: '600',
                    padding: 0,
                    color: nameSet ? groupFontColour : '#8D858A',
                  },
                  fieldset: { border: 'none' },
                  px: 2,
                  py: 2,
                  paddingBottom: 0,
                  padding: 0,
                  paddingLeft: '12px!important',
                  // width: '100%',
                  width: (nameSet ? name.length : 14) + 3 + 'ch',
                  div: { padding: 0, position: 'initial', width: '100%', },
                  position: 'initial',
                }}
                maxRows={2}
                value={nameSet ? name : 'Name grouping'}
                multiline
                onChange={event => {
                  console.log(
                    event.target.value.replace(
                      ' ( ' + group.cards.length + ' ) ',
                      ''
                    ),
                    'value'
                  );
                  setName(
                    event.target.value.replace(
                      ' ( ' + group.cards.length + ' ) ',
                      ''
                    )
                  );
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
              <span
                style={{
                  fontWeight: '600',
                  padding: 0,
                  color: nameSet ? groupFontColour : '#8D858A',
                  // paddingTop: '18px',
                }}
              >
                {' '}
                {'( ' + group.cards.length + ' )'}
              </span>
              {group.name !== UNGROUPED && (
                <Button
                
                  sx={{  paddingTop:'10px' }}
                  style={{paddingTop:"10px",marginTop:'10px'}}
                  disabled={ended}
                  onClick={() =>
                    !ended
                      ? myReact
                        ? addReactToGroup(group.id, '')
                        : addReactToGroup(group.id, '👍')
                      : null
                  }
                >
                  {myReact ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                        fill="#FBBC05"
                        stroke="#FBBC05"
                        strokeWidth="1.5"
                        stroke-linecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>
                      {ended ? (
                        // <img src="/svgs/Star.svg" />
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                            fill="#FBBC05"
                            stroke="#FBBC05"
                            strokeWidth="1.5"
                            stroke-linecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        // <img src="/svgs/GrayStar.svg" />
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                            fill="white"
                            stroke="#FBBC05"
                            strokeWidth="1.5"
                            stroke-linecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                  <Typography
                    color="#FBBC05"
                    style={{
                      fontSize: '1rem',
                      marginLeft: '5px',
                      // marginTop: '3px',
                    }}
                  >
                    {group.reactions?.length ? group.reactions?.length : ''}
                  </Typography>
                </Button>
              )}
            </Grid>
            {/* <Box component="span">{' ( ' + group.cards.length + ' ) '}</Box> */}
            {group.cards.length > 1 && showCollapse ? (
              <Grid
                item
                xs={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  onClick={event => {
                    onCollapse(event);
                  }}
                  // sx={{ position: 'initial' }}
                >
                  {/* <CloseFullscreenIcon
                    style={{ color: '#727D84', width: '20px' }}
                  /> */}
                  <img src="/svgs/Down.svg" />
                </Button>
              </Grid>
            ) : (
              <Grid
                item
                xs={2}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                {' '}
                {group.cards.length > 1 && (
                  <Button
                    onClick={event => {
                      onCollapse(event);
                    }}
                    sx={{ position: 'initial' }}
                  >
                    {/* <OpenInFullIcon
                      style={{ color: '#727D84', width: '20px' }}
                    /> */}
                    <img src="/svgs/Up.svg" />
                  </Button>
                )}
              </Grid>
            )}
          </Grid>
        ) : null}

        {group.cards.length === 0 && group.name !== UNGROUPED ? (
          <Grid container lg={12} direction="row" justifyContent="center">
            <Grid
              item
              lg={12}
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
            </Grid>
          </Grid>
        ) : (
          children
        )}

        {/* bottom side of grouping */}
      </Card>
    </>
  );
}
