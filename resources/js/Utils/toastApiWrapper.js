import axios from "axios";
import Swal from "sweetalert2";

export async function submitActions({
    title = "Confirmation",
    text = "Are you sure?",
    icon = "info",
    html = null,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    confirmButtonColor = "#3085d6",
    cancelButtonColor = "#d33",
    reverseButtons = true,
    axiosConfig,
    onSuccess,
    onError,
    onBefore,
}) {

    try {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: icon,
            html: html,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: cancelButtonColor,
            showCancelButton: true,
            reverseButtons: reverseButtons,
        });

        if (!result.isConfirmed) return;

        if (onBefore) onBefore();

        const response = await axios(axiosConfig);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: response.data || "Success",
            showConfirmButton: false,
            timer: 1500,
        });

        if (onSuccess) onSuccess(response);
    } catch (error) {
        console.log(error);
        
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error!",
            text:
                error.response && error.response.status === 403
                    ? "You do not have permission to perform this action."
                    : error.response.data.error
                    ? error.response.data.error
                    : error.message || error,
            showConfirmButton: false,
            timer: 2000,
        });

        if (onError) onError(error);
    }
}

export function showLoader(message) {
    return Swal.fire({
        title: message || "Processing...",
        allowOutsideClick: false,
        timerProgressBar: true,
    });
}

export function hideLoader() {
    return Swal.close();
}
