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

export const listJiraProjects = async (jiraCode: string): Promise<string[]> => {
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

/* 
export const onSnapshotRetroActions = (socket: Socket<DefaultEventsMap, DefaultEventsMap>,id: string, userId: string, fromTimestamp: number | undefined, callback: (([]) => void)): () => void => {
        const unsubscribe = socket.on('newMessage',(snapshot: { retroId: string; action: any; }[]) => {
        const results = [] as any[];
        snapshot.forEach((change: { retroId: string; action: any; }) => {
           // if ((change.type === "modified" || change.type === "added") && !change.doc.metadata.hasPendingWrites) {
            if (change.retroId === id) {    
                const data = change.action;
                if (!data.onlyVisibleBy || data.onlyVisibleBy.includes(userId)) {
                    results.push(data);
                }
            }
            // }
        });
        callback(
            results.sort(
            (a: any, b: any) =>
                a.sourceActionTimestamp.toMillis() !== b.sourceActionTimestamp.toMillis() ?
                    a.sourceActionTimestamp.toMillis() - b.sourceActionTimestamp.toMillis() :
                    a.timestamp.toMillis() - b.timestamp.toMillis())
            .map((action) =>
            ({
                ...action,
                timestamp: action.timestamp?.toMillis(),
                date: action.timestamp?.toDate() || new Date(),
                sourceActionTimestamp: action.sourceActionTimestamp?.toMillis(),
            })));
    });
    const id2 = Math.random();
    return () => {
        unsubscribe;
    };
} */
