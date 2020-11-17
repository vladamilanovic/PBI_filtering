import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: '100%',
  },
  legend: {
    color: '#0000008a',
  },
  mTop: {
    marginTop: theme.spacing(2),
  },
}))

export default function DropSingle({ data, onChangeCallback }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const slicerName = Object.keys(data)[0]
  const sData = data[slicerName]
  const columnName = sData.column

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div className={clsx(classes.mTop, `order-${sData.order}`)}>
      <span className={classes.legend}>{columnName}</span>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick} className="vm-mw-100 vm-dropdown">
        <div className="vm-mw-100 vm-between-center">
          <span>{sData.curValue}</span>
          <KeyboardArrowDownIcon className={open ? 'vm-rotate' : 'vm-default'} />
        </div>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="vm-popover"
      >
        <div className={classes.root}>
          <FormControl component="fieldset" className={classes.formControl}>
            <RadioGroup
              aria-label={slicerName}
              name={slicerName}
              value={sData.curValue}
              onChange={onChangeCallback('dropSingle', slicerName)}
            >
              {sData.valueLists.map((v, index) => (
                <FormControlLabel value={v} control={<Radio />} label={v} key={index} />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </Popover>
    </div>
  )
}
