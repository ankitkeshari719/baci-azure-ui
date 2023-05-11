import * as React from 'react';
import './styles.scss';

import { Typography, Box } from '@material-ui/core';
import { ActionInterface } from '../../types';
import { ActionType } from '../../contexts/GlobalContext';
import * as Icons from 'heroicons-react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { MAX_CARD_TEXT_LENGTH } from '../../constants';
import { NONE, VOTES_ASC, VOTES_DSC, VALUE_ASC, VALUE_DSC } from './const';

type Props = {
  allActions: ActionInterface[];
  global: any;
  dispatch: any;
  searchQuery: string;
  sortedBy: string;
  handleSearchQueryOnChange: (value: string) => void;
  handleSortedByChange: (event: SelectChangeEvent) => void;
};

export default function ActionHeader({
  allActions,
  global,
  dispatch,
  searchQuery,
  sortedBy,
  handleSortedByChange,
  handleSearchQueryOnChange,
}: Props) {
  const [isSearchEnable, setIsSearchEnable] = React.useState<boolean>(false);

  const showSearchField = () => {
    setIsSearchEnable(!isSearchEnable);
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
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
                        color="#CCCCCC"
                        style={{
                          cursor: 'pointer',
                        }}
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
                        onClick={showSearchField}
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
          {!isSearchEnable && (
            <Box className="searchBoxContainer">
              <Icons.Search
                size={24}
                color="#676767"
                style={{
                  cursor: 'pointer',
                }}
                onClick={showSearchField}
              />
            </Box>
          )}
          {/* Sort Box */}
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography className="sortByText">Sort By: </Typography>
            <FormControl sx={{ m: 1, minWidth: 80 }}>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={sortedBy}
                onChange={handleSortedByChange}
                autoWidth
                label="Age"
                sx={{
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  background: 'rgba(0, 0, 0, 0)',
                  border: 'none',
                  boxShadow: 'none',
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 0,
                    ':hover': { border: 0 },
                  },

                  '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                    {
                      border: 0,
                    },
                  '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                    {
                      border: 0,
                    },
                  '.MuiOutlinedInput-input': {
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    color: '#343434',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '22px',
                    letterSpacing: '0.2px',
                  },
                  borderRadius: '8px',
                  color: '#343434',
                  input: {
                    padding: 0,
                  },
                  div: { padding: 0, position: 'initial', height: '100%' },
                  position: 'initial',
                }}
              >
                <MenuItem value={NONE}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={VOTES_ASC}>VOTES_ASC</MenuItem>
                <MenuItem value={VOTES_DSC}>VOTES_DSC</MenuItem>
                <MenuItem value={VALUE_ASC}>VALUE_ASC</MenuItem>
                <MenuItem value={VALUE_DSC}>VALUE_DSC</MenuItem>
              </Select>
            </FormControl>
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
