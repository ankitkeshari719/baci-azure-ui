import {
  Box,
  FormControl,
  Grid,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ButtonLabelTypography } from '../../CustomizedTypography';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import React from 'react';

function DateSelector({
  fromDate,
  toDate,
  disable,
  handleToDate,
  handleFromDate,
}: {
  fromDate: string;
  toDate: string;
  disable?:boolean;
  handleToDate: (event: any) => void;
  handleFromDate: (event: any) => void;
}) {

  const [global, dispatch] = React.useContext(GlobalContext);
  return (
    <Grid
      item
      xs={12}
      sx={{
        padding: '0px !important',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
       marginRight:'30px'
      }}
    >
      {/* Select Range Title */}
      {!disable&&<ButtonLabelTypography
        label="Select Range:"
        style={{
          color: '#343434',
        }}
      />}
      {/* From Date */}
      <Box sx={{ minWidth: 180, marginLeft: '16px', marginRight: '16px' }}>
      
        <FormControl fullWidth>
        <Input type="month" id="fromDate" name="fromDate" value={fromDate} onChange={(e)=>{
            dispatch({
              type: ActionType.CHART_START_DATE,
              payload: { startDate: e.target.value },
            });
          handleFromDate(e)}} />
        </FormControl>
      </Box>
      <ButtonLabelTypography
        label="To"
        style={{
          color: '#343434',
        }}
      />
      {/*To Date */}
      
      <Box sx={{ minWidth: 180, marginLeft: '16px' }}>
  
        <FormControl fullWidth>
        <Input type="month" id="toDate" name="toDate" value={toDate}
         inputProps={{ min:fromDate }}
        onChange={(e)=>{
           dispatch({
            type: ActionType.CHART_END_DATE,
            payload: { endDate: e.target.value },
          });
          handleToDate(e)}} />
        </FormControl>
      </Box>
    </Grid>
  );
}

export default DateSelector;
