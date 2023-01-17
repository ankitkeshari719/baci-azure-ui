import * as Icons from 'heroicons-react';

function SampleNextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <Icons.ChevronRight
        size={32}
        className={className}
        style={{
          ...style,
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
    className: 'center',
    centerMode: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };