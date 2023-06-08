import * as React from 'react';
import './styles.scss';

import { Typography, Box } from '@material-ui/core';
import { ActionInterface, Actions } from '../../types';
import { ActionType } from '../../contexts/GlobalContext';
import * as Icons from 'heroicons-react';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { MAX_CARD_TEXT_LENGTH } from '../../constants';
import { NONE, VOTES_ASC, VOTES_DSC, VALUE_ASC, VALUE_DSC } from './const';
import theme from '../../theme/theme';
import { BoardContext } from '../../contexts/BoardContext';

type Props = {
  allActions: ActionInterface[];
  global: any;
  dispatch: any;
  searchQuery: string;
  sortedBy: string;
  actionsData: Actions;
  handleSearchQueryOnChange: (value: string) => void;
  handleSortedByChange: (event: SelectChangeEvent) => void;
  enableVotingToParticipant: (value: boolean) => void;
  enableAddActionToParticipant: (value: boolean) => void;
  ended: boolean;
};

export default function ActionHeader({
  allActions,
  global,
  dispatch,
  searchQuery,
  sortedBy,
  actionsData,
  handleSortedByChange,
  handleSearchQueryOnChange,
  enableVotingToParticipant,
  enableAddActionToParticipant,
  ended,
}: Props) {
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [isSearchEnable, setIsSearchEnable] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [enableVoting, setEnableVoting] = React.useState<boolean | undefined>(
    actionsData.isVotingEnableToParticipant
  );
  const [enableActionToParticipant, setEnableActionToParticipant] =
    React.useState<boolean | undefined>(
      actionsData.isAddActionEnableToParticipant
    );

  React.useEffect(() => {
    setEnableVoting(actionsData.isVotingEnableToParticipant);
    setEnableActionToParticipant(actionsData.isAddActionEnableToParticipant);
  }, [actionsData]);
  // Function to show the search bar
  const showSearchField = () => {
    setIsSearchEnable(true);
  };

  // Function to close the search bar
  const cancelSearchField = () => {
    setIsSearchEnable(false);
    handleSearchQueryOnChange('');
  };

  // Function to show the Enable Menu bar
  const openEnableMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the Enable Menu bar
  const closeEnableMenu = () => {
    setAnchorEl(null);
  };

  // Function to Enable/Disable the Voting
  const handleEnableVoting = (event: React.ChangeEvent<HTMLInputElement>) => {
    enableVotingToParticipant(event.target.checked);
    setEnableVoting(event.target.checked);
  };

  // Function to Enable/Disable the Participants Can Add Actions Functionality
  const handleEnableActionToParticipant = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    enableAddActionToParticipant(event.target.checked);
    setEnableActionToParticipant(event.target.checked);
  };

  return (
    <>
      {global.expandColumn === -1 ? (
        <Box
          className="actionHeaderContainer"
          style={{
            backgroundColor: isXsUp ? '#ffffff' : actionsData.backgroundColor,
          }}
        >
          <Box className="actionHeader">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box
                className="d-flex justify-content-start align-items-center p-0 m-0"
                style={{
                  width: '100%',
                  maxHeight: '48px',
                  minWidth: isXsUp ? '100px' : '180px',
                  maxWidth: isXsUp
                    ? '176px'
                    : global.expandColumn === -1
                    ? '220px'
                    : '50%',
                }}
              >
                {isSearchEnable ? (
                  <TextField
                    fullWidth
                    multiline
                    autoFocus
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e =>
                      handleSearchQueryOnChange(e.currentTarget.value)
                    }
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
                        <InputAdornment
                          position="start"
                          style={{ margin: '0px' }}
                        >
                          <IconButton
                            sx={{
                              ':hover': {
                                background: '#ffffff',
                                cursor: 'unset',
                              },
                            }}
                          >
                            <Icons.Search size={20} color="#CCCCCC" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={cancelSearchField}>
                            <Icons.X
                              size={20}
                              color="#676767"
                              style={{
                                cursor: 'pointer',
                              }}
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
              {/* Search Icon */}
              <Box className="d-flex justify-content-end align-items-center p-0 m-0">
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
              </Box>
            </Box>
            <Box
              className="d-flex justify-content-end align-items-center p-0 m-0"
              style={{ flexDirection: 'row', width: '100%' }}
            >
              {/* Sort Box */}
              <Box
                style={{
                  maxHeight: '48px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  className="sortByText"
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    color: '#343434',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '22px',
                    letterSpacing: '0.2px',
                  }}
                >
                  Sort By:{' '}
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minWidth: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    margin: '0px 0px 0px 8px',
                  }}
                >
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
                    <MenuItem value={VOTES_DSC}>VOTES: High to Low</MenuItem>
                    <MenuItem value={VOTES_ASC}>VOTES: Low to High</MenuItem>
                    <MenuItem value={VALUE_ASC}>Assignee: A - Z</MenuItem>
                    <MenuItem value={VALUE_DSC}>Assignee: Z - A</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {/* Ellipsis vertical */}
              {global.user.userType === 2 && (
                <Box
                  sx={{
                    width: '24px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={openEnableMenu}
                    sx={{
                      width: '40px',
                      height: '32px',
                      minWidth: '40px',
                      border: 'none',
                      borderRadius: '0px',
                      ':hover': {
                        background: '#CCCCCC',
                        cursor: 'unset',
                        borderRadius: '0px',
                      },
                    }}
                  >
                    <Icons.DotsVertical
                      size={24}
                      color="#676767"
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={closeEnableMenu}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        border: '1px solid #cccccc',
                        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
                        borderRadius: '10px',
                        background: '#ffffff',
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <Icons.StarOutline
                          size={24}
                          color="#676767"
                          style={{
                            cursor: 'unset',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>Enable Voting</ListItemText>
                      <Switch
                        checked={enableVoting}
                        onChange={handleEnableVoting}
                        inputProps={{ 'aria-label': 'controlled' }}
                        disabled={ended}
                      />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <Icons.UserGroup
                          size={24}
                          color="#676767"
                          style={{
                            cursor: 'unset',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>Participants Can Add Actions</ListItemText>
                      <Switch
                        checked={enableActionToParticipant}
                        onChange={handleEnableActionToParticipant}
                        inputProps={{ 'aria-label': 'controlled' }}
                        disabled={ended}
                      />
                    </MenuItem>
                  </Menu>
                </Box>
              )}
              {/* Expand Icon */}
              {!isXsUp && (
                <Box>
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
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          className="actionHeaderContainer"
          style={{
            backgroundColor: isXsUp ? '#ffffff' : actionsData.backgroundColor,
          }}
        >
          <Box className="actionHeader">
            <Box
              style={{ display: 'flex', flexDirection: 'row', width: '50%' }}
            >
              <Box
                className="d-flex justify-content-start align-items-center p-0 m-0"
                style={{
                  width: '100%',
                  maxHeight: '48px',
                  minWidth: isXsUp ? '100px' : '180px',
                  maxWidth: isXsUp
                    ? '176px'
                    : global.expandColumn === -1
                    ? '220px'
                    : '50%',
                }}
              >
                {isSearchEnable ? (
                  <TextField
                    fullWidth
                    multiline
                    autoFocus
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e =>
                      handleSearchQueryOnChange(e.currentTarget.value)
                    }
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
                        <InputAdornment
                          position="start"
                          style={{ margin: '0px' }}
                        >
                          <IconButton
                            sx={{
                              ':hover': {
                                background: '#ffffff',
                                cursor: 'unset',
                              },
                            }}
                          >
                            <Icons.Search size={20} color="#CCCCCC" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={cancelSearchField}>
                            <Icons.X
                              size={20}
                              color="#676767"
                              style={{
                                cursor: 'pointer',
                              }}
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
            </Box>
            <Box
              className="d-flex justify-content-end align-items-center p-0 m-0"
              style={{ flexDirection: 'row', width: '50%' }}
            >
              {/* Search Icon */}
              <Box className="d-flex justify-content-end align-items-center p-0 m-0">
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
              </Box>
              {/* Sort Box */}
              <Box
                style={{
                  maxHeight: '48px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Typography
                  className="sortByText"
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    color: '#343434',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '22px',
                    letterSpacing: '0.2px',
                  }}
                >
                  Sort By:{' '}
                </Typography>
                <FormControl
                  sx={{
                    m: 1,
                    minWidth: 80,
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    margin: '0px 0px 0px 8px',
                  }}
                >
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
                    <MenuItem value={VOTES_DSC}>VOTES: High to Low</MenuItem>
                    <MenuItem value={VOTES_ASC}>VOTES: Low to High</MenuItem>
                    <MenuItem value={VALUE_ASC}>Assignee: A - Z</MenuItem>
                    <MenuItem value={VALUE_DSC}>Assignee: Z - A</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {/* Ellipsis vertical */}
              {global.user.userType === 2 && (
                <Box
                  sx={{
                    width: '24px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={openEnableMenu}
                    sx={{
                      width: '40px',
                      height: '32px',
                      minWidth: '40px',
                      border: 'none',
                      borderRadius: '0px',
                      ':hover': {
                        background: '#CCCCCC',
                        cursor: 'unset',
                        borderRadius: '0px',
                      },
                    }}
                  >
                    <Icons.DotsVertical
                      size={24}
                      color="#676767"
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={closeEnableMenu}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        border: '1px solid #cccccc',
                        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
                        borderRadius: '10px',
                        background: '#ffffff',
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem>
                      <ListItemIcon>
                        <Icons.StarOutline
                          size={24}
                          color="#676767"
                          style={{
                            cursor: 'unset',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>Enable Voting</ListItemText>
                      <Switch
                        checked={enableVoting}
                        onChange={handleEnableVoting}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon>
                        <Icons.UserGroup
                          size={24}
                          color="#676767"
                          style={{
                            cursor: 'unset',
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>Participants Can Add Actions</ListItemText>
                      <Switch
                        checked={enableActionToParticipant}
                        onChange={handleEnableActionToParticipant}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </MenuItem>
                  </Menu>
                </Box>
              )}
              {/* Expand Icon */}
              {!isXsUp && (
                <Box>
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
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
