import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  keyboardView: {
    maxHeight: '60%',
  },
  container: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end',
  },
  boxContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    marginRight: 10,
    flex: 1,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10
  },
  clip: {
    marginBottom: 4,
    marginLeft: 4,
    marginRight: 8,
  },
  sendWhite: {
    alignSelf: 'center',
  },
  sendGrey: {
    marginBottom: 10,
  }
})

export default styles;
