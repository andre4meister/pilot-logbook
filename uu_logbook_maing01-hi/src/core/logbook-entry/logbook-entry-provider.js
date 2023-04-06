//@@viewOn:imports
import {createVisualComponent, PropTypes, useDataObject, useMemo} from "uu5g05";
import Calls from "calls";

import Config from "./config/config";
//@@viewOff:imports


//@@viewOn:css
const Css = {
  main: () => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const LogbookEntryProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "LogbookEntryProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    logbookEntryId: PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { children, logbookEntryId } = props;

    //@@viewOn:private
    const logbookEntryDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
        update: handleUpdate,
      },
    });

    function handleUpdate(uuObject) {
      return Calls.LogbookEntry.update(uuObject);
    }

    function handleLoad() {
      return Calls.LogbookEntry.get({ id: logbookEntryId });
    }

    const value = useMemo(() => {
      return { logbookEntryDataObject };
    }, [logbookEntryDataObject]);
    //@@viewOff:private

    //@@viewOn:render
    return typeof children === "function" ? children(value) : children;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

//@@viewOn:exports
export { LogbookEntryProvider };
export default LogbookEntryProvider;
//@@viewOff:exports
