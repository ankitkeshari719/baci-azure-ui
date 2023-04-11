import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import animation from '../../assets/img/Retro_Finished_SVG.png';
import './../../global.scss';
import './styles.scss';
import { ContainedButton } from '../../components';

export function RetroIsFinished() {
  const navigate = useNavigate();

  function goToLanding() {
    navigate(`/`);
  }

  return (
    <Grid container className="main">
      <img src={animation}></img>
      <Typography className="firstText">Retro is Finished</Typography>
      <Typography className="secondText" mt={3}>
        Could not find the page you are looking for!
      </Typography>
      <ContainedButton
        id="goHome"
        name="Go Home"
        onClick={() => goToLanding()}
        style={{
          minWidth: '116px !important',
          width: '116px !important',
          height: '40px !important',
          marginTop: '24px !important',
        }}
      />
    </Grid>
  );
}
