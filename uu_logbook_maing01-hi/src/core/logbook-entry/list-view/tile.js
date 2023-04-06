//@@viewOn:imports
import "uu5g04-bricks";
import { createVisualComponent, PropTypes, useScreenSize, Utils } from "uu5g05";
import Uu5Elements, { Button, DateTime, Icon, Text } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  content: (screenSize) =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      height: "100%",
      position: "relative",
      padding: screenSize === "xs" ? "5px" : "5px 10px",
    }),
  textDiv: () =>
    Config.Css.css({
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      overflow: "hidden",
      width: "100%",
      padding: "5px",
      margin: "10px 0",
      backgroundColor: "rgb(33, 150, 243)",
      borderRadius: "5px",
    }),
  column: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "flex-start",
      justifyContent: "center",
      overflow: "hidden",
      height: "100%",
      paddingRight: "40px",
      margin: "10px",
    }),
  menu: () =>
    Config.Css.css({
      position: "absolute",
      top: 0,
      right: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      margin: "0 5px",
    }),
  stateWrapper: () =>
    Config.Css.css({
      height: "36px",
      minWidth: "36px",
      maxWidth: "46.4px",
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: "16px",
      borderRadius: "5.4px",
      padding: "0 8px",
      span: {
        color: "white",
        fontSize: "20px",
        display: "flex",
        "::before": {
          margin: "7px",
        },
      },
    }),
  text: (parent) =>
    Config.Css.css({
      display: "block",
      color: "white",
      fontSize: "18px",
      // marginLeft: parent.padding.left,
      // marginRight: parent.padding.right,
      // marginBottom: parent.padding.bottom,
      // marginTop: parent.padding.top,
    }),
};
//@@viewOff:css

export const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onDetail: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    logbookEntryDataObject: PropTypes.object.isRequired,
    aircraftDataObject: PropTypes.object.isRequired,
    authorizedProfileList: PropTypes.array.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { logbookEntryDataObject, aircraftDataObject, onDetail, onDelete, authorizedProfileList } = props;
    const { elementProps } = Utils.VisualComponent.splitProps(props);
    const logbookEntry = logbookEntryDataObject.data;

    const screenSize = useScreenSize();
    const handleDetail = () => {
      onDetail(logbookEntryDataObject.data);
    };

    function handleDelete(event) {
      event.stopPropagation();
      onDelete(logbookEntryDataObject);
    }
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Uu5Elements.Tile {...elementProps} significance="subdued" borderRadius="elementary">
        {(tile) => (
          <div className={Css.content(screenSize[0])}>
            <div className={Css.column()}>
              <div>
                <Text
                  category="story"
                  segment="heading"
                  type={screenSize[0] === "xs" ? "h4" : "h3"}
                  colorScheme="primary"
                  style={{ borderBottom: "1px solid light-gray}" }}
                >
                  <DateTime value={new Date(logbookEntry.dateTimeFrom)} dateFormat="short" timeFormat="short" />
                </Text>
              </div>
              <div className={Css.textDiv()}>
                <Text
                  category="interface"
                  segment="content"
                  type="medium"
                  colorScheme="blue"
                  className={Css.text(tile)}
                >
                  {`${logbookEntry.departureLocationCode} - ${logbookEntry.arrivalLocationCode}`}
                </Text>
              </div>
              <div className={Css.textDiv()}>
                <Text
                  category="interface"
                  segment="content"
                  type="medium"
                  colorScheme="building"
                  className={Css.text(tile)}
                >
                  {aircraftDataObject.data.model}
                </Text>
              </div>
            </div>
            <div className={Css.menu()}>
              <div
                className={Css.stateWrapper()}
                style={{ backgroundColor: getEntryStateIconProps(logbookEntry.state).colorScheme }}
              >
                <Icon {...getEntryStateIconProps(logbookEntry.state)} />
              </div>
              <Button onClick={handleDetail}>
                <Icon icon="mdi-information-outline" />
              </Button>
              {authorizedProfileList.includes("Authority") && (
                <Button colorScheme="red" onClick={handleDelete}>
                  <Icon icon="mdi-cancel" />
                </Button>
              )}
            </div>
          </div>
        )}
      </Uu5Elements.Tile>
    );
    //@@viewOff:render
  },
});

export default Tile;

//@@viewOn:helpers
function getEntryStateIconProps(state) {
  switch (state) {
    case "active":
      return { colorScheme: "green", icon: "mdi-airplane" };
    case "initial":
      return { colorScheme: "purple", icon: "mdi-airplane" };
    case "problem":
      return { colorScheme: "red", icon: "mdi-airplane" };
    case "finished":
    default:
      return { colorScheme: "grey", icon: "mdi-airplane" };
  }
}
//@@viewOff:helpers
