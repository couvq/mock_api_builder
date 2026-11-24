import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";

// Reason phrases for the standard HTTP status codes (mirrors Node's
// http.STATUS_CODES). The response viewer shows the live reason phrase returned
// by the server; these labels mirror it so choosing a code reads the same
// ("201 Created").
const STATUS_CODE_REASONS: Record<number, string> = {
  100: "Continue",
  101: "Switching Protocols",
  102: "Processing",
  103: "Early Hints",
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  205: "Reset Content",
  206: "Partial Content",
  207: "Multi-Status",
  208: "Already Reported",
  226: "IM Used",
  300: "Multiple Choices",
  301: "Moved Permanently",
  302: "Found",
  303: "See Other",
  304: "Not Modified",
  305: "Use Proxy",
  307: "Temporary Redirect",
  308: "Permanent Redirect",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  407: "Proxy Authentication Required",
  408: "Request Timeout",
  409: "Conflict",
  410: "Gone",
  411: "Length Required",
  412: "Precondition Failed",
  413: "Payload Too Large",
  414: "URI Too Long",
  415: "Unsupported Media Type",
  416: "Range Not Satisfiable",
  417: "Expectation Failed",
  418: "I'm a Teapot",
  421: "Misdirected Request",
  422: "Unprocessable Entity",
  423: "Locked",
  424: "Failed Dependency",
  425: "Too Early",
  426: "Upgrade Required",
  428: "Precondition Required",
  429: "Too Many Requests",
  431: "Request Header Fields Too Large",
  451: "Unavailable For Legal Reasons",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
  505: "HTTP Version Not Supported",
  506: "Variant Also Negotiates",
  507: "Insufficient Storage",
  508: "Loop Detected",
  510: "Not Extended",
  511: "Network Authentication Required",
};

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
 * top. A stored value that is not a standard code (but still within the
 * schema's accepted range) is listed first so the field never renders blank.
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
  const isKnownCode = value in STATUS_CODE_REASONS;

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
