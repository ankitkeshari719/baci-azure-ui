import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getAllTeamsByEnterpriseId } from '../../helpers/msal/services';
import { MenuProps } from '../../screens/Analytics/const';

type Props = {
  enterpriseId: string;
  selectedTeam: string;
  handleChange: any;
};

export default function TeamSelector({
  enterpriseId,
  selectedTeam,
  handleChange,
}: Props) {
  const [teams, setTeams] = React.useState<any>([]);

  React.useEffect(() => {
    callGetAllTeamsByEnterpriseId();
  }, []);

  const callGetAllTeamsByEnterpriseId = async () => {
    await getAllTeamsByEnterpriseId(enterpriseId).then(
      res => {
        console.log('callGetAllTeamsByEnterpriseId response', res);
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
        <InputLabel id="demo-simple-select-label">Select Team</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedTeam}
          label="Age"
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
        >
          {teams.map((team: any) => {
            return (
              <MenuItem value={team.teamId} key={team.teamId}>
                {team.teamName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
