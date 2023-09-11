import * as React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import {
  ActionList,
  jiraActionStatus,
  users,
} from '../../../constants/DemoConst';
import { Box, Checkbox, InputAdornment, TextField } from '@mui/material';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  H1SemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';

const ActionCount = [
  {
    label: jiraActionStatus[0].label,
    count: 0,
    color: jiraActionStatus[0].color,
    selected: true,
  },
  {
    label: jiraActionStatus[1].label,
    count: 0,
    color: jiraActionStatus[1].color,
    selected: true,
  },
  {
    label: jiraActionStatus[2].label,
    count: 0,
    color: jiraActionStatus[2].color,
    selected: true,
  },
  {
    label: jiraActionStatus[3].label,
    count: 0,
    color: jiraActionStatus[3].color,
    selected: true,
  },
];
export default function ActionDashboard() {
  const [jiraRows, setJiraRows] = React.useState<any>([]);
  const [displayJiraRows, setDisplayJiraRows] = React.useState<any>([]);
  const [csvData, setCsvData] = React.useState<any>([]);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [codeError, setCodeError] = React.useState('');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchedVal, setSearchedVal] = React.useState('');

  const [actionCount, setActionCount] = React.useState<any[]>(ActionCount);
  const navigate = useNavigate();

  React.useEffect(() => {
    const localActionList = localStorage.getItem('actionList');
    var tempActionList: any[] = [];
    if (
      localActionList == null ||
      localActionList == undefined ||
      localActionList == ''
    ) {
      ActionList.map(obj => {
        tempActionList.push(flattenObject(obj));
      });
      const stringifiedActionList = JSON.stringify(tempActionList);
      localStorage.setItem('actionList', stringifiedActionList);
    } else {
      tempActionList = JSON.parse(localActionList);
    }
    setJiraRows(tempActionList);
    updateJiraCount(tempActionList);
  }, []);

  const flattenObject = (ob: any) => {
    const toReturn: any = {};

    Object.keys(ob).map(i => {
      if (typeof ob[i] === 'object' && ob[i] !== null) {
        const flatObject = flattenObject(ob[i]);
        Object.keys(flatObject).map((x: any) => {
          toReturn[`${i}.${x}`] = flatObject[x];
          return x;
        });
      } else {
        toReturn[i] = ob[i];
      }
      return i;
    });
    return toReturn;
  };

  const updateJiraCount = (list: any) => {
    let countOfActions = ActionCount;
    countOfActions.map(obj => {
      obj.count = 0;
    });
    list.forEach((action: any) => {
      countOfActions.map(labelObj => {
        if (action['status'] == labelObj.label) {
          labelObj.count = labelObj.count + 1;
        }
      });
    });
    countOfActions[3].label = countOfActions[3].label;
    setActionCount([...countOfActions]);
    // updateTable(list);
  };

  React.useEffect(() => {
    const dummyJiraRows: any[] = [];
    let tempJiraRows: any = [];

    jiraRows.map((jira: any) => {
      actionCount.map((action: any) => {
        if (action.selected && jira.status == action.label) {
          dummyJiraRows.push(jira);
        }
      });
    });
    // setJiraRows([...dummyJiraRows]);
    setDisplayJiraRows([...dummyJiraRows]);
  }, [actionCount]);

  React.useEffect(() => {
    let initialData = [];
    initialData.push({ r1: 'Date : ', r2: new Date().toLocaleString() + '' });

    actionCount.forEach(action => {
      if (action.selected) {
        initialData.push({ r1: action.label, r2: action.count });
      }
    });

    initialData.push({
      teamName: 'Team',
      jiraId: 'JIRA ID',
      'action.value': 'Action',
      initialSession: 'Initial Session',
      'action.assigneeName': 'Assignee',
      startDate: 'Start Date',
      status: 'Status',
      teamId: 'Action',
    });

    displayJiraRows.forEach((element: any) => {
      initialData.push(element);
    });

    setCsvData([...initialData]);
  }, [displayJiraRows]);

  // Function to navigate on create new retro page
  function CreateNewRetro() {
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: true },
    });
    setCodeError('');
    navigate('/create/');
  }

  return (
    <>
      <Paper
        sx={{
          width: '100%',
          background: 'rgb(249 251 252)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BodySemiBoldTypography
          label="Actions"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="All Actions"
          style={{ color: commonStyles.PrimaryDark }}
        />
        {/* {React.useMemo(()=>{ */}
        <Box display="flex" flexDirection="row">
          {actionCount.map((action, index) => {
            return (
              <Box
                display="flex"
                flexDirection="column"
                key={index + 'jiraActionStatus'}
                gap="8px"
                padding="16px"
                paddingRight={'26px'}
                borderRadius="4px"
                marginRight="10px"
                marginTop="20px"
                marginBottom="20px"
                sx={{
                  background: 'white',
                  border: true
                    ? '1px solid ' + commonStyles.PrimaryLight
                    : '1px solid yellow',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => {
                  let newArrayState = actionCount;
                  newArrayState.map((ac, index1) => {
                    if (index == index1) {
                      ac.selected = !action.selected;
                    }
                  });

                  setActionCount([...newArrayState]);
                }}
              >
                <H1SemiBoldTypography
                  style={{ color: action.color }}
                  label="-"
                />
                <Checkbox
                  checked={false}
                  size="small"
                  sx={{ position: 'absolute', zIndex: 2, right: '0px', top: 0 }}
                />
                <BodyRegularTypography
                  style={{ color: action.color }}
                  label={action.label}
                />
              </Box>
            );
          })}
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            sx={{ marginBottom: '10px', background: 'white', width: '450px' }}
            onChange={e => setSearchedVal(e.target.value)}
            value={searchedVal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon width="20px" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box
          sx={{
            height: 'calc(100% - 280px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img src="/svgs/emptyActions.svg" width={300} height={350} />
          <H2SemiBoldTypography
            label="No Action to display"
            style={{ color: '#2C69A1' }}
          />
          <ContainedButtonWithIcon
            id={'create_new__retro_button_desktop'}
            label={'New Session'}
            size={'medium'}
            iconPath="/svgs/plusSmall.svg"
            style={{ width: '260px', marginTop: '40px', textAlign: 'center' }}
            onClick={() => CreateNewRetro()}
          />
        </Box>
      </Paper>
    </>
  );
}
