import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getAllTeamsByEnterpriseId } from '../../helpers/msal/services';
import { MenuProps } from '../../screens/Analytics/const';
import { H5SemiBoldTypography } from '../CustomizedTypography';

type Props = {
  enterpriseId: string;
  selectedTeam: string;
  handleChange: any;
  padding?: string;
};

export default function TeamSelector({
  enterpriseId,
  selectedTeam,
  handleChange,
  padding,
}: Props) {
  const [teams, setTeams] = React.useState<any>([]);

  React.useEffect(() => {
    callGetAllTeamsByEnterpriseId();
  }, []);

  const callGetAllTeamsByEnterpriseId = async () => {
    await getAllTeamsByEnterpriseId(enterpriseId).then(
      res => {
        setTeams(res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  return (
    <Box m={3} sx={{ minWidth: 240 }}>
      <FormControl fullWidth>
        <Select
          value={selectedTeam}
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: '#ffffff',
                '& .MuiMenuItem-root': {
                  padding: 2,
                  display: 'block',
                },
              },
            },
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              padding: padding ? padding : '16px',
            },
          }}
        >
          <MenuItem value="0" key="0">
            {/* <H5SemiBoldTypography 
           label={"All Teams"} />   */}

            {'All Teams'}
          </MenuItem>
          {teams.map((team: any) => {
            return (
              <MenuItem value={team.teamId} key={team.teamId}>
                {/* <H5SemiBoldTypography 
           label= */}
                {team.teamName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
