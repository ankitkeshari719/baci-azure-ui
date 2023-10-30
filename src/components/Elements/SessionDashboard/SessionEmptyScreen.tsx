import * as React from 'react';
import Paper from '@mui/material/Paper';
import { jiraActionStatus } from '../../../constants/DemoConst';
import { Box, InputAdornment, TextField } from '@mui/material';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';

export default function ActionDashboard() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [codeError, setCodeError] = React.useState('');

  const [searchedVal, setSearchedVal] = React.useState('');

  const navigate = useNavigate();

  // Function to navigate on create new retro page
  function CreateNewRetro() {
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: true },
    });
    setCodeError('');
    if (location.pathname.includes('basic')) {
      navigate('/basic/sessions/create');
    } else if (location.pathname.includes('enterprise'))
      navigate('/enterprise/sessions/create');
;
  }

  return (
    <>
      <Paper
        sx={{
          width: '100%',
          background: 'rgb(249 251 252)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BodySemiBoldTypography
          label="Sessions"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="My Sessions"
          style={{ color: commonStyles.PrimaryDark }}
        />

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            sx={{
              marginTop: '48px',
              marginBottom: '10px',
              background: 'white',
              width: '450px',
            }}
            onChange={(e: any) => setSearchedVal(e.target.value)}
            value={searchedVal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon width="20px" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box
          sx={{
            height: 'calc(100% - 280px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img src="/svgs/emptySessions.svg" width={300} height={350} />
          <H2SemiBoldTypography
            label="No Session to display"
            style={{ color: '#2C69A1' }}
          />
          <ContainedButtonWithIcon
            id={'create_new__retro_button_desktop'}
            label={'New Session'}
            size={'medium'}
            iconPath="/svgs/plusSmall.svg"
            style={{ width: '260px', marginTop: '40px', textAlign: 'center' }}
            onClick={() => CreateNewRetro()}
          />
        </Box>
      </Paper>
    </>
  );
}
