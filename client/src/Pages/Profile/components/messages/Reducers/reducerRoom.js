export default (state, action) => {
  switch (action.type) {
    case 'IS_ROOM':
      return {
        ...state,
        room: action.payload
      }  
    case 'SET_USERS':
      return {
        users: action.payload
      }  
    case 'SET_MESSAGES':
      return {
        messages: action.payload
      }  
    case 'IS_ADD':
      return {
        addRoom: action.payload
      }  
    case 'IS_CONNECT_TO_ROOM':
      return {
        connectRoom: action.payload
      } 
    default:
      return state;
  }
}