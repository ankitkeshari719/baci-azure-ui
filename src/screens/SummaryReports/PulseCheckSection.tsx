import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import './styles.scss';
import '../../global.scss';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Question } from '../../components/Elements/PulseCheckChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  scales: {
    x: {
      position: 'top' as const,
      min: 0,
      max: 100,
      title: {
        display: true,
        text: '% Response',
        color: '#343434',
        padding: 20,
        font: {
          family: 'Poppins',
          styles: 'normal',
          weight: '400',
          size: 16,
          lineHeight: '20px',
        },
      },
      ticks: {
        stepSize: 10,
        color: '#808080',
        font: {
          family: 'Poppins',
          styles: 'normal',
          weight: '400',
          size: 14,
          lineHeight: '0.4px',
        },
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        display: false,
        drawOnChartArea: false,
        drawTicks: true,
      },
      ticks: {
        color: '#343434',
        padding: 25,
        font: {
          family: 'Poppins',
          styles: 'normal',
          weight: '400',
          size: 14,
          lineHeight: '20px',
        },
      },
    },
  },
  elements: {
    bar: {},
  },
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        font: {
          weight: '400',
          size: 16,
          family: 'Poppins',
          lineHeight: '20px',
        },
      },
      callbacks: function (label: any, index: any, labels: any) {
        console.log(label, index, labels);
      },
    },
    tooltip: {
      enabled: false,
    },
  },
};

type Props = {
  questions: Question[];
  barData: { 1: any; 2: any; 3: any }[];
  questionOneResponse: number | undefined;
  questionTwoResponse: number | undefined;
  questionThreeResponse: number | undefined;
};

export default function PulseCheckSection({
  questions,
  barData,
  questionOneResponse,
  questionTwoResponse,
  questionThreeResponse,
}: Props) {
  const labelOne = ['People & Resources ', questionOneResponse + ' Responses'];
  const labelTwo = ['Work Processes ', questionTwoResponse + ' Responses'];
  const labelThree = ['Technical Tools ', questionThreeResponse + ' Responses'];
  const labels = [labelOne, labelTwo, labelThree];

  return (
    <Box>
      {/* Pulse Check Section 1*/}
      <Row style={{ marginTop: '36px' }}>
        <Col
          xs="12"
          className="d-flex justify-content-start align-items-center"
        >
          <Typography className="textTypeFour">
            Participant’s Pulse Check Report
          </Typography>
        </Col>
      </Row>
      {/* Pulse Check Section 2*/}
      <Row style={{ marginTop: '16px' }}>
        {questions.length !== 0 ? (
          <Col
            xs="8"
            className="d-flex justify-content-start align-items-center"
            id="pulse-check-chart"
          >
            <Bar
              style={{
                height: '380px',
                border: 'none',
              }}
              options={options}
              data={{
                labels: labels, // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                datasets: [
                  {
                    data: barData[2],
                    label: 'Satisfied',
                    backgroundColor: '#84CA97',
                  },
                  {
                    data: barData[1],
                    label: 'Neutral',
                    backgroundColor: '#FBBC05',
                  },
                  {
                    data: barData[0],
                    label: 'Concerned',
                    backgroundColor: '#F28D85',
                  },
                ],
              }}
            ></Bar>
          </Col>
        ) : (
          <>
            <Col
              xs="12"
              className="d-flex justify-content-start align-items-center"
              id="pulse-check-not-data"
            >
              <Box
                sx={{
                  width: '100%',
                  height: '240px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  background: '#FAFAFA',
                  border: '1px solid #CCCCCC',
                }}
              >
                <Box component="div">
                  <img src="/svgs/LineChart.svg" />
                </Box>
                <Box
                  component="div"
                  sx={{ textAlign: 'justify', marginTop: '16px' }}
                >
                  <Typography className="text1">
                    Sorry, Pulse Check was not selected
                  </Typography>
                </Box>
                <Box
                  component="div"
                  sx={{
                    width: '40%',
                    textAlign: 'justify',
                    marginTop: '16px',
                  }}
                >
                  <Typography>
                    Pulse Check helps the team to quickly understand their
                    feelings about work. Conducting it consistently will help
                    the team to track progress and also to compare & contrast
                    against BACI retro outcomes.
                  </Typography>
                </Box>
              </Box>
            </Col>
            <Box
              id="pulse-check-not-data-print"
              sx={{ display: 'none !important' }}
            >
              <Col
                xs="12"
                className="d-flex justify-content-start align-items-center"
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '300px',
                    minHeight: '300px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    background: '#FAFAFA',
                    border: '1px solid #CCCCCC',
                  }}
                >
                  <Box component="div">
                    <img src="/svgs/LineChart.svg" />
                  </Box>
                  <Box
                    component="div"
                    sx={{ textAlign: 'justify', marginTop: '16px' }}
                  >
                    <Typography className="text1">
                      Sorry, Pulse Check was not selected
                    </Typography>
                  </Box>
                  <Box
                    component="div"
                    sx={{
                      width: '40%',
                      textAlign: 'justify',
                      marginTop: '16px',
                    }}
                  >
                    <Typography>
                      Pulse Check helps the team to quickly understand their
                      feelings about work. Conducting it consistently will help
                      the team to track progress and also to compare & contrast
                      against BACI retro outcomes.
                    </Typography>
                  </Box>
                </Box>
              </Col>
            </Box>
          </>
        )}
      </Row>
    </Box>
  );
}
