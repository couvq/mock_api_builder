import { EndpointConfig, type MockSchemaType } from "@mock-api-builder/schema";
import { Box, Button, Divider, Stack } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormContainer } from "react-hook-form-mui";
import { Link } from "react-router";
import { updateEndpoint } from "../../../api/endpoint";
import EndpointFields from "../../../components/common/endpoint_fields";
import ResponseSchemaEditor from "../../../components/common/response_schema_editor";
import {
  useEditor,
  useEditorDispatch,
} from "../../../context/Editor/EditorContext";
import { useToast } from "../../../hooks/toast";

interface FormProps {
  endpoint: EndpointConfig;
}

const Form = ({ endpoint }: FormProps) => {
  const [responseSchema, setResponseSchema] = useState<MockSchemaType>(
    endpoint.responseSchema,
  );
  const [delay, setDelay] = useState(endpoint.delay);
  const [statusCode, setStatusCode] = useState(endpoint.statusCode);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { activeEndpointId } = useEditor();
  const editorDispatch = useEditorDispatch();

  const updateEndpointMutation = useMutation({
    mutationFn: updateEndpoint,
    onSuccess: (updatedEndpoint) => {
      queryClient.invalidateQueries({ queryKey: ["endpoints"] });
      // Keep the dashboard's inline editor in sync. Its draft is a copy taken
      // when the endpoint was selected, so without this it would still show the
      // pre-edit values (and let Save re-submit them) after a page edit.
      if (activeEndpointId === updatedEndpoint.id) {
        editorDispatch({ type: "UPDATE_DRAFT", draft: updatedEndpoint });
      }
      toast.success(
        `Endpoint ${updatedEndpoint.method} /${updatedEndpoint.path} updated successfully!`,
      );
    },
    onError: () => toast.error("Failed to update endpoint. Please try again."),
  });

  const handleSave = (formData: {
    method: EndpointConfig["method"];
    path: EndpointConfig["path"];
  }) => {
    updateEndpointMutation.mutate({
      id: endpoint.id,
      method: formData.method,
      path: formData.path,
      statusCode,
      delay,
      responseSchema,
    });
  };

  return (
    <FormContainer
      defaultValues={{ method: endpoint.method, path: endpoint.path }}
      onSuccess={handleSave}
    >
      <EndpointFields
        statusCode={statusCode}
        onStatusCodeChange={setStatusCode}
        delay={delay}
        onDelayChange={setDelay}
      />

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
          <Button
            type="submit"
            variant="contained"
            loading={updateEndpointMutation.isPending}
          >
            Save changes
          </Button>
        </Stack>
      </Box>
    </FormContainer>
  );
};

export default Form;
