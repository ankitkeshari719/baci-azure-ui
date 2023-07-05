import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { SocketContext } from '../../contexts/SocketProvider';
import LandingImage from '../../assets/img/landing_img.png';
import LandingMobileImage from '../../assets/img/Mobile_home_Image.png';
import BACILogo from '../../assets/img/bacilogobeta.svg';
import commomStyles from './../../style.module.scss';
import {
  H1SemiBoldTypography,
  H5SemiBoldTypography,
} from '../../components/CustomizedTypography';

const styles = {
  mainDiv: {
    backgroundImage: `url(${LandingImage})`,
    top: '5.78%',
    bottom: '15.2%',
  },
  mainDivXs: {
    backgroundImage: `url(${LandingImage})`,
    top: '5.78%',
    bottom: '15.2%',
    height: '33vh',
  },
  paperContainer: {
    height: '100vh',
    borderRadius: '0px',
    top: '4.74%',
    bottom: '15.2%',
    background:
      'linear-gradient(180deg, rgba(1, 13, 19, 0.87) 0%, rgba(3, 19, 28, 0.740375) 23.15%, rgba(101, 200, 250, 0.13) 100%)',
  },
  paperContainerXs: {
    height: '33vh',
    borderRadius: '0px',
    top: '4.74%',
    bottom: '15.2%',
    background:
      'linear-gradient(180deg, rgba(1, 13, 19, 0.87) 0%, rgba(3, 19, 28, 0.740375) 23.15%, rgba(101, 200, 250, 0.13) 100%)',
  },
  slogan: {
    marginLeft: '58px',

    display: 'flex',
  },
  sloganText: {
    fontFamily: 'Poppins',
    fontSize: '36px',
    fontWeight: '500',
    lineHeight: '48px',
    letterSpacing: ' 0.5px',
    color: commomStyles.grey,
    margin: '2px',
  },
  sloganTextGrow: {
    fontFamily: 'Poppins',
    fontSize: '36px',
    fontWeight: '500',
    lineHeight: '48px',
    letterSpacing: ' 0.5px',
    color: commomStyles.secondaryMain,
    margin: '2px',
  },
  logoImage: {
    //position: 'absolute' as 'absolute',
    height: '49.5px',
    marginTop: '25px',
    marginLeft: '58px',
  },
  logoImageXs: {
    //position: 'absolute' as 'absolute',
    height: '42px',
  },
  fullPoint: {
    margin: '2px',
    color: '#EE7538',
    fontSize: '36px',
  },
};

export function LandingLayout() {
  const isXsUp = useMediaQuery('(max-width:768px)');

  const socket = React.useContext(SocketContext);
  const [isMaintenanceAlertOpen, setIsMaintenanceAlertOpen] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;

    console.log(isPortrait);
    console.log('-------- closing socket ----------');
    socket.close();
  }, []);

  React.useEffect(() => {
    const maintenanceScheduled_1 = sessionStorage.getItem(
      'isMaintenanceScheduled'
    );
    const maintenanceScheduled_2 =
      maintenanceScheduled_1 && JSON.parse(maintenanceScheduled_1);
    const lastRetroName_1 = sessionStorage.getItem('lastRetroName');
    const lastRetroName_2 = lastRetroName_1 && JSON.parse(lastRetroName_1);
    if (maintenanceScheduled_2 && lastRetroName_2 != '') {
      setIsMaintenanceAlertOpen(true);
    } else {
      setIsMaintenanceAlertOpen(true);
    }
  }, []);



  return (
    <>
      {isXsUp ? (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width:'100%'
          }}
        >
          <img
            src={LandingMobileImage}
            style={{ width: '100%', height: '120px' }}
          ></img>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              // height: '48vh',
              width: '100%',
              top: '0px',
            }}
          >
            <Box
              sx={{
                background: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '10px',
              }}
            >
              <Box>
                <LazyLoadImage
                  style={styles.logoImageXs}
                  alt="logo"
                  height="48px"
                  width="108px"
                  src={BACILogo} // use normal <img> attributes as props
                />
              </Box>
              <Box display="flex" mt="32px">
                {/* Reflect Text */}
                <H5SemiBoldTypography
                  label="Reflect"
                  style={{ color: '#F0F0F0' }}
                />
                {/* Dot Text */}
                <Typography
                  color={commomStyles.secondaryMain}
                  mr="6px"
                  ml="6px"
                >
                  {'\u002E'}
                </Typography>
                {/* Gratitude Text */}
                <H5SemiBoldTypography
                  label="Gratitude"
                  style={{ color: '#F0F0F0' }}
                />
                {/* Dot Text */}
                <Typography
                  color={commomStyles.secondaryMain}
                  mr="6px"
                  ml="6px"
                >
                  {'\u002E'}
                </Typography>
                {/* Action Text */}
                <H5SemiBoldTypography
                  label="Action"
                  style={{ color: '#EE7538' }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              minHeight: '400px!important',
              height: '100%',
              display: 'flex',
              position: 'relative',
            }}
          >
            <img
              src={LandingImage}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '400px!important',
              }}
            ></img>
            <Box
              sx={{
                position: 'absolute',
                top: isMaintenanceAlertOpen ? '80px' : '0px',
                width: '100%',
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.4)',
                flexDirection: 'column',
                paddingBottom: '30px',
              }}
            >
              <Box>
                <img src={BACILogo} alt="Logo" style={styles.logoImage} />
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                mt="47px"
                ml="58px"
                flexWrap="wrap"
              >
                <Box display="flex">
                  {/* Reflect Text */}
                  <H1SemiBoldTypography
                    label="Reflect"
                    style={{ color: '#F0F0F0' }}
                  />
                  {/* Dot Text */}
                  <Typography
                    color={commomStyles.secondaryMain}
                    mr="6px"
                    ml="6px"
                    fontSize="32px"
                  >
                    {'\u002E'}
                  </Typography>
                </Box>
                <Box display="flex">
                  {/* Gratitude Text */}
                  <H1SemiBoldTypography
                    label="Gratitude"
                    style={{ color: '#F0F0F0' }}
                  />
                  {/* Dot Text */}
                  <Typography
                    color={commomStyles.secondaryMain}
                    mr="6px"
                    ml="6px"
                    fontSize="32px"
                  >
                    {'\u002E'}
                  </Typography>
                </Box>
                {/* Action Text */}
                <H1SemiBoldTypography
                  label="Action"
                  style={{ color: '#EE7538' }}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
