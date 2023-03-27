import {
  Button,
  Card,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { CardGroup, Column } from '../types';

import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { UNGROUPED } from '../constants';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import {
  DraggableProvided,
} from 'react-beautiful-dnd';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';

export function RetroCardGroup({
  admin,
  group,
  column,
  columnId,
  children,
  showCollapse,
  provided,
  onCollapse,
  onDispatchLoading,
  isPrintPage,
}: {
  admin: boolean;
  group: CardGroup;
  column: Column;
  columnId: string;
  children: React.ReactNode;
  showCollapse: boolean;
  provided: DraggableProvided;
  onCollapse: (value: any) => void;
  onDispatchLoading: (value: any) => void;
  isPrintPage: boolean;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);

  const {
    state: { columns, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [name, setName] = React.useState(group.name);
  const [nameSet, setNameSet] = React.useState(!!group.name);
  const [reactGroups, setReactGroups] = React.useState<any>({});
  const [myReact, setMyReact] = React.useState<boolean>(false);
  const [enableEdit, setEnableEdit] = React.useState<boolean>(false);
  const userReacted = !!group.reactions?.find(
    react => react.userId === global.user.id
  );

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
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.ADD_REACT_TO_GROUP, {
      react,
      groupId,
    }).then(res => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: false },
      });
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

  React.useEffect(() => {
    const inputText = document.getElementById('groupTextField' + group.id);
    if (inputText && enableEdit) {
      setNameSet(true);
      inputText.focus();
    }
  }, [enableEdit]);

  const saveGroupName = async () => {
    if (admin) {
      lockGroup(group.id, false);
      if (name == group.name || !name) {
        setEnableEdit(false);
        setName(group.name);
      } else {
        onDispatchLoading(true);
        await setGroupName(group.id, name).then(
          res => {
            onDispatchLoading(false);
            setEnableEdit(false);
          },
          err => {
            setEnableEdit(false);
          }
        );
      }
    }
  };

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
          <div {...provided.dragHandleProps}>
            <Grid
              container
              justifyContent="space-between"
              paddingLeft={1.5}
              paddingRight={1.5}
            >
              <Grid
                item
                xs={6}
                lg={global?.expandColumn !== -1 ? 8 : 8}
                md={global?.expandColumn !== -1 ? 6 : 4}
                sx={{
                  // height: '30px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {admin && enableEdit ? (
                  <>
                    <Grid item lg={12}>
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
                          // paddingLeft: '12px!important',
                          width:
                            global.expandColumn != -1 ||
                            location.pathname.includes('report')
                              ? '200px'
                              : '100%',
                          // width: (nameSet ? name.length : 14) + 3 + 'ch',
                          div: {
                            padding: 0,
                            position: 'initial',
                            width: '100%',
                          },
                          position: 'initial',
                        }}
                        id={'groupTextField' + group.id}
                        maxRows={2}
                        inputProps={{ maxLength: 25 }}
                        value={nameSet ? name : 'Name grouping'}
                        multiline
                        onChange={event => {
                          if (admin) {
                            setName(
                              event.target.value.replace(
                                ' ( ' + group.cards.length + ' ) ',
                                ''
                              )
                            );
                          }
                        }}
                        InputProps={{
                          readOnly: ended,
                        }}
                        // onFocus={async event => {
                        //   if (admin) {
                        //     setNameSet(true);
                        //     await lockGroup(group.id, true);
                        //   }
                        // }}
                        // onBlur={async () => {
                        //   if (admin) {
                        //     lockGroup(group.id, false);
                        //     if (!name) {
                        //       setNameSet(false);
                        //     } else {
                        //       await setGroupName(group.id, name);
                        //     }
                        //   }
                        // }}
                      />
                    </Grid>
                    <XMarkIcon
                      color="red"
                      onClick={() => {
                        setEnableEdit(false);
                        setName(group.name);
                      }}
                      style={{
                        height: '24px',
                        width: '24px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    />

                    <CheckIcon
                      color="green"
                      onClick={saveGroupName}
                      style={{
                        height: '24px',
                        width: '24px',
                        fontWeight: '600',
                        marginLeft: '10px',
                        cursor: 'pointer',
                      }}
                    />
                  </>
                ) : (
                  <Typography
                    sx={{
                      color: nameSet ? groupFontColour : '#8D858A',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: '600',
                    }}
                    onClick={e => {
                      switch (e.detail) {
                        case 2: {
                          !ended && setEnableEdit(true);
                        }
                      }
                    }}
                  >
                    {nameSet ? name : 'Name grouping'}
                  </Typography>
                )}
              </Grid>
              <Grid
                item
                lg={
                  global?.expandColumn !== -1 ||
                  location.pathname.includes('report')
                    ? 1
                    : 3
                }
                md={
                  global?.expandColumn !== -1 ||
                  location.pathname.includes('report')
                    ? 1.5
                    : 4
                }
                xs={4}
                container
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid
                  style={{
                    fontWeight: '600',
                    padding: 0,
                    color: nameSet ? groupFontColour : '#8D858A',
                  }}
                >
                  {'( ' + group.cards.length + ' )'}
                </Grid>
                {group.name !== UNGROUPED && (
                  <Grid
                    item
                    display="flex"
                    flexDirection="row"
                    alignSelf="center"
                    style={{
                      cursor: !ended && !global.leaveRetro ? 'pointer' : 'auto',
                    }}
                    onClick={() =>
                      !ended && !global.leaveRetro
                        ? userReacted
                          ? addReactToGroup(group.id, '')
                          : addReactToGroup(group.id, '👍')
                        : null
                    }
                  >
                    {userReacted ? (
                      <img src="/svgs/StarGold.svg" />
                    ) : (
                      <>
                        {ended || global.leaveRetro ? (
                          <img src="/svgs/StarDisabled.svg" />
                        ) : (
                          <img src="/svgs/StarEnabled.svg" />
                        )}
                      </>
                    )}
                    <Typography
                      color="#FBBC05"
                      style={{
                        fontSize: '1rem',
                        marginLeft: '6px',
                        marginTop: '1px',
                      }}
                    >
                      {group.reactions?.length ? group.reactions?.length : ''}
                    </Typography>
                  </Grid>
                )}
                {!location.pathname.includes('report') && !isPrintPage &&  (
                  <Grid
                    item
                    sx={{
                      cursor: 'pointer',
                    }}
                    onClick={event => {
                      onCollapse(event);
                    }}
                  >
                    {showCollapse ? (
                      <img src="/svgs/Down.svg" />
                    ) : (
                      <img src="/svgs/Up.svg" />
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </div>
        ) : null}
        {showCollapse &&
        group.cards.length === 0 &&
        group.name !== UNGROUPED ? (
          <Grid container direction="row" justifyContent="center">
            <Grid
              item
              lg={12}
              style={{
                padding: '40px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {admin && (
                <Button
                  sx={{ position: 'initial', color: '#727D84' }}
                  onClick={() => deleteGroup(group.id)}
                >
                  <DeleteIcon />
                </Button>
              )}
            </Grid>
          </Grid>
        ) : (
          children
        )}
      </Card>
    </>
  );
}
