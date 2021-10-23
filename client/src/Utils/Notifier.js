import { toast } from "react-toastify";


const Notifier = {
    notificationType: Object.freeze({ "SUCCESS": 1, "WARNING": 2, "ERROR": 3, "INFO": 4 }),
    notify: (msg, type) => {
        if (type === 1) {
            toast.success(msg, {
                position: "bottom-left",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else if (type === 2) {
            toast.warn(msg, {
                position: "bottom-left",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else if (type === 3) {
            toast.error(msg, {
                position: "bottom-left",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else {
            toast(msg, {
                position: "bottom-left",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
}
export default Notifier;