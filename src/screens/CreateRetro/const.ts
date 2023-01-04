import {
  CARD_COLOURS,
  CARD_HOVER_COLOURS,
  GROUP_COLOURS,
  GROUP_FONT_COLOURS,
} from '../../constants';

export interface pulseCheckInterface {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const RETRONAME_CHARACTER_LIMIT = 80;

export const AVATAR_CHARACTER_LIMIT = 30;

export const UNGROUPED = 'Ungrouped';

export const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export const templatesData = [
  {
    templateId: 'simple',
    templateName: 'Simple',
    templateDescription: 'A classic template for retros.',
    templateImage:
      'https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0=',
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
        name: 'Develop Actions',
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
    templateImage:
      'https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0=',
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
        name: 'Develop Actions',
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
    templateImage:
      'https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0=',
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
        name: 'Develop Actions',
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
    templateId: 'start_stop_continue',
    templateName: 'Start, Stop , Continue',
    templateDescription:
      'The traffic light retro gives everyone in the team an opportunity to talk and quickly identify bottlenecks.',
    templateImage:
      'https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0=',
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
        name: 'Develop Actions',
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

export const pulseChecksData: pulseCheckInterface[] = [
  {
    id: 1,
    name: 'Pulse Check Not Required',
    description:
      'An oldie but a goodie, also known as the PPT Framework created in the 60s, it has long been the benchmark to understanding workforce management.',
    image:
      'https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0=',
  },
  {
    id: 2,
    name: 'Simple (3 Questions)',
    description:
      'An oldie but a goodie, also known as the PPT Framework created in the 60s, it has long been the benchmark to understanding workforce management.',
    image:
      'https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0=',
  },
  {
    id: 3,
    name: 'Business Agility  (7 Questions)',
    description:
      'An oldie but a goodie, also known as the PPT Framework created in the 60s, it has long been the benchmark to understanding workforce management.',
    image:
      'https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0=',
  },
];
