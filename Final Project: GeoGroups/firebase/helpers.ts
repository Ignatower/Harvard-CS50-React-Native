import { Group, LastMessage, NewMessage } from "../types";
import firebase from "./config";


export const uploadImageAsync = async (path: string, imageName: string, imageUri: string): Promise<void> => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const ref = firebase.storage().ref(path).child(imageName);
    const uploadTask = await ref.put(blob)
  } catch (err) {
    alert("uploadImageAsync error ")
  }
}

export const downloadImageAsync = async (path: string, imageName: string): Promise<string> => {
  const ref = firebase.storage().ref(path).child(imageName);
  // get the storage uri mage 
  try {
   const url = await ref.getDownloadURL()
   return url 
  } catch (error) {
    alert("downloadImage error ")
    return ''
  }
}

export const firebaseJoinToGroup = (
  id: string,
  uid: string,
  membersCount: number,
  title: string,
  lastMessage: LastMessage
): void => {
  const updates = {};
  updates[`/users/${uid}/groups/${id}`] = true;
  updates[`/members/${id}/${uid}`] = true;
  updates[`/groups/${id}/membersCount`] = membersCount + 1;
  if (!lastMessage) {
    updates[`/chats/${uid}/${id}`] = { chatTitle: title };
  } else {
    updates[`/chats/${uid}/${id}`] = lastMessage;
  }
  firebase.database().ref().update(updates);
};

export const firebaseCreateGroup = (group: Group, createdAt: number, uid: string): string => {
    const id = firebase.push(`/groups/`, group).getKey();
    // also join user to group, so add a chat to user
    const updates = {};
    updates[`/users/${uid}/groups/${id}`] = true
    updates[`/members/${id}/${uid}`] = true
    // createdAt field is useful to make some firebase queries, easier
    updates[`/chats/${uid}/${id}`] = {chatTitle: group.title, createdAt}
    firebase.database().ref().update(updates);
    return id
}

export const firebaseLeaveGroup = (id: string, membersCount: number, uid: string): void => {
    const updates = {};
    updates[`/members/${id}/${uid}`] = null
    updates[`/chats/${uid}/${id}`] = null
    updates[`/groups/${id}/membersCount`] = membersCount - 1
    updates[`/users/${uid}/groups/${id}`] = null
    firebase.database().ref().update(updates);
}

export const firebaseSendMessage = (
  newMessage: NewMessage,
  lastMessage: LastMessage,
  members: string[],
  id: string
): void => {
  const updates = {};
  members.forEach(
    (memberId) => {(updates[`/chats/${memberId}/${id}`] = lastMessage)}
  );
  updates[`/lastMessages/${id}/`] = lastMessage;
  firebase.push(`messages/${id}`, newMessage);
  firebase.database().ref().update(updates);
};

export const firebaseChangeUserName = (oldName: string, email: string, newName: string, uid: string): void => {
  const updates = {};
      if (oldName !== email) {
        updates[`usersName/${oldName}/`] = null
      }
      updates[`usersName/${newName}/`] = true
      updates[`users/${uid}/name/`] = newName
      firebase.database().ref().update(updates);
}

export const firebaseChangeUserAvatar = (uid: string, avatarUri: string): void => {
  const updates = {};
  updates[`users/${uid}/avatarUri/`] = avatarUri
  firebase.database().ref().update(updates); 
}
