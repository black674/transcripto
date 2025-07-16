export const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_MERGED_TRANSCRIPT":
      return { ...state, mergedTranscript: action.payload };
    case "SET_AUTOSCROLL":
      return { ...state, autoScroll: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };
    default:
      return state;
  }
};
