import {
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  FormControlLabel,
  Grid,
  Switch,
  Tab,
  Tabs,
  // Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { FEATURE_FLAGS, UNGROUPED } from '../constants';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';
import shortid from 'shortid';
import { sentence } from 'txtgen';
import { UserAvatar } from '../atoms/UserAvatar';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { CountdownTimer } from '../elements/CountdownTimer';
import { FeedbackColumn } from '../elements/FeedbackColumn';
import ParticipantsPanel from '../elements/ParticipantsPanel';
import { RetroColumn } from '../elements/RetroColumn';
import RetroPropsPanel from '../elements/RetroPropsPanel';
import SharePanel from '../elements/SharePanel';
import useLoadRetro from '../hooks/useLoadRetro';
import theme from '../theme/theme';
import FeedbackPopup from '../atoms/feedbackPopup';
import Toolbar from '../elements/Toolbar';
import SubToolbar from '../elements/SubToolbar';
import FirstTimeExperience from '../elements/FirstTimeExperience';


const ColumnContainer = ({
  children,
  totalPanels,
}: {
  children: React.ReactNode;
  totalPanels: number;
}) => {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <Grid
      item
      xs={isXsUp ? 12 : 6}
      md={12 / totalPanels}
      sx={{
        background: '#ffffff',
        margin: isXsUp ? 0 : '10px',
        '&:not(:last-child)': {
          marginRight: 0,
        },
      }}
    >
      {children}
    </Grid>
  );
};

export default function RetroBoard() {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));

  const navigate = useNavigate();

  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: {
      lastStateUpdate,
      columns,
      retroName,
      users,
      creatorId,
      ended,
      needsToShow,
      retroStatus,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [currentColumn, setCurrentColumn] = React.useState(0);
  const [showEditBox, setShowEditBox] = React.useState(false);
  const [justMyCards, setJustMyCards] = React.useState(false);
  const [showFeedback, setshowFeedback] = React.useState(false);
  const [islanded, setIsLanded] = React.useState(true);

  const [showRetroPanel, setShowRetroPanel] = React.useState(false);
  const [showParticipantsPanel, setShowParticipantsPanel] =
    React.useState(false);
  const [showSharePanel, setShowSharePanel] = React.useState(false);

  useLoadRetro();
  // React.useEffect(() => {
  //   console.log(columns, '');
  // });
  // const getProcessedColumns = () =>
  //    columns
  //     ? columns.map(column => {
  //         const groups = [...column.groups].sort(
  //           (a, b) =>
  //             (!b.reactions ? 0 : b.reactions.length) -
  //             (!a.reactions ? 0 : a.reactions.length)
  //         );
  //         if(islanded){
  //           for (const column of columns) {
  //             for (const group of column.groups) {
  //               if(group.cards.length !==0){
  //                 group.cards =[];
  //               }
  //             }
  //            }
  //            setIsLanded(true);
  //            return{
  //             ...column,
  //             groups: []

  //            }
  //         } else{
  //         return {
  //           ...column,
  //           groups: groups
  //             .map(group => {
  //               const cards = group.cards.filter(
  //                 card => !justMyCards || card.createdBy === global.user.id
  //               );
  //               return {
  //                 ...group,
  //                 cards,
  //               };
  //             })
  //             .filter(
  //               group =>
  //                 !justMyCards ||
  //                 group.name === UNGROUPED ||
  //                 group.cards.length !== 0
  //             ),
  //         };
  //       }
  //       })
  //     : [];

  const isMatch = (element: any, index: number, array: any): boolean => {
    console.log(element, index, array);
    return true;
  };

  const getProcessedColumns = () =>
    columns
      ? columns.map(
          column => {
            const groups = [...column.groups].sort(
              (a, b) =>
                (!b.reactions ? 0 : b.reactions.length) -
                (!a.reactions ? 0 : a.reactions.length)
            );
            // if(islanded){
            //   for (const column of columns) {
            //     for (const group of column.groups) {
            //       if(group.cards.length !==0){
            //         group.cards =[];
            //       }
            //     }
            //    }
            //    setIsLanded(true);
            //    return{
            //     ...column,
            //     groups: []

            //    }
            // } else{
            // console.log('column', column);
            return {
              ...column,
              groups: groups
                .map(group => {
                  const cards = group.cards.filter(
                    // card => !justMyCards || card.createdBy === global.user.id

                    card =>
                      global.user?.id !== global.currentRetro?.creatorId
                        ? card
                        : global.usersSelected?.some((user, index) => {
                            return user?.userId === card?.createdBy;
                          })
                  );
                  return {
                    ...group,
                    cards,
                  };
                })
                .filter(group =>
                  // !justMyCards ||
                  // group.name === UNGROUPED ||
                  // group.cards.length !== 0

                  global.usersSelected?.some((user, index) => {
                    return (
                      user?.userId === group?.createdBy ||
                      group?.name === UNGROUPED
                    );
                  })
                ),
            };
          }
          // }
        )
      : [];

  const closeAllPanels = () => {
    setShowRetroPanel(false);
    setShowParticipantsPanel(false);
    setShowSharePanel(false);
  };

  const totalPanels = columns
    ? global.expandColumn != -1
      ? 1
      : columns.length
    : 0;
  // columns ? columns.length + (isXsUp ? 1 : 0) : 0;

  const LeftContainer = ({ index }: { index: number }) =>
    isSmUp && currentColumn === index ? (
      <Button
        disabled={currentColumn === 0}
        style={{ float: 'left', position: 'initial' }}
        onClick={() => {
          setCurrentColumn(currentColumn - 1);
        }}
      >
        <ArrowBackIosIcon />
      </Button>
    ) : (
      <></>
    );

  const RightContainer = ({ index }: { index: number }) =>
    isSmUp && currentColumn + 1 === index ? (
      <Button
        disabled={currentColumn + 1 >= totalPanels - 1}
        style={{ float: 'right', position: 'initial' }}
        onClick={() => {
          setCurrentColumn(currentColumn + 1);
        }}
      >
        <ArrowForwardIosIcon />
      </Button>
    ) : (
      <></>
    );

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const finishRetro = () => {
    console.log(
      creatorId === global.user.id,
      ' ',
      creatorId,
      '  ',
      global.user.id
    );
    if (global.user.userType == 2) {
      console.log('ende retro');
      localStorage.removeItem('retoname');
      // setConfirmAction({
      //   action: 'Finish Retro',
      //   title: 'Finish Retro',
      //   text: 'This action will take All Participants to the Feedback screen.',
      //   onConfirm: () => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });

      localStorage.removeItem('pulseCheckState');

      saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
        creatorId: global.currentRetro?.creatorId,
        userId: global.user.id,
        retroStatus: 'ended',
      }).then(
        () => {
          saveAndProcessAction(BoardActionType.END_RETRO, {}).then(
            () => {
              dispatch({
                type: ActionType.SET_LOADING,
                payload: { loadingFlag: false },
              });
              navigate('/report/' + global.currentRetro?.id);
            },
            () => {
              dispatch({
                type: ActionType.SET_LOADING,
                payload: { loadingFlag: false },
              });
            }
          );
        },
        () => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );

      // },
      // });
    } else {
      //navigate(`/board/${global?.currentRetro?.id}/feedback`);
      // setConfirmAction({
      //   action: 'Leave Retro',
      //   title: 'Leave Retro',
      //   text: 'Do you really want to leave the retro ?',
      //   onConfirm: () => {

      //   },
      // });
      dispatch({
        type: ActionType.SET_LEAVE_RETRO,
        payload: { leaveRetro: true },
      });
      setshowFeedback(true);
    }
  };
  const create10Cards = async () => {
    setIsLanded(false);
    for (let i = 0; i < 10; i++) {
      const column = Math.floor(Math.random() * columns.length);
      const group = Math.floor(Math.random() * columns[column].groups.length);
      await saveAndProcessAction(BoardActionType.ADD_NEW_CARD, {
        groupId: columns[column].groups[group].id,
        id: shortid.generate(),
        value: sentence(),
      });
    }
  };

  React.useEffect(() => {
    // console.log(needsToShow);
    console.log('ended', ended, retroStatus);
    if (ended || global.leaveRetro) {
      if (global.user.userType !== 2) {
        const currentUser = users?.filter(
          card => card.userId === global?.user.id
        );
        if (currentUser?.length == 1 && currentUser[0].feedback.length == 0) {
          console.log('ended', true, ' ', currentUser[0].pulseCheckQuestions);
          setshowFeedback(true);
        }
      } else {
        console.log('ended', false);

        setshowFeedback(false);
      }
      // navigate(`/board/${global?.currentRetro?.id}/feedback`);
    }
  }, [ended]);

  return (
    <Box
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {global?.user.userType == 2 && !ended && (
        <FirstTimeExperience facilitator={true} />
      )}
      {global?.user.userType != 2 && !ended && (
        <FirstTimeExperience facilitator={false} />
      )}
      {/* <AppBar component="div" color="primary" position="static" elevation={0}>
        <Toolbar>
          {!isXsUp && !isSmUp ? (
            <CountdownTimer color={'#000'} bold={false} />
          ) : null}

          <Grid container alignItems="center" spacing={1}>
            <Grid
              item
              xs
              style={{
                display: 'flex',
                flexDirection: 'row',
                ...(isXsUp
                  ? {
                      flexGrow: 3,
                      justifyContent: 'center',
                    }
                  : {}),
              }}
            >
              <Button
                color="secondary"
                onClick={() => {
                  setShowRetroPanel(!showRetroPanel);
                  setShowParticipantsPanel(false);
                  setShowSharePanel(false);
                }}
              >
                <Container
                  color="inherit"
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    cursor: 'pointer',
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: '40vw',
                      height: '100%',
                      display: 'block',
                      overflow: 'hidden',
                    }}
                  >
                    {retroName}
                  </Typography>
                  <KeyboardArrowDownIcon
                    sx={{ height: '30px' }}
                  ></KeyboardArrowDownIcon>
                </Container>
              </Button>
            </Grid>
            {useMemo(
              () => (
                <Grid
                  item
                  xs
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setShowRetroPanel(false);
                    setShowParticipantsPanel(!showParticipantsPanel);
                    setShowSharePanel(false);
                  }}
                >
                  {users.map((user, i) =>
                    i === 2 ? (
                      <span
                        key={user.userId}
                        style={{ marginLeft: '-8px', zIndex: 2 - i }}
                      >
                        <UserAvatar userNickname={'+' + (users.length - 2)} />
                      </span>
                    ) : i < 2 ? (
                      <span style={{ marginLeft: '-8px', zIndex: 2 - i }}>
                        <UserAvatar
                          key={user.userId}
                          userNickname={user.userNickname}
                        />
                      </span>
                    ) : null
                  )}
                </Grid>
              ),
              [lastStateUpdate]
            )}
          </Grid>
        </Toolbar>
      </AppBar> */}
      <Grid xs={12} item>
        <Toolbar onFinishRetro={finishRetro}></Toolbar>
        <SubToolbar></SubToolbar>
      </Grid>

      {/* {isXsUp ? (
        <>
          <Tabs
            value={currentColumn}
            onChange={(event, value) => setCurrentColumn(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '.Mui-selected ': { color: 'black' },
              '.MuiTabs-indicator': { background: '#159ADD' },
            }}
          >
            {[
              ...columns,
              ...(FEATURE_FLAGS.feedback
                ? [{ id: 'feedback', name: 'FINISH RETRO' }]
                : []),
            ].map((column, index) => (
              <Tab key={column.id} label={column.name} />
            ))}
          </Tabs>
        </>
      ) : null}

      {!isXsUp || currentColumn !== totalPanels - 1 ? (
        <AppBar
          component="div"
          position="static"
          elevation={0}
          sx={{
            zIndex: 0,
            display: 'flex',
            flexDirection: 'row',
            background: 'white',
            color: '#159ADD',
            padding: '5px 15px',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={isXsUp ? 6 : isSmUp ? 6 : 2}>
              {isXsUp || isSmUp ? (
                <CountdownTimer color={'#2B9FDE'} bold={true} />
              ) : FEATURE_FLAGS.stressTest ? (
                <Button
                  variant="outlined"
                  sx={{ padding: '4px', marginLeft: '4px', borderRadius: 0 }}
                  onClick={() => create10Cards()}
                >
                  Create 10 cards
                </Button>
              ) : null}
            </Grid>

            {!isXsUp && !isSmUp ? (
              <Grid
                item
                xs={6}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    color: 'black',
                    border: '2px #FECE8B solid',
                    padding: '3px',
                  }}
                >
                  Retro Access Code: {global.currentRetro?.humanId}
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    background: '#FECE8B',
                    color: 'black',
                    padding: '4px',
                    marginLeft: '4px',
                    borderRadius: 0,
                    borderColor: '#FECE8B',
                  }}
                  onClick={() => setShowSharePanel(!showSharePanel)}
                >
                  Share
                </Button>
              </Grid>
            ) : null}

            <Grid
              item
              xs={isXsUp ? 6 : 2}
              style={{
                flexDirection: 'row',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}
            >
              <FormControlLabel
                sx={{
                  color: justMyCards ? '#727D84' : '#9EA6AC',
                  'span:nth-child(2)': {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '150px',
                  },
                }}
                control={
                  <Switch
                    color="info"
                    checked={justMyCards}
                    onChange={e => setJustMyCards(e.target.checked)}
                  />
                }
                label="My cards only"
              />
            </Grid>

            {!isXsUp && FEATURE_FLAGS.feedback ? (
              <Grid
                item
                xs={isSmUp ? 4 : 2}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    ':hover': { background: '#695F9B' },
                    background: '#695F9B',
                    color: '#fff',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={finishRetro}
                >
                  Finish Retro
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </AppBar>
      ) : null} */}

      <Grid
        container
        spacing={0}
        style={{
          flexWrap: 'nowrap',
          flexGrow: 1,
          background: 'white',
          paddingLeft: '42px',
          paddingRight: '42px',
        }}
      >
        {showRetroPanel || showParticipantsPanel || showSharePanel ? (
          <Box
            sx={{
              position: 'absolute',
              background: '#88888888',
              width: '100vw',
              height: '100%',
              display: 'flex',
              zIndex: 22,
              paddingTop: '2px',
            }}
            onClick={() => {
              setShowParticipantsPanel(false);
              setShowRetroPanel(false);
              setShowSharePanel(false);
            }}
          >
            {showRetroPanel ? (
              <RetroPropsPanel
                onClose={closeAllPanels}
                setShowSharePanel={setShowSharePanel}
              />
            ) : null}
            {showParticipantsPanel ? (
              <ParticipantsPanel onClose={closeAllPanels} />
            ) : null}
            {showSharePanel ? <SharePanel onClose={closeAllPanels} /> : null}
          </Box>
        ) : null}
        {showFeedback ? (
          <FeedbackPopup show={true} showThankYou={ended}></FeedbackPopup>
        ) : null}
        {useMemo(
          () =>
            (isXsUp
              ? [...getProcessedColumns(), undefined]
              : getProcessedColumns()
            ).map((column, index) => (
              <React.Fragment key={index}>
                {(isXsUp && index === currentColumn) ||
                  (isSmUp &&
                    (index === currentColumn || index === currentColumn + 1)) ||
                  (!isXsUp &&
                    !isSmUp &&
                    (index === global.expandColumn ||
                      global.expandColumn === -1) && (
                      <ColumnContainer totalPanels={totalPanels} key={index+"1"}>
                        {!!column ? (
                          <>
                            <RetroColumn
                              leftHeaderComponent={
                                <LeftContainer index={index} />
                              }
                              rightHeaderComponent={
                                <RightContainer index={index} />
                              }
                              column={column}
                              columnId={column.id}
                              noHeader={isXsUp}
                              showEditBox={showEditBox}
                              setShowEditBox={setShowEditBox}
                              setIslanded={setIsLanded}
                              cardGroups={column.groups}
                            />
                            {isXsUp && !showEditBox ? (
                              <>
                                <Fab
                                  aria-label="add"
                                  style={{
                                    position: 'fixed',
                                    bottom: '20px',
                                    right: '20px',
                                    background: 'black',
                                    color: 'white',
                                    zIndex: 100,
                                  }}
                                  onClick={() => setShowEditBox(true)}
                                >
                                  <AddIcon />
                                </Fab>
                              </>
                            ) : null}
                          </>
                        ) : (
                          <FeedbackColumn
                            noHeader={isXsUp}
                            leftHeaderComponent={
                              <LeftContainer index={index} />
                            }
                            rightHeaderComponent={
                              <RightContainer index={index} />
                            }
                          />
                        )}
                      </ColumnContainer>
                    ))}
              </React.Fragment>
            )),
          [
            lastStateUpdate,
            isXsUp,
            isSmUp,
            justMyCards,
            currentColumn,
            showEditBox,
            global.expandColumn,
            global.usersSelected,
          ]
        )}
      </Grid>
    </Box>
  );
}
