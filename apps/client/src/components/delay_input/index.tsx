import * as React from "react";
import NumberField from "../number_field";

type DelayInputProps = React.ComponentProps<typeof NumberField>;

/**
 * Number input for a response delay in milliseconds. Thin wrapper around
 * NumberField with delay-appropriate defaults; all other NumberField props
 * (value, onValueChange, error, helperText, ...) pass straight through so it
 * can be reused as a controlled field in the editor and create forms.
 */
export default function DelayInput({
  label = "Delay (ms)",
  size = "small",
  min = 0,
  ...props
}: DelayInputProps) {
  return <NumberField label={label} size={size} min={min} {...props} />;
}
