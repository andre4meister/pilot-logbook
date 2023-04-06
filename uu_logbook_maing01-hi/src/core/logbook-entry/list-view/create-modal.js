//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi, Utils } from "uu5g05";
import { Block, Modal } from "uu5g05-elements";
import { Form, FormTextArea, FormDateTime, FormSelect, SubmitButton, CancelButton, FormTime } from "uu5g05-forms";
import Config from "./config/config";
import { getAircraftItemList, getPilotItemList, getPlaceItemList } from "../helpers/getModalListsItems";
import { handleValidate } from "../helpers/validate-modal";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

export const CreateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    logbookEntryDataList: PropTypes.object.isRequired,
    placeDataList: PropTypes.object.isRequired,
    pilotDataList: PropTypes.object.isRequired,
    aircraftDataList: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    onSaveDone: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    shown: false,
    onSaveDone: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [CreateModal.uu5Tag]);
    const validateLsi = useLsi(importLsi, ["validateMessages"]);

    const { logbookEntryDataList, placeDataList, pilotDataList, aircraftDataList, shown, onSaveDone, onCancel } = props;

    async function handleSubmit(event) {
      try {
        const values = { ...event.data.value };

        if (values.pilotInCommand === undefined) {
          delete values.pilotInCommand;
        }
        if (values.pilotInCommandTime === undefined) {
          delete values.pilotInCommandTime;
        }
        if (values.coPilotTime === undefined) {
          delete values.coPilotTime;
        }
        if (values.dualPilotTime === undefined) {
          delete values.dualPilotTime;
        }
        if (values.description === undefined) {
          delete values.description;
        }

        const entry = await logbookEntryDataList.handlerMap.create(values);
        onSaveDone(entry);
      } catch (error) {
        CreateModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
      }
    }

    //@@viewOff:private

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
          info={lsi.info}
          open={shown}
          onClose={onCancel}
          footer={formControls}
          closeOnButtonClick={true}
          closeOnOverlayClick={true}
        >
          <Form.View>
            <FormDateTime label={lsi.dateTimeFrom} name="dateTimeFrom" className={formInputCss} required autoFocus />
            <FormDateTime label={lsi.dateTimeTo} name="dateTimeTo" className={formInputCss} required />
            <FormSelect
              label={lsi.departureLocationCode}
              name="departureLocationCode"
              itemList={getPlaceItemList(placeDataList)}
              className={formInputCss}
              required
            />
            <FormSelect
              label={lsi.arrivalLocationCode}
              name="arrivalLocationCode"
              itemList={getPlaceItemList(placeDataList)}
              className={formInputCss}
              required
            />
            <FormSelect
              label={lsi.registrationNumber}
              name="registrationNumber"
              itemList={getAircraftItemList(aircraftDataList)}
              className={formInputCss}
              required
            />
            <Block>
              <FormSelect
                label={lsi.pilotIdList}
                name="pilotIdList"
                itemList={getPilotItemList(pilotDataList)}
                className={formInputCss}
                multiple
                required
              />
              <FormSelect
                label={lsi.pilotInCommand}
                name="pilotInCommand"
                itemList={getPilotItemList(pilotDataList)}
                className={formInputCss}
                required
              />
            </Block>
            <Block>
              <FormTime label={lsi.pilotInCommandTime} name="pilotInCommandTime" className={formInputCss} format={24} />
              <FormTime label={lsi.coPilotTime} name="coPilotTime" className={formInputCss} format={24} />
              <FormTime label={lsi.dualPilotTime} name="dualPilotTime" className={formInputCss} format={24} />
            </Block>
            <FormTextArea
              label={lsi.description}
              name="description"
              inputAttrs={{ maxLength: 2000 }}
              className={formInputCss}
              rows={3}
              autoResize
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

export default CreateModal;
