import React, { useState } from 'react';
import { getEnterpriseLevelSentimentSummary } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
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
  const [selectedFormat, setSelectedFormat] = useState<string>('1');
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentSummary(selectedFormat);
  }, []);

  // Function to Generate Random number
  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

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
              size: randomIntFromInterval(1, 4),
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
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Link to={'/facilitator/analytics/'}>Analytics </Link>&nbsp;\ Overall
        Summary
      </Grid>
      {/* Back Button & Chart Title */}
      <Grid
        item
        xs={12}
        sx={{
          padding: '0px !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: '24px',
        }}
      >
        <Icons.ArrowCircleLeftOutline
          size={32}
          style={{
            cursor: 'pointer',
            color: '#159ADD',
          }}
          onClick={() => navigate('/facilitator/analytics/')}
        />
        <H2SemiBoldTypography
          label="Overall summary paragraph and word cloud"
          style={{ color: '#2C69A1', marginLeft: '16px' }}
        />
      </Grid>
      {/* Selector and Words */}
      <Grid
        item
        xs={3}
        sx={{
          padding: '0px !important',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          marginTop: '24px',
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
            marginTop: '96px',
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
            onClick={() =>
              handleGetEnterpriseLevelSentimentSummary(selectedFormat)
            }
            style={{
              minWidth: '172px !important',
              width: '172px !important',
              height: '40px !important',
            }}
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
          marginTop: '24px',
          paddingRight: '48px !important',
          paddingLeft: '48px !important',
          paddingTop: '0px !important',
          paddingBottom: '0px !important',
        }}
      >
        <H4SemiBoldTypography label="Summary" style={{ color: '#343434' }} />
        <BodyRegularTypography
          label={summary}
          style={{ color: '#111111', textAlign: 'justify', marginTop: '24px' }}
        />
      </Grid>
      {/* Word Cloud */}
      <Grid
        item
        xs={4}
        sx={{
          padding: '0px !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: '24px',
          background: 'rgba(0, 0, 0, 0.04)',
        }}
      >
        <WordCloud data={keywords} showOn="whatDidntWentWell"></WordCloud>
      </Grid>
    </Grid>
  );
}
