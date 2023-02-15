import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import * as React from 'react';
import '../../global.scss';
import './styles.scss';
import commonStyles from '../../style.module.scss';

import { Row, Col, Button } from 'react-bootstrap';
import { ContainedButton, OutlinedButton } from '../../components';

type Props = {
  handleIsChangeDialogClose: () => void;
  closeCustomTemplateDialog: () => void;
  onClickSelectButton: (selectedId: string) => void;
  templateId: string;
};

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      <Row>
        <Col xs="6" className="d-flex justify-content-start align-items-center">
          {children}
        </Col>
        <Col
          xs={{ span: 1, offset: 5 }}
          className="d-flex justify-content-end align-items-center"
        >
          {onClose ? (
            <img
              width="45px"
              height="45px"
              onClick={onClose}
              src="/svgs/CloseDialog.svg"
              style={{ cursor: 'pointer' }}
            />
          ) : null}
        </Col>
      </Row>
    </DialogTitle>
  );
}

export function CustomizeTemplateDialog({
  handleIsChangeDialogClose,
  closeCustomTemplateDialog,
  onClickSelectButton,
  templateId,
}: Props) {
  return (
    <Box
      sx={{
        width: '800px',
        height: '418px',
        maxWidth: '800px',
        minHeight: '418px',
        background: '#FFFFFF',
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
        borderRadius: '20px',
      }}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleIsChangeDialogClose}
      ></BootstrapDialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography className="unsavedChangesTextOne">
          Unsaved Changes
        </Typography>
        <Typography className="unsavedChangesTextTwo" mt="40px">
          You have unsaved changes to your retro board
        </Typography>
        <Typography className="unsavedChangesTextTwo" mt="8px">
          Are you sure you want to loose these changes?
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}
      >
        <OutlinedButton
          name="Exit without saving"
          onClick={closeCustomTemplateDialog}
          style={{
            minWidth: '240px !important',
            height: '36px !important',
            textTransform: 'uppercase !important',
            marginTop: '0px !important',
          }}
        />
        <ContainedButton
          name="Save and Exit"
          onClick={() => onClickSelectButton(templateId)}
          style={{
            minWidth: '240px !important',
            height: '36px !important',
            textTransform: 'uppercase !important',
            marginLeft: '32px !important'
          }}
        />
      </DialogActions>
    </Box>
  );
}
