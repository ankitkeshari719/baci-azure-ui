import { Paper, Box } from '@mui/material';

import commonStyles from '../../style.module.css';
import {
  BodyRegularTypography,
  H2SemiBoldTypography,
  H4SemiBoldTypography,
  H5RegularTypography,
  H6SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import {
  BASIC,
  ENTERPRISE_ADMIN,
  ENTERPRISE,
} from '../../constants/applicationConst';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on create new retro page
  function goToLanding() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/joinRetro/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate('/enterpriseAdmin/joinRetro/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/joinRetro/');
    } else {
      navigate(`/`);
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(var(--app-height))',
        background: '#F9FBFC',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: '24px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Icons.ArrowCircleLeftOutline
          size={20}
          style={{
            width: '24px',
            height: '24px',
            display: 'block',
            right: '0px',
            color: '#159ADD',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={goToLanding}
        />
        <H2SemiBoldTypography
          label="Privacy Policy"
          style={{ color: commonStyles.PrimaryDark, marginLeft: '8px' }}
        />
      </Box>
      <Paper
        sx={{
          width: '100%',
          background: '#FFF',
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          marginTop: '24px',
        }}
      >
        {/* Links */}
        <Box
          sx={{
            width: '35%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {/* Privacy Policy */}
          <H4SemiBoldTypography
            label="Privacy Policy"
            style={{ color: '#159ADD' }}
          />
          {/* Title */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '24px',
            }}
          >
            <a
              href="#Applicability_of_this_Privacy_Policy"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Applicability of this Privacy Policy
            </a>
            <a
              href="#Identifying_the Data_Controller_and_Processor"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Identifying the Data Controller and Processor
            </a>
            <a
              href="#The_types_of_personal_data_we_collect"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              The types of personal data we collect
            </a>
            <a
              href="#How_we_use_personal_data"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              How we use personal data
            </a>
            <a
              href="#BACI_AI"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              BACI AI
            </a>
            <a
              href="#How_we_share_and_disclose_personal_data"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              How we share and disclose personal data
            </a>
            <a
              href="#Data_Retention"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Data Retention
            </a>
            <a
              href="#Security"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Security
            </a>
            <a
              href="#Our_responsibility_for_third_party_links"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Our responsibility for third party links{' '}
            </a>
            <a
              href="#Age_Restriction"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Age Restriction
            </a>
            <a
              href="#Changes_to_this_Privacy_Policy"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Changes to this Privacy Policy
            </a>
            <a
              href="#Local_Provisions"
              style={{
                color: '#676767',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '130%',
                textDecorationLine: 'none',
                marginTop: '24px',
              }}
            >
              Local Provisions
            </a>
          </Box>
        </Box>
        {/* Description */}
        <Box
          sx={{
            width: '65%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          {/* Privacy Policy */}
          <H4SemiBoldTypography
            label="Privacy Policy"
            style={{ color: '#343434' }}
          />
          {/* Explanation */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: '24px',
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <H6SemiBoldTypography
                label="Publication date"
                style={{ color: '#676767' }}
              />
              <BodyRegularTypography
                label="24th Aug 2023"
                style={{ color: '#000', marginLeft: '8px' }}
              />
            </Box>
            <BodyRegularTypography
              label="This Privacy Policy describes how RealtimeBoard, Inc. dba Miro, including its affiliates and subsidiaries (collectively, Miro and also referred to as our, us and we) collects, uses and discloses personal data, as well as any choices you have with respect to this personal data.
            When we refer to “Miro”, we mean the Miro entity that acts as the controller or processor of your personal data, explained in more detail in the “Identifying the Data Controller and Processor” section below."
              style={{ color: '#000', marginTop: '16px' }}
            />
            <Box
              id="Applicability_of_this_Privacy_Policy"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Applicability of this Privacy Policy"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label="This Privacy Policy applies to Miro’s online collaboration tools and platform, including the associated Miro mobile and desktop applications (collectively, the “Services”), miro.com and other Miro websites (collectively, the “Websites”) and other interactions (e.g. customer support, the Miro Community, etc.) you may have with Miro, including the processing of any messages, files, video or audio recordings, prompts or other content submitted through our Services (collectively, “Customer Content”). This Privacy Policy does not apply to any third-party applications or software that integrate with our Services (“Third-Party Services”), or any other third-party products, services or businesses.
                The organization (e.g., your employer or another entity or person) (“Customer”) that entered into the Terms of Service or the Master Cloud Agreement, and any product-specific Terms (together, the “Customer Agreement”) controls its instance of the Services (its “Organization”) and any associated Customer Content. Individuals that are granted access to an Organization by a Customer (“Authorized Users”) routinely submit Customer Content to Miro when using the Services.
                If you have any questions about specific Organization settings and privacy practices, please contact the Customer whose Organization you use. If you have received an invitation to join an Organization but have not yet created an account, you should request assistance from the Customer that sent the invitation."
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Identifying_the Data_Controller_and_Processor"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Identifying the Data Controller and Processor"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label="Data protection law in certain jurisdictions differentiates between the “controller” and “processor” of personal data. In general, Customer is the controller and Miro is the processor of Customer Content.
                As the controller for Customer Content, Customer may, for example, use the Services to grant and remove access to an Organization, assign roles and configure settings, access, modify, export, share and remove Customer Content and otherwise apply its policies to the Services.
                As the processor for Customer Content, Miro processes Customer Content only on Customer’s request and in accordance with Customer’s written instructions, including the applicable terms in the Customer Agreement, Customer’s use of the Services, and as required by applicable law. For more information about how Customer Content is processed (such as how your personal data is processed, the purpose and legal basis for processing, and your data subject rights), we refer you to the relevant Customer’s privacy notice.
                Miro is the controller for certain other categories of data (described in paragraph 3 below). If you have any questions or complaints, or would like to exercise your rights with regard to your personal data, please contact us at privacy@miro.com."
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="The_types_of_personal_data_we_collect"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="The types of personal data we collect"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="How_we_use_personal_data"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="How we use personal data"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="BACI_AI"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="BACI AI"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="How_we_share_and_disclose_personal_data"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="How we share and disclose personal data"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Data_Retention"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Data Retention"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Security"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Security"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Our_responsibility_for_third_party_links"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Our responsibility for third party links"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Age_Restriction"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Age Restriction"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Changes_to_this_Privacy_Policy"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Changes to this Privacy Policy"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Local_Provisions"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Local Provisions"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
