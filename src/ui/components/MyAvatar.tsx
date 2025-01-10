// hooks
// utils
//
import createAvatar from 'src/utils/createAvatar'
import Avatar, { Props as AvatarProps } from './Avatar'

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }: AvatarProps) {
  const user = {
    name: 'test',
  }

  return (
    <Avatar
      // src={user?.photoURL}
      // alt={user?.displayName}
      color={true ? 'default' : createAvatar(user?.name).color}
      sx={{
        width: '28px',
        height: '28px',
        bgcolor: 'rgb(255,255,255,0.8)',
        fontSize: '18px',
      }}
      {...other}
    >
      {createAvatar(user?.name).name}
    </Avatar>
  )
}
