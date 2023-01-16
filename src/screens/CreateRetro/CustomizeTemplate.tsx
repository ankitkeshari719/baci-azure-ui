import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Toolbar,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';
import Typography from '@mui/material/Typography';
import * as Icons from 'heroicons-react';

type Props = {
  closeCustomTemplateDialog: () => void;
};

export function CustomizeTemplate({ closeCustomTemplateDialog }: Props) {
  return (
    <Box className="mainContainer">
      <TopBar />
      <Grid container spacing={0} className="retroContainer">
        {/* About Template */}
        <Grid item xs={12}>
          <Box component="div" whiteSpace="normal" className="createRetroText">
            Customize Template
          </Box>
        </Grid>
        {/* App bar */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <AppBar position="static" className="learnMoreAppBar">
            <Toolbar
              variant="dense"
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icons.ArrowCircleLeftOutline
                size={20}
                style={{
                  display: 'block',
                  right: '0px',
                  color: '#159ADD',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
                onClick={closeCustomTemplateDialog}
              />
              <Typography
                sx={{ ml: 1, flex: 1 }}
                component="div"
                className="selectedTemplate"
              >
                Sailboat
              </Typography>
              <Button autoFocus variant="outlined" className="customizeButton">
                <Typography className="customizeButtonText" component="span">
                  Customize
                </Typography>
              </Button>
              <Button
                autoFocus
                variant="contained"
                className="saveButton"
                sx={{ ml: 2 }}
              >
                <Typography className="saveButtonText" component="span">
                  Select
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>
        </Grid>
        {/* Columns */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Box
            component="div"
            whiteSpace="normal"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                width: '376px',
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                background: '#FAFAFA',
                border: '1px solid #0B6623',
                borderRadius: '8px',
              }}
            >
              <Box
                component="div"
                whiteSpace="normal"
                sx={{
                  width: '100%',
                  height: '48px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '9px 9px 0px 0px',
                  background: '#E2EBE5',
                }}
              >
                <TextField
                  maxRows={2}
                  inputProps={{ maxLength: 150 }}
                  multiline
                  fullWidth
                  value="What Went Well?"
                  sx={{
                    fieldset: { border: 'none' },
                    textarea: {
                      color: '#0B6623' + '!important',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      lineHeight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '0.6px',
                    },
                  }}
                  //   onKeyDown={e => {
                  //     if (e.keyCode === 13 && value.length !== 0) {
                  //       submitColumnName(columnName);
                  //       (e.target as HTMLInputElement).blur();
                  //     }
                  //   }}
                  //   onChange={e => setColumnName(e.currentTarget.value)}
                  //   onBlur={() => submitColumnName(columnName)}
                  //   onSubmit={() => submitColumnName(columnName)}
                />
              </Box>
            </Box>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                width: '376px',
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                background: '#FAFAFA',
                border: '1px solid #F79722',
                borderRadius: '8px',
                marginLeft: '96px',
                marginRight: '96px',
              }}
            >
              <Box
                component="div"
                whiteSpace="normal"
                sx={{
                  width: '100%',
                  height: '48px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '9px 9px 0px 0px',
                  background: '#fcf2e6',
                }}
              >
                <TextField
                  maxRows={2}
                  inputProps={{ maxLength: 150 }}
                  multiline
                  fullWidth
                  value="What Didn’t Go Well?"
                  sx={{
                    fieldset: { border: 'none' },
                    textarea: {
                      color: '#F79722' + '!important',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      lineHeight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '0.6px',
                    },
                  }}
                  //   onKeyDown={e => {
                  //     if (e.keyCode === 13 && value.length !== 0) {
                  //       submitColumnName(columnName);
                  //       (e.target as HTMLInputElement).blur();
                  //     }
                  //   }}
                  //   onChange={e => setColumnName(e.currentTarget.value)}
                  //   onBlur={() => submitColumnName(columnName)}
                  //   onSubmit={() => submitColumnName(columnName)}
                />
              </Box>
            </Box>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                width: '376px',
                height: '500px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                background: '#FAFAFA',
                border: '1px solid #8A38F5',
                borderRadius: '8px',
              }}
            >
              <Box
                component="div"
                whiteSpace="normal"
                sx={{
                  width: '100%',
                  height: '48px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '9px 9px 0px 0px',
                  background: '#F5F1FB',
                }}
              >
                <TextField
                  maxRows={2}
                  inputProps={{ maxLength: 150 }}
                  multiline
                  fullWidth
                  value="Develop Actions"
                  sx={{
                    fieldset: { border: 'none' },
                    textarea: {
                      color: '#8A38F5' + '!important',
                      fontSize: '16px',
                      fontWeight: 600,
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      lineHeight: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '0.6px',
                    },
                  }}
                  //   onKeyDown={e => {
                  //     if (e.keyCode === 13 && value.length !== 0) {
                  //       submitColumnName(columnName);
                  //       (e.target as HTMLInputElement).blur();
                  //     }
                  //   }}
                  //   onChange={e => setColumnName(e.currentTarget.value)}
                  //   onBlur={() => submitColumnName(columnName)}
                  //   onSubmit={() => submitColumnName(columnName)}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
