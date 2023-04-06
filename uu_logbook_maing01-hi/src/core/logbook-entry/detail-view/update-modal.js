//@@viewOn:imports
import { createVisualComponent, Utils, Content, Lsi, PropTypes, useLsi } from "uu5g05";
import { CancelButton, Form, FormDateTime, FormSelect, FormTextArea, FormTime, SubmitButton } from "uu5g05-forms";
import { Block, Modal } from "uu5g05-elements";
import Config from "./config/config.js";
import { getAircraftItemList, getPilotItemList, getPlaceItemList } from "../helpers/getModalListsItems";
import { handleValidate } from "../helpers/validate-modal";
import importLsi from "../../../lsi/import-lsi";
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

const UpdateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    logbookEntryDataObject: PropTypes.object.isRequired,
    placeDataList: PropTypes.object.isRequired,
    pilotDataList: PropTypes.object.isRequired,
    aircraftDataList: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    onSaveDone: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [UpdateModal.uu5Tag]);
    const validateLsi = useLsi(importLsi, ["validateMessages"]);

    const { logbookEntryDataObject, placeDataList, pilotDataList, aircraftDataList, shown, onSaveDone, onCancel } =
      props;

    const entryData = logbookEntryDataObject.data;
    async function handleSubmit(event) {
      const values = { ...event.data.value };

      try {
        let updatedEntry = await logbookEntryDataObject.handlerMap.update({
          id: logbookEntryDataObject.data.id,
          ...values,
        });
        onSaveDone(updatedEntry);
      } catch (error) {
        UpdateModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
      }
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const formInputCss = Config.Css.css`margin-bottom:16px`;

    const formControls = (
      <div className={Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" })}>
        <CancelButton onClick={onCancel}>{lsi.cancel}</CancelButton>
        <SubmitButton>{lsi.submit}</SubmitButton>
      </div>
    );

    return (
      <Form.Provider onSubmit={handleSubmit} onValidate={(event) => handleValidate(event, validateLsi)}>
        <Modal
          header={lsi.header}
          info={<Lsi lsi={lsi.info} />}
          open={shown}
          footer={formControls}
          onClose={onCancel}
          closeOnButtonClick={true}
          closeOnOverlayClick={true}
        >
          <Form.View>
            <FormDateTime
              label={lsi.dateTimeFrom}
              name="dateTimeFrom"
              className={formInputCss}
              autoFocus
              initialValue={entryData.dateTimeFrom}
            />
            <FormDateTime
              label={lsi.dateTimeTo}
              name="dateTimeTo"
              className={formInputCss}
              initialValue={entryData.dateTimeTo}
            />

            <FormSelect
              label={lsi.departureLocationCode}
              name="departureLocationCode"
              itemList={getPlaceItemList(placeDataList)}
              className={formInputCss}
              initialValue={entryData.departureLocationCode}
            />

            <FormSelect
              label={lsi.arrivalLocationCode}
              name="arrivalLocationCode"
              itemList={getPlaceItemList(placeDataList)}
              className={formInputCss}
              initialValue={entryData.arrivalLocationCode}
            />

            <FormSelect
              label={lsi.registrationNumber}
              name="registrationNumber"
              itemList={getAircraftItemList(aircraftDataList)}
              className={formInputCss}
              initialValue={entryData.registrationNumber}
            />

            <Block>
              <FormSelect
                label={lsi.pilotIdList}
                name="pilotIdList"
                itemList={getPilotItemList(pilotDataList)}
                className={formInputCss}
                initialValue={entryData.pilotIdList}
                multiple
              />
              <FormSelect
                label={lsi.pilotInCommand}
                name="pilotInCommand"
                itemList={getPilotItemList(pilotDataList)}
                className={formInputCss}
                initialValue={entryData.pilotInCommand}
              />
            </Block>
            <Block>
              <FormTime
                label={lsi.pilotInCommandTime}
                name="pilotInCommandTime"
                className={formInputCss}
                initialValue={entryData.pilotInCommandTime}
                format={24}
              />
              <FormTime
                label={lsi.coPilotTime}
                name="coPilotTime"
                className={formInputCss}
                initialValue={entryData.coPilotTime}
                format={24}
              />
              <FormTime
                label={lsi.dualPilotTime}
                name="dualPilotTime"
                className={formInputCss}
                initialValue={entryData.dualPilotTime}
                format={24}
              />
            </Block>
            <FormTextArea
              label={lsi.description}
              name="description"
              inputAttrs={{ maxLength: 1000 }}
              className={formInputCss}
              rows={3}
              autoResize
              initialValue={entryData.description}
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdateModal };
export default UpdateModal;
//@@viewOff:exports
