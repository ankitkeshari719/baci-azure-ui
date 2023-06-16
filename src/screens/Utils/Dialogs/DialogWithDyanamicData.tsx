import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import React from 'react';
import { ContainedButton, OutlinedButton } from '../../../components';
import './styles.scss';
import closeImage from '../../../assets/img/Vectorclose.png';
const DialogWithDyanamicData = ({
  open,
  header,
  subtext,
  agreeLabel,
  cancelLabel,
  handleClose,
  acceptClose,
}: {
  open: boolean;
  header: string;
  subtext: string;
  agreeLabel: string;
  cancelLabel: string;
  handleClose: () => void;
  acceptClose: () => void;
}) => {
  return (
    <Box className="DialogWithDynamicDataContainer">
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <img
          src={closeImage}
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            cursor: 'pointer',
          }}
        ></img>

        <Box className="dialogContainer">
          <DialogTitle
            id="alert-dialog-title"
            color="#EE7538"
            fontSize="24px!important"
            fontFamily="Poppins!important"
          >
            {header}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              fontSize={'20px!important'}
              fontWeight="400"
              color="#343434"
              fontFamily="Poppins!important"
              textAlign="center"
            >
              {subtext}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {agreeLabel.split(' ')[0] == 'REMOVE' ? (
              <ContainedButton
                onClick={acceptClose}
                style={{
                  padding: '12px',
                  height: '44px',
                  width: '217px',
                  backgroundColor: '#EA4335!important',
                  borderColor: '#EA4335!important',
                  boxShadow: 'none!important',
                }}
                name={agreeLabel}
                id={agreeLabel}
                size={'medium'}
              />
            ) : (
              <ContainedButton
                onClick={acceptClose}
                style={{
                  padding: '12px',
                  height: '44px',
                  width: '217px',
                  boxShadow: 'none!important',
                }}
                name={agreeLabel}
                id={agreeLabel}
                size={'medium'}
              />
            )}
            {/* autoFocus */}
            <Box component="span" width="10px" />
            <OutlinedButton
              id={cancelLabel}
              size={'medium'}
              onClick={handleClose}
              style={{
                padding: '12px',
                height: '44px',
                width: '217px',
                boxShadow: 'none!important',
              }}
              label={cancelLabel}
            />
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default DialogWithDyanamicData;
