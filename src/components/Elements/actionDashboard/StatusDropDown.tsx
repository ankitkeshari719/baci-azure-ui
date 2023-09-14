import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { jiraActionStatus } from '../../../constants/DemoConst';
import { Box, Button, Menu } from '@mui/material';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const statusList = jiraActionStatus;

function getStyles(name: any, personName: string, theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    color: name.color,
  };
}

export default function StatusDropDown({ status,outStatusSelected }: { status: string,outStatusSelected:(event:string)=> void }) {
  const theme = useTheme();
  const [statusSelected, setStatusSelected] = React.useState<string>(status);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const returnColor = (): string => {
    var booleanFlag: boolean = false;
    var color: string = 'black';
    jiraActionStatus.forEach(jira => {
      if (jira.label == statusSelected) {
        booleanFlag = true;
        color = jira.color;
        return jira.color;
      }
    });
    return color;
  };



  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  React.useEffect(() => {
    setStatusSelected(status);
  }, [status]);

  return (
    <Box>
      <Box display="flex" flexDirection="row">
        <Box width="100px" style={{ color: returnColor() }}>
          {statusSelected}
        </Box>
        <Button
          aria-controls={open ? 'basic-menu' : undefined}
          id="basic-button"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <ChevronDownIcon fontSize="24px" width="16px" color="gray" />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          style={{ maxHeight: '300px' }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {statusList.map((name: any) => (
            <MenuItem
              key={name.label}
              value={name.label}
              style={getStyles(name, statusSelected, theme)}
              onClick={() => {
                setStatusSelected(name.label);
                outStatusSelected(name.label);
                handleClose();
              }}
            >
              {name.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
}
