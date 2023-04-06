//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useScreenSize, useLsi } from "uu5g05";
import { Block, DateTime, Grid, Text } from "uu5g05-elements";
import Config from "./config/config.js";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports


//@@viewOn:css
const Css = {
  main: (screenSize) => {
    let width;
    switch (screenSize) {
      case "xs":
        width = "100%";
        break;
      case "s":
        width = "90%";
        break;
      case "m":
        width = "90%";
        break;
      case "l":
        width = "80%";
        break;
      case "xl":
        width = "75%";
        break;
      default:
        width = "100%";
        break;
    }
    return Config.Css.css({
      margin: "0 auto",
      width: width,
    });
  },
  gridContainer: () =>
    Config.Css.css({
      width: "100%",
      background: "##7cb5d7",
    }),
  pilotContainer: () =>
    Config.Css.css({
      width: "100%",
      height: "60px",
      display: "flex",
      flexDirection: "row",
      justifyItems: "flex-start",
      alignItems: "center",
    }),
  pilotImage: () =>
    Config.Css.css({
      margin: "0 10px",
      minWidth: "60px",
      minHeight: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      backgroundColor: "white",
      div: {
        color: "#7cb5d7",
        fontSize: "30px",
      },
    }),
  pilotItem: () =>
    Config.Css.css({
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      flexDirection: "column",
    }),
  text: () =>
    Config.Css.css({
      textAlign: "center",
      color: "white",
    }),
  dateText: () =>
    Config.Css.css({
      marginTop: "5px",
      textAlign: "center",
      color: "white",
    }),
  block: () =>
    Config.Css.css({
      textAlign: "center",
      background: "rgba(33,150,243,0.8)",
      color: "white",
      width: "100%",
      div: {
        span: {
          color: "white",
        },
      },
    }),
};
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pilotLogbookDataObject: PropTypes.object.isRequired,
    logbookEntryDataObject: PropTypes.object.isRequired,
    aircraftDataList: PropTypes.object.isRequired,
    pilotDataList: PropTypes.object.isRequired,
    authorizedProfileList: PropTypes.array,
    onUpdate: PropTypes.func,
  },

  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [Content.uu5Tag]);
    const screenSize = useScreenSize();
    const { logbookEntryDataObject, aircraftDataList, pilotDataList } = props;
    const entryData = logbookEntryDataObject.data;

    const aircraftData = aircraftDataList.data.find((aircraft) => {
      return aircraft.data.registrationNumber === entryData.registrationNumber;
    }).data;

    const pilotsList = pilotDataList.data.filter((pilot) => {
      return entryData.pilotIdList.includes(pilot.data.id);
    });
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <div {...attrs} className={Css.main(screenSize[0])}>
        <Grid
          justifyItems="center"
          alignItems="start"
          alignContent="start"
          classname={Css.gridContainer()}
          justifyContent="space-evenly"
          templateColumns={{ xs: "100%", s: "100%", m: "repeat(2, 1fr)", l: "repeat(2, 1fr)", xl: "repeat(2, 1fr)" }}
        >
          <Block
            headerType="title"
            header={
              <Text category="story" segment="heading" type="h3" className={Css.text()}>
                {lsi.departure}
              </Text>
            }
            headerSeparator={true}
            className={Css.block()}
          >
            <Text category="story" segment="heading" type="h3" className={Css.text()}>
              {entryData.departureLocationCode}
            </Text>
            <Text category="interface" segment="highlight" type="major" className={Css.dateText()}>
              <DateTime value={entryData.dateTimeFrom} hourFormat={24} />
            </Text>
          </Block>
          <Block
            headerType="title"
            headerSeparator={true}
            header={
              <Text category="story" segment="heading" type="h3" className={Css.text()}>
                {lsi.arrival}
              </Text>
            }
            className={Css.block()}
          >
            <Text category="story" segment="heading" type="h3" className={Css.text()}>
              {entryData.arrivalLocationCode}
            </Text>
            <Text category="interface" segment="highlight" type="major" className={Css.dateText()}>
              <DateTime value={entryData.dateTimeTo} hourFormat={24} />
            </Text>
          </Block>
        </Grid>
        <div style={{ marginTop: "20px" }}>
          <Grid
            justifyItems="center"
            alignItems="start"
            alignContent="start"
            classname={Css.gridContainer()}
            justifyContent="center"
            templateColumns="100%"
          >
            <Block
              headerType="title"
              header={
                <Text category="story" segment="heading" type="h3" className={Css.text()}>
                  {lsi.aircraft}
                </Text>
              }
              headerSeparator={true}
              className={Css.block()}
            >
              <Text category="story" segment="heading" type="h3" className={Css.text()}>
                {lsi.aircraftModel}: <span>{aircraftData.model}</span>
              </Text>
              <Text category="interface" segment="highlight" type="major" className={Css.dateText()}>
                {lsi.aircraftRegistrationNumber}: <span>{aircraftData.registrationNumber} </span>
              </Text>
            </Block>
            <Block
              headerType="title"
              headerSeparator={true}
              header={
                <Text category="story" segment="heading" type="h3" className={Css.text()}>
                  {lsi.pilots}
                </Text>
              }
              className={Css.block()}
            >
              <Grid
                justifyItems="center"
                alignItems="start"
                alignContent="start"
                classname={Css.gridContainer()}
                rowGap="50px"
                justifyContent="center"
                templateColumns={{
                  xs: "100%",
                  s: "100%",
                  m: "repeat(2, 1fr)",
                  l: "repeat(2, 1fr)",
                  xl: "repeat(2, 1fr)",
                }}
              >
                {pilotsList.map(({ data }, index) => {
                  return (
                    <div key={data.id} className={Css.pilotContainer()}>
                      <div className={Css.pilotImage()}>
                        <div>{data.name[0]}</div>
                      </div>
                      <div className={Css.pilotItem()}>
                        <div>
                          <Text
                            category="interface"
                            segment="highlight"
                            type="major"
                          >{`${lsi.pilotName}: ${data.name} ${data.surname}`}</Text>
                        </div>
                        <div>
                          <Text category="interface" segment="highlight" type="major">
                            {`${lsi.experience}: ${data.experienceHours} ${lsi.hours}`}
                          </Text>
                        </div>
                        <div>
                          <Text category="interface" segment="highlight" type="major">
                            {`${lsi.pilotFlightTime}: ${getPilotsFlightTime(entryData, data.id, index) || "-"} ${
                              lsi.hours
                            }`}
                          </Text>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Grid>
            </Block>
            <Block
              headerType="title"
              headerSeparator={true}
              header={
                <Text category="story" segment="heading" type="h3" className={Css.text()}>
                  {lsi.description}
                </Text>
              }
              className={Css.block()}
            >
              <Text category="interface" segment="highlight" type="minor" className={Css.text()}>
                {entryData.description}
              </Text>
            </Block>
          </Grid>
        </div>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getPilotsFlightTime(entryData, pilotId, index) {
  const pilotInCommand = entryData.pilotInCommand;

  if (pilotId === pilotInCommand) {
    return entryData.pilotInCommandTime ? entryData.pilotInCommandTime.slice(0, 5) : null;
  }

  if (index === 0 && pilotId !== pilotInCommand) {
    return entryData.coPilotTime ? entryData.coPilotTime.slice(0, 5) : null;
  }

  if (index === 1 && pilotId !== pilotInCommand) {
    return entryData.coPilotTime ? entryData.coPilotTime.slice(0, 5) : null;
  }

  if (index === 2 && pilotId !== pilotInCommand) {
    return entryData.dualPilotTime ? entryData.dualPilotTime.slice(0, 5) : null;
  }
}
//@@viewOff:helpers

//@@viewOn:exports
export { Content };
export default Content;
//@@viewOff:exports
