// import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
  InformationCircleIcon,
  PencilSquareIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { OutlinedInput, Box, styled, Typography, Tooltip } from '@mui/material';
import ButtonWithIconWithNoBorder from '../../components/CustomizedButton/ButtonWithIconWithNoBorder';
import { Actions } from '../../types';
import { MAX_CARD_TEXT_LENGTH } from '../../constants';

const TextFieldNoBorderWrapper = styled(OutlinedInput)({
  '.MuiInputBase-multiline': {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  display: 'flex',
  alignItems: 'center',
  position: 'initial',
  width: '100%',
  fieldset: {
    border: 'none',
  },

  input: {
    padding: 0,
  },
});

const MessageForParticipant = ({
  expandMessageForParticipant,
  setExpandMessageForParticipant,
  messageForParticipant,
  setMessageForParticipant,
  postMessageForParticipant,
  actionsData,
  clearMessageForParticipant,
  userType,
}: {
  expandMessageForParticipant: boolean;
  setExpandMessageForParticipant: (value: boolean) => void;
  messageForParticipant: string;
  setMessageForParticipant: (value: string) => void;
  postMessageForParticipant: (post: boolean) => void;
  actionsData: Actions;
  clearMessageForParticipant: () => void;
  userType: any;
}) => {
  const [enablePostButton, setEnablePostButton] = useState<boolean>(false);
  const [enableClearButton, setEnableClearButton] = useState<boolean>(false);
  const [valueOfWidth, setValueOfWidth] = useState<string>('90%');
  useEffect(() => {
    const actionContainer = document.getElementById('actionMainContainer');
    if (actionContainer != null) {
      const width = actionContainer.offsetWidth - 30;
      setValueOfWidth(width + 'px');
    }
  }, []);

  useEffect(() => {
    if (messageForParticipant == '') {
      setEnablePostButton(false);
    } else {
      if (messageForParticipant == actionsData.messageForParicipants)
        setEnablePostButton(false);
      else setEnablePostButton(true);
    }
  }, [messageForParticipant, actionsData.messageForParicipants]);

  return (
    <Box display="flex" flexDirection="row" width="100%">
      {(userType == 2 || messageForParticipant != '') && (
        <Box
          sx={{
            height:
              userType == 2 && expandMessageForParticipant ? '166px' : '48px',
            width: '100%',
            display: 'flex',
            position: 'relative',
            // marginLeft: '12px',
          }}
        >
          <Box
            height="100%"
            width="100%"
            display="flex"
            position="absolute"
            bgcolor={actionsData.fontColor}
            style={{ opacity: '0.08' }}
          ></Box>
          <Box
            zIndex="1"
            padding="8px"
            display="flex"
            width="100%"
            flexDirection="column"
          >
            {userType == 2 ? (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                width="100%"
                color="#343434"
                fontFamily="Poppins"
                fontSize="14px"
                fontWeight="500"
                alignItems="center"
                height="48px"
              >
                <Box component="span">
                  <Box component="span" marginRight="12px">
                    {' '}
                    Message for participants
                  </Box>
                  <Box component="span">
                    <InformationCircleIcon
                      height="20px"
                      width="20px"
                      color="#4E4E4E"
                      fontWeight="500"
                    />
                  </Box>
                </Box>
                <Box component="span">
                  <Box component="span" fontSize="12px" marginRight="12px">
                    {' '}
                    {actionsData.messageForParicipants != ''
                      ? actionsData.messageForParicipants ==
                        messageForParticipant
                        ? 'Message posted'
                        : 'Updated message not posted'
                      : 'No message posted'}
                  </Box>
                  <Box
                    sx={{ cursor: 'pointer' }}
                    component="span"
                    onClick={() => setExpandMessageForParticipant(true)}
                  >
                    <PencilSquareIcon
                      height="20px"
                      width="20px"
                      color="#4E4E4E"
                      fontWeight="500"
                    />
                  </Box>{' '}
                </Box>
              </Box>
            ) : (
              <>
                {messageForParticipant != '' && (
                  <Box
                    display="flex"
                    flexDirection="row"
                    width="100%"
                    color="#EE7538"
                    fontFamily="Poppins"
                    fontSize="16px"
                    fontWeight="400"
                    alignItems="center"
                    height="48px"
                  >
                    <LightBulbIcon
                      height="24px"
                      width="24px"
                      color={actionsData.fontColor}
                      fontWeight="500"
                    />{' '}
                    <Tooltip title={messageForParticipant}>
                      <Typography
                        whiteSpace="nowrap"
                        marginLeft="8px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        color={actionsData.fontColor}
                        width={valueOfWidth}
                      >
                        {messageForParticipant}
                      </Typography>
                    </Tooltip>
                  </Box>
                )}
              </>
            )}

            {userType == 2 && expandMessageForParticipant && (
              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                height="100%"
              >
                <TextFieldNoBorderWrapper
                  style={{
                    backgroundColor: 'white',
                    padding: '12px',
                    borderColor: 'red',
                  }}
                  onChange={e =>
                    setMessageForParticipant(e.currentTarget.value)
                  }
                  value={messageForParticipant}
                  inputProps={{
                    maxLength: MAX_CARD_TEXT_LENGTH,
                    sx: {
                      '&::placeholder': {
                        fontFamily: 'Poppins',
                        fontStyle: 'italic',
                        color: '#808080',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '22px',
                        letterSpacing: '0.2px',
                      },
                    },
                  }}
                  id="outlined-adornment-weight"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder="Type here"
                  multiline
                  rows={2}
                />
                {/* <Box
              style={{
                fontSize: '0.75rem',
                textAlign: 'right',
                whiteSpace: 'nowrap',
                color: '#808080',
              }}
            >
              Characters remaining:{' '}
              {MAX_CARD_TEXT_LENGTH - messageForParticipant.length}
            </Box> */}
                <Box
                  display="flex"
                  flexDirection="row"
                  marginTop="10px"
                  width="100%"
                  justifyContent="space-between"
                >
                  <Box>
                    <ButtonWithIconWithNoBorder
                      disabled={!enablePostButton}
                      //   aria-controls={open ? 'basic-menu' : undefined}
                      id="post-button"
                      label="POST"
                      iconPath={
                        !enablePostButton
                          ? '/svgs/PostDisable.svg'
                          : '/svgs/Post.svg'
                      }
                      style={{
                        marginRight: '20px',
                      }}
                      onClick={res => {
                        postMessageForParticipant(true);
                      }}
                    />

                    <ButtonWithIconWithNoBorder
                      disabled={false}
                      //   aria-controls={open ? 'basic-menu' : undefined}
                      id="clear-button"
                      label="CLEAR"
                      iconPath="/svgs/Clear.svg"
                      onClick={clearMessageForParticipant}
                    />
                  </Box>
                  <ButtonWithIconWithNoBorder
                    disabled={false}
                    //   aria-controls={open ? 'basic-menu' : undefined}
                    id="close-button"
                    label="CLOSE"
                    iconPath="/svgs/Close.svg"
                    error={true}
                    onClick={res => {
                      setExpandMessageForParticipant(
                        !expandMessageForParticipant
                      );
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MessageForParticipant;
