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

    case "DELETE_ENDPOINT":
      if (state.activeEndpointId === action.endpointId) {
        return {
          activeEndpointId: undefined,
          draft: undefined,
        };
      }
      return state;

    default:
      throw new Error(`Unknown action: ${JSON.stringify(action)}`);
  }
};
