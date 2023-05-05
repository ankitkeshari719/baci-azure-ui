import {
  Box,
  Button,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React, { useMemo } from 'react';
import { UNGROUPED } from '../../constants';
import './styles.scss';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import shortid from 'shortid';
import { sentence } from 'txtgen';
import { BoardContext } from '../../contexts/BoardContext';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { ConfirmContext } from '../../contexts/ConfirmContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { FeedbackColumn } from '../../elements/FeedbackColumn';
import { RetroColumn } from '../../elements/RetroColumn';
import useLoadRetro from '../../hooks/useLoadRetro';
import theme from '../../theme/theme';
import FeedbackPopup from '../../atoms/FeedbackPopup';
import Toolbar from '../../elements/Toolbar';
import SubToolbar from '../../elements/SubToolbar';
import FirstTimeExperience from '../../elements/FirstTimeExperience';
import { styled } from '@mui/material/styles';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import { Col, Container, Row } from 'react-bootstrap';
import BACILogo from '../../assets/img/bacilogo.png';
import moment from 'moment';
import { PrintRetroColumn } from './PrintRetroColumn';
import ReactToPrint from 'react-to-print';
import { OutlinedButton } from '../../components';
import useReRoute from '../../hooks/useReRoute';
import ActionMainContainer from '../ManageActions/ActionMainContainer';

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  color: string;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

interface StyledTabProps {
  label: string;
  color: string;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    scrollButtons="auto"
    allowScrollButtonsMobile
    variant="scrollable"
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))(({ color }) => ({
  color: 'red',
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: color,
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: color,
  },
}));

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme, color }) => ({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: '400',
  marginRight: theme.spacing(1),
  color: color,

  '&.Mui-selected': {
    color: color,
    fontWeight: '600',
    width: '99%',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

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

const PrintColumnContainer = ({
  children,
  totalPanels,
}: {
  children: React.ReactNode;
  totalPanels: number;
}) => {
  return (
    <Grid
      item
      xs={12}
      sx={{
        background: '#ffffff',
        margin: '10px',
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
  const navigate = useNavigate();
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: { startedDate, endedDate, lastStateUpdate, columns, users, ended },
    commitAction,
  } = React.useContext(BoardContext);

  const [timeTaken, setTimeTaken] = React.useState<string>('');
  const [value, setValue] = React.useState(0);
  const { setConfirmAction } = React.useContext(ConfirmContext);
  const [currentColumn, setCurrentColumn] = React.useState(0);
  const [showEditBox, setShowEditBox] = React.useState(false);
  const [justMyCards, setJustMyCards] = React.useState(false);
  const [showFeedback, setshowFeedback] = React.useState(false);
  const [islanded, setIsLanded] = React.useState(true);
  const [showRetroPanel, setShowRetroPanel] = React.useState(false);
  const [showSharePanel, setShowSharePanel] = React.useState(false);
  const [showParticipantsPanel, setShowParticipantsPanel] =
    React.useState(false);

  let componentRef = React.useRef(null);

  // Re-Routing rules added
  useReRoute();

  useLoadRetro();

  React.useEffect(() => {
    if (ended || global.leaveRetro) {
      if (global.user.userType !== 2) {
        const currentUser = users?.filter(
          card => card.userId === global?.user.id
        );
        if (currentUser?.length == 1 && currentUser[0].feedback.length == 0) {
          setshowFeedback(true);
        }
      } else {
        setshowFeedback(false);
      }
    }
  }, [ended]);

  React.useEffect(() => {
    // Time Taken
    const seconds = moment(endedDate).diff(moment(startedDate), 'second') % 60;
    const minutes = moment(endedDate).diff(moment(startedDate), 'minutes');
    const hours = moment(endedDate).diff(moment(startedDate), 'hours');
    const days = moment(endedDate).diff(moment(startedDate), 'days');
    const weeks = moment(endedDate).diff(moment(startedDate), 'weeks');

    let timeTaken: string = '';
    if (weeks != 0) {
      timeTaken = timeTaken + weeks + ' ' + 'weeks' + ' ';
    }

    if (days != 0) {
      timeTaken = timeTaken + days + ' ' + 'days' + ' ';
    }
    if (hours != 0) {
      timeTaken = timeTaken + hours + ' ' + 'hours' + ' ';
    }
    if (minutes != 0) {
      timeTaken = timeTaken + minutes + ' ' + 'minutes' + ' ';
    }
    if (seconds != 0) {
      timeTaken = timeTaken + seconds + ' ' + 'seconds';
    }

    setTimeTaken(timeTaken);
  }, [lastStateUpdate]);

  const getProcessedColumns = () =>
    columns
      ? columns.map(
        column => {
          const groups = [...column.groups];
          return {
            ...column,
            groups: groups
              .map(group => {
                const cards = group.cards.filter(card =>
                  global.user?.userType !== 2
                    ? card
                    : global.usersSelected?.some(user => {
                      return user?.userId === card?.createdBy;
                    })
                );
                return {
                  ...group,
                  cards,
                };
              })
              .filter(
                group =>
                  !justMyCards ||
                  group.name === UNGROUPED ||
                  group.cards.length !== 0
              ),
          };
        }
        // }
      )
      : [];

  const totalPanels = columns
    ? global.expandColumn != -1
      ? 1
      : columns.length
    : 0;

  const getColumns = () => {
    return columns;
  };

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

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
  const deleteUnconfirmedGroup = async (groupIdArray: string[]) => {
    await saveAndProcessAction(BoardActionType.DELETE_UNCONFIRMED_GROUPS, {
      groupIdArray
    });
  };
  // Finish Retro
  const finishRetro = () => {
    if (global.user.userType == 2) {
      sessionStorage.removeItem('retoname');

      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });


      //remove unconfirmed groups from array;
      const groupIdArray: string[] = [];

      columns.forEach(column => {

        const groupIdArray: string[] = []
        column.groups.forEach(group => {
          if (group.suggested) {
            groupIdArray.push(group.id)
          }
        })

        deleteUnconfirmedGroup(groupIdArray)

      });


      sessionStorage.removeItem('pulseCheckState');

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
    } else {
      dispatch({
        type: ActionType.SET_LEAVE_RETRO,
        payload: { leaveRetro: true },
      });
      setshowFeedback(true);
    }
  };

  return (
    <>
      {/* Board HTML */}
      <Box
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          height: 'calc(var(--app-height))',
        }}
      >
        {/* First Time Experience : User is facilitator */}
        {global?.user.userType == 2 && !ended && (
          <FirstTimeExperience facilitator={true} />
        )}
        {/* First Time Experience : User is not facilitator */}
        {global?.user.userType != 2 &&
          !ended &&
          (isXsUp ? (
            <FirstTimeExperience facilitator={false} isXsUp={true} />
          ) : (
            <FirstTimeExperience facilitator={false} isXsUp={false} />
          ))}
        <DeploymentPopUp />
        <Grid xs={12} item>
          <Toolbar onFinishRetro={finishRetro}></Toolbar>
          {!isXsUp && <SubToolbar componentRef={componentRef} />}
        </Grid>
        <Grid
          container
          spacing={0}
          style={{
            flexWrap: 'nowrap',
            flexGrow: 1,
            background: 'white',
            paddingLeft: isXsUp ? 0 : '42px',
            paddingRight: isXsUp ? 0 : '42px',
          }}
        >
          {/* Feedback Pop up */}
          {showFeedback ? (
            <FeedbackPopup show={true} showThankYou={ended}></FeedbackPopup>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {/* Column View For Mobile User */}
            {isXsUp && getColumns().length !== 0 ? (
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <StyledTabs
                  color={getColumns()[value].groupFontColour}
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  sx={{ color: 'green!important' }}
                >
                  <StyledTab
                    color={getColumns()[0].groupFontColour}
                    label={getColumns()[0].name}
                    {...a11yProps(0)}
                    sx={{ fontSize: '16px' }}
                  />
                  <StyledTab
                    color={getColumns()[1].groupFontColour}
                    label={getColumns()[1].name}
                    {...a11yProps(1)}
                    sx={{ fontSize: '16px' }}
                  />
                  <StyledTab
                    color={getColumns()[2].groupFontColour}
                    label={getColumns()[2].name}
                    {...a11yProps(2)}
                    sx={{ fontSize: '16px' }}
                  />
                  ;
                </StyledTabs>
              </Box>
            ) : (
              <></>
            )}
            <div
              style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
            >
              {useMemo(
                () =>
                  (false
                    ? [...getProcessedColumns(), undefined]
                    : getProcessedColumns()
                  ).map((column, index) => {
                    return (
                      <React.Fragment key={index}>
                        {((isXsUp && index == value) ||
                          (!isXsUp &&
                            (global.expandColumn == -1 ||
                              (column &&
                                +column.id == global.expandColumn)))) && (
                            <ColumnContainer
                              totalPanels={1}
                              key={index + '1'}
                            >
                              {!!column ? (
                                <>
                                  {getProcessedColumns().length == 3 ?
                                    <>
                                      {column.id != '2' && global.expandColumn != 10 ?
                                        <RetroColumn
                                          leftHeaderComponent={
                                            <LeftContainer index={index} />
                                          }
                                          rightHeaderComponent={
                                            <RightContainer index={index} />
                                          }
                                          column={column}
                                          columnId={column.id}
                                          noHeader={false}
                                          showEditBox={showEditBox}
                                          setShowEditBox={setShowEditBox}
                                          setIslanded={setIsLanded}
                                          cardGroups={column.groups}
                                          columnIndex={index}
                                        /> : column.id == '2' && <ActionMainContainer />}
                                    </> :
                                    <RetroColumn
                                      leftHeaderComponent={
                                        <LeftContainer index={index} />
                                      }
                                      rightHeaderComponent={
                                        <RightContainer index={index} />
                                      }
                                      column={column}
                                      columnId={column.id}
                                      noHeader={false}
                                      showEditBox={showEditBox}
                                      setShowEditBox={setShowEditBox}
                                      setIslanded={setIsLanded}
                                      cardGroups={column.groups}
                                      columnIndex={index}
                                    />}</>

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
                          )}
                      </React.Fragment>
                    );
                  }),
                [
                  lastStateUpdate,
                  isXsUp,
                  value,
                  justMyCards,
                  currentColumn,
                  showEditBox,
                  global.expandColumn,
                  global.usersSelected,
                ]
              )}
            </div>
          </Box>
        </Grid>
      </Box>
      {/* Print Board HTML */}
      <Container
        style={{
          display: 'none',
          height: 'calc(var(--app-height))',
          overflowY: 'auto',
          backgroundColor: '#F5F5F5',
        }}
      >
        <Box ref={componentRef} id="boardPrint">
          {/* Logo */}
          <Row>
            <Col
              xs="12"
              className="d-flex justify-content-start align-items-center"
            >
              <img src={BACILogo} alt="Logo" className="logo" />
            </Col>
          </Row>
          {/* Divider */}
          <Divider
            color="#CDCDD4"
            style={{ width: '100%', marginTop: '18px' }}
          />
          {/* Retro Name */}
          <Row style={{ marginTop: '16px' }}>
            <Col
              xs="12"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeThree">
                {global.currentRetro?.name}
              </Typography>
            </Col>
          </Row>
          {/* DATE and TIME TAKEN */}
          <Row style={{ marginTop: '16px' }}>
            <Col
              xs="4"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">Date</Typography>
              <Typography className="textTypeTwo" ml={2}>
                {moment(startedDate, 'DD MMM YYYY').format('Do MMM YYYY')}
              </Typography>
            </Col>
            <Col
              xs="8"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">Time Taken</Typography>
              <Typography className="textTypeTwo" ml={2}>
                {timeTaken}
              </Typography>
            </Col>
          </Row>
          {/* NO. OF PARTICIPANTS and FACILITATORS */}
          <Row style={{ marginTop: '16px' }}>
            <Col
              xs="4"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">
                No. Of Participants
              </Typography>
              <Typography className="textTypeTwo" ml={2}>
                {users.length}
              </Typography>
            </Col>
            <Col
              xs="8"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">Facilitators</Typography>
              <Typography className="textTypeTwo" ml={2}>
                {global.user.name}
              </Typography>
            </Col>
          </Row>
          {/* Retro Column */}
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            {useMemo(
              () =>
                (false
                  ? [...getProcessedColumns(), undefined]
                  : getProcessedColumns()
                ).map((column, index) => {
                  return (
                    <React.Fragment key={index}>
                      {((isXsUp && index == value) ||
                        (!isXsUp &&
                          (global.expandColumn == -1 ||
                            (column &&
                              +column.id == global.expandColumn)))) && (
                          <PrintColumnContainer
                            totalPanels={totalPanels}
                            key={index + '1'}
                          >
                            {!!column && (
                              <>
                                <PrintRetroColumn
                                  leftHeaderComponent={
                                    <LeftContainer index={index} />
                                  }
                                  rightHeaderComponent={
                                    <RightContainer index={index} />
                                  }
                                  column={column}
                                  columnId={column.id}
                                  noHeader={false}
                                  showEditBox={showEditBox}
                                  setShowEditBox={setShowEditBox}
                                  setIslanded={setIsLanded}
                                  cardGroups={column.groups}
                                  columnIndex={index}
                                />
                              </>
                            )}
                          </PrintColumnContainer>
                        )}
                    </React.Fragment>
                  );
                }),
              [
                lastStateUpdate,
                isXsUp,
                value,
                justMyCards,
                currentColumn,
                showEditBox,
                global.expandColumn,
                global.usersSelected,
              ]
            )}
          </div>
        </Box>
      </Container>
    </>
  );
}
