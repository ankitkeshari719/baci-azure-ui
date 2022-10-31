import { AlertColor } from '@mui/material';

export class Retro {
  id: string = '';
  humanId: string = '';
  name: string = '';
  joinUrl: string = '';
  creatorId?: string = '';
}
export interface PulseCheckSubmitStatus {
  retroId: string;
  pulseSubmitState: boolean;
}
export class User {
  id: string = '';
  name: string = '';
  nickname?: string = '';
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
  creatorId: string = '';
  users: {
    userId: string;
    userNickname: string;

    feedback: FeedbackEntry[];
    pulseCheckQuestions: PulseCheckEntry[];
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

  needsToShow: boolean = false;

  startedDate: Date | undefined;
  endedDate: Date | undefined;
  lastStateUpdate: Date | undefined;

  constructor(retroId: string, columns: Column[]) {
    this.retroId = retroId;
    this.columns = columns;
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
