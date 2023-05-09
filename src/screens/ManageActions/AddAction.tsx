import * as React from 'react';
import './styles.scss';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { Box, styled } from '@mui/system';
import EmojiPicker from 'emoji-picker-react';
import { MAX_CARD_TEXT_LENGTH, UNGROUPED } from '../../constants';
import SendIcon from '@mui/icons-material/Send';

const TextFieldNoBorderWrapper = styled('div')({
  '.MuiInputBase-multiline': {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  display: 'flex',
  alignItems: 'center',
  position: 'initial',
  maxWidth: '135px',
  fieldset: {
    border: 'none',
  },
  input: {
    padding: 0,
  },
});

type Props = {
  addAction: (value: string) => void;
  addedActionValue: string;
  setAddActionValue: (value: string) => void;
  isTextFieldFocused: boolean;
  setIsTextFieldFocused: (value: boolean) => void;
};

export default function AddAction({
  addAction,
  addedActionValue,
  setAddActionValue,
  isTextFieldFocused,
  setIsTextFieldFocused,
}: Props) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] =
    React.useState<boolean>(false);

  // Function to set the textfield focus
  const focusTextBox = () => {
    const inputText = document.getElementById('actionTextField');
    if (inputText != null) {
      inputText.focus();
    }
  };

  // Function to toggle the Emoji Picker
  const handleToOpenEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  const getTheTopCoordinates = (): string => {
    const actionComponent = document.getElementById('actionIndex');
    var width = 0;
    if (actionComponent != undefined && actionComponent != null) {
      width =
        actionComponent.getBoundingClientRect().height +
        actionComponent.getBoundingClientRect().y;
    }

    return width != 0 ? width + 'px' : '270px';
  };

  return (
    <Box className="AddActionContainer">
      {/* Text Field to add action */}
      <Box
        id="actionIndex"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          background: 'white',
          borderBottom: '1px solid #E3E3E3',
          padding: '4px 0px',
          boxSizing: 'border-box',
          gap: '8px',
          ...(false ? { position: 'fixed', height: '8rem' } : {}),
        }}
      >
        {/* Emoji Picker Icon */}
        {isTextFieldFocused ? (
          <Box className="emojiPickerIconContainer">
            <img
              src="/images/Emoji.png"
              style={{
                height: '24px',
                width: '24px',
                cursor: 'pointer',
              }}
              onClick={() => {
                focusTextBox();
                handleToOpenEmojiPicker();
              }}
            />
          </Box>
        ) : (
          <Box className="emojiPickerIconContainer"></Box>
        )}
        <TextFieldNoBorderWrapper
          sx={{
            color: '#343434',
            flexGrow: 10,
            maxWidth: 'unset',
            flexDirection: 'column',
          }}
        >
          {/* Text Field */}
          <TextField
            id="actionTextField"
            fullWidth
            multiline
            placeholder="Type new action here"
            value={addedActionValue}
            onChange={e => setAddActionValue(e.currentTarget.value)}
            onFocus={() => setIsTextFieldFocused(true)}
            onBlur={() => setIsTextFieldFocused(true)}
            onKeyDown={e => {
              const tempValue = addedActionValue;
              const removedEnter = tempValue.replace(/[\r\n]/gm, '');
              setAddActionValue(removedEnter);
              const removedSpaces = removedEnter.replace(/ /g, '');
              if (
                e.keyCode === 13 &&
                removedSpaces &&
                removedSpaces.length !== 0
              ) {
                addAction(addedActionValue);
                (e.target as HTMLInputElement).blur();
              }
            }}
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
              padding: 0,
              input: { padding: 0 },
              div: { padding: 0, position: 'initial' },
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
          />
          {/* Limitation */}
          {addedActionValue &&
          addedActionValue.length >= MAX_CARD_TEXT_LENGTH - 20 ? (
            <Typography
              style={{
                fontSize: '0.75rem',
                textAlign: 'right',
                whiteSpace: 'nowrap',
              }}
            >
              Characters remaining:{' '}
              {MAX_CARD_TEXT_LENGTH - addedActionValue.length}
            </Typography>
          ) : null}
        </TextFieldNoBorderWrapper>
        {/* Send Icon */}
        <Box className="sendIconContainer">
          <Button
            sx={{
              minWidth: '40px',
              ':hover': { background: '#F0F0F0' },
            }}
            disabled={
              addedActionValue.length === 0 ||
              !addedActionValue ||
              addedActionValue.replace(/[\r\n]/gm, '').replace(/ /g, '')
                .length === 0
            }
            onClick={() => addAction(addedActionValue)}
          >
            <SendIcon
              style={{
                color:
                  addedActionValue.length === 0 ||
                  !addedActionValue ||
                  addedActionValue.replace(/[\r\n]/gm, '').replace(/ /g, '')
                    .length === 0
                    ? '#CCCCCC'
                    : '#4E4E4E',
              }}
            ></SendIcon>
          </Button>
        </Box>
      </Box>
      {/* Emoji Picker */}
      <Grid
        style={{
          width:
            document.getElementById('actionIndex') != null
              ? document.getElementById('actionIndex')?.getBoundingClientRect()
                  .width + 'px'
              : '33px',
          zIndex: 3,
          position: 'absolute',
          top: getTheTopCoordinates(),
        }}
      >
        {isEmojiPickerOpen && (
          <EmojiPicker
            onEmojiClick={(event, emojiObject) => {
              setAddActionValue(addedActionValue + emojiObject.emoji);
              setIsTextFieldFocused(true);
              focusTextBox();
              handleToOpenEmojiPicker();
            }}
            pickerStyle={{ width: '100%' }}
          />
        )}
      </Grid>
    </Box>
  );
}
