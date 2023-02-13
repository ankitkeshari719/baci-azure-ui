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
import { ContainedButton } from '../../components';

type Props = {
  handleIsChangeDialogClose: () => void;
  closeCustomTemplateDialog: () => void;
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

export function CustomizeTemplateDialog({ handleIsChangeDialogClose,closeCustomTemplateDialog }: Props) {
  return (
    <Box
      sx={{
        width: '800px',
        maxWidth: '800px',
        height: '265px',
        maxHeight: '265px',
      }}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleIsChangeDialogClose}
      >
        Are you sure to go back?
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          color={commonStyles.secondaryMain}
          fontSize="24px"
          mt="15px"
        >
          Your Changes wll discard
        </Typography>
      </DialogContent>
      <DialogActions>
        <ContainedButton
          name="Yes"
          onClick={closeCustomTemplateDialog}
          style={{
            mt: 5,
            minWidth: '140px !important',
            height: '36px !important',
          }}
        />
        <ContainedButton
          name="No"
          onClick={handleIsChangeDialogClose}
          style={{
            mt: 5,
            minWidth: '140px !important',
            height: '36px !important',
          }}
        />
      </DialogActions>
    </Box>
  );
}
