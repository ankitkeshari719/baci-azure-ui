import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';
export interface RetroTimeInputDialogProps {
  open: boolean;
  selectedValue: any;
  onSubmit: (value: any) => void;
  onClose: (value: string) => void;
}
const RetroTimeInputDialog = (props: RetroTimeInputDialogProps) => {
  const { onClose, onSubmit, selectedValue, open } = props;
  const hrArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const [hr, setHr] = React.useState(1 + '');
  const [min, setMin] = React.useState(0 + '');
  const handleClose = () => {
    onClose(selectedValue);
  };

  const getHour = (input: number) => {
    console.log((input / 60) * 100);
  };

  const handleHr = (event: SelectChangeEvent) => {
    if (min === '0' && event.target.value == '0') {
    } else setHr(+event.target.value + '');
  };
  const handleMin = (event: SelectChangeEvent) => {
    if (hr === '0' && event.target.value == '0') {
    } else setMin(+event.target.value + '');
  };
  const getValueInMinutes = () => {
    const hrToMinute = +hr * 60;
    const minute = +min;
    return hrToMinute + minute;
  };
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          width: '700px',
          maxHeight: '600px',
          padding: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
    >
      <img
        onClick={handleClose}
        style={{
          position: 'absolute',
          right: '20px',
          top: '10px',
          cursor: 'pointer',
        }}
        src="/svgs/CloseDialog.svg"
      ></img>
      <Typography
        sx={{ fontSize: '24px', fontWeight: '500', color: '#EE7538' }}
      >
        When this retro will end?
      </Typography>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: '400!important',
          color: '#EE7538',
          fontStyle: 'normal',
          lineHeight: '18px',
          marginTop: '5px',
        }}
      >
        Participants will get a reminder 5 minutes before the retro ends
      </Typography>

      <DialogContent sx={{ marginTop: '50px', marginBottom: '30px' }}>
        <FormControl sx={{ minWidth: 60, marginRight: '10px' }}>
          <InputLabel id="demo-simple-select-standard-label">Hr</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={hr}
            onChange={handleHr}
            label="Hr"
          >
            {min !== '0' && <MenuItem value="0">00</MenuItem>}
            {hrArray.map((object, index) => {
              return (
                <MenuItem value={object + ''} key={object + index}>
                  {object < 10 ? '0' + object : object}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 60, marginLeft: '10px' }}>
          <InputLabel id="demo-simple-select-standard-label">Min</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={min}
            onChange={handleMin}
            label="Min"
          >
            {hr !== '0' && <MenuItem value="0">00</MenuItem>}
            {hrArray.map((object, index) => {
              return (
                <MenuItem value={object + ''} key={object}>
                  {object < 10 ? '0' + object : object}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            padding: '10px 20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
          }}
          onClick={() => onSubmit(getValueInMinutes())}
        >
          START RETRO
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RetroTimeInputDialog;
