//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import Config from "./config/config";
import PilotProvider from "../pilot/pilot-provider";
import DataObjectStateResolver from "../data-resolvers/data-object-state-resolver";
import LogbookEntryListProvider from "./logbook-entry-list-provider";
import DataListStateResolver from "../data-resolvers/data-list-state-resolver";
import ListView from "./list-view";
import AircraftProvider from "../aircraft/aircraft-provider";
import PlaceProvider from "../place/place-provider";
import PilotLogbookProvider from "../pilot-logbook/pilot-logbook-provider";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
const Css = {
  main: () => Config.Css.css({}),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const List = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "List",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <PilotLogbookProvider>
        {({ pilotLogbookDataObject }) => (
          <DataObjectStateResolver dataObject={pilotLogbookDataObject}>
            <LogbookEntryListProvider>
              {({ logbookEntryDataList, filterList, sorterList }) => (
                <DataListStateResolver dataList={logbookEntryDataList}>
                  <AircraftProvider>
                    {({ aircraftDataList }) => (
                      <DataListStateResolver dataList={aircraftDataList}>
                        <PlaceProvider>
                          {({ placeDataList }) => (
                            <DataListStateResolver dataList={placeDataList}>
                              <PilotProvider>
                                {({ pilotDataList }) => (
                                  <DataListStateResolver dataList={pilotDataList}>
                                    <ListView
                                      pilotLogbookDataObject={pilotLogbookDataObject}
                                      logbookEntryDataList={logbookEntryDataList}
                                      aircraftDataList={aircraftDataList}
                                      placeDataList={placeDataList}
                                      pilotDataList={pilotDataList}
                                      filterList={filterList}
                                      sorterList={sorterList}
                                    />
                                  </DataListStateResolver>
                                )}
                              </PilotProvider>
                            </DataListStateResolver>
                          )}
                        </PlaceProvider>
                      </DataListStateResolver>
                    )}
                  </AircraftProvider>
                </DataListStateResolver>
              )}
            </LogbookEntryListProvider>
          </DataObjectStateResolver>
        )}
      </PilotLogbookProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { List };
export default List;
//@@viewOff:exports
