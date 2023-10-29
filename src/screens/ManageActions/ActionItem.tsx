import * as React from 'react';
import './styles.scss';
import * as Icons from 'heroicons-react';
import { ActionInterface } from '../../helpers/types';
import { ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Box,
  Button,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { MAX_CARD_TEXT_LENGTH } from '../../constants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  connectJira,
  listJiraProjects,
  listJiraMeta,
  createJiraIssue,
  editJiraIssue,
  getJiraUserList,
} from '../../helpers/msal/services';
import { NestedDropdown } from 'mui-nested-menu';
import DyanamicDialog from '../../components/atoms/DyanamicDialog';

type Props = {
  action: ActionInterface;
  handleToggleAction: (actionId: string) => void;
  addReactToAction: (actionId: string, actionBy: string) => void;
  removeReactFromAction: (actionId: string) => void;
  isFeedbackSubmitted: boolean;
  isAddActionEnableToParticipant: boolean | undefined;
  isVotingEnableToParticipant: boolean | undefined;
  disabled: boolean;
  removeAction: (selectedActions: ActionInterface) => void;
  assignAction: (ids: string[], assigneeId: string) => void;
  isOtherParticipantAction?: boolean;
  jiraProjects: any[];
};

export default function ActionItem({
  action,
  handleToggleAction,
  addReactToAction,
  isFeedbackSubmitted,
  removeReactFromAction,
  isAddActionEnableToParticipant,
  isVotingEnableToParticipant,
  disabled,
  removeAction,
  assignAction,
  isOtherParticipantAction,
  jiraProjects,
}: Props) {
  const {
    state: { ended, users, actionsData },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const labelId = `action-label-${action.id}`;
  const [isMouseHover, setIsMouseHover] = React.useState<boolean>(false);
  const [isEditActionClick, setIsEditActionClick] =
    React.useState<boolean>(false);
  const [selectedAction, setSelectedAction] = React.useState<ActionInterface>();
  const [editActionValue, setEditActionValue] = React.useState<
    string | undefined
  >(selectedAction?.value);
  const [showUnassign, setShowUnassign] = React.useState<boolean>(false);

  // For Main Menu
  const [mainAnchorEl, setMainAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const openMainMenu = Boolean(mainAnchorEl);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedActionForAssign, setSelectedActionForAssign] =
    React.useState<ActionInterface>();
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  const userReacted = !!(action.reacts || []).find(
    r => r.by === global.user.id
  );

  //assign callback function to create jira action i.e story, task or other
  const getJiraProjects = () => {
    if (jiraProjects.length != 0) {
      const projectstemsWithCallBack: any = [];

      jiraProjects.forEach(project => {
        var projectItem: any = {
          id: project?.id,
          label: project.label,
          rightIcon: project.rightIcon,
          leftIcon: project.leftIcon,
          items: [],
        };
        const inputItems: any = [];
        if (project.items?.length != 0) {
          project.items?.forEach((item: any) => {
            delete item.callback;
            var itemInput = { ...item };

            inputItems.push({
              ...itemInput,
              callback: () => {
                var actionData: any = action;
                actionData.retroId = global.currentRetro?.humanId;
                (actionData.retroIdEnc = global.currentRetro?.id),
                  (actionData.enterpriseId = global?.azureUser?.enterpriseId),
                  (actionData.teamId = global?.currentRetro?.selectedTeam);
                createJiraIssue(
                  itemInput.projectData.projectId,
                  itemInput.projectData.ticketId,
                  global?.jiraCode ? global?.jiraCode : '',
                  action.value,
                  action
                ).then(
                  res => {
                    console.log(res.message, res.data);
                    if (res.data) {
                      // alert(res.message);
                      dispatch({
                        type: ActionType.SET_SNACK_MESSAGE,
                        payload: {
                          snackMessage: {
                            message: res.message,
                            snackMessageType: 'success',
                          },
                        },
                      });

                      updateJiraAction(action.id, {
                        jiraId: res.data.id,
                        jiraKey: res.data.key,
                        jiraUrl: res.data.self,
                      });
                    }
                  },
                  error => {
                    console.log();
                  }
                );
              },
            });
          });
          projectItem.items = [...inputItems];
        }
        projectstemsWithCallBack.push(projectItem);
      });
      return projectstemsWithCallBack;
    } else return jiraProjects;
  };

  React.useEffect(() => {
    setMenuItemsData({
      label:
        action?.assigneeAvatar === '' || action.assigneeAvatar === undefined ? (
          <LazyLoadImage
            className="avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
            }}
            src={'/svgs/DefaultUser.svg'}
          ></LazyLoadImage>
        ) : (
          <LazyLoadImage
            width="32px !important"
            height="32px !important"
            aria-controls={openMainMenu ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMainMenu ? 'true' : undefined}
            style={{
              borderRadius: '50%',
              border: 'none',
            }}
            src={'/avatars/animals/' + action?.assigneeAvatar + '.svg'}
          ></LazyLoadImage>
        ),
      items: [
        {
          label: '   Edit   ',
          leftIcon: (
            <Icons.Pencil
              size={18}
              color="#676767"
              style={{
                cursor: 'unset',
              }}
            />
          ),
          callback: () => (openEditActionOption(action), handleMainMenuClose()),
        },
        {
          label: '   Copy   ',
          leftIcon: (
            <Icons.DocumentDuplicateOutline
              size={18}
              color="#676767"
              style={{
                cursor: 'unset',
              }}
            />
          ),
          callback: () => (copyManageActions(action), handleMainMenuClose()),
        },

        !action.jiraId && {
          label: '    Export to JIRA  ',
          leftIcon: (
            <img
              src="/images/jira.png"
              style={{ height: '18px', width: '18px' }}
            />
          ),
          rightIcon: <img src="/svgs/RightArrow.svg" />,
          items:
            global.jiraCode == ''
              ? [
                  {
                    label: 'Connect JIRA',
                    leftIcon: <img src="/images/ArrowLeftOnRectangle.png" />,
                    callback: () => setShowDialog(true),
                  },
                ]
              : getJiraProjects(),
        },

        {
          label: '   Remove   ',
          leftIcon: (
            <Icons.TrashOutline
              size={18}
              color="#EA4335"
              style={{
                cursor: 'unset',
              }}
            />
          ),
          callback: () => {
            removeAction(action), handleMainMenuClose();
          },
        },
      ],
    });
  }, [jiraProjects, global?.jiraCode, action]);

  const handleMainMenuClose = () => {
    setMainAnchorEl(null);
  };

  const handleUsersMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAssign = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    const participantId: string = event.currentTarget.dataset.myValue
      ? event.currentTarget.dataset.myValue
      : '';
    selectedActionForAssign &&
      assignAction([selectedActionForAssign.id], participantId);
    handleMainMenuClose();
  };

  // Handle Mover Enter on List Item to show the edit pencil
  const handleMouseEnter = () => {
    setIsMouseHover(true);
  };

  // Handle Mover Leave on List Item to show the edit pencil
  const handleMouseLeave = () => {
    setIsMouseHover(false);
  };

  // function to handle the click of edit icon
  const openEditActionOption = (action: ActionInterface) => {
    setIsEditActionClick(true);
    setSelectedAction(action);
    setEditActionValue(action.value);
  };

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  // function to call API on saving the existing action
  const saveEditAction = async (editActionValue: string | undefined) => {

    if(global?.jiraCode!==undefined&&global?.jiraCode!==""){
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      await saveAndProcessAction(BoardActionType.UPDATE_ACTION, {
        id: selectedAction?.id,
        value: editActionValue,
      }).then(
        async res => {
         
          await editJiraIssue(
            global?.jiraCode ? global?.jiraCode : '',
            editActionValue ? editActionValue : '',
            action
          ).then(
            jiraEditRes => {
              // alert(jiraEditRes.message);
              dispatch({
                type: ActionType.SET_SNACK_MESSAGE,
                payload: {
                  snackMessage: {
                    message:jiraEditRes.message,
                    snackMessageType: 'success',
                  },
                },
              });
            },
            error => {
              // alert(error);
              dispatch({
                type: ActionType.SET_SNACK_MESSAGE,
                payload: {
                  snackMessage: {
                    message:error,
                    snackMessageType: 'success',
                  },
                },
              });
            }
          );
  
          setIsEditActionClick(false);
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        },
        err => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );
     
    }
    else
   {
  
    setShowDialog(true)
  }
  };

  const updateJiraAction = async (actionId: string, jiraObj: any) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.UPDATE_JIRA_ACTION, {
      id: actionId,
      value: jiraObj,
    }).then(
      res => {
        setIsEditActionClick(false);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  // function to discard the edit data
  const cancelEditedData = () => {
    setEditActionValue(action.value);
    setIsEditActionClick(false);
  };

  // Action Copy to clipboard
  const copyManageActions = (action: ActionInterface) => {
    navigator.clipboard.writeText(action.value);
  };

  //connect to jira
  const connect = async () => {
    await connectJira(global.currentRetro?.id as string).then(
      (res: any) => {
        window.location.href = res.response;
      },
      error => {
        console.log('error', error);
      }
    );
  };

  const [menuItemsData, setMenuItemsData] = React.useState<any>({});

  return (
    <>
      <ListItem key={labelId} style={{ padding: '8px 12px' }}>
        {/* Checkbox */}
        {!disabled && !ended && !global.leaveRetro && (
          <ListItemIcon
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              minWidth: '32px',
            }}
            onClick={() => handleToggleAction(action.id)}
          >
            <Checkbox
              edge="start"
              checked={!ended ? action.checked : false}
              tabIndex={-1}
              disableRipple
              disabled
              inputProps={{ 'aria-labelledby': labelId }}
              icon={
                <img
                  src="/svgs/CircleUnchecked.svg"
                  alt="Logo"
                  style={{ width: '32px', height: '32px' }}
                />
              }
              checkedIcon={
                <Icons.CheckCircle
                  size={24}
                  color="#159ADD"
                  style={{
                    cursor: 'pointer',
                  }}
                />
              }
            />
          </ListItemIcon>
        )}
        {/* Action Description and Edit Text Field */}
        {!isEditActionClick ? (
          <ListItemButton
            role={undefined}
            dense
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <>
              {' '}
              {action.jiraKey && (
                <Box
                  component={'span'}
                  sx={{
                    color: 'blue',
                    marginRight: '10px',
                    textDecoration: 'underline',
                  }}
                >
                  {action.jiraKey}
                </Box>
              )}
              <ListItemText
                id={labelId}
                primary={action.value}
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22px',
                  letterSpacing: '0.2px',
                  color: '#343434',
                  wordWrap: 'break-word',
                }}
              />
            </>
            {!ended &&
              isMouseHover &&
              (global.user.userType == 2 ||
                (global.user.id === action.createdBy &&
                  !isFeedbackSubmitted)) && (
                <Icons.PencilAltOutline
                  style={{
                    color: '#CCCCCC',
                    width: '20px',
                    height: '20px',
                    minWidth: '20px',
                    minHeight: '20px',
                    cursor: 'pointer',
                  }}
                  onClick={() => openEditActionOption(action)}
                />
              )}
          </ListItemButton>
        ) : (
          // Edit TextField
          <ListItemButton
            sx={{
              border: '1px solid #159ADD',
              ':hover': { background: '#ffffff' },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '0px',
              }}
            >
              <TextField
                fullWidth
                multiline
                value={editActionValue}
                onChange={(e: any) => setEditActionValue(e.currentTarget.value)}
                onKeyDown={(e: any) => {
                  const tempValue = editActionValue;
                  const removedEnter =
                    tempValue && tempValue.replace(/[\r\n]/gm, '');
                  setEditActionValue(removedEnter);
                  const removedSpaces =
                    removedEnter && removedEnter.replace(/ /g, '');
                  if (
                    e.keyCode === 13 &&
                    removedSpaces &&
                    removedSpaces.length !== 0
                  ) {
                    saveEditAction(editActionValue);
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                inputProps={{
                  maxLength: MAX_CARD_TEXT_LENGTH,
                  style: {
                    padding: 0,
                  },
                }}
                sx={{
                  '& fieldset': { border: 'none' },
                  textarea: {
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    color: '#343434',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '22px',
                    letterSpacing: '0.2px',
                  },
                }}
              />
              {/* Limitation */}
              {editActionValue &&
              editActionValue.length >= MAX_CARD_TEXT_LENGTH - 20 ? (
                <Typography
                  style={{
                    fontSize: '0.75rem',
                    textAlign: 'right',
                    whiteSpace: 'nowrap',
                    color: '#808080',
                  }}
                >
                  Characters remaining:{' '}
                  {MAX_CARD_TEXT_LENGTH - editActionValue.length}
                </Typography>
              ) : null}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'end',
                }}
              >
                <Button
                  onClick={cancelEditedData}
                  sx={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    color: '#EA4335',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                    paddingRight: '0',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={editActionValue?.length === 0}
                  onClick={() => saveEditAction(editActionValue)}
                  sx={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    color: '#159ADD',
                    fontSize: '14px',
                    lineHeight: '20px',
                    letterSpacing: '0.4px',
                    textTransform: 'uppercase',
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </ListItemButton>
        )}
        {/* Voting to Action */}
        {isVotingEnableToParticipant && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Button
              sx={{ minWidth: '0px', position: 'initial' }}
              disabled={ended || global.leaveRetro}
              onClick={e => {
                !ended && userReacted
                  ? removeReactFromAction(action.id)
                  : addReactToAction(action.id, global.user.id);
                e.stopPropagation();
              }}
            >
              {userReacted ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                    fill="#FBBC05"
                    stroke="#FBBC05"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                    fill="#FFFFF"
                    stroke="#FBBC05"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <Typography
                color="black"
                style={{
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#FBBC05',
                  marginLeft: '6px',
                }}
              >
                {action.reacts.length === 0 ? 0 : action.reacts.length}
              </Typography>
            </Button>
          </Box>
        )}
        <Box
          component="span"
          sx={{
            width: '40px',
            overflow: 'hidden',
          }}
        >
          <NestedDropdown
            menuItemsData={
              global.user.userType == 2
                ? menuItemsData
                
                : menuItemsData?.label==undefined?{}: {
                    label: menuItemsData?.label,
                    items: [menuItemsData?.items[0]],
                  }
            }
            MenuProps={{
              elevation: 4,
            }}
            ButtonProps={{ variant: undefined }}
          />
        </Box>
      </ListItem>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleUsersMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            border: '1px solid #cccccc',
            boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
            borderRadius: '10px',
            background: '#ffffff',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {showUnassign && (
          <MenuItem
            className="menu-item"
            data-my-value={''}
            onClick={handleAssign}
          >
            <LazyLoadImage
              width="32px !important"
              height="32px !important"
              style={{
                borderRadius: '50%',
              }}
              src={'/svgs/DefaultUser.svg'}
            ></LazyLoadImage>
            <Box
              component="span"
              sx={{
                marginLeft: '8px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
              }}
            >
              Un-assign
            </Box>
          </MenuItem>
        )}
        <MenuItem
          className="menu-item"
          onClick={handleAssign}
          data-my-value={global.user.id}
        >
          <LazyLoadImage
            width="32px !important"
            height="32px !important"
            style={{
              borderRadius: '50%',
            }}
            src={'/avatars/animals/' + global.user.avatar + '.svg'}
          ></LazyLoadImage>
          <Box
            component="span"
            sx={{
              marginLeft: '8px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
            }}
          >
            You
          </Box>
        </MenuItem>
        {users.map(
          (user: any, index: number) =>
            global.user.id != user.userId && (
              <MenuItem
                className="menu-item"
                key={'basic-menu' + index}
                onClick={handleAssign}
                data-my-value={user.userId}
              >
                <LazyLoadImage
                  width="32px !important"
                  height="32px !important"
                  style={{
                    borderRadius: '50%',
                  }}
                  src={'/avatars/animals/' + user.avatar + '.svg'}
                ></LazyLoadImage>
                <Box
                  component="span"
                  sx={{
                    marginLeft: '8px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                  }}
                >
                  {user.userNickname}
                </Box>
              </MenuItem>
            )
        )}
      </Menu>

      {/* <ConfirmContext.Provider value={{ confirmAction, setConfirmAction }}> */}
      <DyanamicDialog
        show={showDialog}
        title={'Exit automation?'}
        text={
          'All temporary groups created (in dotted lines) would be discarded.'
        }
        action={'YES, EXIT'}
        type="Alert"
        onCancel={() => setShowDialog(false)}
        onConfirm={() => connect()}
      />

      {/* {props.children} */}
      {/* </ConfirmContext.Provider> */}
    </>
  );
}
