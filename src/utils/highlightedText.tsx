import { Box } from '@mui/material'

export const highlightedText = (text: any, query: any) => {
  if (query !== '' && text?.toString()?.toLowerCase()?.includes(query)) {
    const parts = text?.toString()?.split(new RegExp(`(${query})`, 'gi')) || []

    return (
      <Box>
        {parts.map((part: any, index: any) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index}>{part}</mark>
          ) : (
            part
          )
        )}
      </Box>
    )
  }

  return <Box>{text}</Box>
}
