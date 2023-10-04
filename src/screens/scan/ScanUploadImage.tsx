import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CardActionArea,
  Switch,
  Avatar,
} from '@mui/material';
import { TopBar } from '../CreateRetro/TopBar';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import '../../global.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ToggleButton from '@mui/material/ToggleButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import Checkbox from '@mui/material/Checkbox';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export function ScanUploadImage() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState<string[]>([]);
  const [isSelected, setIsSelected] = useState(false);
  const [isLeftGridExpanded, setIsLeftGridExpanded] = useState(true);
  const [isGroupView, setIsGroupView] = useState(false);

  const handleCheckboxChange = () => {
    setIsSelected(!isSelected);
  };

  useEffect(() => {
    const storedImage = localStorage.getItem('uploadedImage') ?? null;
    if (typeof storedImage === 'string') {
      setImage(storedImage);
    }

    const storedDataJson = localStorage.getItem('myData');
    if (storedDataJson) {
      const storedDataArray = JSON.parse(storedDataJson);
      setRecognizedText(storedDataArray);
    }
  }, []);

  const handleToggleLeftGrid = () => {
    setIsLeftGridExpanded(!isLeftGridExpanded);
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string
  ) => {
    if (newView) {
      setIsGroupView(newView === 'group');
    }
  };

  return (
    <>
      <Box className="mainContainer" sx={{ overflowY: 'auto' }}>
        <DeploymentPopUp />
        <TopBar />

        <Typography
          variant="h4"
          style={{ textAlign: 'left', marginTop: '16px' }}
        >
          <Button
            onClick={handleToggleLeftGrid}
            style={{
              borderColor: '#159ADD',
              color: '#159ADD',
              borderRadius: '24px',
              margin: '16px',
              border: '1px solid #159ADD',
              height: '40px',
              padding: '12px 16px',
            }}
          >
            {isLeftGridExpanded ? (
              <>
                <ChevronLeftIcon />
                Collapse Image
              </>
            ) : (
              <>
                Expand Image
                <ChevronRightIcon />
              </>
            )}
          </Button>
          {isLeftGridExpanded ? 'Summarized Cards' : 'Summarized Cards'}
        </Typography>

        <Grid container spacing={2}>
          {isLeftGridExpanded && (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Paper
                style={{
                  height: '100%',
                  padding: '16px',
                  borderColor: '#159ADD',
                  borderRadius: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    height: '330px',
                    marginTop: '10px',
                    marginLeft: '14px',
                    borderRadius: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: 'black',
                    padding: '5px',
                  }}
                >
                  {image && (
                    <img
                      src={image}
                      alt="Stored"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                      }}
                    />
                  )}
                </div>
              </Paper>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={isLeftGridExpanded ? 6 : 9}>
            <div
              className="middle-grid-container"
              style={{
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 160px)', // Adjusted to account for the bottom fixed area
                flex: 1,
                display: 'flex',
                flexWrap: 'wrap',
                paddingBottom: '80px', // Added space for the bottom fixed area
              }}
            >
              <div
                className="middle-grid-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: 'white',
                  position: 'sticky',
                  top: '0',
                  zIndex: '1',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DeleteIcon style={{ color: '#159ADD' }} />
                  <span style={{ color: '#159ADD', marginLeft: '4px' }}>
                    Remove Selected
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: '#159ADD', marginLeft: '220px' }}>
                    Group View
                  </span>
                  <Switch
                    checked={isGroupView}
                    onChange={() => setIsGroupView(!isGroupView)}
                    color="primary"
                  />
                  <FilterListIcon
                    style={{ color: '#159ADD', marginLeft: '16px' }}
                  />
                </div>
              </div>
              {recognizedText &&
                recognizedText.map((text, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: isGroupView ? '50%' : '100%',
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={handleCheckboxChange}
                      inputProps={{ 'aria-label': 'select card' }}
                    />
                    <Card style={{ width: '100%', marginBottom: '16px' }}>
                      <CardActionArea>
                        <CardContent>{text}</CardContent>
                      </CardActionArea>
                      <CardActions
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            alt="User Avatar"
                            src="/user_avatar.jpg"
                            sx={{ width: 24, height: 24, marginRight: 8 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton aria-label="edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton aria-label="options">
                            <MoreVertIcon />
                          </IconButton>
                        </div>
                      </CardActions>
                    </Card>
                  </div>
                ))}
            </div>
            <div
              className="bottom-fixed-area"
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'sticky',
                bottom: 0,
                zIndex: 1,
                backgroundColor: 'white',
                padding: '16px',
              }}
            >
              <Button style={{ marginRight: '16px', color: '#EA4335' }}>
                Cancel
              </Button>
              <Button style={{ color: '#159ADD' }}>Save</Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Paper
              style={{
                height: '100%',
                padding: '16px',
                borderColor: '#159ADD',
                borderRadius: '10px',
              }}
            >
              <Typography
                variant="h5"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Summary</span>
                <div>
                  <IconButton style={{ color: '#159ADD' }} aria-label="copy">
                    <AssignmentIcon />
                  </IconButton>
                  <IconButton style={{ color: '#159ADD' }} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </div>
              </Typography>
              <div
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: '16px',
                }}
              >
                <Typography variant="body2">
                  <p>(Content shown is dummy summary)</p> Lorem ipsum dolor sit
                  amet, consectetur adipiscing elit. Suspendisse efficitur lacus
                  a tellus convallis tincidunt. Proin ultrices iaculis metus,
                  vel imperdiet tellus venenatis eget. Morbi vitae venenatis
                  nulla. Suspendisse potenti. Nam nibh eros, maximus quis
                  suscipit vel, consectetur vel nisi. Ut a ultricies tortor.
                  Mauris rhoncus diam sit amet rutrum dapibus. Morbi ac vehicula
                  tellus. Mauris congue, enim eu porttitor blandit, odio leo
                  mattis libero, eu sagittis odio ligula vitae tortor. Sed
                  blandit, urna ut auctor rutrum, odio quam efficitur sapien, in
                  eleifend eros mauris et orci. Suspendisse libero dolor,
                  volutpat nec neque id, tempus condimentum ipsum. Quisque ut
                  nisl quam. Maecenas at laoreet urna. Duis vel turpis
                  facilisis, pellentesque eros quis, imperdiet elit. Phasellus
                  in libero sed nunc porta sodales vel ac sapien. Vivamus ex
                  urna, consequat at lorem eget, ultricies suscipit ex.
                </Typography>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
