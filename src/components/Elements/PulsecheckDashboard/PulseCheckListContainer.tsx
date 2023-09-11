import * as React from 'react';
import {
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  CardActions,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import theme from '../../../helpers/theme/theme';
import { TextButton } from '../../CustomizedButton/TextButton';
import { pulseChecksData } from './const';
import {
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
  REGULAR_USER,
} from '../../../constants/applicationConst';

export default function PulseCheckListContainer() {
  const navigate = useNavigate();
  const [height, setHeight] = React.useState(0);
  const isMdUp: any = useMediaQuery(theme.breakpoints.only('md'));
  const isXsUp: any = useMediaQuery(theme.breakpoints.only('xs'));
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on retroListTemplate
  function goToPulseCheckLearnMore() {
    if (tempLocalUserData && tempLocalUserData.roleName === REGULAR_USER) {
      navigate(
        '/facilitator/templates/pulseCheckListTemplate/pulseCheckTemplateDetails/'
      );
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate(
        '/enterprise/templates/pulseCheckListTemplate/pulseCheckTemplateDetails/'
      );
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === REGULAR_ENTERPRISE
    ) {
      navigate(
        '/enterprise/templates/pulseCheckListTemplate/pulseCheckTemplateDetails/'
      );
    }
  }

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  return (
    <>
      <Paper
        sx={{
          width: '100%',
          background: 'rgb(249 251 252)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <BodySemiBoldTypography
          label="Template"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="Pulse Check Templates"
          style={{ color: commonStyles.PrimaryDark }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          {pulseChecksData.map(pulseCheck => {
            return (
              <Grid item xs={4} sx={{ margin: '20px 20px 0px 0px' }}>
                <Card
                  key={pulseCheck.id}
                  sx={{
                    pointerEvents: pulseCheck.isComingSoon ? 'none' : 'initial',
                    display: 'flex !important',
                    flexDirection: 'column !important',
                    justifyContent: 'space-between !important',
                    minHeight: '440px',
                    height: isMdUp
                      ? height / 2 + 20 + 'px'
                      : isXsUp
                      ? height / 2 + 60 + 'px'
                      : height / 2 - 40 + 'px',
                    width: 'calc(100% - 50px) !important',
                    background: pulseCheck.checked
                      ? 'rgba(206, 239, 255, 0.4)'
                      : '#ffffff',
                    border: pulseCheck.checked
                      ? '2px solid #2C69A1'
                      : '1px solid #E3E3E3',
                    boxShadow: 'none',
                    borderRadius: '2px',
                    '&:hover': {
                      backgroundColor: 'rgba(206, 239, 255, 0.4)',
                    },
                  }}
                >
                  <CardContent>
                    {pulseCheck.checked ? (
                      <Box component="div" className="imageContainer">
                        <Box
                          component="img"
                          alt="Logo"
                          src={pulseCheck.pulseCheckImage}
                          className="imageMain"
                        />
                      </Box>
                    ) : (
                      <Box component="div" className="imageContainer">
                        <Box
                          component="img"
                          alt="Logo"
                          src={pulseCheck.pulseCheckImage}
                          className="imageMain"
                        />
                      </Box>
                    )}
                    {/* Template Name */}
                    <Typography
                      className="templateName"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      {pulseCheck.name}
                    </Typography>
                    {/* Template Description */}
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      {pulseCheck.description}
                    </Typography>
                  </CardContent>
                  {pulseCheck.id !== 'pulse_check_not_req' && (
                    <CardActions
                      disableSpacing
                      sx={{
                        display: pulseCheck.isComingSoon ? 'none' : 'flex',
                        padding: '0px 16px 24px 16px',
                      }}
                    >
                      <TextButton
                        id={'Learn_More'}
                        label={'Learn More'}
                        size={'small'}
                        style={{
                          paddingLeft: '0px !important',
                          textDecorationLine: 'underline !important',
                          backgroundColor: 'transparent !important',
                        }}
                        disabled={pulseCheck.isComingSoon}
                        onClick={goToPulseCheckLearnMore}
                      />
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Box>
      </Paper>
    </>
  );
}
