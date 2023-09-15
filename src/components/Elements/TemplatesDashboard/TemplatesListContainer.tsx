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
import { templatesDataOne, templatesDataTwo } from './const';
import {
  BASIC,
  ENTERPRISE_ADMIN,
  ENTERPRISE,
} from '../../../constants/applicationConst';

export default function TemplatesListContainer() {
  const navigate = useNavigate();
  const [height, setHeight] = React.useState(0);
  const isMdUp: any = useMediaQuery(theme.breakpoints.only('md'));
  const isXsUp: any = useMediaQuery(theme.breakpoints.only('xs'));
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on retroListTemplate
  function goToRetroTemplateLearnMore() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate(
        '/basic/templates/retroListTemplate/RetroTemplateDetails/'
      );
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate('/enterpriseAdmin/templates/retroListTemplate/RetroTemplateDetails/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/templates/retroListTemplate/RetroTemplateDetails/');
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
          label="Session Templates"
          style={{ color: commonStyles.PrimaryDark }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          {templatesDataOne.map(template => {
            return (
              <Grid item xs={4} sx={{ margin: '20px 20px 0px 0px' }}>
                <Card
                  key={template.templateId}
                  sx={{
                    display: 'flex !important',
                    pointerEvents: template.isComingSoon ? 'none' : 'initial',
                    flexDirection: 'column !important',
                    justifyContent: 'space-between !important',
                    minHeight: '440px',
                    height: isMdUp
                      ? height / 2 + 20 + 'px'
                      : isXsUp
                      ? height / 2 + 60 + 'px'
                      : height / 2 - 40 + 'px',
                    width: '450px',
                    background: template.checked
                      ? 'rgba(206, 239, 255, 0.4)'
                      : '#ffffff',
                    border: template.checked
                      ? '2px solid #2C69A1'
                      : '1px solid #E3E3E3',
                    boxShadow: 'none',
                    borderRadius: '2px',
                    '&:hover': {
                      backgroundColor: 'rgba(206, 239, 255, 0.4)',
                    },
                  }}
                  onClick={() => console.log('')}
                >
                  <CardContent>
                    {template.checked ? (
                      <Box component="div" className="imageContainer">
                        <Box
                          component="img"
                          alt="Logo"
                          src={template.templateImage}
                          className="imageMain"
                        />
                      </Box>
                    ) : (
                      <Box component="div" className="imageContainer">
                        <Box
                          component="img"
                          alt="Logo"
                          src={template.templateImage}
                          className="imageMain"
                        />
                      </Box>
                    )}
                    <Typography
                      className="templateName"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      {template.templateName}
                    </Typography>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      {template.templateDescription}
                    </Typography>
                  </CardContent>
                  <CardActions
                    disableSpacing
                    sx={{
                      display: template.isComingSoon ? 'none' : 'flex',
                      padding: '16px',
                    }}
                  >
                    <Grid item xs={12}>
                      <Box sx={{ float: 'left' }}>
                        <TextButton
                          id={'Learn_More'}
                          label={'Learn More'}
                          size={'small'}
                          style={{
                            padding: '0px !important',
                            textDecorationLine: 'underline !important',
                            backgroundColor: 'transparent !important',
                          }}
                          disabled={template.isComingSoon}
                          onClick={goToRetroTemplateLearnMore}
                        />
                      </Box>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
          }}
        >
          {templatesDataTwo.map(template => {
            return (
              <Grid item xs={4} sx={{ margin: '20px 20px 0px 0px' }}>
                <Card
                  key={template.templateId}
                  sx={{
                    display: 'flex !important',
                    pointerEvents: template.isComingSoon ? 'none' : 'initial',
                    flexDirection: 'column !important',
                    justifyContent: 'space-between !important',
                    minHeight: '440px',
                    height: isMdUp
                      ? height / 2 + 20 + 'px'
                      : isXsUp
                      ? height / 2 + 60 + 'px'
                      : height / 2 - 40 + 'px',
                    width: '450px',
                    background: template.checked
                      ? 'rgba(206, 239, 255, 0.4)'
                      : '#ffffff',
                    border: template.checked
                      ? '2px solid #2C69A1'
                      : '1px solid #E3E3E3',
                    boxShadow: 'none',
                    borderRadius: '2px',
                    '&:hover': {
                      backgroundColor: 'rgba(206, 239, 255, 0.4)',
                    },
                  }}
                  onClick={() => console.log('')}
                >
                  <CardContent>
                    {template.checked ? (
                      <Box component="div" className="imageContainer">
                        <Box
                          component="img"
                          alt="Logo"
                          src={template.templateImage}
                          className="imageMain"
                        />
                      </Box>
                    ) : (
                      <Box component="div" className="imageContainer">
                        <Box
                          component="img"
                          alt="Logo"
                          src={template.templateImage}
                          className="imageMain"
                        />
                      </Box>
                    )}
                    <Typography
                      className="templateName"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      {template.templateName}
                    </Typography>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      {template.templateDescription}
                    </Typography>
                  </CardContent>
                  <CardActions
                    disableSpacing
                    sx={{
                      display: template.isComingSoon ? 'none' : 'flex',
                      padding: '16px',
                    }}
                  >
                    <Grid item xs={12}>
                      <Box sx={{ float: 'left' }}>
                        <TextButton
                          id={'Learn_More'}
                          label={'Learn More'}
                          size={'small'}
                          style={{
                            padding: '0px !important',
                            textDecorationLine: 'underline !important',
                            backgroundColor: 'transparent !important',
                          }}
                          disabled={template.isComingSoon}
                          onClick={() => console.log('')}
                        />
                      </Box>
                    </Grid>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Box>
      </Paper>
    </>
  );
}
