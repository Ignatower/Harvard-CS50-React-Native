import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    margin: 4,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  lefContainer: {
    flex: 4,
    flexDirection: 'row',
  },
  titleContainer: {
    justifyContent: 'space-around',
    flexShrink: 1,
  },
  rigContainer: {
    flex: 1,
    width: "20%",
  },
  senderName: {
    flexDirection: 'row'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  lastMessage: {
    fontSize: 16,
    color: 'grey',
  },
  time: {
    fontSize: 14,
    color: 'grey',
  },
});

export default styles;
