import type { EditorAction, EditorState } from "./EditorContext";

export const editorReducer = (
  state: EditorState,
  action: EditorAction,
): EditorState => {
  switch (action.type) {
    case "ADD_ENDPOINT":
      return {
        activeEndpointId: action.endpoint.id,
        draft: action.endpoint,
      };

    case "UPDATE_DRAFT":
      return {
        ...state,
        draft: action.draft,
      };

    default:
      throw new Error(`Unknown action: ${JSON.stringify(action)}`);
  }
};