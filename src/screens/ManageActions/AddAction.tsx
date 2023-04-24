import * as React from 'react';
import './styles.scss';
import * as Icons from 'heroicons-react';

import { Box, InputAdornment, TextField } from '@mui/material';

type Props = {
  addAction: (value: string) => void;
};

export default function AddAction({ addAction }: Props) {
  const [actionValue, setActionValue] = React.useState<string>('');

  const handleOnChange = (value: string) => {
    setActionValue(value);
  };

  return (
    <Box className="AddActionContainer">
      <TextField
        id="outlined-textarea"
        placeholder="Type new action here"
        multiline
        fullWidth
        value={actionValue}
        onChange={e => handleOnChange(e.currentTarget.value)}
        inputProps={{
          style: {
            fontFamily: 'Poppins',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '20px',
            letterSpacing: '0.4px',
            color: ' #CCCCCC',
          },
          maxLength: 200,
        }}
        InputLabelProps={{ style: { fontSize: 0 } }} // font size of input label
        sx={{
          fontWeight: 300,
          width: '96%',
        }}
      />
      <Icons.PaperAirplaneOutline
        size={20}
        color="#CCCCCC"
        style={{ cursor: 'pointer' }}
        onClick={() => addAction(actionValue)}
      ></Icons.PaperAirplaneOutline>
    </Box>
  );
}
