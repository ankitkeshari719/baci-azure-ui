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
} from '../../components/CustomizedTypography';
import { useNavigate } from 'react-router-dom';
import { ContainedButton } from '../../components';
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
      cardDesc:
        'Analytics - Team Level - Count of actions (assigned vs completed)',
      link: 'teamLevelActionsCount',
    },
    {
      id: 2,
      cardDesc:
        'Analytics 2 - Enterprise Level - Count of actions (assigned vs completed) all teams',
      link: 'enterpriseLevelActionsCount',
    },
    {
      id: 3,
      cardDesc:
        'Analytics 3 - Enterprise Level - Count of all participants over time',
      link: 'enterpriseLevelParticipantsCount',
    },
    {
      id: 4,
      cardDesc:
        'Analytics 4 - Enterprise Level - Count of all retros over time',
      link: 'enterpriseLevelRetrosCount',
    },
    {
      id: 5,
      cardDesc:
        'Analytics 5 - Enterprise Level - Sentiments - Overall Summary Paragraph and Word Cloud',
      link: 'enterpriseLevelSentimentsSummary',
    },
    {
      id: 6,
      cardDesc:
        'Analytics 6 - Enterprise Level - Sentiments - Key Themes Heatmap',
      link: 'enterpriseLevelSentimentsThemes',
    },
    {
      id: 7,
      cardDesc: 'Analytics 7 - Enterprise Level - Sentiments - Moods',
      link: 'enterpriseLevelSentimentsMoods',
    },
  ];

  return (
    <Box sx={{ overflowY: 'auto' }} height="calc(var(--app-height))">
      <Box sx={{ margin: '48px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <H1RegularTypography label="Analytics" />
        </Box>
        {/* Back Button */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <ContainedButton
            id="go_back_to_analytics"
            name="Back"
            onClick={() => navigate(`/board/${retroId}/`)}
            size={'small'}
          />
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
                      image="/images/analyticCardImage.png"
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
