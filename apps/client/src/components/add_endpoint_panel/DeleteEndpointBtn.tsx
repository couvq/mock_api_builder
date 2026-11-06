import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useToast } from "../../hooks/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEndpoint } from "../../api/endpoint";
import { useState } from "react";

interface DeleteEndpointBtnProps {
  endpointId: string;
}

interface ConfirmDeletionModalProps {
  isOpen: boolean;
  endpointId: string;
  onClose: () => void;
}

const ConfirmDeletionModal = ({
  isOpen,
  endpointId,
  onClose,
}: ConfirmDeletionModalProps) => {
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      role="alertdialog"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirm Endpoint Deletion"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this endpoint? This action cannot be
          undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button onClick={handleDelete} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteEndpointBtn = ({ endpointId }: DeleteEndpointBtnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
        onClick={() => setIsModalOpen(true)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <ConfirmDeletionModal
        isOpen={isModalOpen}
        endpointId={endpointId}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DeleteEndpointBtn;
