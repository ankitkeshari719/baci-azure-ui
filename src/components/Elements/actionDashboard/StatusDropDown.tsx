import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { jiraActionStatus } from '../../../helpers/DemoConst';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 180,
    },
  },
};

const names = jiraActionStatus;

function getStyles(name: any, personName: string, theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    color: name.color,
  };
}

export default function StatusDropDown({status}:{status:string}) {
  const theme = useTheme();
  const [statusSelected, setStatusSelected] = React.useState<string>(status);

  const handleChange = (event: SelectChangeEvent<typeof statusSelected>) => {
    const {
      target: { value },
    } = event;
    setStatusSelected(value);
  };
  const returnColor = (): string => {
    var booleanFlag:boolean=false;
    var color:string="black"
    jiraActionStatus.forEach(jira => {
      if (jira.label == statusSelected) {
        booleanFlag=true;
        color=jira.color
        return jira.color;

      }
    });
    return color;
  };
  return (
    <div>
      <FormControl sx={{ m: 1, width: 180 }} size="small">

        <Select
          labelId="demo-select-small-label"
          id="demo-small-name"

          value={statusSelected}
          style={{ color: returnColor() }}
          onChange={handleChange}

          MenuProps={MenuProps}
        >
          {names.map(name => (
            <MenuItem
              key={name.label}
              value={name.label}
              style={getStyles(name, statusSelected, theme)}
            >
              {name.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
