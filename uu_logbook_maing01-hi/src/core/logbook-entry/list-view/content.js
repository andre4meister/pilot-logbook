//@@viewOn:imports
import {createVisualComponent, Utils, PropTypes, useLsi} from "uu5g05";
import { UuGds } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import { FilterBar, FilterManagerModal, SorterBar, SorterManagerModal } from "uu5tilesg02-controls";
import Tile from "./tile";
import Config from "./config/config";
import {UnexpectedError} from "uu_plus4u5g02-elements";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

const TILE_HEIGHT = 300; // px
const ROW_SPACING = UuGds.SpacingPalette.getValue(["fixed", "c"]);

//@@viewOn:css
const Css = {
  grid: () => Config.Css.css({ marginTop: UuGds.SpacingPalette.getValue(["fixed", "c"]) }),
};
//@@viewOff:css

export const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    logbookEntryDataList: PropTypes.object.isRequired,
    aircraftDataList: PropTypes.object.isRequired,
    onLoadNext: PropTypes.func.isRequired,
    authorizedProfileList: PropTypes.array,
    onDelete: PropTypes.func.isRequired,
    onDetail: PropTypes.func.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { logbookEntryDataList, aircraftDataList, onDetail, onDelete, authorizedProfileList, ...tileProps } = props;
    const pageSize = logbookEntryDataList.pageSize;

    const lsi = useLsi(importLsi, [Content.uu5Tag]);
    function handleLoadNext({ indexFrom }) {
      props.onLoadNext({ pageSize: pageSize, pageIndex: Math.floor(indexFrom / pageSize) });
    }
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(tileProps);

    return (
      <div {...attrs}>
        <FilterBar disabled={logbookEntryDataList.state !== "ready"} />
        <SorterBar disabled={logbookEntryDataList.state !== "ready"} />
        <Grid
          onLoad={handleLoadNext}
          tileMinWidth={340}
          tileMaxWidth={450}
          tileHeight={TILE_HEIGHT}
          horizontalGap={UuGds.SpacingPalette.getValue(["fixed", "c"])}
          verticalGap={ROW_SPACING}
          className={Css.grid()}
        >
          {({ data }) => {
            const aircraftDataObject = aircraftDataList.data.find(
              (aircraft) => aircraft.data.registrationNumber === data.data.registrationNumber
            );

            if (!aircraftDataObject) {
              return <UnexpectedError error={lsi.aircraftNotExist} />
            }

            return (
              <Tile
                {...tileProps}
                logbookEntryDataObject={data}
                authorizedProfileList={authorizedProfileList}
                aircraftDataObject={aircraftDataObject}
                onDetail={onDetail}
                onDelete={onDelete}
              />
            );
          }}
        </Grid>
        <FilterManagerModal />
        <SorterManagerModal />
      </div>
    );
    //@@viewOff:render
  },
});

export default Content;
