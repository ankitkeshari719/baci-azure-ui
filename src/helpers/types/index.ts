import { AlertColor } from '@mui/material';

export class Retro {
  id: string = '';
  humanId: string = '';
  name: string = '';
  joinUrl: string = '';
  creatorId?: string = '';
  timestamp?: Date | undefined;
  waitingTimeStamp: Date | undefined;
  retroStatus: string = '';
}
export interface PulseCheckSubmitStatus {
  retroId: string;
  pulseSubmitState: boolean;
}
export class User {
  id: string = '';
  name: string = '';
  nickname?: string = '';
  avatar: string = '';
  userType: number = 0;
}

export interface UserType {
  userId: string;
  userNickname: string;
  avatar: string;
  feedback: FeedbackEntry[];
  pulseCheckQuestions: PulseCheckEntry[];
  checked: boolean;
  isFacilitator: boolean;
  isMobile: boolean;
}

export class SnackMessageClass {
  snackMessageType: AlertColor = 'success';
  message: string = '';
}

export class Global {
  user: User = new User();
  currentRetro?: Retro = undefined;
  preferredNickname?: string = undefined;
  avatar?: string = '';
  snackMessage: SnackMessageClass = new SnackMessageClass();
  retroCreateState?: boolean = false;
  pulseCheckState?: PulseCheckSubmitStatus = {
    retroId: '',
    pulseSubmitState: false,
  };

  loadingFlag?: boolean = false;
  expandColumn?: number = -1;
  usersSelected?: any[] = [];
  leaveRetro?: boolean = false;
  feedbackSubmit?: boolean = false;
  emojiId?: string = '';
  isMaintenanceScheduled?: boolean = false;
  lastGlobalStateUpdate: Date | undefined = new Date();
  jiraCode?: string ="";
}

export class LastRetroName {
  lastRetroName?: string = undefined;
  loadingFlag?: boolean = false;
}

export interface Card {
  id: string;
  value: string;
  reacts: any[];
  locked: boolean;
  lockedBy?: string;
  createdBy?: string;
  lastUpdatedBy?: string;
  editCount: number;
  avatar: string;
  keywords: string[];
}

export interface ActionInterface {
  id: string;
  value: string;
  createdBy?: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  reacts: any[];
  locked?: boolean;
  lockedBy?: string;
  editCount?: number;
  columnId?: string;
  columnName?: string;
  lastUpdatedBy?: string;
  checked?: boolean;
}
export interface Actions {
  order: number;
  actions: ActionInterface[];
  isVotingEnableToParticipant?: boolean;
  isAddActionEnableToParticipant?: boolean;
  messageForParicipants?:string;
  postMessageForParticipants?:boolean;
  backgroundColor?:string;
  fontColor?:string;
}
export interface JiraActionInterface {
  action:ActionInterface;
  teamId:string;
  teamName:string;
  jiraId:string;
  initialSession:string;
  startDate:string;
  // TO DO , IN - PROGRESS, DONE, CANCELLED
  status:string; 

}



export interface CardGroup {
  id: string;
  name: string;
  order: number;
  reactions?: { userId: string; react: string }[];
  cards: Card[];
  createdBy: string;
  lastUpdatedBy?: string;
  locked: boolean;
  lockedBy?: string;
  suggested?: boolean;
}

export interface Column {
  id: string;
  name: string;
  order: number;
  cardColour: string;
  cardColourHover: string;
  groupFontColour: string;
  groupColour: string;
  groups: CardGroup[];
  lastUpdatedBy?: string;
  publish: boolean;
  showSuggestion: boolean;
  showKeywords?: boolean;
}

export interface PulseCheckEntry {
  id: string;
  entry: number;
}

export interface PulseCheckSubmitStatus {
  retroId: string;
  pulseSubmitState: boolean;
}

export interface FeedbackEntry {
  id: string;
  entry: string;
}

export class BoardState {
  retroId: string = '';
  loading: boolean = true;
  columns: Column[] = [];
  actionsData: Actions = {
    order: 0,
    actions: [],
    isVotingEnableToParticipant: false,
    isAddActionEnableToParticipant: false,
    messageForParicipants:"",
    postMessageForParticipants:false,
    backgroundColor:'rgba(138, 56, 245, 0.1)',
    fontColor:'#8A38F5',
  };
  creatorId: string = '';
  users: {
    userId: string;
    userNickname: string;
    avatar: string;
    feedback: FeedbackEntry[];
    pulseCheckQuestions: PulseCheckEntry[];
    checked: boolean;
    isFacilitator: boolean;
    isMobile: boolean;
  }[] = [];
  countdownFrom: number = -1;
  countdownDuration: number = 5 * 60 * 1000;
  countdownPaused: boolean = false;
  countdownExpired: boolean = false;
  retroName: string = '';
  retroGoal: string = '';
  retroTimeframe: string = '';
  fullPulseCheck: boolean = false;
  lastUpdatedBy?: string;
  ended: boolean = false;
  retroStatus?: string;
  retroStarted: boolean = false;
  loadingFlag: boolean = false;
  retroDuration: number = 0;
  needsToShow: boolean = false;
  startedDate: Date | undefined;
  startedTimeStamp: number | undefined;
  endedDate: Date | undefined;
  lastStateUpdate: Date | undefined;
  avatar: string | undefined;
  pulseCheck?: any;
  template?: any;
  feedbackSubmitted?: boolean = false;
  isFeedbackSubmittedByFacilitator?: number = 0;
  disconnected?: boolean = false;
  constructor(retroId: string) {
    this.retroId = retroId;
  }
}

export interface Action {
  id: string;
  actionName: string;
  parameters: any;
  userId: string;
  timestamp: number;
  date?: Date;
  sourceActionTimestamp: number;
  sourceActionId: string;
  onlyVisibleBy?: string[];
  version: number;
}
export interface DyanamicDialog {
  open:boolean;
  header:string;
  content:string;
  cancelLabel:string;
  agreeLabel:string;

}
