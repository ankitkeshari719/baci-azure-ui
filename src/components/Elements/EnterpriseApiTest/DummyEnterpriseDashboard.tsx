import * as React from 'react';
import {
  getAllRoles,
  getRoleById,
  deleteRoleById,
  createRole,
  updateRole,
  createTeam,
  deleteTeamById,
  getAllTeams,
  getTeamById,
  updateTeam,
  getAllTeamsByEnterpriseId,
  createEnterprise,
  deleteEnterpriseById,
  getAllEnterprises,
  getEnterpriseById,
  updateEnterprise,
  createAction,
  deleteActionById,
  getActionById,
  getAllActions,
  updateAction,
  getAllUsers,
  getUserByEmailId,
  getAllUsersByEmails,
  getAllUsersByEnterpriseId,
  createUser,
  updateUser,
  deleteUserById,
  authenticateUser,
} from '../../../helpers/msal/services';
import { ENTERPRISE } from '../../../constants/applicationConst';

export default function DummyEnterpriseDashboard() {
  React.useEffect(() => {
    // callCreateRole();
    // callGetAllRoles();
    // callGetRoleById();
    // callDeleteRoleById();
    // callUpdateRole();
    // callGetAllTeams();
    // callGetTeamById();
    // callDeleteTeamById();
    // callUpdateTeam();
    // callGetAllTeamsByEnterpriseId();
    // callCreateEnterprise();
    // callGetAllEnterprises();
    // callGetEnterpriseById();
    // callUpdateEnterprise();
    // callDeleteEnterpriseById();
    // callCreateAction();
    // callGetAllActions();
    // callGetActionById();
    // callUpdateAction();
    // callDeleteActionById();
    // callGetAllUsers();
    // callGetUserByEmailId();
    // callGetAllUsersByEmailIds();
    // callGetAllUsersByEnterpriseId();
    // callCreateUser();
    // callUpdateUser();
    // callDeleteUserById();
    callAuthenticateUser();
  }, []);

  // ---------------------------------------- Roles API's -----------------------------------------------
  const callCreateRole = async () => {
    const roleName = ENTERPRISE;
    await createRole(roleName).then(
      res => {
        console.log('callCreateRole response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetAllRoles = async () => {
    await getAllRoles().then(
      res => {
        console.log('callGetAllRoles response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetRoleById = async () => {
    const roleId = 'regular_user0.8981389442061536';
    await getRoleById(roleId).then(
      res => {
        console.log('callGetRoleById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callUpdateRole = async () => {
    const roleName = ENTERPRISE;
    const roleId = 'regular_user0.8981389442061536';
    await updateRole(roleId, roleName).then(
      res => {
        console.log('callUpdateRole response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callDeleteRoleById = async () => {
    const roleId = 'regular_user0.8981389442061536';
    await deleteRoleById(roleId).then(
      res => {
        console.log('callDeleteRoleById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };
  // ---------------------------------------- Teams API's -----------------------------------------------

  const callCreateTeam = async () => {
    const requestBody = {
      teamName: 'Mobile team',
      teamDescription: 'Dummy Team',
      enterpriseId: 'adaptovate',
      createdBy: 'ankitkeshari@gmail.com',
      userEmailIds: ['ankitkeshari@gmail.com'],
      isActive: false,
    };

    await createTeam(requestBody).then(
      res => {
        console.log('callCreateTeam response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetAllTeams = async () => {
    await getAllTeams().then(
      res => {
        console.log('callGetAllTeams response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetTeamById = async () => {
    const teamId = 'mobile_team0.902322796861198';
    await getTeamById(teamId).then(
      res => {
        console.log('callGetTeamById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callUpdateTeam = async () => {
    const requestBody = {
      teamName: 'Mobile team 2',
      teamDescription: 'Dummy Team',
      enterpriseId: 'adaptovate',
      createdBy: 'ankitkeshari@gmail.com',
      userEmailIds: ['ankitkeshari@gmail.com'],
      isActive: false,
    };
    const teamId = 'mobile_team0.07515855817868644';
    await updateTeam(teamId, requestBody).then(
      res => {
        console.log('callUpdateTeam response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callDeleteTeamById = async () => {
    const teamId = 'mobile_team0.07515855817868644';
    await deleteTeamById(teamId).then(
      res => {
        console.log('callDeleteTeamById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetAllTeamsByEnterpriseId = async () => {
    const enterpriseId = 'adaptovate';
    await getAllTeamsByEnterpriseId(enterpriseId).then(
      res => {
        console.log('callGetAllTeamsByEnterpriseId response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // ---------------------------------------- Enterprise API's -----------------------------------------------
  const callCreateEnterprise = async () => {
    const requestBody = {
      organisationName: 'Adaptovate',
      organisationDomain: 'adaptovate.com',
      organisationCountry: 'Australia',
      isActive: false,
    };

    await createEnterprise(requestBody).then(
      res => {
        console.log('callCreateEnterprise response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetAllEnterprises = async () => {
    await getAllEnterprises().then(
      res => {
        console.log('callGetAllEnterprises response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetEnterpriseById = async () => {
    const organisationId = 'mobile_team0.902322796861198';
    await getEnterpriseById(organisationId).then(
      res => {
        console.log('callGetEnterpriseById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callUpdateEnterprise = async () => {
    const requestBody = {
      organisationName: 'Adaptovate',
      organisationDomain: 'adaptovate.com',
      organisationCountry: 'Australia',
      isActive: false,
    };
    const organisationId = 'mobile_team0.07515855817868644';
    await updateEnterprise(organisationId, requestBody).then(
      res => {
        console.log('callUpdateEnterprise response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callDeleteEnterpriseById = async () => {
    const organisationId = 'mobile_team0.902322796861198';
    await deleteEnterpriseById(organisationId).then(
      res => {
        console.log('callDeleteEnterpriseById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // ---------------------------------------- Actions API's -----------------------------------------------
  const callCreateAction = async () => {
    const requestBody = {
      actionName: 'Dummy Action',
      jiraId: 'Jira_123',
      retroId: 'retro_123',
      assignedTo: 'ankit.keshari@adaptovate.cu',
      createdBy: 'vishal.gawande@adaptovate.cu',
      status: 'In Progress',
      isActive: false,
    };

    await createAction(requestBody).then(
      res => {
        console.log('callCreateAction response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetAllActions = async () => {
    await getAllActions().then(
      res => {
        console.log('callGetAllActions response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetActionById = async () => {
    const actionId = 'dummy_action0.22746054851576702';
    await getActionById(actionId).then(
      res => {
        console.log('callGetActionById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callUpdateAction = async () => {
    const requestBody = {
      actionName: 'Dummy Action',
      jiraId: 'Jira_123',
      retroId: 'retro_123',
      assignedTo: 'ankit.keshari@adaptovate.cu',
      createdBy: 'ashwin.gawande@adaptovate.cu',
      status: 'In Progress',
      isActive: false,
    };
    const actionId = 'dummy_action0.22746054851576702';
    await updateAction(actionId, requestBody).then(
      res => {
        console.log('callUpdateAction response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callDeleteActionById = async () => {
    const actionId = 'dummy_action0.22746054851576702';
    await deleteActionById(actionId).then(
      res => {
        console.log('callDeleteActionById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // ---------------------------------------- Users API's -----------------------------------------------
  const callGetAllUsers = async () => {
    await getAllUsers().then(
      res => {
        console.log('callGetAllUsers response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetUserByEmailId = async () => {
    const emailId = 'ankitkeshari@gmail.com';
    await getUserByEmailId(emailId).then(
      res => {
        console.log('callGetUserByEmailId response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetAllUsersByEmailIds = async () => {
    const emailIds = ['ankitkeshari@gmail.com'];
    await getAllUsersByEmails(emailIds).then(
      res => {
        console.log('callGetAllUsersByEmailIds response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callGetAllUsersByEnterpriseId = async () => {
    const enterpriseId = 'evoltech';
    await getAllUsersByEnterpriseId(enterpriseId).then(
      res => {
        console.log('callGetAllUsersByEnterpriseId response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callCreateUser = async () => {
    const requestBody = {
      emailId: 'vishalGawande@gmail.com',
      password: 'Ankit@123',
      roleId: 'enterprise_admin',
      enterpriseId: 'evoltech',
      isActive: false,
    };
    await createUser(requestBody).then(
      res => {
        console.log('callCreateUser response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callUpdateUser = async () => {
    const requestBody = {
      emailId: 'ankitkeshari@gmail.com',
      password: 'Ankit@123',
      roleId: 'enterprise_admin',
      enterpriseId: 'adatovate',
      isActive: false,
    };
    const emailId = 'ankitkeshari@gmail.com';
    await updateUser(emailId, requestBody).then(
      res => {
        console.log('callUpdateUser response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callDeleteUserById = async () => {
    const userId = '@gmail.com';
    await deleteUserById(userId).then(
      res => {
        console.log('callDeleteUserById response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const callAuthenticateUser = async () => {
    const requestBody = {
      emailId: 'vishalGawande@gmail.com',
      password: 'Ankit@123',
    };
    await authenticateUser(requestBody).then(
      res => {
        console.log('callAuthenticateUser response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  return <></>;
}
