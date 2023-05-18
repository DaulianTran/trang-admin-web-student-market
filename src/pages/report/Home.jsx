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
import IconButton from '@mui/material/IconButton'

// Icon import
import SearchIcon from '@mui/icons-material/Search'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import LoginIcon from '@mui/icons-material/Login'
import WarningIcon from '@mui/icons-material/Warning'
import DeleteIcon from '@mui/icons-material/Delete'
import BeenhereIcon from '@mui/icons-material/Beenhere'

import TargetDetailModal from './TargetDetailModal'
import DeleteReportModal from './DeleteReportModal'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits'
import BlockIcon from '@mui/icons-material/Block'
import {
  Link,
  MenuItem,
  TextField,
  Tooltip,
} from '../../../node_modules/@mui/material/index'
import InventoryIcon from '@mui/icons-material/Inventory'
import PersonIcon from '@mui/icons-material/Person'

export default function category() {
  const currencies = [
    {
      value: 'user',
      label: 'Người dùng',
    },
    {
      value: 'product',
      label: 'Sản phẩm',
    },
  ]

  const formatDate = (date) => {
    const inputDate = new Date(date)
    const minutes =
      inputDate.getMinutes() < 10
        ? `0${inputDate.getMinutes()}`
        : inputDate.getMinutes()

    return (
      `${inputDate.getDate().toString().padStart(2, '0')}-${(
        inputDate.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          '0',
        )}-${inputDate.getFullYear()} ${inputDate.getHours()}:` + minutes
    )
  }

  const [report, setReport] = React.useState([])
  const [elementNum, setElementNum] = React.useState([])
  const [selectedPage, setSelectedPage] = React.useState('')
  const [change, setChange] = React.useState(true)

  const [openTargetDetailInfo, setOpenTargetDetailInfo] = React.useState(false)
  const [selectedAccused, setSelectedAccused] = React.useState()
  const [selectedType, setSelectedType] = React.useState()
  const [selectedData, setSelectedData] = React.useState()
  const [selectedName, setSelectedName] = React.useState('None')

  const [selectedTarget, setSelectedTarget] = React.useState()
  const [openDeleteReportModal, setOpenDeleteReportModal] =
    React.useState(false)

  const handleGetPage = (event, elementNum) => {
    setSelectedPage(elementNum)
  }

  const [searchedKey, setSearchedKey] = React.useState('')
  const [filter, setFilter] = React.useState('all')

  const handleGetSearch = (e) => {
    setSearchedKey(e.target.value)
  }

  // Using for Dialog delete user
  const handleOpenDeleteReportModal = (item) => {
    setOpenDeleteReportModal((prev) => !prev)
    setSelectedTarget(item)
  }
  const handleCloseDeleteReportModal = () => setOpenDeleteReportModal(false)

  const handleRefreshBoard = () => {
    setOpenDeleteReportModal(false)
    setChange(!change)
  }

  //const [open, setOpen] = React.useState(false);

  const handleOpenTargetDetailInfo = (item) => {
    setOpenTargetDetailInfo((prev) => !prev)
    setSelectedAccused(item.id)
    setSelectedType(item.type)
    setSelectedData(item)
  }

  React.useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/reports?pagination[page]=${selectedPage}&pagination[pageSize]=7&filters[$or][0][product][name][$contains]=${searchedKey}&filters[$or][1][accused][username][$contains]=${searchedKey}&populate=*` +
      (filter !== 'all' ? `&filters[type][$eq]=${filter}` : ``)
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setReport(posts.data)
        console.log(posts.data)
      })
  }, [selectedPage, searchedKey, change, filter])

  React.useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/reports?filters[$or][0][product][name][$contains]=${searchedKey}&filters[$or][1][accused][username][$contains]=${searchedKey}&populate=*` +
      (filter !== 'all' ? `&filters[type][$eq]=${filter}` : ``)
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setElementNum(posts.data)
      })
  }, [searchedKey, filter, change])

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
              width: '360px',
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              value={searchedKey}
              onChange={handleGetSearch}
              placeholder="Tìm kiếm theo người / sản phẩm (bị) tố cáo"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
          </Paper>
          <Box className="CRUDToolHere">
            {selectedAccused && (
              <TargetDetailModal
                open={openTargetDetailInfo}
                onClose={handleOpenTargetDetailInfo}
                targetID={selectedAccused}
                targetType={selectedType}
                selectedData={selectedData}
                onHandle={() => {
                  setOpenTargetDetailInfo(false)
                }}
              />
            )}
            {selectedTarget && (
              <DeleteReportModal
                open={openDeleteReportModal}
                onClose={handleCloseDeleteReportModal}
                targetData={selectedTarget}
                onHandle={handleRefreshBoard}
              />
            )}
          </Box>
        </Box>
        <TextField
          id="outlined-select-currency"
          select
          label="Lọc báo cáo"
          sx={{ ml: '16px', width: '170px' }}
          onChange={(event) => {
            setFilter(event.target.value)
          }}
        >
          <MenuItem key={'all'} value={'all'}>
            Tất cả
          </MenuItem>
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>Mã báo cáo</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Loại báo cáo
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Người báo cáo
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Mục tiêu bị cáo cáo
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Thời gian
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Lý do
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">
                  {row.attributes?.type === 'user' ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '3px',
                        color: 'darkblue',
                        borderRadius: '6px',
                        fontSize: '13px',
                        backgroundColor: 'lightblue',
                        fontSize: '13px',
                      }}
                    >
                      <PersonIcon sx={{ mr: '6px', fontSize: '14px' }} />
                      Người dùng
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: '3px',
                        color: 'green',
                        borderRadius: '6px',
                        fontSize: '13px',
                        backgroundColor: 'lightgreen',
                      }}
                    >
                      <InventoryIcon sx={{ mr: 1, fontSize: '14px' }} />
                      Sản phẩm
                    </Box>
                  )}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color:
                      row.attributes?.reporter?.data === undefined
                        ? 'lightgrey'
                        : '',
                  }}
                >
                  {row.attributes?.reporter?.data === undefined
                    ? 'Không có dữ liệu'
                    : row.attributes?.reporter.data?.attributes.username}
                </TableCell>
                <TableCell align="left">
                  <Link href="#" underline="none">
                    {row.attributes?.type === 'product'
                      ? row.attributes.product.data?.attributes.name
                      : row.attributes.accused.data?.attributes.username}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  {formatDate(row.attributes.createdAt)}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    maxWidth: '360px',
                    color: !row.attributes.description ? 'lightgrey' : '',
                  }}
                >
                  <Box
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '280px',
                    }}
                  >
                    {row.attributes.description
                      ? row.attributes.description?.length > 30
                        ? row.attributes.description.substring(0, 30) + '...'
                        : row.attributes.description
                      : 'Chưa rõ lý do'}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Duyệt tố cáo">
                    <IconButton
                      color="primary"
                      sx={{ m: '0 4px' }}
                      onClick={() =>
                        handleOpenTargetDetailInfo(
                          row.attributes?.type === 'product'
                            ? {
                                id: row.attributes.product.data?.id,
                                type: 'product',
                                name: row.attributes.product.data?.attributes
                                  .name,
                                description: row.attributes.description,
                              }
                            : {
                                id: row.attributes.accused.data?.id,
                                type: 'user',
                                name: row.attributes.accused.data?.attributes
                                  .username,
                                description: row.attributes.description,
                              },
                        )
                      }
                    >
                      <LoginIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Đánh dấu đã duyệt">
                    <IconButton
                      color="info"
                      sx={{ m: '0 4px' }}
                      onClick={() =>
                        handleOpenDeleteReportModal(
                          row.attributes?.type === 'product'
                            ? {
                                id: row.id,
                                type: 'product',
                                name: row.attributes.product.data?.attributes
                                  .name,
                              }
                            : {
                                id: row.id,
                                type: 'user',
                                name: row.attributes.accused.data?.attributes
                                  .username,
                              },
                        )
                      }
                    >
                      <BeenhereIcon />
                    </IconButton>
                  </Tooltip>
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
