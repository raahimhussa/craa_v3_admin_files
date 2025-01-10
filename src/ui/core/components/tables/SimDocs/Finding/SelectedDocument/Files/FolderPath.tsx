import { Box } from '@mui/material'
import { KeyboardArrowRight } from '@mui/icons-material'

type Props = {
  currentPaths: string[]
  onNavigateFolderPath: (index: number) => void
}

export const FolderPath = ({ currentPaths, onNavigateFolderPath }: Props) => {
  return (
    <Box sx={{ height: 48, display: 'flex', alignItems: 'center', ml: 4 }}>
      {currentPaths.map((_path, index) => {
        const isLast = index === currentPaths.length - 1
        return (
          <PathString
            pathname={_path}
            isLast={isLast}
            onNavigateFolderPath={() => onNavigateFolderPath(index)}
          />
        )
      })}
    </Box>
  )
}

const PathString = ({
  pathname,
  isLast,
  onNavigateFolderPath,
}: {
  pathname: string
  isLast: boolean
  onNavigateFolderPath: () => void
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4px 8px 4px 8px',
          cursor: 'pointer',
          borderRadius: 1,
          fontSize: 18,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        }}
        onClick={onNavigateFolderPath}
      >
        {pathname}
      </Box>
      {isLast ? null : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          <KeyboardArrowRight />
        </Box>
      )}
    </Box>
  )
}
