export default (state, action) => {
  switch (action.type) {
    case 'SET_LESSON':
      return {
        ...state,
        lesson: action.payload
      }  
    default:
      return state;
  }
}