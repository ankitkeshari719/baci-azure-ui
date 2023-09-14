import * as React from 'react';
import BasicDashboardWithoutEnterprise from './BasicDashboardWithoutEnterprise';
import BasicDashboardWithEnterprise from './BasicDashboardWithEnterprise';

export const BasicUserMainContainer = () => {
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  return (
    <>
      {tempLocalUserData && tempLocalUserData.enterpriseId == '' ? (
        <BasicDashboardWithoutEnterprise />
      ) : (
        <BasicDashboardWithEnterprise />
      )}
    </>
  );
};
