import * as React from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getAllUsersByEnterpriseId } from '../../helpers/msal/services';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type Props = {
  enterpriseId: string;
  selectedUser: string;
  handleChange: any;
  padding?: string;
  width?: number;
};

export default function UserSelector({
  enterpriseId,
  selectedUser,
  handleChange,
  padding,
  width,
}: Props) {
  const [users, setUsers] = React.useState<any>([]);

  React.useEffect(() => {
    callGetAllUsersByEnterpriseId();
  }, []);

  const callGetAllUsersByEnterpriseId = async () => {
    await getAllUsersByEnterpriseId(enterpriseId).then(
      res => {
        setUsers(res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  return (
    <Box m={3} sx={{ minWidth: width }}>
      <FormControl fullWidth>
        <Select
          value={selectedUser}
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
              alignItems: 'center',
              padding: padding ? padding : '16px',
            },
          }}
        >
          {users.map((user: any) => {
            return (
              <MenuItem value={user.emailId} key={user.emailId}>
                {user.selectedAvatar != '' ? (
                  <LazyLoadImage
                    className="avatar"
                    style={{
                      height: '48px',
                      width: '48px',
                      borderRadius: '50%',
                      border: '5px solid #f9fbf8',
                      cursor: 'pointer',
                    }}
                    src={'/avatars/animals/' + user.selectedAvatar + '.svg'}
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
                  ></LazyLoadImage>
                )}

                {user.firstName + ' ' + user.lastName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
