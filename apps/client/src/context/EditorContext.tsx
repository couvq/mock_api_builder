import type { EndpointConfig } from "@mock-api-builder/schema";
import {
  act,
  createContext,
  useContext,
  useReducer,
  type ActionDispatch,
  type ReactNode,
} from "react";

type EditorState = {
  activeEndpointId: string | undefined;
  draft: EndpointConfig | undefined;
};

type EditorAction = { type: "ADD_ENDPOINT"; endpoint: EndpointConfig };

const initialState: EditorState = {
  activeEndpointId: undefined,
  draft: undefined,
};

interface EditorContextProviderProps {
  children: ReactNode;
}

const EditorContext = createContext<EditorState | undefined>(undefined);
const EditorDispatchContext = createContext<
  ActionDispatch<[action: EditorAction]> | undefined
>(undefined);

const editorReducer = (
  state: EditorState,
  action: EditorAction,
): EditorState => {
  switch (action.type) {
    case "ADD_ENDPOINT":
      return {
        activeEndpointId: action.endpoint.id,
        draft: action.endpoint,
      };

    default:
      return state;
  }
};

const EditorContextProvider = ({ children }: EditorContextProviderProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  return (
    <EditorContext value={state}>
      <EditorDispatchContext value={dispatch}>{children}</EditorDispatchContext>
    </EditorContext>
  );
};

export default EditorContextProvider;

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (ctx === undefined)
    throw new Error(
      "useEditor hook must be used within a EditorContextProvider",
    );

  return ctx;
};

export const useEditorDispatch = () => {
  const ctx = useContext(EditorDispatchContext);
  if (ctx === undefined)
    throw new Error(
      "useEditorDispatch hook must be used within a EditorContextProvider",
    );

  return ctx;
};
