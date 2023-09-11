import * as React from 'react';
import { ActionList } from '../../../constants/DemoConst';
import ActionDashboard from './ActionDashboard';
import ActionEmptyPage from './ActionEmptyPage';

export const ActionsMainContainer = () => {
  // Call API to get the action list
  localStorage.setItem('actionList', JSON.stringify(ActionList));

  return (
    <>{ActionList.length === 0 ? <ActionEmptyPage /> : <ActionDashboard />}</>
  );
};
