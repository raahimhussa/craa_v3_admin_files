// @mui
import { styled } from '@mui/material/styles'
import {
  Card,
  CardHeader,
  Typography,
  Stack,
  StackProps,
  CardProps,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material'
// utils
import { fShortenNumber } from 'src/utils/formatNumber'
// components
import Image from 'src/ui/components/Image'
import Iconify from 'src/ui/components/Iconify'
import Scrollbar from 'src/ui/components/Scrollbar'
import FlagIcon from 'src/ui/components/FlagIcon'
import { Info } from '@mui/icons-material'

// ----------------------------------------------------------------------

const ItemBlockStyle = styled((props: StackProps) => (
  <Stack direction="row" alignItems="center" {...props} />
))({
  minWidth: 72,
  flex: '1 1',
})

const ItemIconStyle = styled(Iconify)(({ theme }) => ({
  width: 16,
  height: 16,
  marginRight: theme.spacing(0.5),
  color: theme.palette.text.disabled,
}))

// ----------------------------------------------------------------------

type ItemProps = {
  id: string
  name: string
  rate: number
  code: string
}

interface Props extends CardProps {
  title?: string
  info?: string
  subheader?: string
  list: ItemProps[]
}

export default function AppTopInstalledCountries({
  title,
  info,
  subheader,
  list,
  ...other
}: Props) {
  return (
    <Card {...other} sx={{ height: '100%' }}>
      <Tooltip title={info} followCursor>
        <IconButton
          sx={{
            minWidth: '10px !important',
            p: 0,
            position: 'absolute',
            top: 25,
            left: 245,
          }}
        >
          <Info
            sx={{
              fontSize: 15,
              opacity: 0.8,
            }}
          />
        </IconButton>
      </Tooltip>
      <CardHeader title={title} subheader={subheader} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={0}>
            <ItemBlockStyle sx={{ minWidth: '70%' }}>
              <Typography variant="subtitle2">Country</Typography>
            </ItemBlockStyle>

            <ItemBlockStyle>
              <Typography variant="subtitle2">Pass Rate</Typography>
            </ItemBlockStyle>
          </Stack>
          {list.map((country) => (
            <CountryItem key={country.id} country={country} />
          ))}
        </Stack>
      </Scrollbar>
    </Card>
  )
}

// ----------------------------------------------------------------------

type CountryItemProps = {
  country: ItemProps
}

function CountryItem({ country }: CountryItemProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      className="flagStack"
    >
      <ItemBlockStyle sx={{ minWidth: '70%' }}>
        {/* <Image
          disabledEffect
          alt={country.name}
          src={country.flag}
          sx={{ width: 20, mr: 3 }}
        /> */}
        <FlagIcon code={country.code} size={'lg'} />
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: '12px',
            ml: 1,
          }}
        >
          {country.name}
        </Typography>
      </ItemBlockStyle>

      <ItemBlockStyle>
        <Typography
          sx={{
            fontSize: '12px',
          }}
          variant="body2"
        >
          {fShortenNumber(country.rate)}%
        </Typography>
      </ItemBlockStyle>
    </Stack>
  )
}
