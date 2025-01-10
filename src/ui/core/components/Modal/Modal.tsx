import { ModalProps as MuiModalProps } from '@mui/material/Modal';
import compose from '@shopify/react-compose';
import ModalView from './ModalView';

export type ModalProps =
  | MuiModalProps
  | {
      state: any;
      path: string;
    };

export default compose<ModalProps>()(ModalView);
