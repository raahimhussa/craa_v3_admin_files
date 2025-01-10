import { observer } from 'mobx-react'
import { Container, Copyright, Grid, Link } from 'src/ui/core/components'
import { Box, Typography } from '@mui/material'

function FooterView(props: any) {
  const { light = false } = props

  const variantStyle = light ? {
    bgcolor: 'white',
    color: 'black'
  } : {
    bgcolor: '#666666',
    color: '#FFFFFF'
  }


  return (
    <Typography
      sx={{
        position: 'relative', bottom: 14, width: '100%', border: 0,
        justifyContent: 'center', alignItems: 'center',
        ...variantStyle
      }}
      align='center'
      component="h1"
      variant="body2">
      © Copyright 2022 CRA Assessments - All Rights Reserved
    </Typography>
  )
}
export default observer(FooterView)
