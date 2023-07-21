import React, { useState } from 'react';
import {
  getEnterpriseLevelSentimentSummary,
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
  const [summary, setSummary] = useState<string>();
  const [keywords, setKeywords] = useState<Word[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('17');
  const [fromDate, setFromDate] = useState<string>('14');
  const [toDate, setToDate] = useState<string>('16');
  const [totalParticipant, setTotalParticipant] = useState<Number>();
  const [totalRetros, setTotalRetros] = useState<Number>();

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

  const handleGetEnterpriseLevelSentimentSummary = async (
    selectedFormat: string
  ) => {
    await getEnterpriseLevelSentimentSummary(selectedFormat, team).then(
      res => {
        if (res && res.result) {
          const keywordsData = res.result[0].keywords;
          setSummary(res.result[0] && res.result[0].summary);
          let tempKeywords = [];
          for (let i = 0; i < keywordsData.length; i++) {
            tempKeywords.push({
              text: keywordsData[i],
              size: randomIntFromInterval(15, 30),
            });
          }
          setKeywords(tempKeywords);
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const handleGetParticipantChartData = async () => {
    await getParticipantsCount(fromDate, toDate, team).then(
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
    await getRetrosCount(fromDate, toDate, team).then(
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

  return (
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
        <Link to={'/facilitator/analytics/'}>Analytics </Link>&nbsp;\ Overall
        summary
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
          <FormControl fullWidth>
            <Select
              sx={{
                fieldset: {
                  border: 'none',
                  opacity: 1,
                  color: '#4E4E4E',
                },
              }}
              labelId="from-Date"
              id="from_date"
              value={selectedFormat}
              label="From"
              onChange={handleSelectedFormat}
              IconComponent={props => (
                <Icons.ChevronDownOutline
                  size={24}
                  color="#4E4E4E"
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: 'calc(50% - 0.8em)',
                  }}
                  {...props}
                />
              )}
              MenuProps={MenuProps}
            >
              {SELECTED_FORMATS.map(month_selector => {
                return (
                  <MenuItem value={month_selector.id} key={month_selector.id}>
                    {month_selector.month}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
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
        <H4SemiBoldTypography label="Summary" style={{ color: '#343434' }} />
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
  );
}
