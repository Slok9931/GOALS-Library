import PropTypes from 'prop-types'
import { forwardRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'

// material-ui
import { useTheme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import Badge from '@mui/material/Badge'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions'

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const customization = useSelector((state) => state.customization)
  const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

  const [activeRequests, setActiveRequests] = useState(false)

  // Fetch active requests from localStorage
  useEffect(() => {
    const fetchRequests = () => {
      const storedRequests = localStorage.getItem('request')
      setActiveRequests(storedRequests === 'true')
    }
    fetchRequests()
    const intervalId = setInterval(() => {
      fetchRequests()
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  const Icon = item.icon
  const itemIcon = item?.icon ? (
    <Badge
      color="error"
      variant="dot"
      invisible={!(item.title === 'Requests' && activeRequests)} // Show dot only if activeRequests is true
    >
      <Icon stroke={1.5} size="1.3rem" />
    </Badge>
  ) : (
    <FiberManualRecordIcon
      sx={{
        width:
          customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
        height:
          customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
      }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  )

  let itemTarget = '_self'
  if (item.target) {
    itemTarget = '_blank'
  }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    )),
  }
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: {itemTarget} }
  }

  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id })
    if (matchesSM) dispatch({ type: SET_MENU, opened: false })
  }

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id)
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id })
    }
    // eslint-disable-next-line
  }, [pathname])

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 0.5,
        alignItems: 'flex-start',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        py: level > 1 ? 1 : 1.25,
        pl: `${level * 24}px`,
      }}
      selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      onClick={() => itemHandler(item.id)}>
      <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>
        {itemIcon}
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={
              customization.isOpen.findIndex((id) => id === item.id) > -1
                ? 'h5'
                : 'body1'
            }
            color="inherit">
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              sx={{ ...theme.typography.subMenuCaption }}
              display="block"
              gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  )
}

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  activeRequests: PropTypes.bool, // Prop for active requests
}

export default NavItem
