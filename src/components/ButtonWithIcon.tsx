import React from 'react';
import { Button, Typography } from '@mui/material';
import './styles.scss';
import { Box } from '@mui/system';

export const ButtonWithIcon = ({ label, iconPath,color,onClick,id,disabled }: { label: string, iconPath?: string,color?:string,onClick?:(...param: any) => void,id?:string,disabled:boolean }) => {
    return (
        <Button variant="outlined" className='buttonWithIcon' onClick={onClick} disabled={disabled}>
            {iconPath && <img src={iconPath} />}

            <Box component="span" >{label}</Box>
        </Button>
    );
};

// export default ButtonWithIcon;