import type { EndpointConfig } from "@mock-api-builder/schema";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { deleteEndpoint } from "../../api/endpoint";
import { useEditorDispatch } from "../../context/Editor/EditorContext";
import { useToast } from "../../hooks/toast";

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
    onSuccess: (_data, endpointId) => {
      dispatch({ type: "DELETE_ENDPOINT", endpointId });
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

  const handleDelete = () => {
    deleteEndpointMutation.mutate(endpoint.id);
  };

  const endpointLabel = `${endpoint.method} /${endpoint.path}`;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      role="alertdialog"
    >
      <DialogTitle id="alert-dialog-title">
        Confirm Endpoint Deletion
      </DialogTitle>
      <FormContainer onSuccess={handleDelete}>
        <DialogContent id="alert-dialog-description">
          <Stack direction="column" spacing={2}>
            <Typography>
              Are you sure you want to delete this endpoint? This action cannot
              be undone. Type "{endpointLabel}" to confirm.
            </Typography>
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
          </Stack>
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

export default ConfirmDeletionModal;
