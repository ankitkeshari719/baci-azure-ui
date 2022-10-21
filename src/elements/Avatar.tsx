import React from 'react';

const Avatar = (props:any) => {
    let avatar;
    if(!window.location.pathname.includes('join')){
         avatar ="/avatars/"+props.avatar+".svg";
    } else if(window.location.pathname.includes('join')){
         avatar ="/avatars/animals/"+props.avatar+".svg";
    }
    
    return (
       
           <img style={props.css} src={avatar}></img> 
         
       
    );
};

export default Avatar;