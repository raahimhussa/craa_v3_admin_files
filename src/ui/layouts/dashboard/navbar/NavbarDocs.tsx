// @mui
import { Stack, Button, Typography } from '@mui/material';
import useLocales from 'src/hooks/useLocales';
// hooks
// routes
// assets

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  const { translate } = useLocales();

  return (
    <Stack
      spacing={3}
      sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}
    >
      {/* <DocIllustration sx={{ width: 1 }} /> */}

      <div>
        <Typography gutterBottom variant="subtitle1">
          {translate('docs.hi')}, Test
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
          {translate('docs.description')}
        </Typography>
      </div>

      <Button href={''} target="_blank" rel="noopener" variant="contained">
        {translate('docs.documentation')}
      </Button>
    </Stack>
  );
}
