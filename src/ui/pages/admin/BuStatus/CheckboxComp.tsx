import { useState, useEffect } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { observer } from 'mobx-react'

function CheckboxComp(props: any) {
  const checkStyle = {
    width: 'auto',
    marginRight: '2rem',
  }
  const [Checked, setChecked] = useState(false)
  const allCheckHandler = () => setChecked(props.isAllChecked)
  const checkHandler = (target: any) => {
    setChecked(!Checked)
    props.func(props.id, target.target.checked)
  }
  useEffect(() => allCheckHandler(), [props.isAllChecked])
  return (
    <FormControlLabel
      control={
        <Checkbox checked={Checked} onChange={(e: any) => checkHandler(e)} />
      }
      label={props.bu}
      sx={checkStyle}
    />
  )
}

export default observer(CheckboxComp)
