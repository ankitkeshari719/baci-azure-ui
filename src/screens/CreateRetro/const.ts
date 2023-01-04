export interface pulseCheckInterface {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const RETRONAME_CHARACTER_LIMIT = 80;

export const AVATAR_CHARACTER_LIMIT = 30;

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

export const pulseCheckData: pulseCheckInterface[] = [
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
