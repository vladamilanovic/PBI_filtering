import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(4),
    minWidth: '100%',
  },
}))

const ListMulti = ({ data, onChangeCallback }) => {
  const classes = useStyles()
  // console.log('list-Multi data:', data)
  const slicerName = Object.keys(data)[0]
  const sData = data[slicerName]
  const columnName = sData.column

  return (
    <FormControl component="fieldset" className={clsx(classes.formControl, `order-${sData.order}`)}>
      <FormLabel component="legend">{columnName}</FormLabel>
      <FormGroup>
        {sData.valueLists.map((option, index) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={option.checked}
                onChange={onChangeCallback('listMulti', slicerName)}
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
  )
}

export default ListMulti
