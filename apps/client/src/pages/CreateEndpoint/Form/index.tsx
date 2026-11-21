import { Box, Button, Divider, Stack } from "@mui/material";
import { EndpointConfig, type MockSchemaType } from "@mock-api-builder/schema";
import { useState } from "react";
import { FormContainer } from "react-hook-form-mui";
import { Link } from "react-router";
import EndpointFields from "../../../components/endpoint_fields";
import ResponseSchemaEditor from "../../../components/response_schema_editor";
import { createEndpoint } from "../../../api/endpoint";
import { useToast } from "../../../hooks/toast";

const DEFAULT_RESPONSE_SCHEMA: MockSchemaType = {};

const Form = () => {
  const [responseSchema, setResponseSchema] = useState<MockSchemaType>(
    DEFAULT_RESPONSE_SCHEMA,
  );
  const [delay, setDelay] = useState(0);
  const { error, success } = useToast();

  const handleCreate = async (formData: {
    method: EndpointConfig["method"];
    path: EndpointConfig["path"];
  }) => {
    const payload: Omit<EndpointConfig, "id"> = {
      method: formData.method,
      path: formData.path,
      delay,
      responseSchema,
    };

    try {
      const newEndpoint = await createEndpoint(payload);
      success(
        `Endpoint ${newEndpoint.method} /${newEndpoint.path} created successfully!`,
      );
    } catch {
      error("Failed to create endpoint. Please try again.");
    }
  };

  return (
    <FormContainer
      defaultValues={{ method: "GET", path: "" }}
      onSuccess={handleCreate}
    >
      <EndpointFields delay={delay} onDelayChange={setDelay} />

      <ResponseSchemaEditor
        value={responseSchema}
        onChange={setResponseSchema}
      />

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button component={Link} to="/dashboard">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Create endpoint
          </Button>
        </Stack>
      </Box>
    </FormContainer>
  );
};

export default Form;
