import { Box, DialogContent, DialogTitle, Typography } from '@mui/material';
import * as React from 'react';
import '../../global.scss';
import './styles.scss';

import { Row, Col } from 'react-bootstrap';
import Avatar from '../../elements/Avatar';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type Props = {
  handleViewParticipantsDialogClose: () => void;
  users: any;
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

export function ViewParticipants({
  handleViewParticipantsDialogClose,
  users,
}: Props) {
  return (
    <Box sx={{ minWidth: '450px', maxHeight: '450px', overflowY: 'auto' }}>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleViewParticipantsDialogClose}
      >
        <Typography className="allParticipants">All PARTICIPANTS</Typography>
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box>
          {users?.map((user: any, index: any) => (
            <Row
              style={{ marginBottom: index < users.length - 1 ? '16px' : '0px' }}
              key={index}
            >
              <Col
                xs="12"
                className="d-flex justify-content-start align-items-center"
              >
                <LazyLoadImage
                  className="avatar"
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '5px solid #f9fbf8',
                  }}
                  src={'/avatars/animals/' + user.avatar + '.svg'}
                ></LazyLoadImage>
                <Typography
                  className="allParticipants"
                  sx={{ marginLeft: '8px' }}
                >
                  {user.userNickname}
                </Typography>
              </Col>
            </Row>
          ))}
        </Box>
      </DialogContent>
    </Box>
  );
}
