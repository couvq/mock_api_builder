import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router";

const AddEndpointBtn = () => {
  return (
    <Button
      component={Link}
      to="/endpoint/new"
      startIcon={<AddIcon />}
      variant="contained"
    >
      New endpoint
    </Button>
  );
};

export default AddEndpointBtn;
