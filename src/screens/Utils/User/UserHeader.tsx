import * as React from 'react';
import './../../../global.scss';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import {
  createUser,
  getAllEnterprises,
  getRoleByName,
  getUserByEmailId,
} from '../../../helpers/msal/services';
import {
  REGULAR_USER,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
} from '../../../constants/applicationConst';

type Props = {
  accounts: any;
};

export function UserHeader({ accounts }: Props) {
  const navigate = useNavigate();
  const [enterpriseCom, setEnterpriseCom] = React.useState<any>();
  const [userRole, setUserRole] = React.useState<any>();
  const [userEnterprise, setUserEnterprise] = React.useState<any>();

  React.useEffect(() => {
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
        emailId: accounts[0].username,
        name: accounts[0].name,
        firstName: '',
        lastName: '',
        phoneNo: '',
        cityCode: '',
        roleName: roleParam && roleParam.roleName,
        roleId: roleParam && roleParam.roleId,
        enterpriseId: enterpriseParam && enterpriseParam.organisationId,
        enterpriseName: enterpriseParam && enterpriseParam.organisationName,
        enterprisePhoto: enterpriseParam && enterpriseParam.organisationPhoto,
        teams: [],
        plan: '',
        country: '',
        role: '',
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

  return <></>;
}
