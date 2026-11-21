import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

interface DeleteEndpointBtnProps {
  onClick: () => void;
}

const DeleteEndpointBtn = ({ onClick }: DeleteEndpointBtnProps) => {
  return (
    <IconButton
      className="hover-action-btn"
      aria-label="delete"
      size="small"
      color="error"
      sx={{
        opacity: 0,
        visibility: "hidden",
        transition: "opacity 0.15s ease, visibility 0.15s ease",
      }}
      onClick={onClick}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
};

export default DeleteEndpointBtn;
