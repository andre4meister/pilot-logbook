//@@viewOn:imports
import {createComponent, useMemo, useDataList} from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const PlaceProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PlaceProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const placeDataList = useDataList({
      handlerMap: {
        load: handleLoad,
      },
    });
    function handleLoad() {
      return Calls.Place.list();
    }

    const value = useMemo(() => {
      return { placeDataList };
    }, [placeDataList]);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default PlaceProvider;
