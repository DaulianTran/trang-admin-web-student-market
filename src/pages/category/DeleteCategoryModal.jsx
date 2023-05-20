import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'

export default function DeleteCategoryModal(props) {
  // Thông báo snackbar
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false)
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false)
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenSuccessSnackbar(false)
    setOpenErrorSnackbar(false)
  }

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  const deleteCustomerByID = async (id) => {
    await axios
      .delete(process.env.REACT_APP_API_ENDPOINT + '/categories/' + id)
      .then((response) => {
        console.log('Thông báo xóa thành công: ' + response)
        props.onAfterDelete(id)
        setOpenSuccessSnackbar(true)
      })
      .catch((error) => {
        console.log('Thông báo lỗi khi xóa: ' + error)
        setOpenErrorSnackbar(true)
      })
  }

  const deleteCustomer = (id) => {
    deleteCustomerByID(id)
    console.log('ID được yêu cầu xóa: ' + id)
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ fontWeight: 'bold', fontSize: '17px' }}
        >
          {'Xác nhận xóa danh mục ?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn xóa danh mục "{props.categoryName}" này không ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Thoát</Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteCustomer(props.categoryID)}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={'Xóa danh mục "' + props.categoryName + '" thành công'}
        action={action}
      />
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={'Xóa danh mục "' + props.categoryName + '" thất bại'}
        action={action}
      />
    </div>
  )
}
