import * as React from 'react';
import { Box, Grid } from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRetro } from '../../helpers';
import { useAzureAuth } from '../../msal/azureauth';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ActionType } from '../../contexts/GlobalContext';
import { BaciDetails } from './BaciDetails';
import { RetroTemplate } from './RetroTemplate';
import { PulseCheck } from './PulseCheck';
import { UserDetails } from './UserDetails';
import { TopBar } from './TopBar';
import { pulseCheckInterface } from './const';
import { UserTypeArray } from '../../constants';

export function CreateRetroWithTemplatePage() {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const timeframeRef = React.useRef<HTMLSelectElement | null>(null);
  const [localRetroName, setLocalRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );

  const [retroName, setRetroName] = React.useState('');
  const [retroTimeframe, setRetroTimeframe] = React.useState('');
  const [retroNameError, setRetroNameError] = React.useState('');
  const [retroNameWarning, setRetoWarning] = React.useState('');
  const [isTimeFrameSet, setisTimeFrameSet] = React.useState(id ? true : false);
  const [userName, setUserName] = React.useState('');
  const [userNameError, setUserNameError] = React.useState('');
  const [userNameWarning, setUserNameWarning] = React.useState('');
  const [selectedAvatar, setAvatar] = React.useState('');
  const [avatarSelectionError, setAvatarSelectionError] = React.useState('');
  const [expandedPanel, setExpandedPanel] =
    React.useState<string>('detailsPanel');
  const [allPanels, setAllPanels] = React.useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [selectedPulseCheck, setSelectedPulseCheck] =
    React.useState<pulseCheckInterface | null>(null);

  React.useEffect(() => {
    dispatch({
      type: ActionType.CLOSE_CURRENT_RETRO,
    });
  }, []);

  useAzureAuth();

  // Function to handle Retro Name on change
  function handleRetroNameChange(e: React.SetStateAction<string>) {
    if (e == '') {
      setRetoWarning('');
    } else {
      setRetroNameError('');
    }
    if (e.length >= 60) {
      let count = 80 - e.length;

      if (count === 0) {
        setRetoWarning('No more charachter remaining');
      } else {
        setRetoWarning('Character remaining -' + `${count}`);
      }
    } else {
      setRetoWarning('');
    }
    setRetroName(e);
  }

  // Function to handle Time Frame on change
  function handleTimeFrame(e: React.SetStateAction<string>) {
    setRetroTimeframe(e);
    setisTimeFrameSet(false);
  }

  // Function to handle Time Frame on change
  function handlePulseCheck(e: pulseCheckInterface | null) {
    console.log('Data :: ', e);
    setSelectedPulseCheck(e);
  }
  function handleTemplate(e: any) {
    console.log('Data :: ', e);
    setSelectedTemplate(e);
  }

  // Function to handle User Name on change
  const handleUsername = (e: string) => {
    setUserNameWarning('');
    setUserNameError('');
    if (e.length >= 25) {
      let count = 30 - e.length;
      if (count === 0) {
        setUserNameWarning('No more charachter remaining');
      } else {
        setUserNameWarning('Character remaining - ' + `${count}`);
      }
    }
    setUserName(e);
  };

  const onClickAvatar = (avatarName: any) => {
    setAvatar(avatarName);
    setAvatarSelectionError('');
  };

  // Function to handle next button on click
  const onClickNext = (currentPanel: string, nextPanel: string) => {
    if (currentPanel === 'detailsPanel' && retroName === '') {
      setRetroNameError('Please enter retro name');
      return;
    }
    if (currentPanel === 'detailsPanel' && retroTimeframe === '') {
      setisTimeFrameSet(true);
      return;
    }
    if (!allPanels.includes(currentPanel)) {
      allPanels.push(currentPanel);
    }
    setExpandedPanel(nextPanel);
  };

  // Function to handle next button on click
  const onClickBack = (previousPanel: string) => {
    setExpandedPanel(previousPanel);
    let index = allPanels.indexOf(previousPanel);
    if (index !== -1) {
      const newPanels = allPanels.splice(index, 1);
      setAllPanels(newPanels);
    }
  };

  // Function to create a New Retro
  const create = async () => {
    sessionStorage.setItem('retroname', retroName);
    setLocalRetroName(retroName);
    const userType: number =
      global?.user?.id == global.currentRetro?.creatorId
        ? UserTypeArray[1].id
        : UserTypeArray[0].id;

    if (userName === '') setUserNameError('Please enter avatar name');
    if (selectedAvatar === '') setAvatarSelectionError('Please select avatar');

    if (
      retroName !== '' &&
      retroTimeframe !== '' &&
      userName !== '' &&
      selectedAvatar !== ''
    ) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      setRetroNameError('');
      setisTimeFrameSet(false);
      await retro
        .createTemplate(
          { name: retroName },
          retroTimeframe,
          '',
          userName,
          selectedAvatar,
          userType,
          selectedPulseCheck
        )
        .then(
          res => {
            dispatch({ type: ActionType.CREATE_RETRO, payload: {} });
            dispatch({
              type: ActionType.SET_PREFERRED_NICKNAME,
              payload: {
                preferredNickname: userName,
                avatar: selectedAvatar,
                userType,
              },
            });
            dispatch({
              type: ActionType.SET_LOADING,
              payload: { loadingFlag: false },
            });
            navigate('/join/' + res.humanId);
          },
          err => {
            console.log('err', err);
            dispatch({
              type: ActionType.SET_LOADING,
              payload: { loadingFlag: false },
            });
          }
        );
    }
    sessionStorage.setItem('retroname', retroName);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <TopBar />
      <Box component="main" className="retroContainer">
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              Create new BACI retro
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ marginTop: '16px' }}>
              {/* BACI Details Panel */}
              <BaciDetails
                expandedPanel={expandedPanel}
                allPanels={allPanels}
                retroName={retroName}
                retroTimeframe={retroTimeframe}
                retroNameError={retroNameError}
                retroNameWarning={retroNameWarning}
                timeframeRef={timeframeRef}
                isTimeFrameSet={isTimeFrameSet}
                handleRetroNameChange={handleRetroNameChange}
                handleTimeFrame={handleTimeFrame}
                onClickNext={onClickNext}
              />
              {/* Template Panel */}
              <RetroTemplate
                expandedPanel={expandedPanel}
                allPanels={allPanels}
                onClickNext={onClickNext}
                onClickBack={onClickBack}
                selectedTemplate={selectedTemplate}
                handleTemplate={handleTemplate}
              />
              {/* Pulse Check Panel */}
              <PulseCheck
                expandedPanel={expandedPanel}
                allPanels={allPanels}
                onClickNext={onClickNext}
                onClickBack={onClickBack}
                selectedPulseCheck={selectedPulseCheck}
                handlePulseCheck={handlePulseCheck}
              />
              {/* User Details Panel */}
              <UserDetails
                expandedPanel={expandedPanel}
                allPanels={allPanels}
                onClickBack={onClickBack}
                create={create}
                handleUsername={handleUsername}
                userName={userName}
                userNameError={userNameError}
                userNameWarning={userNameWarning}
                selectedAvatar={selectedAvatar}
                avatarSelectionError={avatarSelectionError}
                onClickAvatar={onClickAvatar}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
