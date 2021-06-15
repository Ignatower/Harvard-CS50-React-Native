import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  messageBox: {
    borderRadius: 5,
    padding: 10,
    paddingLeft: 8,
    paddingTop: 2,
  },
  imageBox: {
    borderRadius: 5,
    padding: 4,
  },
  name: {
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    margin: 3,
    resizeMode: 'cover',
  },
  time: {
    alignSelf: "flex-end",
    color: 'grey'
  }
});

export default styles;
