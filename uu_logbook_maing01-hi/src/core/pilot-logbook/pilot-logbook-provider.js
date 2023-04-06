//@@viewOn:imports
import { createComponent, useMemo, useDataObject } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const PilotLogbookProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "PilotLogbookProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const pilotLogbookDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
      },
    });
    function handleLoad() {
      return Calls.PilotLogbook.get();
    }

    const value = useMemo(() => {
      return { pilotLogbookDataObject };
    }, [pilotLogbookDataObject]);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

export default PilotLogbookProvider;
