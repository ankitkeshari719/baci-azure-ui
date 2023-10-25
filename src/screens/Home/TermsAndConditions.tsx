import { Paper, Box, Link, useMediaQuery } from '@mui/material';
import React from 'react';
import BACILogo from '../../assets/img/bacilogobeta.svg';

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
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';
import theme from '../../helpers/theme/theme';
export default function TermsAndConditions() {
  const navigate = useNavigate();
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on create new retro page
  function goToLanding() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/joinRetro/');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate('/enterprise/joinRetro/');
    } else {
      navigate(`/`);
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        background: '#F9FBFC',
        padding: '0px 24px  24px  24px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          gap: '8px',
          borderBottom: '1px solid #E3E3E3',
          padding: '16px 0px',
        }}
      >
        <Link href="/">
          <img
            src={BACILogo}
            alt="Logo"
            style={{
              width: isXsUp ? '53px' : '108px',
              height: isXsUp ? '18px' : '48px',
            }}
          />
        </Link>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: '16px',
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
          label="Terms and Conditions "
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
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {/* Terms and Conditions */}
          <H4SemiBoldTypography
            label="Terms and Conditions"
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
              href="#Overview"
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
              Overview
            </a>
            <a
              href="#The_Service"
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
              The Service
            </a>
            <a
              href="#Support"
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
              Support
            </a>
            <a
              href="#Customer_Content"
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
              Customer Content
            </a>
            <a
              href="#Customer_Obligations"
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
              Customer Obligations
            </a>
            <a
              href="#Suspension_of_Service"
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
              Suspension of Service
            </a>
            <a
              href="#Third_Party_Platforms"
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
              Third-Party Platforms
            </a>
            <a
              href="#Technical_Services"
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
              Technical Services
            </a>
            <a
              href="#Commercial_Terms"
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
              Commercial Terms{' '}
            </a>
            <a
              href="#Warranties_and_Disclaimers"
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
              Warranties and Disclaimers
            </a>
            <a
              href="#Term_and_Termination"
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
              Term and Termination
            </a>
            <a
              href="#Ownership"
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
              Ownership
            </a>
            <a
              href="#Limitations_of_Liability"
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
              Limitations of Liability
            </a>
            <a
              href="#Indemnification"
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
              Indemnification
            </a>
            <a
              href="#Required_Disclosures"
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
              Required Disclosures
            </a>
            <a
              href="#Trials_and_Betas"
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
              Trials and Betas{' '}
            </a>
          </Box>
        </Box>
        {/* Description */}
        <Box
          sx={{
            width: '70%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}
        >
          {/* Terms and Conditions */}
          <H4SemiBoldTypography
            label="Terms and Conditions"
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
              label="These are the standard terms of service applicable to all Miro self-serve and reseller customers. If you have subscribed to an Enterprise Plan, please visit our Master Cloud Agreement.
            This Miro Terms of Service (“Agreement”) is entered into by and between RealtimeBoard Inc. dba Miro (“Miro”) and the entity or person placing an order for or accessing the Service (“Customer” or “you”). This Agreement consists of the terms and conditions set forth below and any Orders. If you are accessing or using the Service on behalf of your company, you represent that you are authorized to accept this Agreement on behalf of your company, and all references to “you” reference your company."
              style={{ color: '#000', marginTop: '16px' }}
            />
            <Box
              id="Overview"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Overview"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label="Miro offers a unique Service for visual collaboration that is designed to allow Users to create, collaborate and centralize communication through interactive online virtual whiteboards. Customer maintains sole control over the types and content of all Customer Content it submits to the Service."
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="The_Service"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="The Service"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Support"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Support"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Customer_Content"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Customer Content"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Customer_Obligations"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Customer Obligations"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Suspension_of_Service"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Suspension of Service"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Third_Party_Platforms"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Third-Party Platforms"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Technical_Services"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Technical Services"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Commercial_Terms"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Commercial Terms"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Warranties_and_Disclaimers"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Warranties and Disclaimers"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Term_and_Termination"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Term and Termination"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Ownership"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Ownership"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Limitations_of_Liability"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Limitations of Liability"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Indemnification"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Indemnification"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Required_Disclosures"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Required Disclosures"
                style={{ color: '#676767', marginTop: '24px' }}
              />
              <BodyRegularTypography
                label=""
                style={{ color: '#343434', marginTop: '16px' }}
              />
            </Box>
            <Box
              id="Trials_and_Betas"
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography
                label="Trials and Betas"
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
