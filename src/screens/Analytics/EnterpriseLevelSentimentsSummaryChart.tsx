import React, { useState } from 'react';
import {
  chartInputType,
  formatDateForAPI,
  getCountOfAllParticipantsOverTime,
  getEnterpriseLevelSentimentSummary,
  getOverAllSummary,
  getParticipantsCount,
  getRetrosCount,
} from '../../helpers/msal/services';

import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  BodyRegularTypography,
  ButtonLabelTypography,
  H2SemiBoldTypography,
  H4SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import WordCloud from '../../components/Elements/WordCloud';
import { MenuProps, SELECTED_FORMATS } from './const';
import { OutlinedButton } from '../../components';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';
import DateSelector from '../../components/Elements/EnterpriseDashboardPages/DateSelector';

export interface Word {
  text: string;
  size: number;
}

export default function EnterpriseLevelSentimentsSummaryChart({
  dashboard,
  team,
}: {
  dashboard?: boolean;
  team: string;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [summary, setSummary] = useState<string>();
  const [keywords, setKeywords] = useState<Word[]>([]);
  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate
      ? global.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate
      ? global.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );
  const [totalParticipant, setTotalParticipant] = useState<Number>();
  const [totalRetros, setTotalRetros] = useState<Number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (global.azureUser?.roleName && global.azureUser?.roleName === BASIC) {
      setPath('basic');
    } else if (
      global.azureUser?.roleName &&
      global.azureUser?.roleName === ENTERPRISE
    ) {
      setPath('enterprise');
    }
  }, [global.azureUser?.roleName]);

  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentSummary();
  }, []);

  // Function to Generate Random number
  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const generateSummary = () => {
    handleGetEnterpriseLevelSentimentSummary();
    // handleGetRetroChartData();
  };

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentSummary();
    // handleGetParticipantChartData();
    // handleGetRetroChartData();
  }, [global.teamId]);

  React.useEffect(() => {
    const fromDateInput = global.chartStartDate;
    const toDateInput = global.chartEndDate;
    if (
      fromDateInput != '' &&
      fromDateInput != undefined &&
      fromDateInput != null
    ) {
      setFromDate(fromDateInput);
      generateSummary();
    }
    if (toDateInput != '' && toDateInput != undefined && toDateInput != null) {
      setToDate(toDateInput);
      generateSummary();
    }
  }, [global.chartStartDate, global.chartEndDate]);

  const handleGetEnterpriseLevelSentimentSummary = async () => {
    setLoading(true);
    setTotalRetros(0);
    setTotalParticipant(0);
    if (global.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: global.azureUser?.emailId,
        roleName: global.azureUser?.roleName,
        enterpriseId: global.azureUser?.enterpriseId,
        teamId: global.teamId ? global.teamId : '0',
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate,true),
      };

      await getOverAllSummary(chartInput).then(res => {
        setSummary(res.data.summary);
        let tempKeywords: any[] = [];
        const keywordsData = res.data.keywords ? res.data.keywords : [];
        keywordsData.forEach((item: any) => {
          tempKeywords.push({
            text: item,
            size: randomIntFromInterval(45, 120),
          });
        });
        setKeywords(tempKeywords);
      });

      await getCountOfAllParticipantsOverTime(chartInput).then(
        res => {
          setLoading(false);
          var totalParticipants = 0;
          var totalRetros = 0;
          res.data.forEach((item: any) => {
            totalParticipants = item.userCount + totalParticipants;
            totalRetros = totalRetros + item.retros?.length;
          });
          setTotalRetros(totalRetros);
          setTotalParticipant(totalParticipants);
        },
        err => {
          console.log(err);
          setLoading(false);
        }
      );
    }
  };

  const handleFromDate = (event: SelectChangeEvent) => {
    setFromDate(event.target.value as string);
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
  };

  return (
    <>
      {dashboard ? (
        <Box
          width="518px"
          height="335px"
          alignItems="center"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
         {loading? <CircularProgress /> :<WordCloud data={keywords} showOn="summaryCloud"></WordCloud>} 
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ padding: '48px', overflowY: 'auto' }}>
          {/* Route Path */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: '20px !important',
            }}
          >
            <Link to={path + '/analytics/'}>Analytics </Link>&nbsp;\ Count
            Overall summary
          </Grid>
          {/* Back Button & Chart Title */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              height: '30px !important',
            }}
          >
            <Icons.ArrowCircleLeftOutline
              size={32}
              style={{
                cursor: 'pointer',
                color: '#159ADD',
              }}
              onClick={() => navigate(-1)}
            />
            <H2SemiBoldTypography
              label="Overall summary paragraph and word cloud"
              style={{ color: '#2C69A1', marginLeft: '16px' }}
            />
          </Grid>
          <Grid item xs={12}></Grid>
          {/* Selector and Words */}
          <Grid
            item
            xs={4}
            sx={{
              padding: '0px !important',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              flexDirection: 'column',
            }}
          >
            {/* Words */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <BodyRegularTypography
                label="Sentiment Report Name"
                style={{ color: '#343434' }}
              />
              <H4SemiBoldTypography
                label="Retro Sentiments for OrgGX"
                style={{ color: '#343434' }}
              />
            </Box>
            {/* Selector Menu */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                marginTop: '48px',
              }}
            >
              <ButtonLabelTypography label="Summary of" />
              {/* Selector Menu */}
              <DateSelector
                fromDate={fromDate}
                toDate={toDate}
                handleFromDate={handleFromDate}
                handleToDate={handleToDate}
                disable={true}
              />
            </Box>
            {/* Generate Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                marginTop: '24px',
              }}
            >
              <OutlinedButton
                id="generate_summary"
                label="Generate"
                size={'medium'}
                onClick={() => generateSummary()}
                style={{
                  minWidth: '172px !important',
                  width: '172px !important',
                  height: '40px !important',
                }}
              />
            </Box>
            {/* No. of sessions */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                marginTop: '48px',
              }}
            >
              <BodyRegularTypography
                label="No. of sessions"
                style={{ color: '#343434' }}
              />
              <H4SemiBoldTypography
                label={totalRetros?.toString()}
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            {/* No. of Participants */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                marginTop: '48px',
              }}
            >
              <BodyRegularTypography
                label="No. of Participants"
                style={{ color: '#343434' }}
              />
              <H4SemiBoldTypography
                label={totalParticipant?.toString()}
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
          </Grid>
          {/* Summary */}
          {loading ? (
            <Grid
              item
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              xs={5}
            >
              <CircularProgress />
            </Grid>
          ) : (
            <Grid
              item
              xs={5}
              sx={{
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                paddingRight: '48px !important',
                paddingLeft: '0px !important',
                paddingTop: '0px !important',
                paddingBottom: '0px !important',
              }}
            >
              <H4SemiBoldTypography
                label="Summary"
                style={{ color: '#343434' }}
              />
              <BodyRegularTypography
                label={summary}
                style={{ color: '#111111', marginTop: '24px' }}
              />
            </Grid>
          )}
          {/* Word Cloud */}
          {loading ? (
             <Grid
             item
             sx={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
             }}
             xs={3}
           >
           <CircularProgress /></Grid>
          ) : (
            <Grid
              item
              xs={3}
              sx={{
                padding: '0px !important',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                background: 'rgba(0, 0, 0, 0.04)',
              }}
            >
              <WordCloud data={keywords} showOn="summaryCloud"></WordCloud>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
