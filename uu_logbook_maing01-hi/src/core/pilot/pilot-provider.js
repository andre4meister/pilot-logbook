//@@viewOn:imports
import {createComponent, useMemo, useDataList} from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const PilotProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PilotProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const pilotDataList = useDataList({
      handlerMap: {
        load: handleLoad,
      },
    });
    function handleLoad() {
      return Calls.Pilot.list();
    }

    const value = useMemo(() => {
      return { pilotDataList };
    }, [pilotDataList]);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});


export default PilotProvider;
