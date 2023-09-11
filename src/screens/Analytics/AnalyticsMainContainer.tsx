import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';
import {
  CaptionRegularTypography,
  H1RegularTypography,
  BodySemiBoldTypography,
} from '../../components/CustomizedTypography';
import { useNavigate } from 'react-router-dom';
import { BoardContext } from '../../contexts/BoardContext';

export default function AnalyticsMainContainer() {
  const navigate = useNavigate();
  const {
    state: { retroId },
    commitAction,
  } = React.useContext(BoardContext);

  const handleOnClick = (link: string) => {
    navigate(link);
  };

  const analyticsCards = [
    {
      id: 1,
      cardDesc: 'Count of Team Actions (Assigned vs Completed)',
      link: 'teamLevelActionsCountLearnMore',
      image: '/svgs/Analytics_Images_1.svg',
    },
    {
      id: 2,
      cardDesc: 'Count of All Actions (Assigned vs Completed)',
      link: 'enterpriseLevelActionsCountLearnMore',
      image: '/svgs/Analytics_Images_2.svg',
    },
    {
      id: 3,
      cardDesc: 'Count of All Participants',
      link: 'enterpriseLevelParticipantsCountLearnMore',
      image: '/svgs/Analytics_Images_3.svg',
    },
    {
      id: 4,
      cardDesc: 'Count of All Sessions',
      link: 'enterpriseLevelRetrosCountLearnMore',
      image: '/svgs/Analytics_Images_4.svg',
    },
    {
      id: 5,
      cardDesc: 'Overall Summary - Paragraph and Word Cloud',
      link: 'enterpriseLevelSentimentsSummaryLearnMore',
      image: '/svgs/Analytics_Images_5.svg',
    },
    {
      id: 6,
      cardDesc: 'Sentiments - Key Themes Heatmap',
      link: 'enterpriseLevelSentimentsThemesLearnMore',
      image: '/svgs/Analytics_Images_6.svg',
    },
    {
      id: 7,
      cardDesc: 'Sentiments - Mood',
      link: 'enterpriseLevelSentimentsMoodsLearnMore',
      image: '/svgs/Analytics_Images_7.svg',
    },
  ];

  return (
    <Box
      sx={{ overflowY: 'auto' }}
      height="calc(var(--app-height))"
      width="100%"
    >
      <Box sx={{ margin: '20px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'start',
            justifyContent: 'start',
            flexDirection: 'column',
          }}
        >
          <BodySemiBoldTypography
            label="Analytics"
            style={{ marginBottom: '10px' }}
          />
          <H1RegularTypography label="Analytics" style={{ color: '#2C69A1' }} />
        </Box>
        <Grid container spacing={2} sx={{ marginTop: '48px' }}>
          {analyticsCards.map(analyticsCard => {
            return (
              <Grid item xs={12} md={4} lg={3} key={analyticsCard.id}>
                <Card
                  sx={{
                    maxWidth: 400,
                    minHeight: 315,
                    borderRadius: '8px',
                    padding: '8px',
                    bgcolor: '#FFFFFF',
                    border: '2px solid #AAAAAA ',
                  }}
                  onClick={() => handleOnClick(analyticsCard.link)}
                >
                  <CardActionArea>
                    <CardMedia
                      sx={{ objectFit: 'contain !important' }}
                      component="img"
                      height="140"
                      image={analyticsCard.image}
                      alt="green iguana"
                    />
                    <CardContent>
                      <ul>
                        <li>
                          <CaptionRegularTypography
                            label={analyticsCard.cardDesc}
                          />
                        </li>
                      </ul>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
