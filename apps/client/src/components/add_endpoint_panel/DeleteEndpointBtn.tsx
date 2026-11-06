import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useToast } from "../../hooks/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEndpoint } from "../../api/endpoint";

interface DeleteEndpointBtnProps {
  endpointId: string;
}

const DeleteEndpointBtn = ({ endpointId }: DeleteEndpointBtnProps) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const deleteEndpointMutation = useMutation({
    mutationFn: deleteEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast.success("Endpoint deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete endpoint.");
    },
  });

  const handleDelete = () => {
    deleteEndpointMutation.mutate(endpointId);
  };

  return (
    <IconButton
      className="hover-action-btn"
      aria-label="delete"
      size="small"
      color="error"
      sx={{
        opacity: 0,
        visibility: "hidden",
        // Reserves consistent space so the text never jumps or moves when the button appears
        marginLeft: "auto",
        transition: "opacity 0.15s ease, visibility 0.15s ease",
      }}
      onClick={() => handleDelete()}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
};

export default DeleteEndpointBtn;
