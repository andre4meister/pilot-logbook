//@@viewOn:imports
import {createComponent, useMemo, useDataList} from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const AircraftProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "AircraftProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const aircraftDataList = useDataList({
      handlerMap: {
        load: handleLoad,
      },
    });
    function handleLoad() {
      return Calls.Aircraft.list();
    }

    const value = useMemo(() => {
      return { aircraftDataList };
    }, [aircraftDataList]);
    //@@viewOff:private
    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default AircraftProvider;
