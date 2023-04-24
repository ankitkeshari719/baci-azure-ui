import * as React from 'react';
import './styles.scss';
import * as Icons from 'heroicons-react';

import { Typography, Box, Grid } from '@material-ui/core';
import { ActionInterface } from '../../types';
import { Row, Col } from 'react-bootstrap';

type Props = {
  allActions: ActionInterface[];
};

export default function ActionHeader({ allActions }: Props) {
  return (
    <Box className="actionHeaderContainer">
      <Box className="actionHeader">
        <Row style={{ width: '100%', margin: '0px' }}>
          <Col
            xs="6"
            className="d-flex justify-content-start align-items-center p-0"
          >
            <Typography component="span" className="totalActions">
              {allActions.length} Actions
            </Typography>
          </Col>
          <Col
            xs="6"
            className="d-flex justify-content-end align-items-center p-0"
          >
            <Icons.ArrowsExpand
              size={20}
              color="red"
              style={{ cursor: 'pointer' }}
              // onClick={() => addAction(actionValue)}
            ></Icons.ArrowsExpand>
          </Col>
        </Row>
      </Box>
    </Box>
  );
}
