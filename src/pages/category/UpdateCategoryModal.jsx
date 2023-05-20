import React, { useCallback, useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import axios from 'axios'
import placeholder from '../../../src/assets/images/misc/image-placeholder.png'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Avatar, Box } from '../../../node_modules/@mui/material/index'

export default function UpdateCategoryModal(props) {
  console.log(props.category.attributes.image?.data)
  // Thông báo snackbar
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false)
  const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false)
  const [error, setError] = useState(null)
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
  // const [modifiedData, setModifiedData] = useState({
  //   id: '',
  //   name: '',
  //   description: '',
  //   parent: '',
  // })

  const [id, setId] = useState(props.category.id)
  const [name, setName] = useState(props.category.attributes.name)
  const [description, setDescription] = useState(
    props.category.attributes.description,
  )
  const [parent, setParent] = useState(
    props.category.attributes.parent?.data?.id,
  )

  const [image, setImage] = useState(props.category.attributes.image?.data)
  // const [image, setImage] = useState(
  //   props.category.attributes.parent?.data?.id,
  // )

  const handleIdChange = (event) => {
    setId(event.target.value)
  }

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }

  const handleParentChange = (event) => {
    setParent(event.target.value)
  }

  // Upload file here
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

  // Refresh update form
  useEffect(() => {
    setId(props.category.id)
    setName(props.category.attributes.name)
    setDescription(props.category.attributes.description)
    setParent(props.category.attributes.parent?.data?.id)
    setImage(props.category.attributes.image?.data)
    setUrlAvatar(null)
  }, [props.category])

  // Function after click submit update
  const handleUpdateSubmition = async (e) => {
    e.preventDefault()
    const data = {
      id: id,
      name: name,
      description: description,
      parent: parent,
      image: urlAvatar ? urlAvatar : image,
    }

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
            .put(process.env.REACT_APP_API_ENDPOINT + '/categories/' + id, {
              data: { ...data, image: response.data[0].id },
            })
            .then((response) => {
              setOpenSuccessSnackbar(true)
              console.log(response)
              props.onUpdate()
            })
            .catch((error) => {
              setOpenErrorSnackbar(true)
            })
        })
        .catch((error) => {
          setOpenErrorSnackbar(true)
        })
    } else {
      console.log(data)
      await axios
        .put(process.env.REACT_APP_API_ENDPOINT + '/categories/' + id, {
          data: data,
        })
        .then((response) => {
          setOpenSuccessSnackbar(true)
          console.log(response)
          props.onUpdate()
        })
        .catch((error) => {
          setError(error)
          setOpenErrorSnackbar(true)
        })
    }
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
              Cập nhật danh mục
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
                      border: '1px dashed grey',
                      padding: '3px',
                    }}
                    alt="avatar"
                    src={
                      urlAvatar
                        ? urlAvatar
                        : image
                        ? process.env.REACT_APP_SERVER_ENDPOINT +
                          image.attributes.url
                        : placeholder
                    }
                    onClick={handleOpenImage}
                    // className={
                    //   buttonPressed ? 'input-style-active pointer' : ''
                    // }
                  />
                  <Box sx={{ color: 'grey', fontSize: '11px' }}>
                    Ấn vào ảnh để thay ảnh
                  </Box>
                </Box>
                <Box>
                  <FormControl sx={{ m: 1, width: '345px' }} variant="outlined">
                    <TextField
                      label="Tên danh mục"
                      id="update_name"
                      name="name"
                      onChange={handleNameChange}
                      value={name}
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '345px' }} variant="outlined">
                    <TextField
                      label="Mô tả"
                      id="update_description"
                      name="description"
                      onChange={handleDescriptionChange}
                      value={description}
                    />
                  </FormControl>
                  <FormControl sx={{ m: 1, width: '345px' }} variant="outlined">
                    <TextField
                      id="update_parent"
                      select
                      name="parent"
                      label="Danh mục cha"
                      align="left"
                      onChange={handleParentChange}
                      value={parent}
                    >
                      {props.categoryData &&
                        props.categoryData.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.attributes.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </FormControl>
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
                  {error}
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                sx={{ marginRight: '20px', textTransform: 'lowercase' }}
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleUpdateSubmition}
              >
                Cập nhật
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
        message="Cập nhật danh mục thành công"
        action={action}
      />
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Cập nhật danh mục thất bại"
        action={action}
      />
    </div>
  )
}
