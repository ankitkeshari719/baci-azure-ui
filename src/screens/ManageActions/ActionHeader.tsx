import * as React from 'react';
import './styles.scss';

import { Typography, Box } from '@material-ui/core';
import { ActionInterface } from '../../types';
import { ActionType } from '../../contexts/GlobalContext';
import * as Icons from 'heroicons-react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { MAX_CARD_TEXT_LENGTH } from '../../constants';

type Props = {
  allActions: ActionInterface[];
  global: any;
  dispatch: any;
  handleSearchQueryOnChange: (value: string) => void;
  searchQuery: string;
};

export default function ActionHeader({
  allActions,
  global,
  dispatch,
  searchQuery,
  handleSearchQueryOnChange,
}: Props) {
  const [isSearchEnable, setIsSearchEnable] = React.useState<boolean>(false);

  const test = () => {
    setIsSearchEnable(true);
  };

  return (
    <Box className="actionHeaderContainer">
      <Box className="actionHeader">
        <Box className="d-flex justify-content-start align-items-center p-0">
          {isSearchEnable ? (
            <TextField
              fullWidth
              multiline
              autoFocus
              placeholder="Search..."
              value={searchQuery}
              onChange={e => handleSearchQueryOnChange(e.currentTarget.value)}
              inputProps={{
                maxLength: MAX_CARD_TEXT_LENGTH,
                style: {
                  padding: 0,
                },
                sx: {
                  '&::placeholder': {
                    fontFamily: 'Poppins',
                    fontStyle: 'italic',
                    color: '#CCCCCC',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '20px',
                    letterSpacing: '0.4px',
                  },
                },
              }}
              sx={{
                height: '40px',
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                padding: '12px',
                background: '#FFFFFF',
                border: '1px solid #159ADD',
                borderRadius: '8px',
                input: {
                  padding: 0,
                },
                div: { padding: 0, position: 'initial', height: '100%' },
                position: 'initial',
                textarea: {
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  color: '#343434',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22px',
                  letterSpacing: '0.2px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <Icons.Search
                        size={20}
                        color="#676767"
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={test}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Icons.X
                        size={20}
                        color="#676767"
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={test}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <Typography component="span" className="totalActions">
              {allActions.length} Actions
            </Typography>
          )}
        </Box>
        <Box
          className="d-flex justify-content-center align-items-center"
          style={{ flexDirection: 'row' }}
        >
          {/* Search Icon */}
          <Box className="searchBoxContainer">
            <Icons.Search
              size={24}
              color="#676767"
              style={{
                cursor: 'pointer',
              }}
              onClick={test}
            />
          </Box>
          {/* Expand Icon */}
          {global.expandColumn === -1 ? (
            <img
              onClick={() => {
                dispatch({
                  type: ActionType.EXPAND_COLUMN,
                  payload: { expandColumn: 2 },
                });
              }}
              src="/svgs/Expand.svg"
              style={{
                width: '20px',
                marginLeft: '15px',
                cursor: 'pointer',
              }}
            />
          ) : (
            <img
              onClick={() => {
                dispatch({
                  type: ActionType.EXPAND_COLUMN,
                  payload: { expandColumn: -1 },
                });
              }}
              src="/svgs/Shrink.svg"
              style={{
                width: '20px',
                marginLeft: '15px',
                cursor: 'pointer',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
