//@@viewOn:imports
import {createVisualComponent, Utils, Content, PropTypes} from "uu5g05";
import Config from "./config/config.js";
import PilotLogbookProvider from "../pilot-logbook/pilot-logbook-provider";
import DataObjectStateResolver from "../data-resolvers/data-object-state-resolver";
import DataListStateResolver from "../data-resolvers/data-list-state-resolver";
import AircraftProvider from "../aircraft/aircraft-provider";
import PlaceProvider from "../place/place-provider";
import PilotProvider from "../pilot/pilot-provider";
import LogbookEntryProvider from "./logbook-entry-provider";
import DetailView from "./detail-view";
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

const Detail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Detail",
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
    const { logbookEntryId } = props;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <PilotLogbookProvider>
        {({ pilotLogbookDataObject }) => (
          <DataObjectStateResolver dataObject={pilotLogbookDataObject}>
            <LogbookEntryProvider logbookEntryId={logbookEntryId}>
              {({ logbookEntryDataObject }) => (
                <DataListStateResolver dataList={logbookEntryDataObject}>
                  <AircraftProvider>
                    {({ aircraftDataList }) => (
                      <DataListStateResolver dataList={aircraftDataList}>
                        <PlaceProvider>
                          {({ placeDataList }) => (
                            <DataListStateResolver dataList={placeDataList}>
                              <PilotProvider>
                                {({ pilotDataList }) => (
                                  <DataListStateResolver dataList={pilotDataList}>
                                    <DetailView
                                      pilotLogbookDataObject={pilotLogbookDataObject}
                                      logbookEntryDataObject={logbookEntryDataObject}
                                      aircraftDataList={aircraftDataList}
                                      placeDataList={placeDataList}
                                      pilotDataList={pilotDataList}
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
            </LogbookEntryProvider>
          </DataObjectStateResolver>
        )}
      </PilotLogbookProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Detail };
export default Detail;
//@@viewOff:exports
