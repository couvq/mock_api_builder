import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router";

const AddEndpointBtn = () => {
  return (
    <Link to="/endpoint/new">
      <Button variant="contained" startIcon={<AddIcon />}>
        New endpoint
      </Button>
    </Link>
  );
};

export default AddEndpointBtn;
