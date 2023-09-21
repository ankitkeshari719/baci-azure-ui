import { Action, Retro, User } from '../types';
import { useSocket } from '../hooks/useSocket';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { Socket } from 'socket.io-client';
import { Dayjs } from 'dayjs';

import { API_URL } from '../../constants/FeatureFlags';

export const createRetro = async (
  retro: Omit<Retro, 'id'>,
  creator: User
): Promise<string> => {
  let id = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ retro, creator }),
  };
  await fetch(API_URL + '/createRetro', requestOptions)
    .then(response => response.json())
    .then(data => {
      id = data.id;
    });
  return id;
};

export const getRetro = async (id: string): Promise<Retro> => {
  let retro = new Retro();
  const requestOptions = {
    method: 'GET',
  };
  await fetch(API_URL + `/getRetro?id=${id}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      retro = data.retro[0];
    });
  if (retro) {
    retro.id = id;
  }
  return retro;
};

export const getRetroByHumanId = async (
  humanId: string
): Promise<Retro | undefined> => {
  let retro = new Array();
  let result: Retro | undefined = undefined;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(API_URL + `/getRetroByHumanId?id=${humanId}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      retro = data.retro;
    });
  retro.forEach(snapshot => {
    result = { ...(snapshot as Retro), id: snapshot._id };
  });

  return result;
};

export const getRetroActions = async (
  id: string,
  userId: string,
  userType: number,
  fromTimestamp?: number
): Promise<Action[]> => {
  let snapshot: any[] = [];
  const results: any[] = [];
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getRetroActions?id=${id}&userId=${userId}&fromTimestamp=${fromTimestamp}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      snapshot = data.retro;
    });
  if (snapshot.length !== 0) {
    snapshot[0].action.forEach((doc: any) => {
      const data = doc;
      if (!data.onlyVisibleBy || data.onlyVisibleBy.includes(userId)) {
        results.push(data);
      }
    });
    const sortedActions = results.sort((a: any, b: any) =>
      a.sourceActionTimestamp !== b.sourceActionTimestamp
        ? a.sourceActionTimestamp - b.sourceActionTimestamp
        : a.timestamp - b.timestamp
    );
    return sortedActions.map((action, index) => ({
      ...action,
      timestamp: action.timestamp,
      date: action.timestamp || new Date(),
      sourceActionTimestamp: action.sourceActionTimestamp,
    }));
  }
  return results;
};

export const addRetroAction = async (
  retroId: string,
  action: Action
): Promise<string> => {
  let id = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ retroId, action }),
  };
  await fetch(API_URL + '/addRetroAction', requestOptions)
    .then(response => response.json())
    .then(data => {
      id = data.id;
    });
  return id;
};

export const addFeedback = async (
  retroId: string,
  user: User,
  rating: number,
  comment: string
): Promise<string> => {
  let id = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ retroId, user, rating, comment }),
  };
  await fetch(API_URL + '/addFeedback', requestOptions)
    .then(response => response.json())
    .then(data => {
      id = data.id;
    });
  return id;
};

export const addDeploymentData = async (
  deploymentDate: Dayjs | null,
  notificationDate: Dayjs | null
): Promise<{ id: any; message: string }> => {
  let id = '';
  let message = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deploymentDate, notificationDate }),
  };
  await fetch(API_URL + '/addDeploymentData', requestOptions)
    .then(response => response.json())
    .then(data => {
      id = data.id;
      message = data.message;
    });
  return { id: id, message: message };
};

export const getDeploymentData = async (): Promise<any> => {
  let deploymentData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(API_URL + '/getDeploymentData', requestOptions)
    .then(response => response.json())
    .then(data => {
      deploymentData = data;
    });

  return deploymentData;
};

export const createRetroSummary=async(columns:any, cards:any[],retroId:string)=>{
  let groupData = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ columns: columns,cards:cards,retroId:retroId }),
  };
  await fetch(API_URL + '/createRetroSummary', requestOptions)
    .then(response => response.json())
    .then(data => {
      groupData = data;
    });
  return groupData;
}

export const groupSuggestion = async (
  retroId: string,
  column: any
): Promise<string> => {
  let groupData = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column: column }),
  };
  await fetch(API_URL + '/groupSuggestion', requestOptions)
    .then(response => response.json())
    .then(data => {
      groupData = data;
    });
  return groupData;
};






export const keywordExtraction = async (
  retroId: string,
  column: any
): Promise<string> => {
  let groupData = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column: column }),
  };
  await fetch(API_URL + '/keywordExtraction', requestOptions)
    .then(response => response.json())
    .then(data => {
      groupData = data;
    });
  return groupData;
};

// Jira Integration
export const connectJira = async (retroId: string): Promise<string> => {
  let jiraURL = '';
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/connectJira?retroId=${retroId}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      jiraURL = data;
    });
  return jiraURL;
};

export const getJiraToken = async (jiraCode: string): Promise<string> => {
  let jiraAccessToken = '';
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/getJiraToken?jiraCode=${jiraCode}`, requestOptions)
    .then(response => response.json())
    .then(data => {
      jiraAccessToken = data;
    });
  return jiraAccessToken;
};

export const listJiraProjects = async (jiraCode: string): Promise<any> => {
  let jiraProjects: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(
    API_URL + `/listJiraProjects?jiraCode=${jiraCode}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      jiraProjects = data;
    });
  return jiraProjects;
};

export const listJiraMeta = async (
  jiraCode: string,
  projectId: string
): Promise<string[]> => {
  let jiraProjects: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(
    API_URL + `/listJiraMeta?jiraCode=${jiraCode}&projectId=${projectId}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      jiraProjects = data;
    });
  return jiraProjects;
};

export const createJiraIssue = async (
  projectId: string,
  issueType: string,
  jiraCode: string,
  description: string
): Promise<any> => {
  let status: any = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectId,
      issueType,
      access_token: jiraCode,
      description,
    }),
  };

  await fetch(API_URL + `/createJiraIssue`, requestOptions)
    .then(response => response.json())
    .then(data => {
      status = data;
    });
  return status;
};

// Api to get dummy chart data
export const getDummyChartData = async (): Promise<any> => {
  let dummyChartData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(API_URL + '/getDummyChartData', requestOptions)
    .then(response => response.json())
    .then(data => {
      dummyChartData = data;
    });

  return dummyChartData;
};

// Chart 1: Api to get Enterprise Level ActionsCount

export interface chartInputType {userId:string,roleName:string,enterpriseId:string,teamId:string,fromDate:string,toDate:string}

export const getActionsChartData=async(input:chartInputType):Promise<any>=>{
 let actionsChartData;
  const requestOptions = {
    method: 'POST',
    body:JSON.stringify(input),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
  }
  };
  await fetch( `http://localhost:8080/getActionsChartData`,requestOptions).then(response =>response.json()).then(
      data =>{
        actionsChartData=data
      }
    )
    return actionsChartData;
}



export const getTeamLevelActionsDataForChart=async(input:chartInputType):Promise<any>=>{
  let teamLevelActionsDataForChart;
   const requestOptions = {
     method: 'POST',
     body:JSON.stringify(input),
     headers: {
       "Content-type": "application/json; charset=UTF-8"
   }
   };
   await fetch( `http://localhost:8080/analytics/getTeamLevelActionsDataForChart`,requestOptions).then(response =>response.json()).then(
       data =>{
        teamLevelActionsDataForChart=data
       }
     )
     return teamLevelActionsDataForChart;
 }

 export const getCountOfAllParticipantsOverTime=async(input:chartInputType):Promise<any>=>{
  let countOfAllParticipantsOverTime;
   const requestOptions = {
     method: 'POST',
     body:JSON.stringify(input),
     headers: {
       "Content-type": "application/json; charset=UTF-8"
   }
   };
   await fetch( `http://localhost:8080/analytics/getCountOfAllParticipantsOverTime`,requestOptions).then(response =>response.json()).then(
       data =>{
        countOfAllParticipantsOverTime=data
       }
     )
     return countOfAllParticipantsOverTime;
 }



export function formatDateToMonthYear(inputDate:string) {
  // Parse the input date
  const dateParts = inputDate.split('-');
  const year = dateParts[0];
  const month = dateParts[1];

  // Define an array of month abbreviations
  const monthAbbreviations = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  // Get the abbreviation for the month (assuming 1-based index)
  const monthAbbreviation = monthAbbreviations[parseInt(month, 10) - 1];

  // Format the date as "YYYY MON"
  const formattedDate = `${monthAbbreviation} ${year} `;

  return formattedDate;
}

export function formatDateForAPI(inputDate:string){

const parts = inputDate.split("-");
const formattedDate = `${parts[1]}/01/${parts[0]}`;
return formattedDate
}





export const getEnterpriseLevelActionsCounts = async (
  fromDate: string,
  toDate: string,
  team: string
): Promise<any> => {
  let enterpriseLevelActionsCountData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getEnterpriseLevelActionsCounts?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      enterpriseLevelActionsCountData = data;
    });

  return enterpriseLevelActionsCountData;
};

// Chart 2: Api to get Team Level Actions Count
export const getTeamLevelActionsCounts = async (
  fromDate: string,
  toDate: string
): Promise<any> => {
  let teamLevelActionsCountData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getTeamLevelActionsCounts?fromDate=${fromDate}&toDate=${toDate}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      teamLevelActionsCountData = data;
    });

  return teamLevelActionsCountData;
};

// Chart 3: Api to get count of all participant over time
export const getParticipantsCount = async (
  fromDate: string,
  toDate: string,
  team: string
): Promise<any> => {
  let participantsCountData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getParticipantsCount?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      participantsCountData = data;
    });

  return participantsCountData;
};

// Chart 4: Api to get count of all retros over time
export const getRetrosCount = async (
  fromDate: string,
  toDate: string,
  team: string
): Promise<any> => {
  let retrosCountData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getRetrosCount?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      retrosCountData = data;
    });

  return retrosCountData;
};

// Chart 5: Api to get count of all retros over time
export const getEnterpriseLevelSentimentSummary = async (
  selectedFormat: string,
  team: string
): Promise<any> => {
  let retrosCountData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getEnterpriseLevelSentimentSummary?selectedFormat=${selectedFormat}&team=${team}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      retrosCountData = data;
    });

  return retrosCountData;
};

// Chart 5: Api to get count of all retros over time
export const getEnterpriseLevelSentimentsTheme = async (
  fromDate: string,
  toDate: string,
  team: string
): Promise<any> => {
  let heatMapData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getEnterpriseLevelSentimentsTheme?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      heatMapData = data;
    });

  return heatMapData;
};

// Chart 7:  Api to get Enterprise Level Sentiments Moods
export const getEnterpriseLevelSentimentsMoods = async (
  fromDate: string,
  toDate: string,
  team: string
): Promise<any> => {
  let enterpriseLevelSentimentsMoodsData;
  const requestOptions = {
    method: 'GET',
  };
  await fetch(
    API_URL +
      `/getEnterpriseLevelSentimentsMoods?fromDate=${fromDate}&toDate=${toDate}&team=${team}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      enterpriseLevelSentimentsMoodsData = data;
    });

  return enterpriseLevelSentimentsMoodsData;
};
// ---------------------------------------- Roles API's -----------------------------------------------

// Create Role
export const createRole = async (roleName: string): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roleName,
    }),
  };

  await fetch(API_URL + `/roles/create`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Get All Roles
export const getAllRoles = async (): Promise<any> => {
  let roles: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/roles/`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        roles = response.data;
      }
    })
    .catch(err => console.log(err));

  return roles;
};

// Get By Id Role
export const getRoleById = async (roleId: string): Promise<any> => {
  let role;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/roles/${roleId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response) {
        role = response.data;
      }
    })
    .catch(err => console.log(err));
  return role;
};

// Get By Role Name
export const getRoleByName = async (roleName: string): Promise<any> => {
  let role;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/roles/getByName/${roleName}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response) {
        role = response.data;
      }
    })
    .catch(err => console.log(err));
  return role;
};

// Update Role
export const updateRole = async (
  roleId: string,
  roleName: string
): Promise<any> => {
  let message: any = '';
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      roleName,
    }),
  };

  await fetch(API_URL + `/roles/update/${roleId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      message = response.message;
    });
  return message;
};

// Delete Role
export const deleteRoleById = async (roleId: string): Promise<any> => {
  let message;
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/roles/${roleId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      message = response.message;
    });
  return message;
};

// ---------------------------------------- Teams API's -----------------------------------------------

// Create Team
export const createTeam = async (requestBody: any): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teamName: requestBody.teamName,
      teamDescription: requestBody.teamDescription,
      teamDepartment: requestBody.teamDepartment,
      createdBy: requestBody.createdBy,
      userEmailIds: requestBody.userEmailIds,
      enterpriseId: requestBody.enterpriseId,
      isActive: requestBody.isActive,
    }),
  };

  await fetch(API_URL + `/teams/create`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Get All Teams
export const getAllTeams = async (): Promise<any> => {
  let teams: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/teams/`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        teams = response.data;
      }
    })
    .catch(err => console.log(err));

  return teams;
};

// Get By Id Team
export const getTeamById = async (teamId: string): Promise<any> => {
  let team;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/teams/${teamId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response) {
        team = response.data;
      }
    })
    .catch(err => console.log(err));
  return team;
};

// Update Team
export const updateTeam = async (
  teamId: string,
  requestBody: any
): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      teamName: requestBody.teamName,
      teamDescription: requestBody.teamDescription,
      enterpriseId: requestBody.enterpriseId,
      createdBy: requestBody.createdBy,
      isActive: requestBody.isActive,
      userEmailIds: requestBody.userEmailIds,
    }),
  };

  await fetch(API_URL + `/teams/update/${teamId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Delete Role
export const deleteTeamById = async (teamId: string): Promise<any> => {
  let message;
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/teams/${teamId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      message = response.message;
    });
  return message;
};

// Get All Teams By EnterpriseId
export const getAllTeamsByEnterpriseId = async (
  enterpriseId: string
): Promise<any> => {
  let teams: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(
    API_URL + `/teams/getAllTeamsByEnterpriseId/${enterpriseId}`,
    requestOptions
  )
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        teams = response.data;
      }
    })
    .catch(err => console.log(err));
  return teams;
};

// Get All Teams data for Table
export const getTeamDataForTable = async (requestBody: any): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: requestBody.userId,
      roleName: requestBody.roleName,
      enterpriseId: requestBody.enterpriseId,
    }),
  };

  await fetch(API_URL + `/analytics/getTeamDataForTable`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// ---------------------------------------- Enterprise API's -----------------------------------------------
// Create Enterprise
export const createEnterprise = async (requestBody: any): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      organisationName: requestBody.organisationName,
      organisationDomain: requestBody.organisationDomain,
      organisationCountry: requestBody.organisationCountry,
      organisationPhoto: requestBody.organisationPhoto,
      isActive: requestBody.isActive,
    }),
  };

  await fetch(API_URL + `/enterprises/create`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Get All Enterprises
export const getAllEnterprises = async (): Promise<any> => {
  let enterprises: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/enterprises/`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        enterprises = response.data;
      }
    })
    .catch(err => console.log(err));

  return enterprises;
};

// Get By Id Enterprise
export const getEnterpriseById = async (enterpriseId: string): Promise<any> => {
  let enterprise;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/enterprises/${enterpriseId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response) {
        enterprise = response.data;
      }
    })
    .catch(err => console.log(err));
  return enterprise;
};

// Update Enterprise
export const updateEnterprise = async (
  enterpriseId: string,
  requestBody: any
): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      organisationName: requestBody.organisationName,
      organisationDomain: requestBody.organisationDomain,
      organisationCountry: requestBody.organisationCountry,
      organisationPhoto: requestBody.organisationPhoto,
      isActive: requestBody.isActive,
    }),
  };

  await fetch(API_URL + `/enterprises/update/${enterpriseId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Delete Enterprise
export const deleteEnterpriseById = async (
  enterpriseId: string
): Promise<any> => {
  let message;
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/enterprises/${enterpriseId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      message = response.message;
    });
  return message;
};

// ---------------------------------------- Actions API's -----------------------------------------------
// Create Action
export const createAction = async (requestBody: any): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actionName: requestBody.actionName,
      jiraId: requestBody.jiraId,
      retroId: requestBody.retroId,
      assignedTo: requestBody.assignedTo,
      createdBy: requestBody.createdBy,
      status: requestBody.status,
      isActive: requestBody.isActive,
    }),
  };

  await fetch(API_URL + `/actions/create`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Get All Actions
export const getAllActions = async (): Promise<any> => {
  let actions: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/actions/`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        actions = response.data;
      }
    })
    .catch(err => console.log(err));

  return actions;
};

// Get By Id Action
export const getActionById = async (actionId: string): Promise<any> => {
  let action;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/actions/${actionId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response) {
        action = response.data;
      }
    })
    .catch(err => console.log(err));
  return action;
};

// Update Action
export const updateAction = async (
  actionId: string,
  requestBody: any
): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      actionName: requestBody.actionName,
      jiraId: requestBody.jiraId,
      retroId: requestBody.retroId,
      assignedTo: requestBody.assignedTo,
      createdBy: requestBody.createdBy,
      status: requestBody.status,
      isActive: requestBody.isActive,
    }),
  };

  await fetch(API_URL + `/actions/update/${actionId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Delete Role
export const deleteActionById = async (actionId: string): Promise<any> => {
  let message;
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/actions/${actionId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      message = response.message;
    });
  return message;
};

// ---------------------------------------- Users API's -----------------------------------------------
// Get All Users
export const getAllUsers = async (): Promise<any> => {
  let users: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/users/`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        users = response.data;
      }
    })
    .catch(err => console.log(err));

  return users;
};

// Get By Id User
export const getUserByEmailId = async (emailId: string): Promise<any> => {
  let user;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/users/${emailId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response) {
        user = response.data;
      }
    })
    .catch(err => console.log(err));
  return user;
};

// Get All Users By Email Ids
export const getAllUsersByEmails = async (emails: any): Promise<any> => {
  let users: any[] = [];
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emails: emails,
    }),
  };
  await fetch(API_URL + `/users/`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        users = response.data;
      }
    })
    .catch(err => console.log(err));

  return users;
};

// Get All Users By Enterprise Id
export const getAllUsersByEnterpriseId = async (
  enterpriseId: string
): Promise<any> => {
  let users: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(
    API_URL + `/users/getAllUsersByEnterpriseId/${enterpriseId}`,
    requestOptions
  )
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        users = response.data;
      }
    })
    .catch(err => console.log(err));

  return users;
};

// Create User
export const createUser = async (requestBody: any): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      emailId: requestBody.emailId,
      phoneNo: requestBody.phoneNo,
      name: requestBody.name,
      country: requestBody.country,
      cityCode: requestBody.cityCode,
      roleId: requestBody.roleId,
      roleName: requestBody.roleName,
      enterpriseId: requestBody.enterpriseId,
      enterpriseName: requestBody.enterpriseName,
      selectedAvatar: requestBody.selectedAvatar,
      isEnterpriserRequested: requestBody.isEnterpriserRequested,
      teams: requestBody.teams,
      isActive: requestBody.isActive,
    }),
  };

  await fetch(API_URL + `/users/create`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Update User
export const updateUser = async (
  emailId: string,
  requestBody: any
): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      emailId: requestBody.emailId,
      phoneNo: requestBody.phoneNo,
      name: requestBody.name,
      country: requestBody.country,
      cityCode: requestBody.cityCode,
      roleId: requestBody.roleId,
      roleName: requestBody.roleName,
      enterpriseId: requestBody.enterpriseId,
      enterpriseName: requestBody.enterpriseName,
      selectedAvatar: requestBody.selectedAvatar,
      isEnterpriserRequested: requestBody.isEnterpriserRequested,
      teams: requestBody.teams,
      isActive: requestBody.isActive,
    }),
  };

  await fetch(API_URL + `/users/update/${emailId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Delete Role
export const deleteUserById = async (userId: string): Promise<any> => {
  let message;
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/users/${userId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      message = response.message;
    });
  return message;
};

// Authenticate user
export const authenticateUser = async (requestBody: any): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emailId: requestBody.emailId,
      password: requestBody.password,
    }),
  };

  await fetch(API_URL + `/users/authenticate`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Create User
export const deleteManyUsers = async (requestBody: any): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      emailIds: requestBody.emailIds,
    }),
  };

  await fetch(API_URL + `/users/deleteMany`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// ---------------------------------------- Enterprise Request API's -----------------------------------------------
// Create Enterprise
export const createEnterpriseRequest = async (
  requestBody: any
): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      organisationId: requestBody.enterpriseRequestParam.organisationId,
      fromName: requestBody.enterpriseRequestParam.fromName,
      fromEmail: requestBody.enterpriseRequestParam.fromEmail,
      fromTeams: requestBody.enterpriseRequestParam.fromTeams,
      toEmails: requestBody.enterpriseRequestParam.toEmails,
      isApproved: requestBody.enterpriseRequestParam.isApproved,
    }),
  };

  await fetch(API_URL + `/enterpriseRequests/create`, requestOptions)
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Get All Enterprise Request
export const getAllByEnterpriseId = async (
  organisationId: string
): Promise<any> => {
  let enterpriseRequests: any[] = [];
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/enterpriseRequests/${organisationId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      if (response && response.data) {
        enterpriseRequests = response.data;
      }
    })
    .catch(err => console.log(err));

  return enterpriseRequests;
};

// Get By Id Enterprise Request
export const getByEnterpriseRequestId = async (
  enterpriseRequestId: string
): Promise<any> => {
  let enterpriseRequest;
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(
    API_URL + `/enterpriseRequests/${enterpriseRequestId}`,
    requestOptions
  )
    .then(response => response.json())
    .then(response => {
      if (response) {
        enterpriseRequest = response.data;
      }
    })
    .catch(err => console.log(err));
  return enterpriseRequest;
};

// Update Enterprise Request
export const updateEnterpriseRequest = async (
  enterpriseRequestId: string,
  requestBody: any
): Promise<any> => {
  let data: any;
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      organisationId: requestBody.enterpriseRequestParam.organisationId,
      fromName: requestBody.enterpriseRequestParam.fromName,
      fromEmail: requestBody.enterpriseRequestParam.fromEmail,
      fromTeams: requestBody.enterpriseRequestParam.fromTeams,
      toEmails: requestBody.enterpriseRequestParam.toEmails,
      isApproved: requestBody.enterpriseRequestParam.isApproved,
    }),
  };

  await fetch(
    API_URL + `/enterpriseRequests/update/${enterpriseRequestId}`,
    requestOptions
  )
    .then(response => response.json())
    .then(response => {
      data = response.data;
    });
  return data;
};

// Delete Enterprise Request
export const deleteEnterpriseRequestById = async (
  enterpriseId: string
): Promise<any> => {
  let message;
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  };
  await fetch(API_URL + `/enterpriseRequests/${enterpriseId}`, requestOptions)
    .then(response => response.json())
    .then(response => {
      message = response.message;
    });
  return message;
};
