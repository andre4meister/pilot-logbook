//@@viewOn:imports
import { createComponent, PropTypes } from "uu5g05";
import { Pending } from "uu5g05-elements";
import { Error } from "uu_plus4u5g02-elements";
import Config from "../config/config";
import Loader from "../loader";
//@@viewOff:imports

export const DataListStateResolver = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DataListStateResolver",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    dataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:render
    const { dataList, children, ...viewProps } = props;
    switch (dataList.state) {
      case "ready":
      case "error":
      case "pending":
      case "itemPending":
        return typeof children === "function" ? children() : children;
      case "readyNoData":
      case "pendingNoData":
        return <Loader />;
      case "errorNoData":
      default:
        return <Error {...viewProps} error={dataList.errorData} />;
    }
    //@@viewOff:render
  },
});

export default DataListStateResolver;
