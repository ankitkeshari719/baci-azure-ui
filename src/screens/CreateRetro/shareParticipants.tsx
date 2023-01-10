import * as React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { CreateRetroWithTemplatePage } from './CreateRetroWithTemplatePage';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

export function ShareParticipants() {
  return (
    <Box className="participantContainer">
      <Box component="div" whiteSpace="normal" className="createRetroText">
        Share with participants
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="firstDesignSprint"
      >
        First Design Sprint
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="joinUrl"
      >
        https://baciapp.com
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="withCode"
      >
        with code
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="codeId"
      >
        173222
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="img"
        alt="Logo"
        src="/images/barcode.png"
      />
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="productUrl"
      >
        https://product-retro-dev.web.app/join/173222
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          className="inviteButton"
          size="medium"
          startIcon={<MailOutlineIcon />}
        >
          <Typography component="span" className="inviteText">
            invite via email
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
