import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 4,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  lefContainer: {
    flexDirection: "row",
  },
  midContainer: {
    justifyContent: "space-around",
    alignSelf: "center",
  },
  rigContainer: {
    justifyContent: "space-around",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  info: {
    fontSize: 16,
    color: "grey",
  },
  map: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});

export default styles;
