
import { FormControlLabel, FormGroup, Grid, Switch, TextField, ThemeProvider, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { ActionType } from '../../contexts/GlobalContext';
import theme from '../../theme/theme';
import { Column } from '../../types';
import RefreshIcon from '@mui/icons-material/Refresh';
import { UNGROUPED } from '../../constants';
const ColumnHeader = ({
  column,
  columnId,
  columnName,
  noHeader,
  groupFontColour,
  global,
  ended,
  leftHeaderComponent,
  value,
  submitColumnName,
  setColumnName,
  publishColumn,
  dispatch,
  columnIndex,
  isPrintPage,
  getGroupSuggestion,
  deleteUnconfirmedGroups,
  retryGroupSuggestion,
  keywordExtraction,
  hideKeywords
}: {
  column: Column;
  columnId: string;
  columnName: string;
  noHeader: any;
  groupFontColour: string | undefined;
  global: any;
  ended: boolean;
  leftHeaderComponent: any;
  value: string;
  submitColumnName: (columnName: string) => void;
  setColumnName: (columnName: string) => void;
  publishColumn: (flag: boolean) => void;
  dispatch: any;
  columnIndex: number | undefined;
  isPrintPage: boolean;
  getGroupSuggestion: () => void;
  deleteUnconfirmedGroups: () => void;
  retryGroupSuggestion: () => void;
  keywordExtraction: () => void;
  hideKeywords: () => void;
}) => {
  const [showEdit, setShowEdit] = React.useState(false);
  const [enableSave, setEnableSave] = React.useState(false);
  const [groupSuggestion, setGroupSuggestion] = React.useState(false);
  const [disableGroupSuggestion, setDisableGroupSuggestion] = React.useState(true);
  const [disableKeywordSuggestion, setDisabledKeywordSuggestion] = React.useState(true);
  useEffect(() => {
    setGroupSuggestion(false)
    setDisableGroupSuggestion(true);
    setDisabledKeywordSuggestion(true)
    var tempKeywordGroupSuggestion = true;
    var totalCards = 0;


    column.groups.forEach(element => {
      totalCards = totalCards + element.cards.length
      if (element.suggested) {
        setGroupSuggestion(true)
      }

      if (element.name == UNGROUPED) {
        if (element.cards.length > 2) {
          setDisableGroupSuggestion(false)
          tempKeywordGroupSuggestion = false;

        }
        else {
          setDisableGroupSuggestion(true)
        }
      }
    });

    if(totalCards>1){
      setDisabledKeywordSuggestion(false)

    }


  }, [column])
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      item
      xs={12}
      md={12}
      lg={12}

    >
      <Grid item lg={global.expandColumn === -1 ? 8 : 6} md={global.expandColumn === -1 ? 6 : 4} xs={6}>
        <Tooltip title={columnName}>
          <div>
            {!noHeader && (
              <Grid
                style={{
                  userSelect: 'none',
                  display: 'flex',
                  color: groupFontColour + '!important',
                  fontSize: '16px',
                  padding: '10px',
                  alignItems: 'center',
                }}
              >
                {global.user.userType == 2 && (!ended || !global.leaveRetro) ? (
                  <>
                    <TextField
                      maxRows={2}
                      sx={{
                        fieldset: { border: 'none' },
                        flex: 10,
                        // padding: '10px',
                        div: { padding: 0, position: 'initial' },
                        textarea: {
                          // textAlign: 'center',
                          color: groupFontColour + '!important',
                          fontSize: '16px',
                          fontWeight: 600,
                        },

                        position: 'initial',
                        display: 'flex',
                        // alignItems: 'center',
                        // justifyContent: 'left',
                      }}
                      inputProps={{ maxLength: 150 }}
                      multiline
                      fullWidth
                      value={columnName}
                      onKeyDown={e => {
                        if (e.keyCode === 13 && value.length != 0) {
                          submitColumnName(columnName);
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      onChange={e => setColumnName(e.currentTarget.value)}
                      onBlur={() => submitColumnName(columnName)}
                      onSubmit={() => submitColumnName(columnName)}
                    ></TextField>
                  </>
                ) : (
                  <Typography
                    noWrap
                    sx={{
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      color: groupFontColour + '!important',
                    }}
                  >
                    {columnName}
                  </Typography>
                )}
              </Grid>
            )}
          </div>
        </Tooltip>
      </Grid>
      {!isPrintPage && (

        <Grid
          container
          justifyContent="flex-end"
          direction="row"
          alignItems="center"
          item
          lg={global.expandColumn === -1 ? 4 : 6}
          md={global.expandColumn === -1 ? 5 : 8}
          xs={5}
        >
          {global.user.userType == 2 && (!ended || !global.leaveRetro) && (


            <>
              {global.expandColumn !== -1 && !ended &&

                <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>

                    <Tooltip title={disableKeywordSuggestion && "Need at least two cards"}>
                      <FormControlLabel
                        checked={column.showKeywords ? column.showKeywords : false}
                        sx={{ color: theme.palette.primary.dark }}
                        disabled={disableKeywordSuggestion}
                        control={<Switch color="primary"

                          onChange={(value) => {
                            if (value.target.checked) {
                              keywordExtraction()

                            }
                            else {
                              hideKeywords()
                            }

                          }}
                        />} label="Show keywords" />
                    </Tooltip>
                    <Tooltip title={!groupSuggestion && disableGroupSuggestion ? "Need more than 2 ungrouped cards" : ''}>
                      <FormControlLabel disabled={!groupSuggestion && disableGroupSuggestion} sx={{ color: theme.palette.primary.dark }} checked={groupSuggestion}
                        control={<Switch color="primary" onChange={(value) => {
                          if (value.target.checked) {
                            getGroupSuggestion()

                          }
                          else {
                  
                            deleteUnconfirmedGroups()
                          }
                        }} />} label="Suggest Grouping" />
                    </Tooltip>

                  </FormGroup>
                  {groupSuggestion && !disableGroupSuggestion && <Tooltip title="Resuggest grouping">
                    <RefreshIcon sx={{ color: theme.palette.primary.dark, marginRight: '15px', cursor: 'pointer' }}
                      onClick={
                        retryGroupSuggestion
                      }
                    />

                  </Tooltip>}
                </Grid>

              }

              {column.publish ? (
                <Typography style={{ color: '#808080' }}>
                  Published
                </Typography>
              ) : (
                <Typography
                  id={'publish' + columnIndex}
                  onClick={() => {
                    if (!ended) {
                      publishColumn(true);
                    }
                  }}
                  sx={{
                    color: '#159ADD',
                    textDecorationLline: 'underline',
                    cursor: !ended ? 'pointer' : 'auto',
                    display: !ended ? 'flex' : 'none',
                  }}
                >
                  Publish
                </Typography>
              )}
            </>
          )}
          {global.expandColumn === -1 ? (
            <img
              onClick={() => {
                dispatch({
                  type: ActionType.EXPAND_COLUMN,
                  payload: { expandColumn: +column.id },
                });
              }}
              src="/svgs/Expand.svg"
              style={{
                width: '20px',
                marginLeft: '15px',
                cursor: 'pointer',
              }}
            />
          ) : (
            <img
              onClick={() => {
                dispatch({
                  type: ActionType.EXPAND_COLUMN,
                  payload: { expandColumn: -1 },
                });
              }}
              src="/svgs/Shrink.svg"
              style={{
                width: '20px',
                marginLeft: '15px',
                cursor: 'pointer',
              }}
            />
          )}
        </Grid>

      )}
    </Grid>
  );
};

export default ColumnHeader;
