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

  it("should throw an error for unknown actions", () => {
    const unknownAction: EditorAction = {
      // @ts-expect-error intentionally invalid action type to test the reducer's unknown-action branch
      type: "UNKNOWN_ACTION",
    };

    expect(() => editorReducer(initialEditorState, unknownAction)).toThrow();
  });
});
