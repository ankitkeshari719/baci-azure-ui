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
import { pulseCheckInterface, pulseChecksData, templatesData } from './const';
import { UserTypeArray } from '../../constants';

export function CreateRetroWithTemplatePage() {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const timeFrameRef = React.useRef<HTMLSelectElement | null>(null);
  const [localRetroName, setLocalRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );

  {
    /* BACI Details Panel Constant */
  }
  const [retroName, setRetroName] = React.useState('');
  const [retroTimeFrame, setRetroTimeFrame] = React.useState('');
  const [retroNameError, setRetroNameError] = React.useState('');
  const [retroNameWarning, setRetroWarning] = React.useState('');
  const [isTimeFrameSet, setIsTimeFrameSet] = React.useState(id ? true : false);
  {
    /* User Details Panel Constant */
  }
  const [userName, setUserName] = React.useState('');
  const [userNameError, setUserNameError] = React.useState('');
  const [userNameWarning, setUserNameWarning] = React.useState('');
  const [selectedAvatar, setAvatar] = React.useState('');
  const [avatarSelectionError, setAvatarSelectionError] = React.useState('');
  {
    /* Template Panel Constant */
  }
  const [templates, setTemplates] = React.useState(templatesData);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [templateError, setTemplateError] = React.useState('');
  {
    /* Pulse Check Panel Constant */
  }
  const [pulseChecks, setPulseChecks] =
    React.useState<Array<pulseCheckInterface> | null>(pulseChecksData);
  const [selectedPulseCheck, setSelectedPulseCheck] =
    React.useState<pulseCheckInterface | null>(null);
  const [pulseCheckError, setPulseCheckError] = React.useState('');

  const [activePanel, setActivePanel] = React.useState('detailsPanel');

  React.useEffect(() => {
    dispatch({
      type: ActionType.CLOSE_CURRENT_RETRO,
    });
  }, []);

  useAzureAuth();

  // Function to handle Retro Name on change
  function handleRetroNameChange(e: React.SetStateAction<string>) {
    if (e == '') {
      setRetroWarning('');
    } else {
      setRetroNameError('');
    }
    if (e.length >= 60) {
      let count = 80 - e.length;

      if (count === 0) {
        setRetroWarning('No more character remaining');
      } else {
        setRetroWarning('Character remaining -' + `${count}`);
      }
    } else {
      setRetroWarning('');
    }
    setRetroName(e);
  }

  // Function to handle Time Frame on change
  function handleTimeFrame(e: React.SetStateAction<string>) {
    setRetroTimeFrame(e);
    setIsTimeFrameSet(false);
  }

  // Function to template selection
  function handleTemplate(selectedTemplate_l: any) {
    let data: any = templates?.map(template => {
      if (
        selectedTemplate_l &&
        template.templateId === selectedTemplate_l.templateId
      ) {
        template.checked = true;
      } else {
        template.checked = false;
      }
      return template;
    });
    setTemplates(data);
    setSelectedTemplate(selectedTemplate_l);
    setTemplateError('');
  }

  // Function to handle pulse check selection
  function handlePulseCheck(selectedPulseCheck_l: pulseCheckInterface | null) {
    let data: any = pulseChecks?.map(pulseCheck => {
      if (selectedPulseCheck_l && pulseCheck.id === selectedPulseCheck_l.id) {
        pulseCheck.checked = true;
      } else {
        pulseCheck.checked = false;
      }
      return pulseCheck;
    });
    setPulseChecks(data);
    setSelectedPulseCheck(selectedPulseCheck_l);
    setPulseCheckError('');
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
      setRetroNameError('Please enter retro name.');
    }
    if (currentPanel === 'detailsPanel' && retroTimeFrame === '') {
      setIsTimeFrameSet(true);
      return;
    }
    if (currentPanel === 'templatePanel' && selectedTemplate === null) {
        setTemplateError('Please select the template.');
      return;
    }
    if (currentPanel === 'pulseCheckPanel' && selectedPulseCheck === null) {
        setPulseCheckError('Please select the pulse check.')
      return;
    }
    setActivePanel(nextPanel);
  };

  // Function to handle next button on click
  const onClickBack = (previousPanel: string) => {
    setActivePanel(previousPanel);
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
      retroTimeFrame !== '' &&
      userName !== '' &&
      selectedAvatar !== ''
    ) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      setRetroNameError('');
      setIsTimeFrameSet(false);
      await retro
        .createTemplate(
          { name: retroName },
          retroTimeFrame,
          '',
          userName,
          selectedAvatar,
          userType,
          selectedPulseCheck,
          selectedTemplate
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
    <Box className="retroContainer">
      <Box component="div" whiteSpace="normal" className="createRetroText">
        Create new BACI retro
      </Box>
      <Box sx={{ mt: 4, minWidth: '100%' }}>
        <BaciDetails
          activePanel={activePanel}
          retroName={retroName}
          retroTimeFrame={retroTimeFrame}
          retroNameError={retroNameError}
          retroNameWarning={retroNameWarning}
          timeFrameRef={timeFrameRef}
          isTimeFrameSet={isTimeFrameSet}
          handleRetroNameChange={handleRetroNameChange}
          handleTimeFrame={handleTimeFrame}
          onClickNext={onClickNext}
        />
        <RetroTemplate
          activePanel={activePanel}
          onClickNext={onClickNext}
          onClickBack={onClickBack}
          selectedTemplate={selectedTemplate}
          handleTemplate={handleTemplate}
          templateError={templateError}
        />
        <PulseCheck
          activePanel={activePanel}
          onClickNext={onClickNext}
          onClickBack={onClickBack}
          selectedPulseCheck={selectedPulseCheck}
          handlePulseCheck={handlePulseCheck}
          pulseCheckError={pulseCheckError}
        />
        <UserDetails
          activePanel={activePanel}
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
    </Box>
  );
}
