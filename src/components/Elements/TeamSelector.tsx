import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getAllTeamsByEnterpriseId } from '../../helpers/msal/services';
import { UserContext } from '../../contexts/UserContext';
import { ENTERPRISE } from '../../constants/applicationConst';

type Props = {
  enterpriseId: string;
  selectedTeam: string;
  handleChange: any;
  padding?: string;
  showAllTeamOption?: boolean;
};

export default function TeamSelector({
  enterpriseId,
  selectedTeam,
  handleChange,
  padding,
  showAllTeamOption,
}: Props) {
  const [teams, setTeams] = React.useState<any>([]);
  const [gUser]=React.useContext(UserContext)

  React.useEffect(() => {
    if(gUser.azureUser?.roleName==ENTERPRISE){
      callGetAllTeamsByEnterpriseId();
    }
    else
    setTeams(gUser?.azureUser?.teams?gUser?.azureUser?.teams:[])
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
          {showAllTeamOption && (
            <MenuItem value="0" key="0">
              {'All Teams'}
            </MenuItem>
          )}
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
