import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  STATUS_CODE_REASONS,
  isKnownStatusCode,
} from "@mock-api-builder/schema";

// Codes surfaced at the top of the dropdown, in this order, for quick access.
const COMMON_STATUS_CODES = [
  200, 201, 202, 204, 301, 302, 304, 400, 401, 403, 404, 405, 409, 422, 429,
  500, 502, 503,
];

const commonSet = new Set(COMMON_STATUS_CODES);
// Integer-keyed objects enumerate in ascending numeric order, so this is the
// full code list sorted; the common ones are pulled out into their own group.
const OTHER_STATUS_CODES = Object.keys(STATUS_CODE_REASONS)
  .map(Number)
  .filter((code) => !commonSet.has(code));

const formatLabel = (code: number): string => {
  const reason = STATUS_CODE_REASONS[code];
  return reason ? `${code} ${reason}` : `${code}`;
};

interface StatusCodeInputProps {
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
  size?: "small" | "medium";
  required?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * Dropdown for choosing an endpoint's HTTP response status code. Controlled
 * like DelayInput (value / onValueChange owned by the parent) so it can be
 * reused by the create/edit forms and the dashboard's inline editor.
 *
 * Lists every standard HTTP status code, with the common ones pinned to the
 * top. Defensively, a stored value that is not a standard code is listed first
 * so the field never renders blank.
 */
export default function StatusCodeInput({
  value,
  onValueChange,
  label = "Status code",
  size = "small",
  required,
  fullWidth,
  sx,
}: StatusCodeInputProps) {
  const isKnownCode = isKnownStatusCode(value);

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(event) => onValueChange(Number(event.target.value))}
      size={size}
      required={required}
      fullWidth={fullWidth}
      sx={sx}
    >
      {!isKnownCode && <MenuItem value={value}>{formatLabel(value)}</MenuItem>}
      <ListSubheader>Common</ListSubheader>
      {COMMON_STATUS_CODES.map((code) => (
        <MenuItem key={code} value={code}>
          {formatLabel(code)}
        </MenuItem>
      ))}
      <ListSubheader>All status codes</ListSubheader>
      {OTHER_STATUS_CODES.map((code) => (
        <MenuItem key={code} value={code}>
          {formatLabel(code)}
        </MenuItem>
      ))}
    </TextField>
  );
}
