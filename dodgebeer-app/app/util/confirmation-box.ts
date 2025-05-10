import Swal from "sweetalert2";

/**
 * Shows a SweetAlert2 confirmation dialog for deleting an object.
 *
 * @param {string} title - The title of the confirmation dialog.
 * @param {string} text - The warning message displayed in the dialog.
 * @param {string} confirmButtonText - The text on the confirm button.
 * @returns {Promise<boolean>} - Resolves to true if the user confirmed deletion.
 */
export async function deleteObjectConfirmationBox(
  title: string = "Are you sure?",
  text: string = "You won't be able to revert this!",
  confirmButtonText: string = "Yes, delete it!",
) {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmButtonText,
  });

  return result.isConfirmed;
}
