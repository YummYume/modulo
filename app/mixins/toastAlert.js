import { toast } from "react-toastify";

export const toastAlert = (type, message, options) => {
    const types = ["success", "error", "warning", "info", "default"];

    if (!types.contains(type)) {
        type = "default";
    }

    toast[type](message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        ...options
    });
};
