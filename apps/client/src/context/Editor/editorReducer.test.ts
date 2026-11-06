import type { EditorAction, EditorState } from "./EditorContext";
import { editorReducer } from "./editorReducer";

const initialEditorState: EditorState = {
  activeEndpointId: undefined,
  draft: undefined,
};

describe("editorReducer", () => {
  it("ADD_ENDPOINT", () => {
    const addEndpointAction: EditorAction = {
      type: "ADD_ENDPOINT",
      endpoint: {
        id: "1",
        method: "GET",
        path: "friends",
        responseSchema: {},
      },
    };
    const expectedNextState: EditorState = {
      activeEndpointId: "1",
      draft: {
        id: "1",
        method: "GET",
        path: "friends",
        responseSchema: {},
      },
    };

    const nextState = editorReducer(initialEditorState, addEndpointAction);
    expect(nextState).toEqual(expectedNextState);
  });

  it("UPDATE_DRAFT", () => {
    const currentEditorState: EditorState = {
      activeEndpointId: "1",
      draft: {
        id: "1",
        method: "GET",
        path: "friends",
        responseSchema: {},
      },
    };
    const updateDraftAction: EditorAction = {
      type: "UPDATE_DRAFT",
      draft: {
        id: "1",
        method: "GET",
        path: "friends",
        responseSchema: {
          friends: [],
        },
      },
    };
    const expectedNextState: EditorState = {
      activeEndpointId: "1",
      draft: {
        id: "1",
        method: "GET",
        path: "friends",
        responseSchema: {
          friends: [],
        },
      },
    };

    const nextState = editorReducer(currentEditorState, updateDraftAction);
    expect(nextState).toEqual(expectedNextState);
  });

  describe("DELETE_ENDPOINT", () => {
    it("should clear activeEndpointId and draft if the deleted endpoint is the active one", () => {
      const currentEditorState: EditorState = {
        activeEndpointId: "1",
        draft: {
          id: "1",
          method: "GET",
          path: "friends",
          responseSchema: {},
        },
      };

      const deleteEndpointAction: EditorAction = {
        type: "DELETE_ENDPOINT",
        endpointId: "1",
      };

      const expectedNextState: EditorState = {
        activeEndpointId: undefined,
        draft: undefined,
      };

      const nextState = editorReducer(currentEditorState, deleteEndpointAction);
      expect(nextState).toEqual(expectedNextState);
    });

    it("should not change the state if the deleted endpoint is not the active one", () => {
      const currentEditorState: EditorState = {
        activeEndpointId: "1",
        draft: {
          id: "1",
          method: "GET",
          path: "friends",
          responseSchema: {},
        },
      };

      const deleteEndpointAction: EditorAction = {
        type: "DELETE_ENDPOINT",
        endpointId: "2",
      };

      const expectedNextState: EditorState = {
        activeEndpointId: "1",
        draft: {
          id: "1",
          method: "GET",
          path: "friends",
          responseSchema: {},
        },
      };

      const nextState = editorReducer(currentEditorState, deleteEndpointAction);
      expect(nextState).toEqual(expectedNextState);
    });
  });

  it("should throw an error for unknown actions", () => {
    const unknownAction: EditorAction = {
      // @ts-expect-error intentionally invalid action type to test the reducer's unknown-action branch
      type: "UNKNOWN_ACTION",
    };

    expect(() => editorReducer(initialEditorState, unknownAction)).toThrow();
  });
});
