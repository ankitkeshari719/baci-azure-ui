import * as Icons from 'heroicons-react';

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Icons.ChevronRight
      size={32}
      className={className}
      style={{
        ...style,
        width: '42px',
        height: '42px',
        display: 'block',
        right: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Icons.ChevronLeft
      size={32}
      className={className}
      style={{
        ...style,
        width: '42px',
        height: '42px',
        display: 'block',
        left: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    />
  );
}

export const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  centerPadding: '10px',
  responsive: [
    {
      breakpoint: 1480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        speed: 500,
      },
    },
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
      },
    },
  ],
};
