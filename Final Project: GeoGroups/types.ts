/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Login: undefined;
  Root: undefined;
  Chat: undefined;
  Map: undefined;
  Settings: undefined;
  ChangeName: undefined;
  CreateGroup: undefined;
  AddLocation: undefined;

};

export type TopTabParamList = {
  Chats: undefined;
  NearGroups: undefined;
};

export type NearGroupsParamList = {
  NearGroupsScreen: undefined;
};

export type ChatsParamList = {
  Chats: undefined;
  Chat: undefined;
};

export type User = {
  uid: string;
  name: string;
  email: string;
  imageUri?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  groups: {[key: string]: boolean}[];
  };

type Coords = {
  latitude: number;
  longitude: number;
  radius: number;
};

export type Group = {
  id: string;
  title: string;
  coords: Coords;
  membersCount: number;
  avatarUri: string;
  place: string;
};

export type GroupProps = Group & {distance: number};

export type LastMessage = {
  chatTitle: string;
  senderName: string;
  createdAt: number;
  lastMessage?: string;
  isImage?: boolean;
};

export type NewMessage = {
  message?: string;
  imageUri?: string;
  name: string;
  userId: string;
  createdAt: number;
  avatarUri: string | null;
  };


export type ChatProps = {
  id: string;
  chatTitle: string;
  senderName: string;
  lastMessage: string;
  createdAt: number;
  // id of current user (not necessarily the sender)
  uid: string;
};

export type ImagePickerProps = {
  handleImage: (image: any) => any;
  icon: JSX.Element;
  style?: object;
};

export type ConversationProps = {
  id: string;
  title: string;
  messagesData: {key: string; value: NewMessage}[];
  membersData: {key: string; value: boolean}[];
};

export type ChatMessageProps = {
  id: string;
  text: string;
  // the user that sent the message
  user: {
    name: string;
    userId: string;
    avatarUri: string;
  };
  imageUri: string;
  createdAt: number;
  // the id of the current user of the app
  uid: string;
  // the id of the sender of the previous message
  prevMessageUserId: string;
};

export type InputBoxProps = {
  sendTextMessage: (message: string) => void;
  sendImageMessageAsync: (image: string) => Promise<void>;
};
