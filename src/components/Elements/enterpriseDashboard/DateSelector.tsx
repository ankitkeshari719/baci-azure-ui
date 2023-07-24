import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ButtonLabelTypography } from '../../CustomizedTypography';

import * as Icons from 'heroicons-react';
import { MONTH_SELECTORS, MenuProps } from '../../../screens/Analytics/const';
import { useState } from 'react';

function DateSelector({
  fromDate,
  toDate,
  handleToDate,
  handleFromDate,
}: {
  fromDate: string;
  toDate: string;
  handleToDate: (event: SelectChangeEvent) => void;
  handleFromDate: (event: SelectChangeEvent) => void;
}) {
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
        marginTop: '16px',
      }}
    >
      {/* Select Range Title */}
      <ButtonLabelTypography
        label="Select Range:"
        style={{
          color: '#343434',
        }}
      />
      {/* From Date */}
      <Box sx={{ minWidth: 240, marginLeft: '16px', marginRight: '16px' }}>
        <FormControl fullWidth>
          <Select
            sx={{
              fieldset: {
                border: 'none',
                opacity: 1,
                color: '#4E4E4E',
              },
            }}
            labelId="from-Date"
            id="from_date"
            value={fromDate}
            label="From"
            onChange={handleFromDate}
            IconComponent={props => (
              <Icons.ChevronDownOutline
                size={24}
                color="#4E4E4E"
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 'calc(50% - 0.8em)',
                }}
                {...props}
              />
            )}
            MenuProps={MenuProps}
          >
            {MONTH_SELECTORS.map(month_selector => {
              return (
                <MenuItem value={month_selector.id} key={month_selector.id}>
                  {month_selector.month}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      <ButtonLabelTypography
        label="To"
        style={{
          color: '#343434',
        }}
      />
      {/*To Date */}
      <Box sx={{ minWidth: 240, marginLeft: '16px' }}>
        <FormControl fullWidth>
          <Select
            sx={{
              fieldset: {
                border: 'none',
                opacity: 1,
                color: '#4E4E4E',
              },
            }}
            labelId="to-Date"
            id="to_date"
            value={toDate}
            label="To"
            onChange={handleToDate}
            IconComponent={props => (
              <Icons.ChevronDownOutline
                size={24}
                color="#4E4E4E"
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 'calc(50% - 0.8em)',
                }}
                {...props}
              />
            )}
            MenuProps={MenuProps}
          >
            {MONTH_SELECTORS.map(month_selector => {
              return (
                <MenuItem value={month_selector.id} key={month_selector.id}>
                  {month_selector.month}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </Grid>
  );
}

export default DateSelector;
