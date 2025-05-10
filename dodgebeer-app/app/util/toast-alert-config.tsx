import {
  Bounce,
  ToastContainer,
  toast as baseToast,
  ToastOptions,
  ToastPosition,
  Theme,
} from "react-toastify";

const DEFAULT_POSITION: ToastPosition = "top-right";
const DEFAULT_THEME: Theme = "light";
const DEFAULT_OPTIONS: ToastOptions = {
  position: DEFAULT_POSITION,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  pauseOnFocusLoss: false,
  theme: DEFAULT_THEME,
  transition: Bounce,
};

//-----------------------------------------------------------------------------//
/** TOAST CONTAINER COMPONENT */
//-----------------------------------------------------------------------------//

export function ToastContainerCustom() {
  return <ToastContainer {...DEFAULT_OPTIONS} />;
}

//-----------------------------------------------------------------------------//
/** CUSTOM TOAST METHODS */
//-----------------------------------------------------------------------------//

export const toast = {
  success: (msg: string, opts: ToastOptions = {}) =>
    baseToast.success(msg, { ...DEFAULT_OPTIONS, ...opts }),
  error: (msg: string, opts: ToastOptions = {}) =>
    baseToast.error(msg, { ...DEFAULT_OPTIONS, ...opts }),
  info: (msg: string, opts: ToastOptions = {}) =>
    baseToast.info(msg, { ...DEFAULT_OPTIONS, ...opts }),
  warn: (msg: string, opts: ToastOptions = {}) =>
    baseToast.warn(msg, { ...DEFAULT_OPTIONS, ...opts }),
  default: (msg: string, opts: ToastOptions = {}) =>
    baseToast(msg, { ...DEFAULT_OPTIONS, ...opts }),
};
