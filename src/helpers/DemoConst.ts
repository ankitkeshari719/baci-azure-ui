import { JiraActionInterface, User } from './types';

export interface Team {
  teamId: string;
  teamName: string;
  ownerId: string;
  users: User[];
}

export const users = [
  {
    id: '26ef9a73-2ed0-40a8-9df8-6432a240dc81',
    name: 'Sean Woon',
    nickname: 'Sean',
    avatar: 'Animals-avatar_2avatar',
    userType: '1',
  },
  {
    id: 'a3a99a80-1b2d-11ee-be56-0242ac120002',
    name: 'Charlotte Adams',
    nickname: 'Charlotte',
    avatar: 'Animals-avatar_10avatar',
    userType: '2',
  },
  {
    id: 'a3a99d14-1b2d-11ee-be56-0242ac120002',
    name: 'Oliver Allen',
    nickname: 'Oliver',
    avatar: 'Animals-avatar_16avatar',
    userType: '2',
  },
  {
    id: 'a3a9ad40-1b2d-11ee-be56-0242ac120002',
    name: 'Noah Anderson',
    nickname: 'Noah',
    avatar: 'Animals-avatar_23avatar',
    userType: '2',
  },
  {
    id: 'a3a9b1dc-1b2d-11ee-be56-0242ac120002',
    name: 'Jack Bailey',
    nickname: 'Jack',
    avatar: 'Animals-avatar_17avatar',
    userType: '2',
  },
  {
    id: 'a3a9b362-1b2d-11ee-be56-0242ac120002',
    name: 'William Baker',
    nickname: 'William',
    avatar: 'Animals-avatar_25avatar',
    userType: '2',
  },
  {
    id: 'a3a9b4f2-1b2d-11ee-be56-0242ac120002',
    name: 'Leo Bell',
    nickname: 'Leo',
    avatar: 'Animals-avatar_11avatar',
    userType: '2',
  },
  {
    id: 'a3a9b678-1b2d-11ee-be56-0242ac120002',
    name: 'Grace Bennett',
    nickname: 'Grace',
    avatar: 'Animals-avatar_28avatar',
    userType: '2',
  },
  {
    id: 'a3a9bb32-1b2d-11ee-be56-0242ac120002',
    name: 'Lucas Blackman',
    nickname: 'Lucas',
    avatar: 'Animals-avatar_20avatar',
    userType: '2',
  },
  {
    id: 'a3a9bcae-1b2d-11ee-be56-0242ac120002',
    name: 'Thomas Butler',
    nickname: 'Thomas',
    avatar: 'Animals-avatar_31avatar',
    userType: '2',
  },
  {
    id: 'a3a9bdf8-1b2d-11ee-be56-0242ac120002',
    name: 'Henry Cameron',
    nickname: 'Henry',
    avatar: 'Animals-avatar_12avatar',
    userType: '2',
  },
  {
    id: 'a3a9bf56-1b2d-11ee-be56-0242ac120002',
    name: 'Charlie Campbell',
    nickname: 'Charlie',
    avatar: 'Animals-avatar_32avatar',
    userType: '2',
  },
  {
    id: 'a3a9c0aa-1b2d-11ee-be56-0242ac120002',
    name: 'Ivy Carter',
    nickname: 'Ivy',
    avatar: 'Animals-avatar_38avatar',
    userType: '2',
  },
  {
    id: 'a3a9c21c-1b2d-11ee-be56-0242ac120002',
    name: 'Isabella Chapman',
    nickname: 'Isabella',
    avatar: 'Animals-avatar_7avatar',
    userType: '2',
  },
  {
    id: 'a3a9c546-1b2d-11ee-be56-0242ac120002',
    name: 'James Clarke',
    nickname: 'James',
    avatar: 'Animals-avatar_13avatar',
    userType: '2',
  },
  {
    id: 'a3a9c6c2-1b2d-11ee-be56-0242ac120002',
    name: 'Liam Colling',
    nickname: 'Liam',
    avatar: 'Animals-avatar_27avatar',
    userType: '2',
  },
  {
    id: 'a3a9c834-1b2d-11ee-be56-0242ac120002',
    name: 'Alexander Cook',
    nickname: 'Alexander',
    avatar: 'Animals-avatar_21avatar',
    userType: '2',
  },
  {
    id: 'a3a9c99c-1b2d-11ee-be56-0242ac120002',
    name: 'Lily Cooper',
    nickname: 'Lily',
    avatar: 'Animals-avatar_14avatar',
    userType: '2',
  },
  {
    id: 'a3a9cb22-1b2d-11ee-be56-0242ac120002',
    name: 'Oscar Cox',
    nickname: 'Oscar',
    avatar: 'Animals-avatar_29avatar',
    userType: '2',
  },
  {
    id: 'a3a9d112-1b2d-11ee-be56-0242ac120002',
    name: 'Mason Davies',
    nickname: 'Mason',
    avatar: 'Animals-avatar_15avatar',
    userType: '2',
  },
  {
    id: 'a3a9d2c0-1b2d-11ee-be56-0242ac120002',
    name: 'Aria Edwards',
    nickname: 'Aria',
    avatar: 'Animals-avatar_30avatar',
    userType: '2',
  },
];
export const teams = [
  {
    teamId: 'BACIT001',
    teamName: 'Insurance Team',
    ownerId: users[0].id,
    users: users,
    teamPhoto: '',
  },
  {
    teamId: 'BACIT002',
    teamName: 'Mobile Experience Team',
    ownerId: users[0].id,
    users: [
      users[0],
      users[1],
      users[4],
      users[8],
      users[9],
      users[16],
      users[10],
    ],
    teamPhoto: '',
  },
  {
    teamId: 'BACIT003',
    teamName: 'Sales Team',
    ownerId: users[11].id,
    users: [
      users[0],
      users[11],
      users[4],
      users[2],
      users[10],
      users[14],
      users[15],
      users[8],
      users[9],
      users[10],
      users[13],
    ],
    teamPhoto: '',
  },
  {
    teamId: 'BACIT004',
    teamName: 'Superannuation Product Team',
    ownerId: users[12].id,
    users: [users[10], users[12], users[13], users[14], users[15], users[16]],
    teamPhoto: '',
  },
];

export const retro = [
  {
    retroId: 'BACI001',
    retroName: 'Mobile App Design BACI Session 1',
    retroCode: '54727',
    retroStatus: 'Done',
    teamId: teams[1].teamId,
    users:teams[1].users,
    actions: '4',
    retroDate: '19-06-2023',
  },
  {
    retroId: 'BACI002',
    retroName: 'Mobile App Design BACI Session 2',
    retroCode: '45273',
    retroStatus: 'Done',
    teamId: teams[1].teamId,
    users:teams[1].users,
    actions: '3',
    retroDate: '22-06-2023',
  },
  {
    retroId: 'BACI003',
    retroName: 'Mobile App Design BACI Session 3',
    retroCode: '18342',
    retroStatus: 'Inprogress',
    teamId: teams[1].teamId,
    users:teams[1].users,
    actions: '0',
    retroDate: '23-06-2023',
  },
  {
    retroId: 'BACI004',
    retroName: 'Insurance Monthly Session',
    retroCode: '10831',
    retroStatus: 'Inprogress',
    teamId: teams[0].teamId,
    users:teams[0].users,
    actions: '4',
    retroDate: '27-06-2023',
  },
  {
    retroId: 'BACI005',
    retroName: 'Project Kick off',
    retroCode: '12332',
    retroStatus: 'Done',
    teamId: teams[3].teamId,
    users:teams[3].users,
    actions: '18',
    retroDate: '28-06-2023',
  },
  {
    retroId: 'BACI006',
    retroName: 'UX planning',
    retroCode: '14832',
    retroStatus: 'Inprogress',
    teamId: teams[3].teamId,
    users:teams[3].users,
    actions: '0',
    retroDate: '26-06-2023',
  },
];

export const jiraActionStatus = [
  { label: 'TO DO', color: 'rgba(234, 67, 53, 1)' },
  { label: 'IN-PROGRESS', color: 'rgba(223, 133, 23, 1)' },
  { label: 'DONE', color: 'rgba(52, 168, 83, 1)' },
  { label: 'CANCELLED', color: 'rgba(44, 105, 161, 1)' },
];

export const ActionList: JiraActionInterface[] = [
  {
    action: {
      id: 'BACI001',
      value:
        'Convert all Low fidelity mobile designs into Hi-Fidelity clickable prototypes',
      createdBy: '',
      assigneeId: users[5].id,
      assigneeAvatar: users[5].avatar,
      assigneeName: users[5].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[0].teamName,
    jiraId: 'PB-049',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[0].label,
  },
  {
    action: {
      id: 'BACI002',
      value: 'Set up devops server for additional test environment',
      createdBy: '',
      assigneeId: users[0].id,
      assigneeAvatar: users[0].avatar,
      assigneeName: users[0].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[1].teamName,
    jiraId: 'PB-139',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI003',
      value: 'Maintain detailed documentation of database design',
      createdBy: '',
      assigneeId: users[7].id,
      assigneeAvatar: users[7].avatar,
      assigneeName: users[7].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[0].teamName,
    jiraId: 'PB-989',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[0].label,
  },
  {
    action: {
      id: 'BACI004',
      value: 'Send consolidated design meeting notes to all stakeholders',
      createdBy: '',
      assigneeId: users[12].id,
      assigneeAvatar: users[12].avatar,
      assigneeName: users[12].name,
      reacts: [],
    },
    teamId: retro[4].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-231',
    initialSession: retro[4].retroName,
    startDate: retro[4].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI005',
      value: 'Conduct a team communication workshop',
      createdBy: '',
      assigneeId: users[12].id,
      assigneeAvatar: users[12].avatar,
      assigneeName: users[12].name,
      reacts: [],
    },
    teamId: retro[4].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-917',
    initialSession: retro[4].retroName,
    startDate: retro[4].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI006',
      value: 'Review and update risk management protocols',
      createdBy: '',
      assigneeId: users[6].id,
      assigneeAvatar: users[6].avatar,
      assigneeName: users[6].name,
      reacts: [],
    },
    teamId: retro[1].teamId,
    teamName: teams[1].teamName,
    jiraId: 'PB-630',
    initialSession: retro[4].retroName,
    startDate: retro[4].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI007',
      value: 'Implement a data analysis tool and generate initial reports',
      createdBy: '',
      assigneeId: users[4].id,
      assigneeAvatar: users[4].avatar,
      assigneeName: users[4].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[2].teamName,
    jiraId: 'PB-238',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI008',
      value: 'Identify and streamline one internal workflow process',
      createdBy: '',
      assigneeId: users[18].id,
      assigneeAvatar: users[18].avatar,
      assigneeName: users[18].name,
      reacts: [],
    },
    teamId: retro[5].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-818',
    initialSession: retro[5].retroName,
    startDate: retro[5].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI009',
      value: 'Organize a focused training session on a specific topic',
      createdBy: '',
      assigneeId: users[12].id,
      assigneeAvatar: users[12].avatar,
      assigneeName: users[12].name,
      reacts: [],
    },
    teamId: retro[5].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-066',
    initialSession: retro[5].retroName,
    startDate: retro[5].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0010',
      value: 'Pilot and evaluate a new technology solution',
      createdBy: '',
      assigneeId: users[11].id,
      assigneeAvatar: users[11].avatar,
      assigneeName: users[11].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-825',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0011',
      value: 'Define specific goals and objectives for the next sprint',
      createdBy: '',
      assigneeId: users[16].id,
      assigneeAvatar: users[16].avatar,
      assigneeName: users[16].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-325',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0012',
      value: 'Implement a customer feedback collection process',
      createdBy: '',
      assigneeId: users[18].id,
      assigneeAvatar: users[18].avatar,
      assigneeName: users[18].name,
      reacts: [],
    },
    teamId: retro[5].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-334',
    initialSession: retro[5].retroName,
    startDate: retro[5].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0013',
      value: 'Improve documentation for a critical process',
      createdBy: '',
      assigneeId: users[1].id,
      assigneeAvatar: users[1].avatar,
      assigneeName: users[1].name,
      reacts: [],
    },
    teamId: retro[1].teamId,
    teamName: teams[1].teamName,
    jiraId: 'PB-610',
    initialSession: retro[1].retroName,
    startDate: retro[1].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0014',
      value: 'Conduct a comprehensive review of a financial product',
      createdBy: '',
      assigneeId: users[0].id,
      assigneeAvatar: users[0].avatar,
      assigneeName: users[0].name,
      reacts: [],
    },
    teamId: retro[0].teamId,
    teamName: teams[0].teamName,
    jiraId: 'PB-257',
    initialSession: retro[0].retroName,
    startDate: retro[0].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0015',
      value: 'Enhance compliance documentation and processes',
      createdBy: '',
      assigneeId: users[3].id,
      assigneeAvatar: users[3].avatar,
      assigneeName: users[3].name,
      reacts: [],
    },
    teamId: retro[4].teamId,
    teamName: teams[2].teamName,
    jiraId: 'PB-247',
    initialSession: retro[4].retroName,
    startDate: retro[4].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0016',
      value: 'Conduct an innovation brainstorming session',
      createdBy: '',
      assigneeId: users[10].id,
      assigneeAvatar: users[10].avatar,
      assigneeName: users[10].name,
      reacts: [],
    },
    teamId: retro[5].teamId,
    teamName: teams[2].teamName,
    jiraId: 'PB-565',
    initialSession: retro[5].retroName,
    startDate: retro[5].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0017',
      value: 'Address one recurring issue and propose a solution',
      createdBy: '',
      assigneeId: users[12].id,
      assigneeAvatar: users[12].avatar,
      assigneeName: users[12].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-604',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0018',
      value: 'Provide individual feedback and performance reviews',
      createdBy: '',
      assigneeId: users[6].id,
      assigneeAvatar: users[6].avatar,
      assigneeName: users[6].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[1].teamName,
    jiraId: 'PB-957',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI0019',
      value: 'Collaborate with another team on a small joint project',
      createdBy: '',
      assigneeId: users[10].id,
      assigneeAvatar: users[10].avatar,
      assigneeName: users[10].name,
      reacts: [],
    },
    teamId: retro[1].teamId,
    teamName: teams[1].teamName,
    jiraId: 'PB-692',
    initialSession: retro[1].retroName,
    startDate: retro[1].retroDate,
    status: jiraActionStatus[0].label,
  },
  {
    action: {
      id: 'BACI0020',
      value: 'Conduct a cybersecurity audit and implement improvements',
      createdBy: '',
      assigneeId: users[15].id,
      assigneeAvatar: users[15].avatar,
      assigneeName: users[15].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-901',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[0].label,
  },
  {
    action: {
      id: 'BACI0021',
      value: 'Clarify roles and responsibilities for a specific projec',
      createdBy: '',
      assigneeId: users[11].id,
      assigneeAvatar: users[11].avatar,
      assigneeName: users[11].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[1].teamName,
    jiraId: 'PB-219',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI0022',
      value: 'Identify one skill gap and arrange necessary training',
      createdBy: '',
      assigneeId: users[17].id,
      assigneeAvatar: users[17].avatar,
      assigneeName: users[17].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-571',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI0023',
      value: 'Implement a project management tool for better tracking',
      createdBy: '',
      assigneeId: users[7].id,
      assigneeAvatar: users[7].avatar,
      assigneeName: users[7].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-157',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0024',
      value: 'Facilitate an open discussion during team meetings',
      createdBy: '',
      assigneeId: users[0].id,
      assigneeAvatar: users[0].avatar,
      assigneeName: users[0].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-321',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0025',
      value: 'Organize a lunch-and-learn session for continuous learning',
      createdBy: '',
      assigneeId: users[10].id,
      assigneeAvatar: users[10].avatar,
      assigneeName: users[10].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-913',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI0026',
      value: 'Create and distribute a customer satisfaction survey',
      createdBy: '',
      assigneeId: users[1].id,
      assigneeAvatar: users[1].avatar,
      assigneeName: users[1].name,
      reacts: [],
    },
    teamId: retro[4].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-869',
    initialSession: retro[4].retroName,
    startDate: retro[4].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI0027',
      value: 'Pair experienced team members with junior colleagues',
      createdBy: '',
      assigneeId: users[12].id,
      assigneeAvatar: users[12].avatar,
      assigneeName: users[12].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[2].teamName,
    jiraId: 'PB-169',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[0].label,
  },
  {
    action: {
      id: 'BACI0028',
      value: 'Hold a progress check meeting and update action items',
      createdBy: '',
      assigneeId: users[12].id,
      assigneeAvatar: users[12].avatar,
      assigneeName: users[12].name,
      reacts: [],
    },
    teamId: retro[5].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-570',
    initialSession: retro[5].retroName,
    startDate: retro[5].retroDate,
    status: jiraActionStatus[0].label,
  },
  {
    action: {
      id: 'BACI0029',
      value: 'Streamline and automate one redundant process',
      createdBy: '',
      assigneeId: users[3].id,
      assigneeAvatar: users[3].avatar,
      assigneeName: users[3].name,
      reacts: [],
    },
    teamId: retro[0].teamId,
    teamName: teams[0].teamName,
    jiraId: 'PB-712',
    initialSession: retro[0].retroName,
    startDate: retro[0].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0030',
      value: 'Arrange knowledge-sharing sessions among team members',
      createdBy: '',
      assigneeId: users[6].id,
      assigneeAvatar: users[6].avatar,
      assigneeName: users[6].name,
      reacts: [],
    },
    teamId: retro[1].teamId,
    teamName: teams[1].teamName,
    jiraId: 'PB-597',
    initialSession: retro[1].retroName,
    startDate: retro[1].retroDate,
    status: jiraActionStatus[0].label,
  },
  {
    action: {
      id: 'BACI0031',
      value: 'Share a success story and extract lessons learned',
      createdBy: '',
      assigneeId: users[5].id,
      assigneeAvatar: users[5].avatar,
      assigneeName: users[5].name,
      reacts: [],
    },
    teamId: retro[2].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-662',
    initialSession: retro[2].retroName,
    startDate: retro[2].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI0032',
      value: 'Set up a basic KPI tracking system for team performance',
      createdBy: '',
      assigneeId: users[10].id,
      assigneeAvatar: users[10].avatar,
      assigneeName: users[10].name,
      reacts: [],
    },
    teamId: retro[5].teamId,
    teamName: teams[2].teamName,
    jiraId: 'PB-870',
    initialSession: retro[5].retroName,
    startDate: retro[5].retroDate,
    status: jiraActionStatus[1].label,
  },
  {
    action: {
      id: 'BACI0033',
      value: 'Plan and execute a team-building activity',
      createdBy: '',
      assigneeId: users[18].id,
      assigneeAvatar: users[18].avatar,
      assigneeName: users[18].name,
      reacts: [],
    },
    teamId: retro[3].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-448',
    initialSession: retro[3].retroName,
    startDate: retro[3].retroDate,
    status: jiraActionStatus[2].label,
  },
  {
    action: {
      id: 'BACI0034',
      value: 'Seek feedback from stakeholders and take necessary actions',
      createdBy: '',
      assigneeId: users[19].id,
      assigneeAvatar: users[19].avatar,
      assigneeName: users[19].name,
      reacts: [],
    },
    teamId: retro[1].teamId,
    teamName: teams[3].teamName,
    jiraId: 'PB-006',
    initialSession: retro[1].retroName,
    startDate: retro[1].retroDate,
    status: jiraActionStatus[1].label,
  },
];
