import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Grid,
  styled,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';
import * as Icons from 'heroicons-react';
import EdiText from 'react-editext';

const StyledEdiText = styled(EdiText)`
  button {
    border-radius: 5px;
  }
  button[editext='edit-button'] {
    color: #000;
    background: #ffffff;
    width: 50px;
    border: none;
  }
  button[editext='save-button'] {
    width: 50px;
    background: #ffffff;
    border: none;
    &:hover {
      background: greenyellow;
    }
  }
  button[editext='cancel-button'] {
    width: 50px;
    background:#ffffff;
    border: none;
    &:hover {
      background: crimson;
      color: #fff;
    }
  }
  div[editext='view-container'],
  div[editext='edit-container'] {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    letter-spacing: 0.6px;
    padding: 15px;
  }
`;

type Props = {
  closeCustomTemplateDialog: () => void;
  selectedTemplate: any;
  handleTemplateSelectClick: (selectedTemplateId: string) => void;
  setIsTemplateCustomized: (isTemplateCustomized: boolean) => void;
  setSelectedTemplate: (selectedTemplate: any) => void;
};

export function CustomizeTemplate({
  closeCustomTemplateDialog,
  selectedTemplate,
  handleTemplateSelectClick,
  setSelectedTemplate,
  setIsTemplateCustomized
}: Props) {
  const [tempSelectedTemplate, setTempSelectedTemplate] = React.useState<any>();

  React.useEffect(() => {
    setTempSelectedTemplate(selectedTemplate);
  }, []);

  const handleColumnNameChange = (
    value: React.SetStateAction<string>,
    columnId: string
  ) => {
    let data: any = tempSelectedTemplate.columns?.map((column: any) => {
      if (column.id === columnId) {
        column.name = value;
      }
      return column;
    });
    setIsTemplateCustomized(true);
    setTempSelectedTemplate({ ...tempSelectedTemplate, columns: [...data] });
    setSelectedTemplate(tempSelectedTemplate);
  };

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
                paddingLeft: '0px !important',
              }}
            >
              <Icons.ArrowCircleLeftOutline
                size={20}
                style={{
                  width: '24px',
                  height: '24px',
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
                {tempSelectedTemplate && tempSelectedTemplate.templateName}
              </Typography>
              <Button
                autoFocus
                variant="contained"
                className="saveButton"
                onClick={() => handleTemplateSelectClick(selectedTemplate.templateId)}
              >
                <Typography className="saveButtonText" component="span">
                  Select
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>
        </Grid>
        {/* Columns */}
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            mt: 4
          }}
        >
          {tempSelectedTemplate &&
            tempSelectedTemplate.columns.map((column: any) => {
              return (
                <Box
                  key={column.id}
                  whiteSpace="normal"
                  sx={{
                    width: '376px !important',
                    height: '500px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    background: column.cardColor,
                    border: '1px solid ' + column.groupFontColor,
                    borderRadius: '8px',
                  }}
                >
                  <Box
                    whiteSpace="normal"
                    sx={{
                      width: '100%',
                      height: '48px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '9px 9px 0px 0px',
                      background: column.groupColor,
                    }}
                  >
                    <StyledEdiText
                      type="text"
                      value={column.name}
                      showButtonsOnHover
                      onSave={value => handleColumnNameChange(value, column.id)}
                      validation={val => val.length <= 35}
                      inputProps={{
                        style: {
                          color: column.groupFontColor + '!important',
                          fontSize: '16px',
                          fontWeight: 600,
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          lineHeight: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          letterSpacing: '0.6px',
                          borderRadius: '8px',
                        },
                      }}
                      hideIcons={true}
                      editButtonContent={
                        <Icons.PencilOutline
                          size={20}
                          style={{
                            color: '#000000',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        />
                      }
                      cancelButtonContent={
                        <Icons.XOutline
                          size={20}
                          style={{
                            color: '#000000',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        />
                      }
                      saveButtonContent={
                        <Icons.Check
                          size={20}
                          style={{
                            color: '#000000',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        />
                      }
                    />
                    {/* <TextField
                      maxRows={2}
                      inputProps={{ maxLength: 150 }}
                      multiline
                      fullWidth
                      value={column.name}
                      sx={{
                        fieldset: { border: 'none' },
                        textarea: {
                          color: column.groupFontColor + '!important',
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
                      onChange={e =>
                        handleColumnNameChange(e.currentTarget.value, column.id)
                      }
                    /> */}
                  </Box>
                </Box>
              );
            })}
        </Box>
      </Grid>
    </Box>
  );
}
