import React, { useCallback, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import placeholder from '../../../src/assets/images/misc/image-placeholder.png'

import RestartAltIcon from '@mui/icons-material/RestartAlt'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Avatar, Box } from '../../../node_modules/@mui/material/index'

export default function AddUserModal(props) {
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

  const [modifiedData, setModifiedData] = useState({
    name: '',
    description: null,
    parent: null,
    children: null,
    image: null,
  })

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setModifiedData((prevData) => ({ ...prevData, [name]: value }))
  }, [])

  const handleFormSubmition = async (e) => {
    // e.preventDefault()

    if (urlAvatar) {
      let formData = new FormData()
      formData.append('files', fileAvatarInput)

      await axios
        .post(process.env.REACT_APP_API_ENDPOINT + '/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: user.token,
          },
        })
        .then((response) => {
          axios
            .post(process.env.REACT_APP_API_ENDPOINT + '/categories', {
              data: { ...modifiedData, image: response.data[0].id },
            })
            .then((response) => {
              setOpenSuccessSnackbar(true)
              console.log(response)
              props.onCreate()
            })
            .catch((error) => {
              setOpenErrorSnackbar(true)
            })
        })
        .catch((error) => {
          setOpenErrorSnackbar(true)
        })
    } else {
      await axios
        .post(process.env.REACT_APP_API_ENDPOINT + '/categories', {
          data: { ...modifiedData, image: null },
        })
        .then((response) => {
          setOpenSuccessSnackbar(true)
          console.log(response)
          props.onCreate()
        })
        .catch((error) => {
          setOpenErrorSnackbar(true)
        })
    }
  }

  // Upload file here
  const imagePlaceholder = placeholder
  const [urlAvatar, setUrlAvatar] = useState()
  const [fileAvatarInput, setFileAvatarInput] = useState()

  const handleOpenImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (event) => {
      const file = event.target.files[0]
      setFileAvatarInput(file)
      console.log(file)
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          setUrlAvatar(reader.result)
        }
        reader.readAsDataURL(file)
        console.log(reader.result)
      }
    }
    input.click()
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.open}
        onClose={props.onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={props.open}>
          <Card
            sx={{
              maxWidth: 550,
              margin: 'auto',
              marginTop: 10,
              padding: '25px 0px',
              position: 'relative',
            }}
          >
            <Typography variant="h5" align="center">
              Thêm danh mục
            </Typography>
            <CardContent align="center">
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: '8px',
                  }}
                >
                  <Box
                    sx={{
                      color: 'grey',
                      fontSize: '11px',
                      mb: '4px',
                    }}
                  >
                    Ảnh danh mục
                  </Box>
                  <Avatar
                    sx={{
                      width: 150,
                      height: 150,
                      m: 'auto',
                      borderRadius: '6px',
                      border: '2px dashed lightgrey',
                      padding: '3px',
                    }}
                    alt="avatar"
                    src={urlAvatar ? urlAvatar : imagePlaceholder}
                    onClick={handleOpenImage}
                    // className={
                    //   buttonPressed ? 'input-style-active pointer' : ''
                    // }
                  />
                  <Box sx={{ color: 'grey', fontSize: '11px', mt: '6px' }}>
                    Ấn vào ảnh để thêm ảnh
                  </Box>
                </Box>
                <Box>
                  <FormControl sx={{ m: 1, width: '350px' }} variant="outlined">
                    <TextField
                      label="Tên danh mục"
                      id="name"
                      name="name"
                      onChange={handleInputChange}
                      value={modifiedData.name}
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '350px' }} variant="outlined">
                    <TextField
                      label="Mô tả"
                      id="description"
                      name="description"
                      onChange={handleInputChange}
                      value={modifiedData.description}
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '350px' }} variant="outlined">
                    <TextField
                      id="outlined-select-currency"
                      select
                      name="parent"
                      label="Danh mục cha"
                      align="left"
                      onChange={handleInputChange}
                      defaultValue={modifiedData.parent}
                    >
                      {props.categoryData.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.attributes.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormControl>
                  {/* <FormControl sx={{ m: 1, width: '350px' }} variant="outlined">
                <TextField
                  label="Mã danh mục cha"
                  id="parent"
                  name="parent"
                  onChange={handleInputChange}
                  value={modifiedData.parent}
                  multiline
                  maxRows={1}
                />
              </FormControl> */}
                  {/* <FormControl sx={{ m: 1, width: '350px' }} variant="outlined">
                <TextField
                  label="Mã danh mục con"
                  id="children"
                  name="children"
                  onChange={handleInputChange}
                  value={modifiedData.children}
                  multiline
                  maxRows={1}
                />
              </FormControl> */}
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                sx={{ marginRight: '20px', textTransform: 'lowercase' }}
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleFormSubmition}
              >
                Thêm
              </Button>
              <Button
                variant="contained"
                sx={{ marginRight: '20px', textTransform: 'lowercase' }}
                color="error"
                startIcon={<RestartAltIcon />}
              >
                Đặt lại
              </Button>
            </CardActions>
          </Card>
        </Fade>
      </Modal>
      {/* Thông báo thành công */}
      <Snackbar
        open={openSuccessSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={"Thêm danh mục '" + modifiedData.name + "' thành công"}
        action={action}
      />
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        message={"Thêm danh mục '" + modifiedData.name + "' thất bại"}
        action={action}
      />
    </div>
  )
}
