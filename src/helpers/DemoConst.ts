import { JiraActionInterface, User } from "./types";


export interface Team {
    teamId:string;
    teamName:string;
    ownerId:string;
    users:User[]
}

export const users=[

    {id:"26ef9a73-2ed0-40a8-9df8-6432a240dc81",name:'Sean Woon',nickname:'Sean',avatar:'Animals-avatar_2avatar',userType:"1"},
    {id:"a3a99a80-1b2d-11ee-be56-0242ac120002",name:'Charlotte Adams',nickname:'Charlotte',avatar:'Animals-avatar_10avatar',userType:"2"},
    {id:"a3a99d14-1b2d-11ee-be56-0242ac120002",name:'Oliver Allen',nickname:'Oliver',avatar:'Animals-avatar_16avatar',userType:"2"},
    {id:"a3a9ad40-1b2d-11ee-be56-0242ac120002",name:'Noah Anderson',nickname:'Noah',avatar:'Animals-avatar_23avatar',userType:"2"},
    {id:"a3a9b1dc-1b2d-11ee-be56-0242ac120002",name:'Jack Bailey',nickname:'Jack',avatar:'Animals-avatar_17avatar',userType:"2"},
    {id:"a3a9b362-1b2d-11ee-be56-0242ac120002",name:'William Baker',nickname:'William',avatar:'Animals-avatar_25avatar',userType:"2"},
    {id:"a3a9b4f2-1b2d-11ee-be56-0242ac120002",name:'Leo Bell',nickname:'Leo',avatar:'Animals-avatar_11avatar',userType:"2"},
    {id:"a3a9b678-1b2d-11ee-be56-0242ac120002",name:'Grace Bennett',nickname:'Grace',avatar:'Animals-avatar_28avatar',userType:"2"},
    {id:"a3a9bb32-1b2d-11ee-be56-0242ac120002",name:'Lucas Blackman',nickname:'Lucas',avatar:'Animals-avatar_20avatar',userType:"2"},
    {id:"a3a9bcae-1b2d-11ee-be56-0242ac120002",name:'Thomas Butler',nickname:'Thomas',avatar:'Animals-avatar_31avatar',userType:"2"},
    {id:"a3a9bdf8-1b2d-11ee-be56-0242ac120002",name:'Henry Cameron',nickname:'Henry',avatar:'Animals-avatar_12avatar',userType:"2"},
    {id:"a3a9bf56-1b2d-11ee-be56-0242ac120002",name:'Charlie Campbell',nickname:'Charlie',avatar:'Animals-avatar_32avatar',userType:"2"},
    {id:"a3a9c0aa-1b2d-11ee-be56-0242ac120002",name:'Ivy Carter',nickname:'Ivy',avatar:'Animals-avatar_38avatar',userType:"2"},
    {id:"a3a9c21c-1b2d-11ee-be56-0242ac120002",name:'Isabella Chapman',nickname:'Isabella',avatar:'Animals-avatar_7avatar',userType:"2"},
    {id:"a3a9c546-1b2d-11ee-be56-0242ac120002",name:'James Clarke',nickname:'James',avatar:'Animals-avatar_13avatar',userType:"2"},
    {id:"a3a9c6c2-1b2d-11ee-be56-0242ac120002",name:'Liam Colling',nickname:'Liam',avatar:'Animals-avatar_27avatar',userType:"2"},
    {id:"a3a9c834-1b2d-11ee-be56-0242ac120002",name:'Alexander Cook',nickname:'Alexander',avatar:'Animals-avatar_21avatar',userType:"2"},
    {id:"a3a9c99c-1b2d-11ee-be56-0242ac120002",name:'Lily Cooper',nickname:'Lily',avatar:'Animals-avatar_14avatar',userType:"2"},
    {id:"a3a9cb22-1b2d-11ee-be56-0242ac120002",name:'Oscar Cox',nickname:'Oscar',avatar:'Animals-avatar_29avatar',userType:"2"},
    {id:"a3a9d112-1b2d-11ee-be56-0242ac120002",name:'Mason Davies',nickname:'Mason',avatar:'Animals-avatar_15avatar',userType:"2"},
    {id:"a3a9d2c0-1b2d-11ee-be56-0242ac120002",name:'Aria Edwards',nickname:'Aria',avatar:'Animals-avatar_30avatar',userType:"2"},

]
export const teams=[
    {teamId:'BACIT001',teamName:'Insurance Team',ownerId:users[0].id,users:users,teamPhoto:''},
    {teamId:'BACIT002',teamName:'Mobile Experience Team',ownerId:users[0].id,users:[users[0],users[1],users[4],users[8],users[9],users[16],users[10]],teamPhoto:''},
    {teamId:'BACIT003',teamName:'Sales Team',ownerId:users[11].id,users:[users[0],users[11],users[4],users[2],users[10],users[14],users[15],users[8],users[9],users[10],users[13]],teamPhoto:''},
    {teamId:'BACIT004',teamName:'Superannuation Product Team',ownerId:users[12].id,users:[users[10],users[12],users[13],users[14],users[15],users[16]],teamPhoto:''}
]

export const retro=[
    {retroId:'BACI001',retroName:'Mobile App Design BACI Session 1',retroCode:'54727',retroStatus:'done',teamId:teams[1].teamId,actions:'',retroDate:("13-08-2022")},
    {retroId:'BACI002',retroName:'Mobile App Design BACI Session 2',retroCode:'45273',retroStatus:'done',teamId:teams[1].teamId,actions:'',retroDate:("13-08-2022")},
    {retroId:'BACI003',retroName:'Mobile App Design BACI Session 3',retroCode:'12832',retroStatus:'inprogress',teamId:teams[1].teamId,actions:'',retroDate:("13-08-2022")},
    {retroId:'BACI004',retroName:'Insurance Monthly Session',retroCode:'12832',retroStatus:'inprogress',teamId:teams[0].teamId,actions:'',retroDate:("13-08-2022")},
    {retroId:'BACI005',retroName:'Project Kick off',retroCode:'12832',retroStatus:'inprogress',teamId:teams[3].teamId,actions:'',retroDate:("13-08-2022")}
]

export const jiraActionStatus=["TO DO","IN PROGRESS","DONE","CANCELLED"]


export const ActionList: JiraActionInterface[] = [
    {
        action: {
            id: "BACI001",
            value: 'Convert all Low fidelity mobile designs into Hi-Fidelity clickable prototypes',
            createdBy: "",
            assigneeId: users[5].id,
            assigneeAvatar: users[5].avatar,
            assigneeName: users[5].name,
            reacts: []
        }
        , teamId: retro[3].teamId,
        teamName: teams[0].teamName,
        jiraId: 'PB-234',
        initialSession: retro[3].retroName,
        startDate: retro[3].retroDate,
        status: jiraActionStatus[0]
    },
    {
        action: {
            id: "BACI002",
            value: 'Set up devops server for additional test environment',
            createdBy: "",
            assigneeId: users[5].id,
            assigneeAvatar: users[5].avatar,
            assigneeName: users[5].name,
            reacts: []
        }
        , teamId: retro[2].teamId,
        teamName: teams[1].teamName,
        jiraId: 'PB-633',
        initialSession: retro[2].retroName,
        startDate: retro[2].retroDate,
        status: jiraActionStatus[1]
    },
    {
        action: {
            id: "BACI003",
            value: 'Maintain detailed documentation of database design',
            createdBy: "",
            assigneeId: users[7].id,
            assigneeAvatar: users[7].avatar,
            assigneeName: users[7].name,
            reacts: []
        }
        , teamId: retro[3].teamId,
        teamName: teams[0].teamName,
        jiraId: 'PB-276',
        initialSession: retro[3].retroName,
        startDate: retro[3].retroDate,
        status: jiraActionStatus[3]
    },
    {
        action: {
            id: "BACI004",
            value: 'Send consolidated design meeting notes to all stakeholders',
            createdBy: "",
            assigneeId: users[12].id,
            assigneeAvatar: users[12].avatar,
            assigneeName: users[12].name,
            reacts: []
        }
        , teamId: retro[4].teamId,
        teamName: teams[3].teamName,
        jiraId: 'PB-835',
        initialSession: retro[4].retroName,
        startDate: retro[4].retroDate,
        status: jiraActionStatus[2]
    }

]