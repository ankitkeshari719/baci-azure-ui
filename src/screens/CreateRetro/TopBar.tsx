import * as React from 'react';
import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material';
import theme from '../../theme/theme';
import BACILogo from '../../assets/img/bacilogo.png';
import Link from '@mui/material/Link';

export function TopBar() {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <AppBar
      position="static"
      className='logoContantainer'
    >
      <Toolbar variant="dense">
        <Link href="/">
          <Box
            component="img"
            sx={{
              width: isXsUp ? '53px' : '82px',
              height: isXsUp ? '18px' : '28px',
            }}
            alt="Logo"
            src={BACILogo}
          />
        </Link>
      </Toolbar>
    </AppBar>
  );
}
