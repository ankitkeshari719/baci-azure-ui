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
  useMediaQuery,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';
import * as Icons from 'heroicons-react';
import EdiText from 'react-editext';
import theme from '../../theme/theme';

const ColumnComponent = styled('div')({
  height: 'calc(var(--app-height) - 160px)',
  display: 'flex',
  flexGrow: 1,
  padding: 0,
});

const StyledEdiText = styled(EdiText)`
  button {
    border-radius: 5px;
  }
  button[editext='edit-button'] {
    color: #000;
    background: #ffffff00;
    width: 50px;
    border: none;
  }
  button[editext='save-button'] {
    width: 50px;
    background: #ffffff00;
    border: none;
    &:hover {
      background: greenyellow;
    }
  }
  button[editext='cancel-button'] {
    width: 50px;
    background: #ffffff00;
    border: none;
    &:hover {
      background: crimson;
      color: #fff;
    }
  }
  div[editext='main-container'] {
    width: 100% !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  div[editext='view-container'],
  div[editext='edit-container'] {
    display: flex;
    justify-content: space-between;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    letter-spacing: 0.6px;
    padding-left: 20px;
    padding-right: 20px;
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
  setIsTemplateCustomized,
}: Props) {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
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
                onClick={() =>
                  handleTemplateSelectClick(selectedTemplate.templateId)
                }
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
          sx={{ display: 'flex', flexDirection: 'row', width: '100%', mt: 4 }}
        >
          {tempSelectedTemplate &&
            tempSelectedTemplate.columns.map((column: any, index: number) => {
              return (
                <Grid
                  item
                  xs={4}
                  sx={{
                    marginLeft: index === 1 ? '10px' : '0px',
                    marginRight: index === 1 ? '10px' : '0px',
                  }}
                >
                  <ColumnComponent
                    sx={{
                      height: isXsUp
                        ? 'calc(var(--app-height) - 115px)'
                        : 'calc(var(--app-height) - 160px)',
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
                        onSave={value =>
                          handleColumnNameChange(value, column.id)
                        }
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
                    </Box>
                  </ColumnComponent>
                </Grid>
              );
            })}
        </Box>
      </Grid>
    </Box>
  );
}
