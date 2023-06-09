import * as React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  AppBar,
  Box,
  Button,
  Dialog,
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
import theme from '../../helpers/theme/theme';
import './styles.scss';
import { BoardContext } from '../../contexts/BoardContext';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { CustomizeTemplateDialog } from './CustomizeTemplateDialog';

const ColumnComponent = styled('div')({
  height: 'calc(var(--app-height) - 160px)',
  display: 'flex',
  flexGrow: 1,
  padding: 0,
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const StyledEdiText = styled(EdiText)`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
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
  }
  button[editext='cancel-button'] {
    width: 50px;
    background: #ffffff00;
    border: none;
  }
  div[editext='main-container'] {
    width: 100% !important;
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
  div[editext='view-container'],
  div[editext='edit-container'] {
    width: 100% !important;
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
    word-break: break-all;
  }
`;

type Props = {
  closeCustomTemplateDialog: () => void;
  selectedTemplate: any;
  handleTemplateSelectClick: (
    selectedTemplateId: string,
    selectedTemplate: any
  ) => void;
  setIsTemplateCustomized: (isTemplateCustomized: boolean) => void;
  customizedTemplate: any;
  isTemplateCustomized: boolean;
};

export function CustomizeTemplate({
  closeCustomTemplateDialog,
  selectedTemplate,
  handleTemplateSelectClick,
  setIsTemplateCustomized,
  customizedTemplate,
  isTemplateCustomized,
}: Props) {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const { commitAction } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [isChangesHappen, setIsChangesHappen] = React.useState<boolean>(false);
  const [isChangeDialogOpen, setIsChangeDialogOpen] = React.useState(false);

  const [tempSelectedTemplate, setTempSelectedTemplate] = React.useState<any>();
  const [dragDropList, setDragDropList] = React.useState<any>([]);
  const [initialHeight, setInitialHeight] = React.useState<string>('60px');

  React.useEffect(() => {
    if (!isTemplateCustomized) {
      setTempSelectedTemplate(selectedTemplate);
      localStorage.setItem(
        'selectedTemplate',
        JSON.stringify(selectedTemplate)
      );
      localStorage.setItem(
        'tempSelectedTemplateData',
        JSON.stringify(selectedTemplate)
      );
      const newArr =
        selectedTemplate.columns &&
        selectedTemplate.columns.map((element: any) => ({
          ...element,
          isHovered: false,
        }));
      setDragDropList(newArr);
    } else {
      setTempSelectedTemplate(customizedTemplate);
      localStorage.setItem(
        'selectedTemplate',
        JSON.stringify(customizedTemplate)
      );
      localStorage.setItem(
        'tempSelectedTemplateData',
        JSON.stringify(customizedTemplate)
      );
      const newArr =
        customizedTemplate.columns &&
        customizedTemplate.columns.map((element: any) => ({
          ...element,
          isHovered: false,
        }));
      setDragDropList(newArr);
    }
  }, []);

  // On Dragging the Column
  const onDragComplete = (result: any) => {
    if (!result.destination) return;
    const arr = [...dragDropList];

    //Changing the position of Array element
    let removedItem = arr.splice(result.source.index, 1)[0];
    arr.splice(result.destination.index, 0, removedItem);

    //Updating the list
    setDragDropList(arr);
    setTempSelectedTemplate({ ...tempSelectedTemplate, columns: [...arr] });
    localStorage.setItem(
      'tempSelectedTemplateData',
      JSON.stringify({ ...tempSelectedTemplate, columns: [...arr] })
    );
    setIsChangesHappen(true);
  };

  // On Changing the column name
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
    if (value.length > 60 && value.length <= 80) {
      setInitialHeight('80px !important');
    } else if (value.length > 80 && value.length <= 100) {
      setInitialHeight('100px !important');
    } else if (value.length > 100 && value.length <= 120) {
      setInitialHeight('120px !important');
    } else if (value.length > 120 && value.length <= 150) {
      setInitialHeight('140px !important');
    }
    setIsChangesHappen(true);
    localStorage.setItem(
      'tempSelectedTemplateData',
      JSON.stringify({ ...tempSelectedTemplate, columns: [...data] })
    );
    setTempSelectedTemplate({ ...tempSelectedTemplate, columns: [...data] });
  };

  // Function to handle the select button click and SaveAndExit button
  const onClickSelectButton = (templateId: string) => {
    const localStorageTemplateTemp = localStorage.getItem(
      'tempSelectedTemplateData'
    );
    const localStorageTemplate =
      localStorageTemplateTemp && JSON.parse(localStorageTemplateTemp);
    localStorage.setItem(
      'selectedTemplate',
      JSON.stringify(localStorageTemplate)
    );
    handleTemplateSelectClick(templateId, localStorageTemplate);
    setIsTemplateCustomized(true);
    closeCustomTemplateDialog();
    localStorage.removeItem('tempSelectedTemplateData');
  };

  // Function to handle the ExitWithOutExit button
  const exitWithOutExit = (templateId: string) => {
    closeCustomTemplateDialog();
    localStorage.removeItem('tempSelectedTemplateData');
    const localStorageTemplateTemp = localStorage.getItem('selectedTemplate');
    const localStorageTemplate =
      localStorageTemplateTemp && JSON.parse(localStorageTemplateTemp);
    handleTemplateSelectClick(templateId, localStorageTemplate);
  };

  const handleIsChangeDialogClose = () => {
    setIsChangeDialogOpen(false);
  };

  const onClickBack = () => {
    if (isChangesHappen) {
      setIsChangeDialogOpen(true);
    } else {
      closeCustomTemplateDialog();
    }
  };

  const handleMouseEnter = (i: number) => {
    const newArr = dragDropList.map((element: any, index: number) => {
      if (index === i) {
        element.isHovered = true;
      }
      return element;
    });
    setDragDropList(newArr);
  };

  const handleMouseLeave = (i: number) => {
    const newArr = dragDropList.map((element: any, index: number) => {
      if (index === i) {
        element.isHovered = false;
      }
      return element;
    });
    setDragDropList(newArr);
  };

  const setValueLive = (e: any, columnId: string) => {
    if (e.target.value.length > 150 && e.keyCode !== 46 && e.keyCode !== 8) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      return false;
    }
  };

  return (
    <>
      <Box className="mainContainer">
        <TopBar />
        <Grid container spacing={0} className="retroContainer">
          {/* About Template */}
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
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
                  onClick={onClickBack}
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
                    onClickSelectButton(selectedTemplate.templateId)
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
            <DragDropContext onDragEnd={onDragComplete}>
              <Droppable droppableId="drag-drop-list" direction="horizontal">
                {(provided, snapshot) => (
                  <div
                    className="drag-drop-list-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {dragDropList.map((column: any, index: number) => (
                      <Draggable
                        key={column.id}
                        draggableId={column.id}
                        index={index}
                      >
                        {provided => (
                          <Grid
                            item
                            xs={4}
                            sx={{
                              marginLeft: index === 1 ? '48px' : '0px',
                              marginRight: index === 1 ? '48px' : '0px',
                            }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                          >
                            <ColumnComponent
                              sx={{
                                height: isXsUp
                                  ? 'calc(var(--app-height) - 115px)'
                                  : 'calc(var(--app-height) - 160px)',
                              }}
                            >
                              <Box>
                                {column.isHovered && (
                                  <span>
                                    <img
                                      src="/images/drag_icon.png"
                                      style={{
                                        width: '20px',
                                        height: '36px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        top: ' 16px',
                                      }}
                                    />
                                  </span>
                                )}
                              </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  background: column.cardColour,
                                  border: '1px solid ' + column.groupFontColour,
                                  borderRadius: '8px',
                                }}
                              >
                                <Box
                                  whiteSpace="normal"
                                  sx={{
                                    width: '100%',
                                    height: initialHeight,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '9px 9px 0px 0px',
                                    background: column.groupColour,
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  <StyledEdiText
                                    type="text"
                                    value={column.name}
                                    showButtonsOnHover
                                    onSave={value =>
                                      handleColumnNameChange(value, column.id)
                                    }
                                    validationMessage="Maximum 150 characters allowed."
                                    validation={val => val.length <= 150}
                                    inputProps={{
                                      onChange: (
                                        e: React.ChangeEvent<HTMLInputElement>
                                      ) => {
                                        setValueLive(e, column.id);
                                      },
                                      style: {
                                        color:
                                          column.groupFontColour + '!important',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        fontFamily: 'Poppins',
                                        fontStyle: 'normal',
                                        lineHeight: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        letterSpacing: '0.6px',
                                        borderRadius: '8px',
                                        wordBreak: 'break-all',
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
                              </Box>
                            </ColumnComponent>
                          </Grid>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Grid>
      </Box>
      <BootstrapDialog
        open={isChangeDialogOpen}
        onClose={handleIsChangeDialogClose}
        aria-labelledby="customized-dialog-title"
        PaperProps={{
          sx: {
            width: '800px',
            height: '418px',
            maxWidth: '800px',
            minHeight: '418px',
            padding: isXsUp ? '16px' : '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden',
            background: '#FFFFFF',
            boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
            borderRadius: '20px',
          },
        }}
        sx={{
          boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
          borderRadius: '20px',
        }}
      >
        <CustomizeTemplateDialog
          handleIsChangeDialogClose={handleIsChangeDialogClose}
          exitWithOutExit={exitWithOutExit}
          templateId={selectedTemplate.templateId}
          onClickSelectButton={onClickSelectButton}
        />
      </BootstrapDialog>
    </>
  );
}
