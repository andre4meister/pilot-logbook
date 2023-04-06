//@@viewOn:imports
import {createVisualComponent, useDataList, useMemo, useRef} from "uu5g05";
import Calls from "calls";

import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  main: () => Config.Css.css({}),
};
//@@viewOff:css

const LogbookEntryListProvider = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "LogbookEntryListProvider",
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

    //@@viewOn:private
    const logbookEntryDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
        reload: handleReload,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
      },
    });

    const filterList = useRef([]);
    const sorterList = useRef([]);
    function handleCreate(uuObject) {
      return Calls.LogbookEntry.create(uuObject);
    }

    function handleUpdate(uuObject) {
      return Calls.LogbookEntry.create(uuObject);
    }
    function handleDelete(uuObject) {
      return Calls.LogbookEntry.delete({id: uuObject.id });
    }

    function handleReload() {
      return handleLoad({ filterList: filterList.current, sorterList: sorterList.current });
    }
    function handleLoad(criteria) {
      filterList.current = criteria?.filterList || [];

      let sorter;
      if (criteria?.sorterList) {
        sorter = criteria.sorterList.at(criteria.sorterList.length - 1);
        sorterList.current = sorter ? [sorter] : [];
      } else {
        sorter = sorterList.current.at(0);
      }

      const dtoIn = getLoadDtoIn(filterList.current, sorter, criteria?.pageInfo);
      return Calls.LogbookEntry.list(dtoIn);
    }

    function handleLoadNext(pageInfo) {
      const criteria = getLoadDtoIn(filterList.current, sorterList.current, pageInfo);

      const dtoIn = { ...criteria, pageInfo };
      return Calls.LogbookEntry.list(dtoIn);
    }

    const value = useMemo(() => {
      return { logbookEntryDataList, filterList: filterList.current, sorterList: sorterList.current };
    }, [logbookEntryDataList]);
    //@@viewOff:private

    //@@viewOn:render
    return typeof children === "function" ? children(value) : children;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getLoadDtoIn(filterList, sorter, pageInfo) {
  const filterMap = filterList.reduce((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {});

  let dtoIn = {filterMap};
  if (sorter) {
    dtoIn.sortBy = sorter.key;
    dtoIn.order = sorter.ascending ? "asc" : "desc";
  }

  if (pageInfo) {
    dtoIn.pageInfo = pageInfo;
  }

  return dtoIn;
}
//@@viewOff:helpers

//@@viewOn:exports
export { LogbookEntryListProvider };
export default LogbookEntryListProvider;
//@@viewOff:exports
