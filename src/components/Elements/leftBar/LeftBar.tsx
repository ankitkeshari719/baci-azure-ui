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
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeftBar = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = React.useState('');
  const menuArray = [
    { id: 1, label: 'Home', icon: HomeIcon, routeTo: '', disabled: false },
    {
      id: 2,
      label: 'Retros',
      icon: ViewColumnsIcon,
      routeTo: '',
      disabled: false,
    },
    {
      id: 3,
      label: 'Workspace',
      icon: ClipboardDocumentCheckIcon,
      routeTo: '',
      disabled: false,
    },
    {
      id: 4,
      label: 'Analytics',
      icon: ChartBarIcon,
      routeTo: '/analytics/',
      disabled: false,
    },
    {
      id: 5,
      label: 'Templates',
      icon: Square3Stack3DIcon,
      routeTo: '',
      disabled: false,
    },
    {
      id: 6,
      label: 'Users',
      icon: UserGroupIcon,
      routeTo: '',
      disabled: false,
    },
    {
      id: 7,
      label: 'Settings',
      icon: Cog8ToothIcon,
      routeTo: '',
      disabled: false,
    },
  ];
  const bottomMenuArray = [
    {
      id: 8,
      label: 'Help',
      icon: QuestionMarkCircleIcon,
      routeTo: '',
      disabled: false,
    },
    {
      id: 9,
      label: 'Notifications',
      icon: BellIcon,
      routeTo: '',
      disabled: false,
    },
  ];
  return (
    <>
      <Box className="leftBarContainer">
        <Box className="topContainer">
          <Box>
            <img src="../images/r_MenuHeader.png" style={{ width: '56px' }} />
          </Box>

          {menuArray.map((menu, index) => {
            return (
              <Tooltip title={menu.label} key={menu.label}>
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
        </Box>
        <Box className="bottomContainer">
          {bottomMenuArray.map((menu, index) => {
            return (
              <Tooltip title={menu.label} key={menu.label}>
                <menu.icon
                  className={
                    menu.label == selectedMenu ? 'menuIconSelected' : 'menuIcon'
                  }
                  onClick={() => {
                    setSelectedMenu(menu.label);
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          position: 'abosolute',
          left: '72px',
          zIndex: '1000',
          background: 'white',
        }}
      ></Box>
    </>
  );
};

export default LeftBar;
