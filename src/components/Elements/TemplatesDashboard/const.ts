export const CARD_COLOURS = [
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
  '#FFFFFF',
];

export const CARD_HOVER_COLOURS = [
  '#a7e4fc',
  '#695f9b',
  '#fcb34c',
  '#abd261',
  '#f3715b',
];

export const GROUP_FONT_COLOURS = [
  '#0B6623',
  '#F79722',
  '#8A38F5',
  '#abd261',
  '#f3715b',
];

export const GROUP_COLOURS = [
  '#E2EBE5',
  '#fcf2e6',
  '#F5F1FB',
  '#abd261',
  '#f3715b',
];
export const RETRONAME_CHARACTER_LIMIT = 80;

export const AVATAR_CHARACTER_LIMIT = 30;

export const UNGROUPED = 'Ungrouped';

export const templatesDataOne = [
  {
    templateId: 'simple',
    templateName: 'Simple',
    templateDescription: 'A classic template for retros.',
    templateImage: '/images/SimpleDefaultRetroTemplate.png',
    checked: true,
    isComingSoon: false,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColour: CARD_COLOURS[0],
        cardColourHover: CARD_HOVER_COLOURS[0],
        groupColour: GROUP_COLOURS[0],
        groupFontColour: GROUP_FONT_COLOURS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColour: CARD_COLOURS[1],
        cardColourHover: CARD_HOVER_COLOURS[1],
        groupColour: GROUP_COLOURS[1],
        groupFontColour: GROUP_FONT_COLOURS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Manage Actions',
        order: 2,
        cardColour: CARD_COLOURS[2],
        cardColourHover: CARD_HOVER_COLOURS[2],
        groupColour: GROUP_COLOURS[2],
        groupFontColour: GROUP_FONT_COLOURS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },
  {
    templateId: '4l_retrospective',
    templateName: '4L Retrospective',
    templateDescription:
      'For the team to share how they feel in a structured manner and capture key learnings and ideas to progress.',
    templateImage: '/images/coming_soon.png',
    checked: false,
    isComingSoon: true,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColour: CARD_COLOURS[0],
        cardColourHover: CARD_HOVER_COLOURS[0],
        groupColour: GROUP_COLOURS[0],
        groupFontColour: GROUP_FONT_COLOURS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColour: CARD_COLOURS[1],
        cardColourHover: CARD_HOVER_COLOURS[1],
        groupColour: GROUP_COLOURS[1],
        groupFontColour: GROUP_FONT_COLOURS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Manage Actions',
        order: 2,
        cardColour: CARD_COLOURS[2],
        cardColourHover: CARD_HOVER_COLOURS[2],
        groupColour: GROUP_COLOURS[2],
        groupFontColour: GROUP_FONT_COLOURS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },
  {
    templateId: 'sailboat',
    templateName: 'Sailboat',
    templateDescription:
      'A fun way to think differently and reflect on the bigger picture.',
    templateImage: '/images/coming_soon.png',
    checked: false,
    isComingSoon: true,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColour: CARD_COLOURS[0],
        cardColourHover: CARD_HOVER_COLOURS[0],
        groupColour: GROUP_COLOURS[0],
        groupFontColour: GROUP_FONT_COLOURS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColour: CARD_COLOURS[1],
        cardColourHover: CARD_HOVER_COLOURS[1],
        groupColour: GROUP_COLOURS[1],
        groupFontColour: GROUP_FONT_COLOURS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Manage Actions',
        order: 2,
        cardColour: CARD_COLOURS[2],
        cardColourHover: CARD_HOVER_COLOURS[2],
        groupColour: GROUP_COLOURS[2],
        groupFontColour: GROUP_FONT_COLOURS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },
];

export const templatesDataTwo = [
  {
    templateId: 'start_stop_continue',
    templateName: 'Start, Stop , Continue',
    templateDescription:
      'The traffic light retro gives everyone in the team an opportunity to talk and quickly identify bottlenecks.',
    templateImage: '/images/coming_soon.png',
    checked: false,
    isComingSoon: true,
    columns: [
      {
        id: '0',
        name: 'What went well',
        order: 0,
        cardColour: CARD_COLOURS[0],
        cardColourHover: CARD_HOVER_COLOURS[0],
        groupColour: GROUP_COLOURS[0],
        groupFontColour: GROUP_FONT_COLOURS[0],
        groups: [
          {
            id: UNGROUPED + 1,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '1',
        name: `What didn't go well`,
        order: 1,
        cardColour: CARD_COLOURS[1],
        cardColourHover: CARD_HOVER_COLOURS[1],
        groupColour: GROUP_COLOURS[1],
        groupFontColour: GROUP_FONT_COLOURS[1],
        groups: [
          {
            id: UNGROUPED + 2,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
      {
        id: '2',
        name: 'Manage Actions',
        order: 2,
        cardColour: CARD_COLOURS[2],
        cardColourHover: CARD_HOVER_COLOURS[2],
        groupColour: GROUP_COLOURS[2],
        groupFontColour: GROUP_FONT_COLOURS[2],
        groups: [
          {
            id: UNGROUPED + 3,
            name: UNGROUPED,
            order: 1000000,
            cards: [],
            createdBy: 'default',
            locked: false,
            lockedBy: undefined,
          },
        ],
        publish: false,
      },
    ],
  },  
];

export const PORTRAIT_PRIMARY = 'portrait-primary';
export const PORTRAIT_SECONDARY = 'portrait-secondary';
export const LANDSCAPE_PRIMARY = 'landscape-primary';
export const LANDSCAPE_SECONDARY = 'landscape-secondary';
