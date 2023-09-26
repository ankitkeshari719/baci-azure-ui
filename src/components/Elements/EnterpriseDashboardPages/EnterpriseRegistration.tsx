import * as React from 'react';
import {
  Paper,
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Button,
} from '@mui/material';
import { WithContext as ReactTags } from 'react-tag-input';
import './react_tags_style.css';

import { ContainedButton } from '../..';

import {
  BodySemiBoldTypography,
  CaptionSemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import * as Icons from 'heroicons-react';
import {
  createEnterprise,
  getEnterpriseById,
  updateEnterprise,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';

const styles = {
  accessCodeTextField: {
    '& .MuiFilledInput-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
      borderRadius: '0px !important',
    },
  },
};

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function EnterpriseRegistration() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  const [organisationPhoto, setOrganisationPhoto] = React.useState<any>('');
  const [organisationName, setOrganisationName] = React.useState('');
  const [tags, setTags] = React.useState<{ id: string; text: string }[]>([]); // For Organisation Domains
  const [organisationCountry, setOrganisationCountry] = React.useState('');
  const [domains, setDomains] = React.useState<any>([]);
  const [codeImageError, setCodeImageError] = React.useState('');
  const [codeOrganisationNameError, setOrganisationNameCodeError] =
    React.useState('');
  const [codeCountryError, setCountryCodeError] = React.useState('');
  const [codeDomainError, setDomainCodeError] = React.useState('');

  React.useEffect(() => {
    callGetEnterpriseById();
  }, []);

  const callGetEnterpriseById = async () => {
    const organisationId = tempLocalUserData && tempLocalUserData.enterpriseId;
    await getEnterpriseById(organisationId).then(
      res => {
        setOrganisationPhoto(res.organisationPhoto);
        setOrganisationName(res.organisationName);
        setOrganisationCountry(res.organisationCountry);
        setDomains(res.organisationDomain);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const handlePhoto = (e: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setOrganisationPhoto(reader.result);
      setCodeImageError('');
    };
    reader.onerror = error => {
      console.log('error', error);
    };
  };

  // Handle tags
  const handleDelete = (i: number) => {
    setTags(
      tags.filter(
        (tag: { id: string; text: string }, index: number) => index !== i
      )
    );
    if (tags.length === 0) {
      setDomainCodeError('Please enter at least one organisation domain');
    }
  };

  const handleAddition = (tag: { id: string; text: string }) => {
    setTags([...tags, tag]);
    setDomainCodeError('');
  };

  const handleDrag = (
    tag: { id: string; text: string },
    currPos: any,
    newPos: any
  ) => {
    const newTags = tags && tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index: any) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const submitEnterpriseRegistration = () => {
    if (organisationPhoto === '' || organisationPhoto === null) {
      setCodeImageError('Please upload image');
    } else {
      setCodeImageError('');
    }
    if (organisationName === '') {
      setOrganisationNameCodeError('Please enter organisation name');
    } else {
      setOrganisationNameCodeError('');
    }
    if (tags.length === 0 && domains.length === 0) {
      setDomainCodeError('Please enter at least one organisation domain');
    } else {
      setDomainCodeError('');
    }

    if (organisationCountry === '') {
      setCountryCodeError('Please enter organisationCountry');
    } else {
      setCountryCodeError('');
    }

    if (
      organisationName === '' ||
      (tags.length === 0 && domains.length === 0) ||
      organisationCountry === '' ||
      organisationPhoto === '' ||
      organisationPhoto === null
    ) {
      return;
    }

    if (
      organisationName != '' ||
      tags.length === 0 ||
      organisationCountry != '' ||
      organisationPhoto != null ||
      organisationPhoto != ''
    ) {
      // Call API
      callCreateEnterprise();
    }
  };

  const callCreateEnterprise = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const organisationDomains = tags.map(tag => {
      return tag.text;
    });

    const finalDomains = domains.concat(organisationDomains);
    const requestBody = {
      organisationName: organisationName,
      organisationDomain: finalDomains,
      organisationCountry: organisationCountry,
      organisationPhoto: organisationPhoto,
      isActive: true,
    };

    await updateEnterprise(
      tempLocalUserData && tempLocalUserData.enterpriseId,
      requestBody
    ).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        setTags([]);
        callGetEnterpriseById();
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        console.log('err', err);
        setTags([]);
        callGetEnterpriseById();
      }
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: '#F9FBFC',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <BodySemiBoldTypography
        label="Enterprise Details"
        style={{ marginBottom: '10px' }}
      />
      <H2SemiBoldTypography
        label="Organisation Details"
        style={{ color: commonStyles.PrimaryDark }}
      />
      <Box
        sx={{
          width: '100%',
          height: 'calc(var(--app-height) - 160px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            width: '50%',
            background: 'rgb(249 251 252)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            boxShadow: '10px 10px 40px 20px rgba(21, 154, 221, 0.08)',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {organisationPhoto === '' || organisationPhoto == null ? (
              ''
            ) : (
              <img width={250} height={250} src={organisationPhoto} />
            )}
            {organisationPhoto === '' || organisationPhoto == null ? (
              <>
                {/* Upload Image Button */}
                <FormControl
                  style={{
                    display: 'flex',
                    width: '600px',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: '16px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      style={{
                        color: '#159ADD',
                        fontSize: '16px',
                        fontWeight: '500',
                        borderRadius: '24px',
                        letterSpacing: '0.4',
                        border: '1px solid rgba(21, 154, 221, 0.5)',
                        height: '36px',
                        paddingLeft: '15px',
                        paddingRight: '15px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Icons.UploadOutline
                        size={20}
                        style={{ marginRight: '8px' }}
                      />
                      Upload Company Logo
                      <input
                        type="file"
                        hidden
                        accept=".png,.jpg,.jpeg"
                        onChange={handlePhoto}
                      />
                    </Button>
                  </Box>
                  {/* Error Organisation Photo */}
                  {codeImageError !== '' && (
                    <FormHelperText
                      style={{ color: '#d32f2f', marginLeft: '5px' }}
                    >
                      {codeImageError}
                    </FormHelperText>
                  )}
                </FormControl>
              </>
            ) : (
              <>
                {/* Change Image Button */}
                <FormControl
                  style={{
                    display: 'flex',
                    width: '600px',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: '16px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      style={{
                        color: '#159ADD',
                        fontSize: '16px',
                        fontWeight: '500',
                        borderRadius: '24px',
                        letterSpacing: '0.4',
                        border: '1px solid rgba(21, 154, 221, 0.5)',
                        height: '36px',
                        paddingLeft: '15px',
                        paddingRight: '15px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Icons.UploadOutline
                        size={20}
                        style={{ marginRight: '8px' }}
                      />
                      Change Company Logo
                      <input
                        type="file"
                        hidden
                        accept=".png,.jpg,.jpeg"
                        onChange={handlePhoto}
                      />
                    </Button>
                  </Box>
                  {/* Error Organisation Photo */}
                  {codeImageError !== '' && (
                    <FormHelperText
                      style={{ color: '#d32f2f', marginLeft: '5px' }}
                    >
                      {codeImageError}
                    </FormHelperText>
                  )}
                </FormControl>
              </>
            )}
            {/* Organisation Name* */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '24px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Organisation Name*"
                  autoFocus
                  variant="standard"
                  error={!!codeOrganisationNameError}
                  sx={{
                    width: '100%',
                    ...styles.accessCodeTextField,
                  }}
                  value={organisationName}
                  onChange={e => {
                    setOrganisationName(e.currentTarget.value);
                    setOrganisationNameCodeError('');
                  }}
                />
              </Box>
              {/* Error Organisation Name */}
              {codeOrganisationNameError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeOrganisationNameError}
                </FormHelperText>
              )}
            </FormControl>
            {/* Organisation Domain */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
              >
                <ReactTags
                  autofocus={false}
                  inputFieldPosition="top"
                  tags={tags}
                  delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleDrag={handleDrag}
                  handleTagClick={handleTagClick}
                  placeholder="Organisation Domains*"
                  autocomplete
                  inputProps={{}}
                />
                <FormHelperText
                  style={{ color: 'rgba(0, 0, 0, 0.60)', marginLeft: '5px' }}
                >
                  Add your Organisation Domain Name and Hit Enter
                </FormHelperText>
              </Box>
              {/* Error Organisation Domain */}
              {codeDomainError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeDomainError}
                </FormHelperText>
              )}
            </FormControl>
            {/* Existing Organisation Domain */}
            <Box
              sx={{
                width: '600px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: '16px',
              }}
            >
              {domains.map((team: any) => {
                return (
                  <Box
                    key={team}
                    sx={{
                      width: '150px',
                      height: '32px',
                      minWidth: '150px',
                      minHeight: '32px',
                      borderRadius: '4px',
                      background: 'rgba(0, 0, 0, 0.04)',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '4px',
                    }}
                  >
                    <CaptionSemiBoldTypography
                      label={team}
                      style={{
                        color: '#4E4E4E !important',
                        fontSize: '12px !important',
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
            {/* Country */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Country*"
                  maxRows={8}
                  variant="standard"
                  error={!!codeCountryError}
                  sx={{
                    width: '100%',
                    ...styles.accessCodeTextField,
                  }}
                  value={organisationCountry}
                  onChange={e => {
                    setOrganisationCountry(e.currentTarget.value);
                    setCountryCodeError('');
                  }}
                />
              </Box>
              {/* Error country */}
              {codeCountryError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeCountryError}
                </FormHelperText>
              )}
            </FormControl>
            <ContainedButton
              id={'submit_Enterprise_Registration'}
              name={'Update'}
              onClick={() => submitEnterpriseRegistration()}
              style={{
                marginTop: '16px !important',
                padding: '10px 18px',
                gap: '8px',
              }}
              size={'medium'}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
