import React, { useState } from 'react';
import {
  chartInputType,
  formatDateForAPI,
  getEnterpriseLevelSentimentSummary,
  getOverAllSummary,
  getParticipantsCount,
  getRetrosCount,
} from '../../helpers/msal/services';

import {
  Box,
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
  const [selectedFormat, setSelectedFormat] = useState<string>('17');
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

  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      setPath('basic');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      setPath('enterprise');
    }
  }, [tempLocalUserData]);

  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetParticipantChartData();
    handleGetRetroChartData();
  }, []);

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentSummary(selectedFormat);
  }, []);

  React.useEffect(() => {
    if (Number(selectedFormat) > 0 && Number(selectedFormat) <= 16) {
      setFromDate(selectedFormat);
      setToDate(selectedFormat);
    } else if (Number(selectedFormat) == 17) {
      setFromDate('14');
      setToDate('16');
    } else if (Number(selectedFormat) == 18) {
      setFromDate('11');
      setToDate('16');
    } else if (Number(selectedFormat) == 19) {
      setFromDate('5');
      setToDate('16');
    }
  }, [selectedFormat]);

  // Function to Generate Random number
  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const generateSummary = () => {
    handleGetEnterpriseLevelSentimentSummary(selectedFormat);
    handleGetParticipantChartData();
    handleGetRetroChartData();
  };

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentSummary(selectedFormat);
    handleGetParticipantChartData();
    handleGetRetroChartData();
  }, [team]);

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

  const handleGetEnterpriseLevelSentimentSummary = async (
    selectedFormat: string
  ) => {
    const chartInput: chartInputType = {
      userId: 'vishal.gawande@evoltech.com.au',
      roleName: 'Enterprise',
      enterpriseId: 'evoltech0.0751886606959975',
      teamId: '0',
      fromDate: formatDateForAPI(fromDate),
      toDate: formatDateForAPI(toDate),
    };

    await getOverAllSummary(chartInput).then(res => {
      console.log(res, 'summary');
      setSummary(res.data.summary);
      let tempKeywords: any[] = [];
      const keywordsData=res.data.keywords?res.data.keywords:[];
console.log(keywordsData,"keywordsData")
      keywordsData.forEach((item: any) => {
        console.log(item)
        tempKeywords.push({
          text: item,
          size: randomIntFromInterval(45, 120),
        });
      });
      setKeywords(tempKeywords);
    });

    // await getEnterpriseLevelSentimentSummary(selectedFormat, team).then(
    //   res => {
    //     if (res && res.result) {
    //       const keywordsData = res.result[0].keywords;
    //       setSummary(res.result[0] && res.result[0].summary);
    //       let tempKeywords = [];
    //       for (let i = 0; i < keywordsData.length; i++) {
    //         tempKeywords.push({
    //           text: keywordsData[i],
    //           size: randomIntFromInterval(45, 120),
    //         });
    //       }
    //       setKeywords(tempKeywords);
    //     }
    //   },
    //   err => {
    //     console.log('err', err);
    //   }
    // );
  };

  const handleGetParticipantChartData = async () => {
    await getParticipantsCount('10', '16', team).then(
      res => {
        if (res && res.result) {
          let temp = 0;
          for (let i = 0; i < res.result.length; i++) {
            temp = temp + res.result[i].averageParticipants;
          }
          setTotalParticipant(temp);
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const handleGetRetroChartData = async () => {
    await getRetrosCount('10', '16', team).then(
      res => {
        if (res && res.result) {
          let temp = 0;
          for (let i = 0; i < res.result.length; i++) {
            temp = temp + res.result[i].averageRetros;
          }
          setTotalRetros(temp);
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const handleSelectedFormat = (event: SelectChangeEvent) => {
    setSelectedFormat(event.target.value as string);
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
          <WordCloud data={keywords} showOn="summaryCloud"></WordCloud>
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
          {/* Word Cloud */}
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
        </Grid>
      )}
    </>
  );
}
