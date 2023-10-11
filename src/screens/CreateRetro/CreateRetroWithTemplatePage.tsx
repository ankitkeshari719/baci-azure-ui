import * as React from 'react';
import { Box, SelectChangeEvent } from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRetro } from '../../helpers';
import { useAzureAuth } from '../../helpers/msal/azureauth';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ActionType } from '../../contexts/GlobalContext';
import { BaciDetailsTab } from './BaciDetailsTab';
import { RetroTemplateTab } from './RetroTemplateTab';
import { PulseCheckTab } from './PulseCheckTab';
import { UserDetailsTab } from './UserDetailsTab';
import {
  RETRO_IMMEDIATELY,
  pulseCheckInterface,
  pulseChecksData,
  templatesData,
} from './const';
import { UserTypeArray } from '../../constants';
import {
  getRetro,
  getTeamById,
  getUserByEmailId,
} from '../../helpers/msal/services';
import { StartRetroWithTemplate } from './StartRetroWithTemplate';
import { TeamsDetailsTab } from './TeamsDetailsTab';
import { ScheduleRetroTab } from './ScheduleRetroTab';
import moment from 'moment';
import { ContainedButton } from '../../components';

type Props = {
  handleStartRetro: () => void;
  isRetroStart: boolean;
};

export function CreateRetroWithTemplatePage({
  handleStartRetro,
  isRetroStart,
}: Props) {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const timeFrameRef = React.useRef<HTMLSelectElement | null>(null);
  const [localRetroName, setLocalRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );
  const [activePanel, setActivePanel] = React.useState('detailsPanel');
  const [isStartRetro, setIsStartRetro] = React.useState(false);
  const [isLoginUser, setIsLoginUser] = React.useState(false);

  {
    /* BACI Details Panel Constant */
  }
  const [retroName, setRetroName] = React.useState('');
  const [retroTimeFrame, setRetroTimeFrame] = React.useState('');
  const [retroNameError, setRetroNameError] = React.useState('');
  const [retroNameWarning, setRetroWarning] = React.useState('');
  const [isTimeFrameSet, setIsTimeFrameSet] = React.useState(id ? true : false);

  {
    /* Template Panel Constant */
  }
  const [templates, setTemplates] = React.useState(templatesData);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [customizedTemplate, setCustomizedTemplate] = React.useState(null);
  const [isTemplateCustomized, setIsTemplateCustomized] = React.useState(false);
  {
    /* Pulse Check Panel Constant */
  }
  const [pulseChecks, setPulseChecks] =
    React.useState<Array<pulseCheckInterface> | null>(pulseChecksData);
  const [selectedPulseCheck, setSelectedPulseCheck] =
    React.useState<pulseCheckInterface | null>(null);

  {
    /* User Details Panel Constant */
  }
  const [userName, setUserName] = React.useState('');
  const [userNameError, setUserNameError] = React.useState('');
  const [userNameWarning, setUserNameWarning] = React.useState('');
  const [selectedAvatar, setAvatar] = React.useState('');
  const [avatarSelectionError, setAvatarSelectionError] = React.useState('');

  {
    /* Team Details Panel & Facilitator Details PanelConstant */
  }
  const [selectedTeam, setSelectedTeam] = React.useState('');
  const [selectedTeamData, setSelectedTeamData] = React.useState(null);
  const [teamSelectionError, setTeamSelectionError] = React.useState('');
  const [selectedFacilitator, setSelectedFacilitator] = React.useState('');
  const [selectedFacilitatorData, setSelectedFacilitatorData] =
    React.useState(null);
  const [facilitatorSelectionError, setFacilitatorSelectionError] =
    React.useState('');

  {
    /* Schedule Details Panel Constant */
  }
  const [scheduleRetroType, setScheduleRetroType] =
    React.useState(RETRO_IMMEDIATELY);
  const [scheduleRetroTime, setScheduleRetroTime] = React.useState(
    moment(new Date()).format('Do MMM YYYY h:mm:ss a')
  );
  const [scheduleDescription, setScheduleDescription] = React.useState('');
  const [scheduleDescriptionError, setScheduleDescriptionError] =
    React.useState('');

  React.useEffect(() => {
    setSelectedFacilitatorData(null);
    setSelectedTeamData(null);
    dispatch({
      type: ActionType.CLOSE_CURRENT_RETRO,
    });
  }, []);

  React.useEffect(() => {
    if (
      window.location.href.indexOf('enterprise') > -1 ||
      window.location.href.indexOf('basic') > -1
    ) {
      setIsLoginUser(true);
    } else {
      setIsLoginUser(false);
    }
    const initialPulseCheck = pulseChecksData.filter(e => e.checked == true);
    const initialTemplate: any = templatesData.filter(e => e.checked == true);
    if (!isTemplateCustomized) {
      setSelectedTemplate(initialTemplate && initialTemplate[0]);
    }
    setSelectedPulseCheck(initialPulseCheck && initialPulseCheck[0]);
  }, []);

  const callGetTeamById = async (selectedTeamId: any) => {
    await getTeamById(selectedTeamId).then(
      res => {
        setSelectedTeamData(res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetUserByEmailId = async (selectedFacilitatorId: any) => {
    await getUserByEmailId(selectedFacilitatorId).then(
      res => {
        setSelectedFacilitatorData(res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

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
  function handleCheckedTemplate(selectedTemplateData: any) {
    let data: any = templates?.map(template => {
      if (
        selectedTemplateData &&
        template.templateId === selectedTemplateData.templateId
      ) {
        template.checked = true;
      } else {
        template.checked = false;
      }
      return template;
    });
    setTemplates(data);
    setSelectedTemplate(selectedTemplateData);
  }

  function handleTemplateSelectClick(
    selectedTemplateId: string,
    customizedTemplateData: any
  ) {
    let data: any = templates?.map(template => {
      if (template.templateId === selectedTemplateId) {
        template.checked = true;
      } else {
        template.checked = false;
      }
      return template;
    });
    setCustomizedTemplate(customizedTemplateData);
    setSelectedTemplate({ ...customizedTemplateData });
    setTemplates(data);
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
  }

  function handlePulseCheckSelectClick(selectedPulseCheckId: any) {
    let data: any = pulseChecks?.map(pulseCheck => {
      if (pulseCheck.id === selectedPulseCheckId) {
        pulseCheck.checked = true;
      } else {
        pulseCheck.checked = false;
      }
      return pulseCheck;
    });
    setTemplates(data);
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

  // Function to handle Avatar change
  const onClickAvatar = (avatarName: string) => {
    setAvatar(avatarName);
    setAvatarSelectionError('');
  };

  // Function to handle the team selection
  const handleTeamChange = (event: SelectChangeEvent) => {
    setSelectedTeam(event.target.value as string);
    callGetTeamById(event.target.value);
    setTeamSelectionError('');
  };

  // Function to handle the facilitator selection
  const handleFacilitatorChange = (event: SelectChangeEvent) => {
    setSelectedFacilitator(event.target.value as string);
    callGetUserByEmailId(event.target.value);
    setFacilitatorSelectionError('');
  };

  // Function to handle the schedule retro type
  const handleRetroTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScheduleRetroType((event.target as HTMLInputElement).value);
  };

  const handleRetroDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setScheduleRetroTime((event.target as HTMLInputElement).value);
  };

  // Function to handle the schedule description
  const handleScheduleDescriptionChange = (value: any) => {
    setScheduleDescription(value);
    setScheduleDescriptionError('');
  };

  // Function to handle next button on click
  const onClickBack = (previousPanel: string) => {
    setActivePanel(previousPanel);
  };

  // Function to handle next button on click
  const onClickNext = (currentPanel: string, nextPanel: string) => {
    if (
      currentPanel === 'detailsPanel' &&
      (retroName === '' || retroTimeFrame === '')
    ) {
      if (retroName === '') {
        setRetroNameError('Please enter retro name.');
      }
      if (retroTimeFrame === '') {
        setIsTimeFrameSet(true);
      }
      return;
    }

    if (
      currentPanel === 'userDetailPanel' &&
      (userName === '' || selectedAvatar === '')
    ) {
      if (selectedAvatar === '') {
        setAvatarSelectionError('Please select avatar');
      }
      if (userName === '') {
        setUserNameError('Please enter your name');
      }
      return;
    }

    if (!isLoginUser) {
      // If user is not basic and enterprise
      setActivePanel(nextPanel);
      if (
        currentPanel === 'userDetailPanel' &&
        retroName != '' &&
        retroTimeFrame != '' &&
        selectedTemplate != null &&
        selectedPulseCheck != null &&
        userName != '' &&
        selectedAvatar != ''
      ) {
        create();
      }
    } else {
      // If user is basic and enterprise
      if (
        currentPanel === 'teamDetailPanel' &&
        (selectedTeam === '' || selectedFacilitator === '')
      ) {
        if (selectedTeam === '') {
          setTeamSelectionError('Please select team');
        }
        if (selectedFacilitator === '') {
          setFacilitatorSelectionError('Please select facilitator');
        }
        return;
      }
      if (
        currentPanel === 'scheduleDetailPanel' &&
        scheduleDescription === ''
      ) {
        if (scheduleDescription === '') {
          setScheduleDescriptionError('Please add description');
        }
        return;
      }
      setActivePanel(nextPanel);
    }
  };

  // Function to create a New Retro
  const create = async () => {
    let mySelectedTemplate;
    if (isTemplateCustomized) {
      const localStorageTemplateTemp = localStorage.getItem('selectedTemplate');
      mySelectedTemplate =
        localStorageTemplateTemp && JSON.parse(localStorageTemplateTemp);
    } else {
      mySelectedTemplate = selectedTemplate;
    }

    sessionStorage.setItem('retroname', retroName);
    setLocalRetroName(retroName);
    const userType: number =
      global?.user?.id == global.currentRetro?.creatorId
        ? UserTypeArray[1].id
        : UserTypeArray[0].id;

    console.log('isLoginUser', isLoginUser);
    console.log('retroName', retroName);
    console.log('retroTimeFrame', retroTimeFrame);
    console.log('userName', userName);
    console.log('selectedAvatar', selectedAvatar);
    console.log('selectedPulseCheck', selectedPulseCheck);
    console.log('selectedTemplate', selectedTemplate);
    console.log('selectedTeam', selectedTeam);
    console.log('selectedFacilitator', selectedFacilitator);
    console.log('scheduleRetroType', scheduleRetroType);
    console.log('scheduleRetroTime', scheduleRetroTime);
    console.log('scheduleDescription', scheduleDescription);

    if (!isLoginUser) {
      // if the user is not basic and enterprise
      if (
        retroName !== '' &&
        retroTimeFrame !== '' &&
        userName !== '' &&
        selectedAvatar !== '' &&
        selectedPulseCheck != null &&
        selectedTemplate != null
      ) {
        dispatch({ type: ActionType.CREATE_RETRO, payload: {} });
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
            mySelectedTemplate
          )
          .then(
            res => {
              // dispatch({ type: ActionType.CREATE_RETRO, payload: {} });
              const userTypeValue: number =
                global?.user?.id == res?.creatorId
                  ? UserTypeArray[1].id
                  : UserTypeArray[0].id;
              dispatch({
                type: ActionType.SET_PREFERRED_NICKNAME,
                payload: {
                  preferredNickname: userName,
                  avatar: selectedAvatar,
                  userType: userTypeValue,
                },
              });
              dispatch({
                type: ActionType.SET_LOADING,
                payload: { loadingFlag: false },
              });
              // Call Join Retro
              // Get Retro
              getRetro(res.id as string)
                .then(retro => {
                  if (retro && retro.id) {
                    console.log(
                      '------------- Setting retro details for BoardState in create retro temp page -------------',
                      retro
                    );
                    dispatch({
                      type: ActionType.SET_CURRENT_RETRO,
                      payload: { retro },
                    });
                  }
                })
                .catch(e => {
                  console.log('error', e);
                });
              setIsStartRetro(true);
              handleStartRetro();
              localStorage.removeItem('selectedTemplate');
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
    } else {
      // if the user is basic and enterprise
      if (
        retroName !== '' &&
        retroTimeFrame !== '' &&
        selectedPulseCheck != null &&
        selectedTemplate != null &&
        selectedTeam !== '' &&
        selectedFacilitator !== '' &&
        scheduleRetroType !== '' &&
        scheduleRetroTime !== '' &&
        scheduleDescription !== ''
      ) {
        dispatch({ type: ActionType.CREATE_RETRO, payload: {} });
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
            mySelectedTemplate
          )
          .then(
            res => {
              // dispatch({ type: ActionType.CREATE_RETRO, payload: {} });
              const userTypeValue: number =
                global?.user?.id == res?.creatorId
                  ? UserTypeArray[1].id
                  : UserTypeArray[0].id;
              dispatch({
                type: ActionType.SET_PREFERRED_NICKNAME,
                payload: {
                  preferredNickname: userName,
                  avatar: selectedAvatar,
                  userType: userTypeValue,
                },
              });
              dispatch({
                type: ActionType.SET_LOADING,
                payload: { loadingFlag: false },
              });
              // Call Join Retro
              // Get Retro
              getRetro(res.id as string)
                .then(retro => {
                  if (retro && retro.id) {
                    console.log(
                      '------------- Setting retro details for BoardState in create retro temp page -------------',
                      retro
                    );
                    dispatch({
                      type: ActionType.SET_CURRENT_RETRO,
                      payload: { retro },
                    });
                  }
                })
                .catch(e => {
                  console.log('error', e);
                });
              setIsStartRetro(true);
              handleStartRetro();
              localStorage.removeItem('selectedTemplate');
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
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      {!isRetroStart ? (
        <Box component="div" whiteSpace="normal" className="createRetroText">
          Create A New Session
        </Box>
      ) : (
        <Box component="div" whiteSpace="normal" className="createRetroText">
          {global.currentRetro?.name} is ready to start
        </Box>
      )}
      {isLoginUser ? (
        <>
          <Box sx={{ mt: 4, minWidth: '100%' }}>
            <BaciDetailsTab
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
            <RetroTemplateTab
              activePanel={activePanel}
              onClickNext={onClickNext}
              onClickBack={onClickBack}
              selectedTemplate={selectedTemplate}
              handleCheckedTemplate={handleCheckedTemplate}
              handleTemplateSelectClick={handleTemplateSelectClick}
              templates={templates}
              setSelectedTemplate={setSelectedTemplate}
              isTemplateCustomized={isTemplateCustomized}
              setIsTemplateCustomized={setIsTemplateCustomized}
              customizedTemplate={customizedTemplate}
            />
            <PulseCheckTab
              activePanel={activePanel}
              onClickNext={onClickNext}
              onClickBack={onClickBack}
              selectedPulseCheck={selectedPulseCheck}
              handlePulseCheck={handlePulseCheck}
              handlePulseCheckSelectClick={handlePulseCheckSelectClick}
              isLoginUser={isLoginUser}
            />
            <TeamsDetailsTab
              activePanel={activePanel}
              onClickBack={onClickBack}
              onClickNext={onClickNext}
              selectedTeam={selectedTeam}
              handleTeamChange={handleTeamChange}
              selectedFacilitator={selectedFacilitator}
              handleFacilitatorChange={handleFacilitatorChange}
              selectedTeamData={selectedTeamData}
              selectedFacilitatorData={selectedFacilitatorData}
              teamSelectionError={teamSelectionError}
              facilitatorSelectionError={facilitatorSelectionError}
            />
            <ScheduleRetroTab
              activePanel={activePanel}
              onClickBack={onClickBack}
              onClickNext={onClickNext}
              scheduleRetroType={scheduleRetroType}
              scheduleRetroTime={scheduleRetroTime}
              scheduleDescription={scheduleDescription}
              scheduleDescriptionError={scheduleDescriptionError}
              handleRetroTypeChange={handleRetroTypeChange}
              handleRetroDateChange={handleRetroDateChange}
              handleScheduleDescriptionChange={handleScheduleDescriptionChange}
            />
            {activePanel == 'finalTab' && (
              <ContainedButton
                name="Save Session"
                onClick={create}
                style={{
                  mt: 5,
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
                size={'medium'}
              />
            )}
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ mt: 4, minWidth: '100%' }}>
            <BaciDetailsTab
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
            <RetroTemplateTab
              activePanel={activePanel}
              onClickNext={onClickNext}
              onClickBack={onClickBack}
              selectedTemplate={selectedTemplate}
              handleCheckedTemplate={handleCheckedTemplate}
              handleTemplateSelectClick={handleTemplateSelectClick}
              templates={templates}
              setSelectedTemplate={setSelectedTemplate}
              isTemplateCustomized={isTemplateCustomized}
              setIsTemplateCustomized={setIsTemplateCustomized}
              customizedTemplate={customizedTemplate}
            />
            <PulseCheckTab
              activePanel={activePanel}
              onClickNext={onClickNext}
              onClickBack={onClickBack}
              selectedPulseCheck={selectedPulseCheck}
              handlePulseCheck={handlePulseCheck}
              handlePulseCheckSelectClick={handlePulseCheckSelectClick}
              isLoginUser={isLoginUser}
            />
            <UserDetailsTab
              activePanel={activePanel}
              onClickBack={onClickBack}
              onClickNext={onClickNext}
              handleUsername={handleUsername}
              userName={userName}
              userNameError={userNameError}
              userNameWarning={userNameWarning}
              selectedAvatar={selectedAvatar}
              avatarSelectionError={avatarSelectionError}
              onClickAvatar={onClickAvatar}
            />
          </Box>
        </>
      )}
      {isStartRetro && (
        <Box
          sx={{
            mt: 2,
            minWidth: '100%',
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}
        >
          <StartRetroWithTemplate />
        </Box>
      )}
    </Box>
  );
}
