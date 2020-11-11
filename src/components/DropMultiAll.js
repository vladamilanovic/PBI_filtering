import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

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
}))

export default function DropMultiAll({ data, onChangeCallback }) {
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
    <div>
      <span className={classes.legend}>{columnName}</span>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick} className="vm-mw-100 vm-dropdown">
        <div className="vm-mw-100 vm-between-center">
          <span>
            {sData.curValue.length === 0 || sData.curValue.length === sData.valueLists.length
              ? 'ALL'
              : sData.curValue.length === 1
              ? sData.curValue[0]
              : 'Multiple selections'}
          </span>
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
            <FormGroup>
              {sData.valueLists.map((option, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.checked}
                      onChange={onChangeCallback('dropMultiAll', slicerName)}
                      name={option.label}
                      className={classes.p0}
                    />
                  }
                  label={option.label}
                  key={index}
                />
              ))}
            </FormGroup>
          </FormControl>
        </div>
      </Popover>
    </div>
  )
}
