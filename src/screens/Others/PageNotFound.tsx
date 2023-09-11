import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { ContainedButtonWithIcon } from '../../components/CustomizedButton/ContainedButtonWithIcon';
import {
  BodyRegularTypography,
  H2SemiBoldTypography,
} from '../../components/CustomizedTypography';

export default function PageNotFound() {
  const navigate = useNavigate();

  // Function to navigate on create new retro page
  function goToLanding() {
    navigate(`/`);
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
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src="/svgs/pageNotFound.svg" width={400} height={400} />
        <H2SemiBoldTypography
          label="Something’s missing"
          style={{ color: '#2C69A1' }}
        />
        <BodyRegularTypography
          label="The page you are looking for is missing or the link entered is incorrect."
          style={{ color: '#4E4E4E', marginTop: '10px' }}
        />
        <ContainedButtonWithIcon
          id={'page-not-found'}
          label={'Go to Homepage'}
          size={'medium'}
          style={{ width: '260px', marginTop: '40px', textAlign: 'center' }}
          onClick={() => goToLanding()}
        />
      </Paper>
    </>
  );
}
