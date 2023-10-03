import * as React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { TopBar } from '../CreateRetro/TopBar';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import '../../global.scss';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
} from '@mui/material';
import { ScanUploadImage } from '../scan/ScanUploadImage';
type Props = {
  handleStartRetro: () => void;
  isRetroStart: boolean;
};

interface ApiResponse {
  status: string; // Add this line to define the 'status' property
  analyzeResult: {
    readResults: { lines: Line[] }[];
  };
}

interface Line {
  boundingBox: number[];
  text: string;
}

export function UploadImageScan() {
  const [isRetroStart, setIsRetroStart] = React.useState<boolean>(false);
  const [isUploaded, setIsUploaded] = React.useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const navigate = useNavigate();
  const [image, setImage] = React.useState<string | null>(null);
  const [fileData, setFileData] = React.useState<Blob | null>(null);
  const [recognizedText, setRecognizedText] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  function handleStartRetro() {
    setIsRetroStart(true);
  }

  const navigateToScan = () => {
    navigate('/basic/scan/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          // Save the base64 representation of the image in localStorage
          localStorage.setItem('uploadedImage', base64String);
          setImage(base64String);
          setIsUploaded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const ruleList = [
    {
      id: '1',
      title: 'Upload Your Document or Scan it',
      description:
        'Just take a picture of your board, sticky note or paper. Upload it and lets us do the work to digitise and analyse',
    },
    {
      id: '2',
      title: 'Select, Edit or Delete',
      description:
        'Our AI can help you automatically summarise, group cards, and create a summary report',
    },
    {
      id: '3',
      title: 'Share it or Save it',
      description: 'Once your summary is generated, share or save your report',
    },
  ];

  const recognizeHandwrittenText = async () => {
    if (!selectedFile) {
      alert('Please select an image.');
      return;
    }
    console.log('selected file', selectedFile);
    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://baciazureai.cognitiveservices.azure.com/vision/v3.2/read/analyze',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Ocp-Apim-Subscription-Key': '104af6e8b86c44b0830453ed747a8beb', // Replace with your Azure API key
          },
        }
      );

      if (response.status === 202) {
        const operationUrl = response.headers.get('operation-location');
        if (operationUrl) {
          await waitForOperationToComplete(operationUrl);
        } else {
          console.error('Operation location not found in headers');
        }
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error recognizing text:', error);
    }
  };

  const waitForOperationToComplete = async (operationUrl: string) => {
    let operationStatus = 'running';

    while (operationStatus === 'running') {
      try {
        const operationResponse = await fetch(operationUrl, {
          headers: {
            'Ocp-Apim-Subscription-Key': '104af6e8b86c44b0830453ed747a8beb',
          },
        });

        if (operationResponse.status === 200) {
          const responseData: ApiResponse = await operationResponse.json();
          console.log('Status:', responseData.status);

          if (responseData.status === 'succeeded') {
            //const data = transformData(responseData.analyzeResult.readResults[0].lines);
            const data: string[] = transformData(
              responseData.analyzeResult.readResults[0].lines
            );
            console.log('Data:', data);
            // Convert the array to a JSON string
            const dataJson = JSON.stringify(data);

            // Save it to local storage
            localStorage.setItem('myData', dataJson);
            setRecognizedText(data);
            setIsLoading(false);
            navigateToScan();
            return data;
          } else if (responseData.status === 'failed') {
            // The operation has failed, handle the error
            throw new Error('Recognition operation failed');
          } else {
            // Wait for a while before checking the status again (e.g., every few seconds)
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } else {
          throw new Error(
            'Error checking operation status. HTTP status: ' +
              operationResponse.status
          );
        }
      } catch (error) {
        console.error('Error checking operation status:', error);
        throw error;
      }
    }
  };

  const transformData = (apiData: Line[]) => {
    console.log('apiData', apiData);
    const store: { [key: string]: string } = {};

    for (let i = 0; i < apiData.length; i++) {
      const item = apiData[i];
      const [dx1, dy1, dx2, dy2, dx3, dy3, dx4, dy4] = item.boundingBox;

      const height = Math.round((dy4 - dy1) * 1.2);
      const identity = `${dx1 - height}/${dx2}/${dy3 + height}/${dy4 + height}`;

      let isPresent = false;
      const preDefinedKeys = Object.keys(store);

      for (let j = 0; j < preDefinedKeys.length; j++) {
        const subItem = preDefinedKeys[j];
        const [subVal1, subVal2, subVal3, subVal4] = subItem
          .split('/')
          .map(el => Number(el));

        if (dx1 > subVal1 && dx1 < subVal2) {
          if (dy1 < subVal3 || dy2 < subVal4) {
            const tempText = store[subItem];
            delete store[subItem];
            store[identity] = tempText + ' ' + item.text;
            isPresent = true;
            break;
          }
        }
      }

      if (!isPresent) {
        store[identity] = item.text;
      }
    }

    console.log('store', store);
    return Object.values(store);
  };

  return (
    <>
      <Box className="mainContainer" sx={{ overflowY: 'auto' }}>
        <DeploymentPopUp />
        <TopBar />

        <Grid
          container
          spacing={0}
          sx={{ height: 'calc(100vh - 64px) !important' }}
          style={{ padding: '10px', paddingTop: '30px' }}
        >
          {isUploaded ? (
            <>
              <Grid item xs={12} md={6}>
                <Box
                  component="div"
                  whiteSpace="normal"
                  style={{ fontSize: '32px', marginLeft: '14px' }}
                >
                  Upload Image or Photo
                </Box>

                <div
                  style={{
                    display: 'flex',
                    height: '330px',
                    width: 'auto',
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
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      {image && (
                        <img src={image} alt="Stored" height="325px" />
                      )}
                    </>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    justifyItems: 'center',
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: '#159ADD',
                      borderRadius: '24px',
                      width: '120px',
                      alignItems: 'center',
                      color: 'white',
                      marginTop: '10px',
                    }}
                    onClick={recognizeHandwrittenText}
                  >
                    <RotateRightIcon />
                    Scan
                  </Button>
                </div>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6}>
                <Box
                  component="div"
                  whiteSpace="normal"
                  style={{ fontSize: '32px', marginLeft: '14px' }}
                >
                  Upload Image or Photo
                </Box>

                <div
                  style={{
                    display: 'flex',
                    height: '330px',
                    width: 'auto',
                    marginTop: '10px',
                    marginLeft: '14px',
                    borderRadius: '10px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'all 0.3s ease-in-out',
                    backgroundColor: '#CEEFFF',
                    border: '2px dashed #159ADD',
                  }}
                >
                  <label htmlFor="fileInput">
                    <InputLabel
                      style={{
                        border: '1px solid #159ADD',
                        borderRadius: '10px',
                        color: '#159ADD',
                        padding: '3px',
                      }}
                    >
                      Upload Image <FileUploadOutlinedIcon />
                      <Input
                        id="fileInput"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </InputLabel>
                  </label>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    justifyItems: 'center',
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: '#CCCCCC',
                      borderRadius: '24px',
                      width: '120px',
                      alignItems: 'center',
                      color: 'white',
                      marginTop: '10px',
                    }}
                  >
                    <RotateRightIcon />
                    Scan
                  </Button>
                </div>
              </Grid>
            </>
          )}

          <Grid item xs={0} md={1}></Grid>
          <Grid item xs={12} md={5} style={{ marginTop: '50px' }}>
            <div>
              {ruleList.map(item => (
                <div key={item.id}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div
                      style={{
                        height: '25px',
                        width: '25px',
                        backgroundColor: '#E3E3E3',
                        borderRadius: '50%',
                      }}
                    >
                      <span style={{ padding: '7px', color: '#676767' }}>
                        {item.id}
                      </span>
                    </div>
                    <span
                      style={{
                        color: '#EE7538',
                        marginLeft: '5px',
                        fontSize: '14px',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: '7px',
                    }}
                  >
                    {item.id === '3' ? (
                      <>
                        <p
                          style={{
                            marginLeft: '22px',
                            fontSize: '14px',
                            marginTop: '3px',
                          }}
                        >
                          {item.description}
                        </p>
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            borderLeft: '2px solid gray',
                            padding: '2px',
                            marginTop: '5px',
                            marginBottom: '10px',
                          }}
                        ></span>
                        <p style={{ marginLeft: '15px', fontSize: '14px' }}>
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
