import { Box, DialogContent, DialogTitle, Typography } from '@mui/material';
import * as React from 'react';
import '../../global.scss';
import './styles.scss';
import commonStyles from '../../style.module.scss';

import { Row, Col } from 'react-bootstrap';

type Props = {
  handleFeedbackSubmitClose: () => void;
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

export function FeedbackSubmitDialog({ handleFeedbackSubmitClose }: Props) {
  return (
    <Box
      sx={{
        width: '800px',
        maxWidth: '800px',
        height: '400px',
        maxHeight: '400px',
      }}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleFeedbackSubmitClose}
      ></BootstrapDialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src="/images/RetroFinish.gif"></img>
        <Typography
          color={commonStyles.secondaryMain}
          fontSize="24px"
          mt="15px"
        >
          Thank for the feedback message!
        </Typography>
      </DialogContent>
    </Box>
  );
}
