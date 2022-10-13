import React from 'react';

const Avatar = (props:any) => {
    const avatar ="/avatars/"+props.avatar+".svg";
    return (
       
           <img style={{width:'40px',height:"40px"}} src={avatar}></img> 
         
       
    );
};

export default Avatar;