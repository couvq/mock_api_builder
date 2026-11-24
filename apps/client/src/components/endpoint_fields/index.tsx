import { Grid, InputAdornment, Typography } from "@mui/material";
import { SelectElement, TextFieldElement } from "react-hook-form-mui";
import DelayInput from "../delay_input";
import StatusCodeInput from "../status_code_input";
import { MOCK_API_BASE_URL } from "../endpoint_viewer";

// `EndpointConfig.method` only models these two, so the dropdown matches it.
const HTTP_METHODS = ["GET", "POST"] as const;

const METHOD_OPTIONS = HTTP_METHODS.map((method) => ({
  id: method,
  label: method,
}));

interface EndpointFieldsProps {
  statusCode: number;
  onStatusCodeChange: (statusCode: number) => void;
  delay: number;
  onDelayChange: (delay: number) => void;
}

/**
 * The method / path / status code / delay row shared by the create and edit
 * endpoint forms. `method` and `path` are react-hook-form fields (this must
 * render inside a `FormContainer`); `statusCode` and `delay` are controlled
 * values owned by the parent.
 */
const EndpointFields = ({
  statusCode,
  onStatusCodeChange,
  delay,
  onDelayChange,
}: EndpointFieldsProps) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 2 }}>
        <SelectElement
          name="method"
          label="Method"
          options={METHOD_OPTIONS}
          required
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextFieldElement
          name="path"
          label="Path"
          required
          fullWidth
          sx={{ "& input": { fontFamily: "monospace" } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    {MOCK_API_BASE_URL}
                  </Typography>
                </InputAdornment>
              ),
            },
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }}>
        <StatusCodeInput
          required
          size="medium"
          fullWidth
          value={statusCode}
          onValueChange={onStatusCodeChange}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 2 }}>
        <DelayInput
          required
          size="medium"
          sx={{ width: "100%" }}
          value={delay}
          onValueChange={(value) => onDelayChange(value ?? 0)}
        />
      </Grid>
    </Grid>
  );
};

export default EndpointFields;
