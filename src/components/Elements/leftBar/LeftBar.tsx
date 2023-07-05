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
import { useNavigate, useSearchParams } from 'react-router-dom';

const LeftBar = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = React.useState('');
  const [searchParams] = useSearchParams();
  const [{ user }] = React.useContext(GlobalContext);

  const menuArray = [
    { id: 1, label: 'Home', icon: HomeIcon, routeTo: 'facilitator/dashboard', disabled: false },

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
      disabled: true,
    },

    {
      id: 4,
      label: 'Analytics',
      icon: ChartBarIcon,
      routeTo: 'facilitator/analytics/',
      disabled: false,
    },

    {
      id: 5,
      label: 'Templates',
      icon: Square3Stack3DIcon,
      routeTo: '',
      disabled: true,
    },

    {
      id: 6,
      label: 'Users',
      icon: UserGroupIcon,
      routeTo: '',
      disabled: true,
    },

    {
      id: 7,
      label: 'Settings',
      icon: Cog8ToothIcon,
      routeTo: '',
      disabled: true,
    },
  ];

  const bottomMenuArray = [
    {
      id: 8,
      label: 'Help',
      icon: QuestionMarkCircleIcon,
      routeTo: '',
      disabled: true,
    },
    {
      id: 9,
      label: 'Notifications',
      icon: BellIcon,
      routeTo: '',
      disabled: true,
    },
  ];
useEffect(()=>{
 if(location.pathname.includes('facilitator/dashboard')){
  setSelectedMenu(menuArray[0].label);
 }
 else if(location.pathname.includes('analytics')){
  setSelectedMenu(menuArray[3].label);

 }

},[location.pathname.includes('analytics'),location.pathname.includes('facilitator/dashboard')])
  return (
    <>
      <Box className="leftBarContainer" sx={{display:location.pathname.includes('facilitator')?'flex':'none'}}>
        <Box className="topContainer">
          <Box>
            <img src="/../images/r_MenuHeader.png" style={{ width: '56px' }} />
          </Box>

          {menuArray.map((menu, index) => {
            return (
              <Tooltip title={menu.label} key={menu.label}>
                <menu.icon
                  className={
                    menu.label == selectedMenu ? 'menuIconSelected' : 'menuIcon'
                  }
                  onClick={() => {
                    if(!menu.disabled)
                    {setSelectedMenu(menu.label);
                    navigate(menu.routeTo);}
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

          <Tooltip title={user?.name + ''}>
            <span>
              {user?.avatar ? (
                <Avatar
                  avatar={user.avatar}
                  onClickAvatar={() => {}}
                  css={{
                    width: '48px',

                    height: '48px',

                    borderRadius: '50%',

                    border: 'none',
                  }}
                ></Avatar>
              ) : (
                <LazyLoadImage
                  width="48px !important"
                  height="48px !important"
                  style={{
                    borderRadius: '50%',

                    border: 'none',
                  }}
                  src={'/svgs/DefaultUser.svg'}
                ></LazyLoadImage>
              )}
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* <Box sx={{ display: 'flex', position: 'abosolute', left: '72px', zIndex: '1000', background: 'white' }}>




        </Box> */}
    </>
  );
};

export default LeftBar;
