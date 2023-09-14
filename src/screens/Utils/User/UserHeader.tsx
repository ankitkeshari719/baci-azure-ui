import * as React from 'react';
import './../../../global.scss';
import { useNavigate } from 'react-router-dom';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';
import {
  createUser,
  getAllEnterprises,
  getRoleByName,
  getUserByEmailId,
} from '../../../helpers/msal/services';
import * as Icons from 'heroicons-react';
import {
  REGULAR_USER,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
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
  const [enterpriseCom, setEnterpriseCom] = React.useState<any>();
  const [userRole, setUserRole] = React.useState<any>();
  const [userEnterprise, setUserEnterprise] = React.useState<any>();
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
      localStorage.setItem('userAzureData', JSON.stringify(accounts));
      callGetUserByEmailId(accounts[0].username);
    }
  };

  // Function to get user by email
  const callGetUserByEmailId = async (emailId: string) => {
    await getUserByEmailId(emailId).then(
      res => {
        if (res === null) {
          // Create new user in DB
          callGetRoleByName();
        } else {
          // Navigate the user to dashboard according to his role
          localStorage.setItem('userData', JSON.stringify(res));
          if (res.roleName === REGULAR_USER) {
            navigate('/facilitator/');
          } else if (res.roleName === ENTERPRISE_ADMIN) {
            navigate('/enterprise/');
          } else if (res.roleName === REGULAR_ENTERPRISE) {
            navigate('/enterprise/');
          }
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // Function to get regular user role data
  const callGetRoleByName = async () => {
    await getRoleByName(REGULAR_USER).then(
      res => {
        setUserRole(res);
        callGetAllEnterprises(res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // Function to get all user enterprises
  const callGetAllEnterprises = async (roleParam: any) => {
    await getAllEnterprises().then(
      res => {
        const com =
          accounts && accounts[0] && accounts[0].username.split('@')[1];
        let enterpriseFlag = 0;
        setEnterpriseCom(com);
        if (res) {
          for (let i = 0; i < res.length; i++) {
            if (res[i].organisationDomain.includes(com)) {
              setUserEnterprise(res[i]);
              callCreateUser(roleParam, res[i]);
              enterpriseFlag = 1;
            }
          }
          if (enterpriseFlag == 0) {
            // user is not from any enterprise
            setOpenEnterpriseNotExistDialog(true);
            localStorage.setItem('userData', JSON.stringify(null));
          }
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // Function to create new user
  const callCreateUser = async (roleParam: any, enterpriseParam: any) => {
    let requestBody;
    if (roleParam && enterpriseParam && accounts) {
      requestBody = {
        firstName: '',
        lastName: '',
        emailId: accounts[0].username,
        phoneNo: '',
        name: accounts[0].name,
        country: '',
        cityCode: '',
        plan: '',
        roleId: roleParam && roleParam.roleId,
        roleName: roleParam && roleParam.roleName,
        enterpriseId: enterpriseParam && enterpriseParam.organisationId,
        enterpriseName: enterpriseParam && enterpriseParam.organisationName,
        selectedAvatar: '',
        isEnterpriserRequested: false,
        teams: [],
        isActive: true,
      };
      await createUser(requestBody).then(
        res => {
          if (res != null) {
            localStorage.setItem('userData', JSON.stringify(res));
            checkUser();
          }
        },
        err => {
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
        localStorage.removeItem('userAzureData');
        localStorage.removeItem('userData');
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
