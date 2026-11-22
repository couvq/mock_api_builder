import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Link } from "react-router";

interface EditEndpointBtnProps {
  endpointId: string;
}

const EditEndpointBtn = ({ endpointId }: EditEndpointBtnProps) => {
  return (
    <IconButton
      className="hover-action-btn"
      aria-label="edit"
      size="small"
      component={Link}
      to={`/endpoint/edit?endpointId=${endpointId}`}
      sx={{
        opacity: 0,
        visibility: "hidden",
        transition: "opacity 0.15s ease, visibility 0.15s ease",
      }}
    >
      <EditIcon fontSize="small" />
    </IconButton>
  );
};

export default EditEndpointBtn;
