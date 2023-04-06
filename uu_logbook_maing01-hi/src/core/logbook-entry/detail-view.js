//@@viewOn:imports
import { createVisualComponent, PropTypes, useState, useCallback, Lsi, useLsi } from "uu5g05";
import { Block, useAlertBus, Text } from "uu5g05-elements";
import { useSystemData } from "uu_plus4u5g02";
import Config from "./config/config.js";
import DataObjectStateResolver from "../data-resolvers/data-object-state-resolver";
import UpdateModal from "./detail-view/update-modal";
import Content from "./detail-view/content";
import DataListStateResolver from "../data-resolvers/data-list-state-resolver";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

const DetailView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pilotLogbookDataObject: PropTypes.object.isRequired,
    logbookEntryDataObject: PropTypes.object.isRequired,
    aircraftDataList: PropTypes.object.isRequired,
    placeDataList: PropTypes.object.isRequired,
    pilotDataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [DetailView.uu5Tag]);

    const { pilotLogbookDataObject, logbookEntryDataObject, aircraftDataList, placeDataList, pilotDataList } = props;
    const { addAlert } = useAlertBus();
    const { data: systemData } = useSystemData();
    const [updateData, setUpdateData] = useState({ shown: false, id: undefined });

    const handleUpdate = useCallback(
      (logbookEntryDataObject) => {
        setUpdateData({ shown: true, id: logbookEntryDataObject.data.id });
      },
      [setUpdateData]
    );

    const activeDataObjectId = updateData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = logbookEntryDataObject;
    }
    const handleUpdateDone = (logbookEntryDataObject) => {
      setUpdateData({ shown: false });
      showUpdateSuccess(logbookEntryDataObject);
    };

    const handleUpdateCancel = () => {
      setUpdateData({ shown: false });
    };

    function showUpdateSuccess(logbookEntry) {
      const message = (
        <>
          <Lsi import={importLsi} path={[DetailView.uu5Tag, "updateSuccessPrefix"]} />
        </>
      );
      addAlert({ message, priority: "success", durationMs: 5000 });
    }
    //@@viewOff:private


    //@@viewOn:render
    return (
      <>
        {updateData.shown && (
          <UpdateModal
            logbookEntryDataObject={logbookEntryDataObject}
            placeDataList={placeDataList}
            pilotDataList={pilotDataList}
            aircraftDataList={aircraftDataList}
            shown={true}
            onSaveDone={handleUpdateDone}
            onCancel={handleUpdateCancel}
          />
        )}
        <Block
          info={lsi.info}
          actionList={[
            {
              icon: "mdi-pencil",
              children: <Lsi import={importLsi} path={[DetailView.uu5Tag, "updateEntry"]} />,
              primary: true,
              onClick: () => handleUpdate(logbookEntryDataObject),
            },
          ]}
          header={
            <Text colorScheme="primary" significance="common">
              {lsi.flightInfo}
            </Text>
          }
          headerType="heading"
          card="none"
        >
          <DataObjectStateResolver dataObject={logbookEntryDataObject}>
            <DataListStateResolver dataList={aircraftDataList}>
              <DataListStateResolver dataList={pilotDataList}>
                <Content
                  pilotLogbookDataObject={pilotLogbookDataObject}
                  logbookEntryDataObject={logbookEntryDataObject}
                  aircraftDataList={aircraftDataList}
                  pilotDataList={pilotDataList}
                  authorizedProfileList={systemData.profileData.uuIdentityProfileList}
                  onUpdate={handleUpdate}
                />
              </DataListStateResolver>
            </DataListStateResolver>
          </DataObjectStateResolver>
        </Block>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { DetailView };
export default DetailView;
//@@viewOff:exports
