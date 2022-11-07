import React from 'react';

const Avatar = (props: any) => {
  let avatar_src: any;

  if (
    window.location.pathname.includes('join') ||
    window.location.pathname.includes('startRetro')
  ) {
    avatar_src = '/avatars/animals/' + props.avatar + '.svg';
  } else if (!window.location.pathname.includes('join')) {
    avatar_src = '/avatars/' + props.avatar + '.svg';
  }

  return (
    <img
      style={props.css}
      className={`${
        window.location.pathname.includes('join') &&
        props.avatar == props.selectedAvatar
          ? 'selectedAvatar'
          : 'avatar'
      }`}
      src={avatar_src}
      onClick={() => {
        console.log(props.avatar, 'avatar');
        props.onClickAvatar(props.avatar);
      }}
    ></img>
  );
};

export default Avatar;
