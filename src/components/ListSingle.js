import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(4),
    minWidth: '100%',
  },
}))

const ListSingle = ({ data, onChangeCallback }) => {
  const classes = useStyles()
  // console.log('list-single data:', data)
  const slicerName = Object.keys(data)[0]
  const sData = data[slicerName]

  return (
    <FormControl component="fieldset" className={clsx(classes.formControl, `order-${sData.order}`)}>
      <FormLabel component="legend">{sData.column}</FormLabel>
      <RadioGroup
        aria-label={slicerName}
        name={slicerName}
        value={sData.curValue}
        onChange={onChangeCallback('listSingle', slicerName)}
      >
        {sData.valueLists.map((v, index) => (
          <FormControlLabel value={v} control={<Radio />} label={v} key={index} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default ListSingle
