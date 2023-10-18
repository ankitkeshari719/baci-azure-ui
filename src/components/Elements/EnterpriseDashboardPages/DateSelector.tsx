import {
  Box,
  FormControl,
  Grid,
  Input,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { ButtonLabelTypography } from '../../CustomizedTypography';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import React from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import {   LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { UserActionType, UserContext } from '../../../contexts/UserContext';

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
  const [gUser,userDispatch]= React.useContext(UserContext);
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

      
      <Box sx={{display:"flex",flexDirection:'row',  alignItems:'center'}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>


      <DatePicker
        views={['year', 'month']} // Only show year and month views
        value={fromDate}
       
        onChange={(e:any)=>{
          dispatch({
           type: ActionType.CHART_START_DATE,
           payload: { endDate: dayjs(e).format('YYYY-MM') },
         });
         userDispatch({
          type: UserActionType.CHART_START_DATE,
          payload: { endDate: dayjs(e).format('YYYY-MM') },
        });

         handleFromDate(dayjs(e).format('YYYY-MM'))}}
        renderInput={(params) => <TextField {...params} />
      }
      />



<ButtonLabelTypography
        label="To"
        style={{
          color: '#343434',
          marginLeft:"15px",
          marginRight:"15px",
        
        }}
      />
        
  
      <DatePicker
      
        views={['year', 'month']} // Only show year and month views
        value={toDate}
       minDate={fromDate}
        onChange={(e:any)=>{
          dispatch({
           type: ActionType.CHART_END_DATE,
           payload: { endDate: dayjs(e).format('YYYY-MM') },
         });
         userDispatch({
          type: UserActionType.CHART_END_DATE,
          payload: { endDate: dayjs(e).format('YYYY-MM') },
        });


         handleToDate(dayjs(e).format('YYYY-MM'))}}
        renderInput={(params) => <TextField {...params} />}
      />
        {/* <DateTimePicker
          label="Date&Time picker"
          value={toDate}
          onChange={(e:any)=>{
            dispatch({
             type: ActionType.CHART_END_DATE,
             payload: { endDate: e.target.value },
           });
           handleToDate(e)}}
          renderInput={(params) => <TextField {...params} />}
        /> */}

    </LocalizationProvider>
  
        {/* <FormControl fullWidth>
        <Input type="month" id="toDate" name="toDate" value={toDate}
         inputProps={{ min:fromDate }}
        onChange={(e)=>{
           dispatch({
            type: ActionType.CHART_END_DATE,
            payload: { endDate: e.target.value },
          });
          handleToDate(e)}} />
        </FormControl> */}
      </Box>
    </Grid>
  );
}

export default DateSelector;
