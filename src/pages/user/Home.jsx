import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Box } from '@mui/system'
import Pagination from '@mui/material/Pagination'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InfoUserModal from './InfoUserModal'

// Icon import
import SearchIcon from '@mui/icons-material/Search'
import ConstructionIcon from '@mui/icons-material/Construction'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddUserModal from './AddUserModal'
import DeleteUserModal from './DeleteUserModal'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import DoneIcon from '@mui/icons-material/Done'
import SmsFailedIcon from '@mui/icons-material/SmsFailed'
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications'
import BlockIcon from '@mui/icons-material/Block'
import { Avatar } from '../../../node_modules/@mui/material/index'

export default function category() {
  const [customer, setCustomer] = React.useState([])
  const [elementNum, setElementNum] = React.useState([])
  const [selectedPage, setSelectedPage] = React.useState(1)
  const [change, setChange] = React.useState(true)

  const [currentPage, setCurrentPage] = React.useState(1)

  const [totalPages, setTotalPages] = React.useState(1)

  const PER_PAGE = 7 // Số lượng phần tử hiển thị trên mỗi trang
  const offset = (currentPage - 1) * PER_PAGE

  // const handleGetPage = (event, elementNum) => {
  //   setSelectedPage(elementNum)
  // }
  const handlePage = (event, value) => {
    setCurrentPage(value)
  }

  const [searchedKey, setSearchedKey] = React.useState('')

  const handleGetSearch = (e) => {
    setSearchedKey(e.target.value)
  }

  // Using for Modal Add user
  const [openAddUserModal, setOpenAddUserModal] = React.useState(false)
  const handleOpenAddUserModal = () => setOpenAddUserModal(true)
  const handleCloseAddUserModal = () => setOpenAddUserModal(false)

  // Using for Dialog delete user
  const [userData, setUserData] = React.useState({})
  const [openDeleteUserModal, setOpenDeleteUserModal] = React.useState(false)
  const handleOpenDeleteUserModal = (data) => {
    setOpenDeleteUserModal(true)
    setUserData(data)
  }
  const handleCloseDeleteUserModal = () => setOpenDeleteUserModal(false)

  const handleRefreshBoard = (deletedID) => {
    setCustomer(customer.filter((item) => item.id !== deletedID))
    setChange(!change)
    handleCloseDeleteUserModal()
    console.log(deletedID)
  }

  //Handle open info user modal
  const [userDetail, setUserDetail] = React.useState()
  const [openTargetDetailInfo, setOpenTargetDetailInfo] = React.useState(false)
  const handleOpenTargetDetailInfo = (row) => {
    setUserDetail(row)
    console.log(row)
    setOpenTargetDetailInfo((prev) => !prev)
  }

  //const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/users?populate=*&pagination[page]=${selectedPage}&pagination[pageSize]=7&filters[$or][0][fullName][$contains]=${searchedKey}&filters[$or][1][username][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setCustomer(posts)
        setTotalPages(Math.ceil(posts.length / PER_PAGE))
      })
  }, [selectedPage, searchedKey, change])

  React.useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/users?populate=*&pagination[page]=${selectedPage}&pagination[pageSize]=7&filters[fullName][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setElementNum(posts)
        setTotalPages(Math.ceil(posts.length / PER_PAGE))
      })
  }, [searchedKey])

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '30px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
        <Box>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '300px',
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              value={searchedKey}
              onChange={handleGetSearch}
              placeholder="Tìm kiếm theo tên, username"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
          </Paper>
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', margin: '0 10px' }}
        >
          {/* <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleOpenAddUserModal}
          >
            Thêm người dùng
          </Button> */}
          <AddUserModal
            open={openAddUserModal}
            onClose={handleCloseAddUserModal}
          />
          {userData !== undefined && (
            <InfoUserModal
              open={openTargetDetailInfo}
              onClose={() => setOpenTargetDetailInfo(false)}
              data={userDetail}
              onHandle={() => {
                setOpenTargetDetailInfo(false)
                setChange((prev) => !prev)
              }}
            />
          )}
          <DeleteUserModal
            open={openDeleteUserModal}
            onClose={handleCloseDeleteUserModal}
            data={userData}
            onAfterDelete={handleRefreshBoard}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }} align="center">
                ID
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Username
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Tên đầy đủ
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Ảnh đại diện
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Email
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Xác thực
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Trạng thái
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Trường
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customer.slice(offset, offset + PER_PAGE).map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">
                  <Box
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '150px',
                    }}
                  >
                    {row.username}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  <Box
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '130px',
                    }}
                  >
                    {row.fullName}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {row.avatar !== undefined ? (
                    <Avatar
                      src={
                        process.env.REACT_APP_SERVER_ENDPOINT + row.avatar?.url
                      }
                      alt={row.username}
                      style={{
                        width: '50px',
                        height: '50px',
                        margin: 'auto',
                      }}
                    ></Avatar>
                  ) : (
                    <p style={{ color: 'lightgrey' }}>Chưa có ảnh</p>
                  )}
                </TableCell>
                <TableCell align="left">
                  <Box
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '200px',
                    }}
                  >
                    {row.email}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  {row.confirmed ? (
                    <Box
                      sx={{
                        color: 'blue',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <DoneIcon sx={{ mr: 1 }} />
                      Đã xác thực
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        color: 'red',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <SmsFailedIcon sx={{ mr: 1 }} />
                      Chưa xác thực
                    </Box>
                  )}
                </TableCell>
                <TableCell align="center">
                  {!row.blocked ? (
                    <Box
                      sx={{
                        color: 'green',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <ToggleOffIcon sx={{ mr: 1 }} />
                      Hoạt động
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        color: 'red',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <ToggleOnIcon sx={{ mr: 1 }} />
                      Đã chặn
                    </Box>
                  )}
                </TableCell>
                <TableCell align="left">{row.university}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleOpenTargetDetailInfo(row)
                    }}
                  >
                    <ConstructionIcon />
                  </IconButton>
                  <IconButton color="info">
                    <CircleNotificationsIcon />
                  </IconButton>
                  {/* <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteUserModal(row)}
                  >
                    <BlockIcon />
                  </IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box spacing={2} sx={{ padding: '20px' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePage}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}
