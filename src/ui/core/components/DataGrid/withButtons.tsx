import { Button, Spacer } from 'src/ui/core/components'

import Box from '@mui/material/Box'
import { ButtonProps } from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import green from '@mui/material/colors/green'
import { observer } from 'mobx-react'
import palette from 'src/theme/palette'
import red from '@mui/material/colors/red'
import uniqid from 'uniqid'

const withButtons = (WrappedComponent: any) =>
  observer((props: any) => {
    const { leftButtons = [], rightButtons = [], buttons = true } = props

    const renderButton = (button: ButtonProps & any, color?: string) => {
      if (button.type === 'custom') {
        return button.renderButton()
      }

      return (
        <Button
          sx={{
            // overflow: 'clip',
            // textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            borderRadius: '2px',
            ml: 1,
            mt: 0.5,
            bgcolor: palette.light.button.dark,
            width: 'auto',
            height: '28px',
            fontSize: '14px',
            boxShadow: 'none',
            ...button.sx,
          }}
          key={uniqid()}
          color={button.color}
          onClick={button.onClick}
          disabled={button?.disabled}
          variant="contained"
        >
          {button.title}
        </Button>
      )
    }

    return (
      <Box>
        {buttons ? (
          <Grid
            container
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              position: 'absolute',
              width: '97%',
              pt: 2,
              // bgcolor: 'rgb(244,244,244)',
              zIndex: 100,
              pb: 1,
            }}
          >
            <Grid sx={{ width: 'auto' }} item>
              {leftButtons?.map((button: any) =>
                renderButton(button, green[500])
              )}
            </Grid>
            <Grid item>
              {rightButtons?.map((button: any) =>
                renderButton(button, red[700])
              )}
            </Grid>
          </Grid>
        ) : null}
        <Spacer spacing={2} />
        <WrappedComponent {...props} />
      </Box>
    )
  })

export default withButtons
