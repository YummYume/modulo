import { toast } from "react-toastify";

export const toastAlert = (type, message, options) => {
    const types = ["success", "error", "warning", "info"];
    const defaultOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...options
    };

    if (!types.includes(type)) {
        toast(message, defaultOptions);
    } else {
        toast[type](message, defaultOptions);
    }
};
