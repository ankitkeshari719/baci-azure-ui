import * as React from 'react';
import './../../../global.scss';
import { useNavigate } from 'react-router-dom';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import {
  createUser,
  getAllEnterprises,
  getUserByEmailId,
} from '../../../helpers/msal/services';
import * as Icons from 'heroicons-react';
import {
  BASIC,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
  REGULAR_USER_ID,
} from '../../../constants/applicationConst';
import { Dialog, DialogTitle, Grid, Box } from '@mui/material';
import { ContainedButton } from '../../../components';
import {
  H5SemiBoldTypography,
  BodyRegularTypography,
} from '../../../components/CustomizedTypography';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';

type Props = {
  accounts: any;
};

export function UserHeader({ accounts }: Props) {
  const navigate = useNavigate();
  const [height, setHeight] = React.useState(0);
  const [openEnterpriseNotExistDialog, setOpenEnterpriseNotExistDialog] =
    React.useState(false);
  const [global, dispatch] = React.useContext(GlobalContext);
  const { instance } = useMsal();

  React.useEffect(() => {
    setHeight(window.innerHeight);
    checkUser();
  }, []);

  React.useEffect(() => {
    checkUser();
  }, [accounts]);

  // Function to check weather this id is present in DB or not
  const checkUser = () => {
    if (accounts && accounts.length != 0) {
      callGetUserByEmailId(accounts[0].username);
    }
  };

  // Function to get user by email
  const callGetUserByEmailId = async (emailId: string) => {
    await getUserByEmailId(emailId).then(
      res => {
        if (res === null) {
          // Create new user in DB
          callGetAllEnterprises();
        } else {
          // Navigate the user to dashboard according to his role
          localStorage.setItem('userData', JSON.stringify(res));
          localStorage.setItem('userAzureData', JSON.stringify(accounts));
          if (res.roleName === BASIC) {
            navigate('/basic/');
          } else if (res.roleName === REGULAR_ENTERPRISE) {
            navigate('/facilitator/');
          } else if (res.roleName === ENTERPRISE_ADMIN) {
            navigate('/enterprise/');
          }
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // Function to get all user enterprises
  const callGetAllEnterprises = async () => {
    await getAllEnterprises().then(
      res => {
        const com =
          accounts && accounts[0] && accounts[0].username.split('@')[1];
        let enterpriseFlag = 0;
        if (res) {
          console.log('res', res);
          for (let i = 0; i < res.length; i++) {
            if (res[i].organisationDomain.includes(com)) {
              enterpriseFlag = 1;
              callCreateUser(res[i].organisationId, res[i].organisationName);
            }
          }
          if (enterpriseFlag == 0) {
            callCreateUser('', '');
          }
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // Function to create new user
  const callCreateUser = async (enterpriseId: any, enterpriseName: any) => {
    let requestBody;
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    if (accounts) {
      requestBody = {
        firstName: '',
        lastName: '',
        emailId: accounts[0].username,
        phoneNo: '',
        name: accounts[0].name,
        country: '',
        cityCode: '',
        plan: '',
        roleId: REGULAR_USER_ID,
        roleName: BASIC,
        enterpriseId: enterpriseId,
        enterpriseName: enterpriseName,
        selectedAvatar: '',
        isEnterpriserRequested: false,
        teams: [],
        isActive: true,
      };
      await createUser(requestBody).then(
        res => {
          if (res != null) {
            dispatch({
              type: ActionType.SET_LOADING,
              payload: { loadingFlag: false },
            });
            localStorage.setItem('userData', JSON.stringify(res));
            checkUser();
          }
        },
        err => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
          console.log('err', err);
        }
      );
    }
  };
  const handleLogoutRedirect = () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    instance
      .logoutRedirect()
      .then(() => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        setOpenEnterpriseNotExistDialog(false);
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      });
  };

  return (
    <>
      <Dialog open={openEnterpriseNotExistDialog}>
        <DialogTitle
          style={{ padding: '20px', borderBottom: '1px solid #EA4335' }}
        >
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item sm={6}>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Icons.ExclamationCircleOutline
                  size={32}
                  style={{
                    color: '#EA4335',
                    fontSize: '32px',
                  }}
                />
                <H5SemiBoldTypography
                  label={'Enterprise Not Exist'}
                  style={{
                    color: '#343434',
                    marginLeft: '12px !important',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <Box
          sx={{
            width: '600px',
            minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure your company using BACI?`}
          />
        </Box>
        {/* Buttons */}
        <Box sx={{ mx: 3 }}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flex: '1 0 auto',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              my: 2,
            }}
          >
            <AuthenticatedTemplate>
              <ContainedButton
                id={'signin_button_desktop'}
                name={'Logout'}
                onClick={() => handleLogoutRedirect()}
                style={{
                  marginTop: '42px',
                  textDecorationLine: 'underline',
                  background: '#EA4335 !important',
                }}
                size={'medium'}
              />
            </AuthenticatedTemplate>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
