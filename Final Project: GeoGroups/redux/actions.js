// action types
export const RESET_USER = "RESET_USER";
export const UPDATE_USER = "UPDATE_USER";
export const JOIN_GROUP = "JOIN_GROUP"
export const LEAVE_GROUP = "LEAVE_GROUP"

// action creators
export const resetUser = () => ({
  type: RESET_USER,
  payload: {},
});

export const updateUser = (update) => ({
  type: UPDATE_USER,
  payload: update,
});

export const joinGroup = (groupId) => ({
  type: JOIN_GROUP,
  payload: groupId,
});

export const leaveGroup = (groupId) => ({
  type: LEAVE_GROUP,
  payload: groupId,
});
