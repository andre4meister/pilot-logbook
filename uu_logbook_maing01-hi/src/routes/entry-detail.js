//@@viewOn:imports
import {createVisualComponent, PropTypes, useRoute} from "uu5g05";
import Config from "./config/config.js";
import {RouteController} from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import Detail from "../core/logbook-entry/detail";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const EntryDetail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "EntryDetail",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { children } = props;
    const [route] = useRoute();
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <RouteController>
        <RouteContainer>
          <Detail logbookEntryId={route.params.id} />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { EntryDetail };
export default EntryDetail;
//@@viewOff:exports
