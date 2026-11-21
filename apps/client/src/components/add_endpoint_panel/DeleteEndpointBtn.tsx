import type { EndpointConfig } from "@mock-api-builder/schema";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type BaseSyntheticEvent, type MouseEvent } from "react";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { deleteEndpoint } from "../../api/endpoint";
import { useEditorDispatch } from "../../context/Editor/EditorContext";
import { useToast } from "../../hooks/toast";

interface DeleteEndpointBtnProps {
  endpoint: EndpointConfig;
}

interface ConfirmDeletionModalProps {
  isOpen: boolean;
  endpoint: EndpointConfig;
  onClose: () => void;
}

const ConfirmDeletionModal = ({
  isOpen,
  endpoint,
  onClose,
}: ConfirmDeletionModalProps) => {
  const dispatch = useEditorDispatch();
  const toast = useToast();
  const queryClient = useQueryClient();
  const deleteEndpointMutation = useMutation({
    mutationFn: deleteEndpoint,
    onSuccess: () => {
      dispatch({ type: "DELETE_ENDPOINT", endpointId: endpoint.id });
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      toast.success("Endpoint deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete endpoint.");
    },
    onSettled: () => {
      onClose();
    },
  });

  const handleDelete = (e?: BaseSyntheticEvent) => {
    e?.stopPropagation(); // Prevent the click from propagating to the parent ListItemButton
    deleteEndpointMutation.mutate(endpoint.id);
  };

  const endpointLabel = `${endpoint.method} /${endpoint.path}`;

  return (
    <Dialog
      onClick={(e) => e.stopPropagation()}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      role="alertdialog"
    >
      <DialogTitle id="alert-dialog-title">
        Confirm Endpoint Deletion
      </DialogTitle>
      <FormContainer onSuccess={(_data, e) => handleDelete(e)}>
        <DialogContent id="alert-dialog-description">
          Are you sure you want to delete this endpoint? This action cannot be
          undone. Type "{endpointLabel}" to confirm.
          <TextFieldElement
            name="confirmation"
            placeholder={endpointLabel}
            required
            rules={{
              validate: (value: string) => {
                if (value !== endpointLabel) {
                  return `Value must be ${endpointLabel}`;
                }
                return true;
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="error"
            loading={deleteEndpointMutation.isPending}
          >
            Confirm
          </Button>
        </DialogActions>
      </FormContainer>
    </Dialog>
  );
};

const DeleteEndpointBtn = ({ endpoint }: DeleteEndpointBtnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent the click from propagating to the parent ListItemButton
    setIsModalOpen(true);
  };

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
        onClick={handleDeleteClick}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <ConfirmDeletionModal
        isOpen={isModalOpen}
        endpoint={endpoint}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DeleteEndpointBtn;
