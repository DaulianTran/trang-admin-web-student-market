import { useState, useEffect } from 'react'
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

// Icon import.
import SearchIcon from '@mui/icons-material/Search'
import ConstructionIcon from '@mui/icons-material/Construction'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCategoryModal from './AddCategoryModal'
import DeleteCategoryModal from './DeleteCategoryModal'
import UpdateCategoryModal from './UpdateCategoryModal'

export default function category() {
  const [customer, setCustomer] = useState([])
  const [elementNum, setElementNum] = useState([])
  const [selectedPage, setSelectedPage] = useState('')
  const [change, setChange] = useState(true)

  const handleGetPage = (event, elementNum) => {
    setSelectedPage(elementNum)
  }

  const [searchedKey, setSearchedKey] = useState('')

  const handleGetSearch = (e) => {
    setSearchedKey(e.target.value)
  }

  // Using for Modal Add category
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)
  const handleOpenAddCategoryModal = () => setOpenAddCategoryModal(true)
  const handleCloseAddCategoryModal = () => setOpenAddCategoryModal(false)

  // Using for Dialog delete category
  const [categoryDeleteData, setCategoryDeleteData] = useState({
    id: '',
    name: '',
  })
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false)
  const handleOpenDeleteCategoryModal = (data) => {
    setOpenDeleteCategoryModal(true)
    setCategoryDeleteData({ id: data.id, name: data.attributes.name })
  }

  const handleCloseDeleteCategoryModal = () => setOpenDeleteCategoryModal(false)

  // Using for Dialog update category
  const [selectedCategory, setSelectedCategory] = useState(null)

  const [openUpdateCategoryModal, setOpenUpdateCategoryModal] = useState(false)
  const handleOpenUpdateCategoryModal = (category) => {
    setOpenUpdateCategoryModal(true)
    setSelectedCategory(category)
  }

  const handleOnCreate = () => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/categories?populate=*&pagination[page]=1&pagination[pageSize]=7&filters[name][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setCustomer(posts.data)
      })
  }

  const handleUpdate = () => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/categories?populate=*&pagination[page]=${selectedPage}&pagination[pageSize]=7&filters[name][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        console.log('đã được gọi')
        setCustomer(posts.data)
      })
  }

  const handleCloseUpdateCategoryModal = () => setOpenUpdateCategoryModal(false)

  const handleRefreshBoard = (deletedID) => {
    setCustomer(customer.filter((item) => item.id !== deletedID))
    setChange(!change)
    handleCloseDeleteCategoryModal()
    console.log(deletedID)
  }

  //const [open, setOpen] = useState(false);

  useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/categories?populate=*&pagination[page]=${selectedPage}&pagination[pageSize]=7&filters[name][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setCustomer(posts.data)
      })
  }, [selectedPage, searchedKey, change])

  useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/categories?filters[name][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setElementNum(posts.data)
      })
  }, [searchedKey])

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // padding: '20px',
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
              placeholder="Tìm kiếm theo tên, mã danh mục"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
          </Paper>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleOpenAddCategoryModal}
            sx={{ margin: '0 10px', padding: '9px 16px' }}
          >
            Thêm danh mục
          </Button>
          <AddCategoryModal
            open={openAddCategoryModal}
            onClose={handleCloseAddCategoryModal}
            categoryData={elementNum}
            onCreate={handleOnCreate}
          />
          {selectedCategory && (
            <UpdateCategoryModal
              open={openUpdateCategoryModal}
              onClose={handleCloseUpdateCategoryModal}
              category={selectedCategory}
              categoryData={elementNum}
              onUpdate={handleUpdate}
            />
          )}
          <DeleteCategoryModal
            open={openDeleteCategoryModal}
            onClose={handleCloseDeleteCategoryModal}
            categoryID={categoryDeleteData.id}
            categoryName={categoryDeleteData.name}
            onAfterDelete={handleRefreshBoard}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>Mã danh mục</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Ảnh
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Tên danh mục
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Mô tả
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Danh mục cha
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Danh mục con
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customer.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.id}
                </TableCell>
                <TableCell align="center">
                  {row.attributes.image?.data ? (
                    <Box key={row.id}>
                      <img
                        src={
                          process.env.REACT_APP_SERVER_ENDPOINT +
                          row.attributes.image.data.attributes.url
                        }
                        alt={row.attributes.image.data.attributes.name}
                        style={{ width: '50px', height: '50px' }}
                      ></img>
                    </Box>
                  ) : (
                    <p style={{ color: 'lightgrey' }}>Chưa có ảnh</p>
                  )}
                </TableCell>
                <TableCell align="center">{row.attributes.name}</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: row.attributes.description ? 'black' : 'lightgrey',
                  }}
                >
                  {row.attributes.description
                    ? row.attributes.description
                    : 'Chưa có mô tả'}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: row.attributes.parent.data ? 'black' : 'blue',
                  }}
                >
                  {row.attributes.parent.data
                    ? row.attributes.parent.data.attributes.name
                    : 'Danh mục cao nhất'}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    color: row.attributes.children.data ? 'black' : 'lightgrey',
                  }}
                >
                  {row.attributes.children.data
                    ? row.attributes.children.data.map((row) => (
                        <Box key={row.id}>{row.attributes.name}</Box>
                      ))
                    : 'Chưa có danh mục con'}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleOpenUpdateCategoryModal(row)
                    }}
                  >
                    <ConstructionIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteCategoryModal(row)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box spacing={2} sx={{ padding: '20px' }}>
        <Pagination
          count={Math.ceil(elementNum.length / 7)}
          onChange={handleGetPage}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}
