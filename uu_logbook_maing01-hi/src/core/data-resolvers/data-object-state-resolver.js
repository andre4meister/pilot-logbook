//@@viewOn:imports
import { createComponent, PropTypes } from "uu5g05";
import { Pending } from "uu5g05-elements";
import { Error } from "uu_plus4u5g02-elements";
import Config from "../config/config";
import Loader from "../loader";
//@@viewOff:imports

export const DataObjectStateResolver = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DataObjectStateResolver",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    dataObject: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:render
    const { dataObject, children, ...viewProps } = props;

    switch (dataObject.state) {
      case "ready":
      case "error":
      case "pending":
        return typeof children === "function" ? children() : children;
      case "readyNoData":
      case "pendingNoData":
        return <Loader />;
      case "errorNoData":
      default:
        return <Error {...viewProps} error={dataObject.errorData} />;
    }
    //@@viewOff:render
  },
});

export default DataObjectStateResolver;
