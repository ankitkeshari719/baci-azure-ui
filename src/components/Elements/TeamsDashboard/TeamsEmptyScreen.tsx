import * as React from 'react';
import Paper from '@mui/material/Paper';
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
import {
  REGULAR_USER,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
} from '../../../constants/applicationConst';

export default function TeamsEmptyScreen() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  const navigate = useNavigate();

  // Function to navigate on create new team page
  function CreateNewTeam() {
    if (tempLocalUserData && tempLocalUserData.roleName === REGULAR_USER) {
      navigate('/facilitator/teams/create/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate('/enterprise/teams/create/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === REGULAR_ENTERPRISE
    ) {
      navigate('/enterprise/teams/create/');
    }
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
          label="Teams"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="My Teams"
          style={{ color: commonStyles.PrimaryDark }}
        />
        <Box
          sx={{
            height: 'calc(100% - 280px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img src="/svgs/emptyTeams.svg" width={300} height={350} />
          <H2SemiBoldTypography
            label="You have not created any Teams"
            style={{ color: '#2C69A1' }}
          />
          <ContainedButtonWithIcon
            id={'create_new__retro_button_desktop'}
            label={'New Team'}
            size={'medium'}
            iconPath="/svgs/plusSmall.svg"
            style={{ width: '260px', marginTop: '40px', textAlign: 'center' }}
            onClick={() => CreateNewTeam()}
          />
        </Box>
      </Paper>
    </>
  );
}
