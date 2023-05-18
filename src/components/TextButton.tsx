import { Button } from '@mui/material';
import React from 'react';

export const TextButton = ({ label,
    onClick,
    style,
    disabled,
    id }:
    {
        label: string;
        onClick: (...param: any) => void;
        style?: any;
        disabled?: boolean;
        id?: string;
    }

) => {
    return (
        <Button variant="text">
            {label}
        </Button>
    );
};

// export default TextButton;