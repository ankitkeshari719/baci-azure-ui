import { Box, Tooltip } from '@mui/material';

import './LeftBar.scss';

import {
  HomeIcon,
  ViewColumnsIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  Square3Stack3DIcon,
  UserGroupIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

import React, { useEffect } from 'react';

import Avatar from '../Avatar';

import { GlobalContext } from '../../../contexts/GlobalContext';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { BodyRegularTypography } from '../../CustomizedTypography';
import {
  REGULAR_USER,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
} from '../../../constants/applicationConst';

const LeftBar = () => {
  const navigate = useNavigate();
  const [hoverOnMenu, setHoverOnMenu] = React.useState<Boolean>(false);
  const [hoverOnUserMenu, setHoverOnUserMenu] = React.useState<Boolean>(false);
  const [selectedMenu, setSelectedMenu] = React.useState('');
  const [{ user }] = React.useContext(GlobalContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [selectedAvatar, setSelectedAvatar] = React.useState('');

  const [path, setPath] = React.useState('');
  const imaSrc = '/avatars/animals/' + selectedAvatar + '.svg';

  React.useEffect(() => {
    setSelectedAvatar(tempLocalUserData && tempLocalUserData.selectedAvatar);
    if (tempLocalUserData && tempLocalUserData.roleName === REGULAR_USER) {
      setPath('facilitator');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      setPath('enterprise');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === REGULAR_ENTERPRISE
    ) {
      setPath('enterprise');
    }
  }, [tempLocalUserData]);

  const menuArray = [
    {
      id: 1,
      label: 'Home',
      icon: HomeIcon,
      routeTo: path + '/dashboard',
      disabled: false,
    },
    {
      id: 2,
      label: 'Actions',
      icon: ClipboardDocumentCheckIcon,
      routeTo: path + '/actions',
      disabled: false,
    },

    {
      id: 3,
      label: 'Analytics',
      icon: ChartBarIcon,
      routeTo: path + '/analytics/',
      disabled: false,
    },

    {
      id: 4,
      label: 'Sessions',
      icon: ViewColumnsIcon,
      routeTo: path + '/sessions',
      disabled: false,
    },
    {
      id: 5,
      label: 'Templates',
      icon: Square3Stack3DIcon,
      routeTo: path + '/templates',
      disabled: true,
    },

    {
      id: 6,
      label: 'Users',
      icon: UserGroupIcon,
      routeTo: path + '/teams',
      disabled: true,
    },
    {
      id: 7,
      label: 'Settings',
      icon: Cog8ToothIcon,
      routeTo: path + '/settings',
      disabled: false,
    },
  ];

  const bottomMenuArray = [
    {
      id: 8,
      label: 'Help',
      icon: QuestionMarkCircleIcon,
      routeTo: path + '/help',
      disabled: false,
    },
    {
      id: 9,
      label: 'Notifications',
      icon: BellIcon,
      routeTo: path + '/notifications',
      disabled: false,
    },
  ];

  useEffect(() => {
    if (location.pathname.includes('dashboard')) {
      setSelectedMenu(menuArray[0].label);
      setPath(
        location.pathname.includes('facilitator')
          ? 'facilitator'
          : location.pathname.includes('enterprise')
          ? 'enterprise'
          : 'facilitator'
      );
    } else if (location.pathname.includes('analytics')) {
      setSelectedMenu(menuArray[2].label);
    } else if (location.pathname.includes('actions')) {
      setSelectedMenu(menuArray[1].label);
    }
  }, [
    location.pathname.includes('analytics'),
    location.pathname.includes('facilitator/dashboard'),
    location.pathname.includes('enterprise/dashboard'),
    location.pathname.includes('enterprise'),
  ]);

  // Function to navigate on retroListTemplate
  function goToRetroList() {
    setHoverOnMenu(false);
    navigate(path + '/templates/retroListTemplate/');
  }

  // Function to navigate on pulseCheckListTemplate
  function goToPulseCheckList() {
    setHoverOnMenu(false);
    navigate(path + '/templates/pulseCheckListTemplate/');
  }

  // Function to navigate to enterprise registration
  function goToEnterpriseRegistration() {
    setHoverOnUserMenu(false);
    navigate(path + '/teams/enterpriseRegistration/');
  }

  // Function to navigate to get all teams
  function goToAllTeams() {
    setHoverOnUserMenu(false);
    navigate(path + '/teams/allTeams/');
  }

  // Function to navigate on manage users
  function goToManageUser() {
    setHoverOnUserMenu(false);
    navigate(path + '/teams/manageUsers/');
  }

  // Function to navigate on goToProfile
  function goToProfile() {
    navigate(path + '/profile');
  }

  return (
    <>
      <Box
        className="leftBarContainer"
        sx={{
          display:
            location.pathname.includes('facilitator') ||
            location.pathname.includes('enterprise')
              ? 'flex'
              : 'none',
        }}
      >
        <Box className="topContainer">
          <Box
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              navigate('/');
            }}
          >
            <img src="/../images/r_MenuHeader.png" style={{ width: '56px' }} />
          </Box>
          {menuArray.map((menu, index) => {
            return (
              <Tooltip title={menu.label} key={menu.label} placement="right">
                <menu.icon
                  className={
                    menu.label == selectedMenu ? 'menuIconSelected' : 'menuIcon'
                  }
                  onClick={() => {
                    if (!menu.disabled) {
                      setSelectedMenu(menu.label);
                      navigate(menu.routeTo);
                    }
                  }}
                  onMouseEnter={() => {
                    if (menu.label === 'Templates') {
                      setHoverOnMenu(true);
                    } else if (menu.label != 'Templates') {
                      setHoverOnMenu(false);
                    }

                    if (menu.label === 'Users') {
                      setHoverOnUserMenu(true);
                    } else if (menu.label != 'Users') {
                      setHoverOnUserMenu(false);
                    }
                  }}
                  onMouseLeave={() => {}}
                />
              </Tooltip>
            );
          })}
        </Box>
        <Box className="bottomContainer">
          {bottomMenuArray.map((menu, index) => {
            return (
              <Tooltip title={menu.label} key={menu.label} placement="right">
                <menu.icon
                  className={
                    menu.label == selectedMenu ? 'menuIconSelected' : 'menuIcon'
                  }
                  onClick={() => {
                    setSelectedMenu(menu.label);
                    navigate(menu.routeTo);
                  }}
                />
              </Tooltip>
            );
          })}

          <Tooltip title={user?.name + ''} placement="right-start">
            <span>
              {selectedAvatar != '' ? (
                <LazyLoadImage
                  className="avatar"
                  style={{
                    height: '48px',
                    width: '48px',
                    borderRadius: '50%',
                    border: '5px solid #f9fbf8',
                    cursor: 'pointer',
                  }}
                  src={imaSrc}
                  onClick={goToProfile}
                ></LazyLoadImage>
              ) : (
                <LazyLoadImage
                  width="48px !important"
                  height="48px !important"
                  style={{
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                  src={'/svgs/DefaultUser.svg'}
                  onClick={goToProfile}
                ></LazyLoadImage>
              )}
            </span>
          </Tooltip>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 4,
          left: '80px',
          bottom: '400px',
          width: '320px',
          padding: '10px 1px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          display: hoverOnMenu ? 'flex' : 'none',
          borderRadius: '10px',
          border: '1px solid #CCC',
          background: '#FFF',
          boxShadow: '0px 1px 10px 0px rgba(0, 0, 0, 0.15);',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            padding: '10px 24px',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={goToRetroList}
        >
          <BodyRegularTypography label="Retro Templates" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            padding: '10px 24px',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={goToPulseCheckList}
        >
          <BodyRegularTypography label="Pulse Check Template" />
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          zIndex: 4,
          left: '80px',
          bottom: '300px',
          width: '320px',
          padding: '10px 1px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          display: hoverOnUserMenu ? 'flex' : 'none',
          borderRadius: '10px',
          border: '1px solid #CCC',
          background: '#FFF',
          boxShadow: '0px 1px 10px 0px rgba(0, 0, 0, 0.15);',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            padding: '10px 24px',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={goToEnterpriseRegistration}
        >
          <BodyRegularTypography label="Organisation Details" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            padding: '10px 24px',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={goToManageUser}
        >
          <BodyRegularTypography label="Manage Users" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            padding: '10px 24px',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={goToAllTeams}
        >
          <BodyRegularTypography label="All Teams" />
        </Box>
      </Box>
    </>
  );
};

export default LeftBar;
