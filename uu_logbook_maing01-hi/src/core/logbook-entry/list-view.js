//@@viewOn:imports
import {
  createVisualComponent,
  useCallback,
  Utils,
  PropTypes,
  Lsi,
  useLsi,
  useState,
  useRoute,
} from "uu5g05";
import Uu5Elements, { useAlertBus, Link } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { FilterButton, SorterButton } from "uu5tilesg02-controls";
import { useSystemData } from "uu_plus4u5g02";
import DataListStateResolver from "../data-resolvers/data-list-state-resolver";
import Content from "./list-view/content";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
import CreateModal from "./list-view/create-modal";
import DeleteModal from "./list-view/delete-modal";
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

const ListView = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    logbookEntryDataList: PropTypes.object.isRequired,
    pilotLogbookDataObject: PropTypes.object.isRequired,
    placeDataList: PropTypes.object.isRequired,
    pilotDataList: PropTypes.object.isRequired,
    aircraftDataList: PropTypes.object.isRequired,
    filterList: PropTypes.array.isRequired,
    sorterList: PropTypes.array.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { addAlert } = useAlertBus();
    const {
      logbookEntryDataList,
      pilotDataList,
      placeDataList,
      aircraftDataList,
      filterList,
      sorterList,
    } = props;

    const { data: systemData } = useSystemData();
    const [createData, setCreateData] = useState({ shown: false });
    const [deleteData, setDeleteData] = useState({ shown: false, id: undefined });
    const [, setRoute] = useRoute();

    const activeDataObjectId = deleteData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = getLogbookEntryDataObject(logbookEntryDataList, activeDataObjectId);
    }

    const profileList = systemData.profileData.uuIdentityProfileList;
    const isAuthorities = profileList.includes("Authorities");
    const isAuthority = profileList.includes("Authority");
    const isExecutive = profileList.includes("Executives");

    const logbookEntryPermissions = {
      logbookEntry: {
        canManage: () => isAuthority || isExecutive || isAuthorities,
      },
    };

    const showError = useCallback(
      (error) =>
        addAlert({
          message: error.message,
          priority: "error",
        }),
      [addAlert]
    );

    const handleDetail = (logbookEntry) => {
      setRoute("entryDetail", { id: logbookEntry.id });
    };

    const handleCreate = useCallback(() => {
      setCreateData({ shown: true });
    }, [setCreateData]);

    const handleCreateDone = (logbookEntry) => {
      setCreateData({ shown: false });
      showCreateSuccess(logbookEntry);

      try {
        logbookEntryDataList.handlerMap.reload();
      } catch (error) {
        ListView.logger.error("Error creating logbook entry", error);
        showError(error);
      }
    };

    const handleCreateCancel = () => {
      setCreateData({ shown: false });
    };

    const handleDelete = useCallback(
      (logbookEntryDataObject) => setDeleteData({ shown: true, id: logbookEntryDataObject.data.id }),
      [setDeleteData]
    );

    const handleDeleteDone = () => {
      setDeleteData({ shown: false });
    };

    const handleDeleteCancel = () => setDeleteData({ shown: false });

    const handleLoad = useCallback(
      async (event) => {
        try {
          await logbookEntryDataList.handlerMap.load(event?.data);
        } catch (error) {
          showError(error);
        }
      },
      [logbookEntryDataList, showError]
    );

    const handleLoadNext = useCallback(
      async (pageInfo) => {
        try {
          await logbookEntryDataList.handlerMap.loadNext(pageInfo);
        } catch (error) {
          showError(error);
        }
      },
      [logbookEntryDataList, showError]
    );

    function showCreateSuccess(logbookEntry) {
      const message = (
        <>
          <Link colorSchema="primary" onClick={() => handleDetail({ id: logbookEntry.id })}>
              <Lsi import={importLsi} path={[ListView.uu5Tag, "createSuccessPrefix"]} />
          </Link>
        </>
      );
      addAlert({ message, priority: "success", durationMs: 5000 });
    }

    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props, Css.main());
    const actionList = getActions(props, logbookEntryPermissions, handleCreate, lsi);

    return (
      <>
        {createData.shown && (
          <CreateModal
            logbookEntryDataList={logbookEntryDataList}
            placeDataList={placeDataList}
            pilotDataList={pilotDataList}
            aircraftDataList={aircraftDataList}
            shown={true}
            onSaveDone={handleCreateDone}
            onCancel={handleCreateCancel}
          />
        )}

        {deleteData.shown && activeDataObject && (
          <DeleteModal
            logbookEntryDataObject={activeDataObject}
            onDeleteDone={handleDeleteDone}
            onCancel={handleDeleteCancel}
            shown
          />
        )}
        <ControllerProvider
          data={logbookEntryDataList.data}
          onFilterChange={handleLoad}
          onSorterChange={handleLoad}
          filterDefinitionList={getFilters(aircraftDataList, lsi)}
          sorterDefinitionList={getSorters(lsi)}
          filterList={filterList}
          sorterList={sorterList}
        >
          <Uu5Elements.Block
            {...attrs}
            actionList={actionList}
            info={<Lsi import={importLsi} path={[ListView.uu5Tag, "info"]} />}
            header={<Lsi import={importLsi} path={[ListView.uu5Tag, "header"]} />}
            card="full"
            borderRadius="none"
            headerType="title"
            level={3}
            footerSeparator
          >
            <DataListStateResolver dataList={logbookEntryDataList}>
              <DataListStateResolver dataList={aircraftDataList}>
                <Content
                  logbookEntryDataList={logbookEntryDataList}
                  aircraftDataList={aircraftDataList}
                  onLoadNext={handleLoadNext}
                  onDetail={handleDetail}
                  authorizedProfileList={profileList}
                  onDelete={handleDelete}
                />
              </DataListStateResolver>
            </DataListStateResolver>
          </Uu5Elements.Block>
        </ControllerProvider>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getFilters(aircraftDataList, lsi) {
  let filterList = [];
  const logbookEntryStates = ["Active", "Initial", "Problem", "Finished"];

  filterList.push({
    key: "state",
    label: lsi.filterState,
    inputType: "select",
    inputProps: {
      multiple: false,
      itemList: logbookEntryStates.map((state) => ({ value: state.toLowerCase(), children: state })),
    },
  });

  filterList.push({
    key: "dateTimeFrom",
    label: lsi.dateTimeFrom,
    inputType: "date-time",
  });

  filterList.push({
    key: "dateTimeTo",
    label: lsi.dateTimeTo,
    inputType: "date-time",
  });
  return filterList;
}

function getSorters(lsi) {
  return [
    {
      key: "dateTimeTo",
      label: lsi.dateTimeTo,
    },
    {
      key: "dateTimeFrom",
      label: lsi.dateTimeFrom,
    },
  ];
}

function getLogbookEntryDataObject(logbookEntryDataList, id) {
  const item =
    logbookEntryDataList.newData?.find((item) => item?.data.id === id) ||
    logbookEntryDataList.data.find((item) => item?.data.id === id);

  return item;
}

function getActions(props, logbookEntryPermissions, handleCreate, lsi) {
  const actionList = [];

  if (props.logbookEntryDataList.data) {
    actionList.push({
      component: FilterButton,
    });

    actionList.push({
      component: SorterButton,
    });
  }

  if (logbookEntryPermissions.logbookEntry.canManage()) {
    actionList.push({
      icon: "mdi-plus",
      children: lsi.create,
      primary: true,
      onClick: handleCreate,
      disabled: props.disabled,
    });
  }

  return actionList;
}

//@@viewOff:helpers

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
