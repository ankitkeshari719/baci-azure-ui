import * as React from 'react';
import './styles.scss';

import { Typography,Box } from '@material-ui/core';
import { ActionInterface } from '../../types';

type Props = {
  allActions: ActionInterface[];
};

export default function ActionHeader({ allActions }: Props) {
  return (
    <Box className="actionHeaderContainer">
      <Box className="actionHeader">
        <Box>
          <Typography component="span" className="totalActions">
            {allActions.length} Actions
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
