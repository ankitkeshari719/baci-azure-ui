
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
  } from '@mui/material';
  import {
      BodyRegularTypography,
    H2RegularTypography,
    H4RegularTypography,
    H5SemiBoldTypography,
  } from '../../components/CustomizedTypography';
import { XMarkIcon } from '@heroicons/react/24/outline';
  export default function DyanamicDialog({
    title,
    text,
    action,
    show,
    onCancel,
    onConfirm,
    type
  }: {
    title: string;
    text: string;
    action: string;
    show: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    //type = Critical | Alert | Info | Success
    type:string
  }) {
    return (
      <Dialog
        open={show}
        keepMounted
        onClose={onCancel}
        aria-describedby="alert-dialog-slide-description"
      
        // style={{maxWidth:'410px'}}
      >
        <DialogTitle alignItems="center"  display="flex" padding="20px, 24px, 20px, 24px"   sx={{maxWidth:'410px', justifyContent:'space-between'}}>
            <Box>
            <img style={{marginRight:'10px', height:'23px'}} src="/images/DialogAlert.png"></img>
           <H5SemiBoldTypography 
           label={title} />
           </Box>
           <XMarkIcon height="24px" style={{ cursor:'pointer'}} onClick={onCancel}/>
            </DialogTitle>
            <Divider sx={{color:"rgba(251, 188, 5, 1)", background:"rgba(251, 188, 5, 1)", height:'2px',opacity:'1'}} />
            {/* <hr style={{background:"rgba(251, 188, 5, 1)",color:"rgba(251, 188, 5, 1)", height:'10px!important'}}/> */}
        <DialogContent   sx={{maxWidth:'410px'}}>
          <DialogContentText id="alert-dialog-slide-description">
            <BodyRegularTypography
            style={{display:'flex',flexWrap:'wrap'}}
            label={text}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions   sx={{maxWidth:'410px',padding:'24px'}}    >
          <Button variant="outlined" sx={{borderRadius:"24px", fontWeight:'500', size:'16px'}} color='primary' onClick={onCancel} >
            Cancel
          </Button>
          <Box component="span" width="20px"></Box>
          <Button variant="contained" sx={{borderRadius:"24px", fontWeight:'500', size:'16px'}} color='primary' onClick={onConfirm} >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  