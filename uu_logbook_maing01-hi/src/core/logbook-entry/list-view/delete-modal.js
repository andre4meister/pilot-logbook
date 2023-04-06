//@@viewOn:imports
import { createVisualComponent, PropTypes, useLsi, Utils } from "uu5g05";
import { Modal, Button } from "uu5g05-elements";
import { Form } from "uu5g05-forms";
import { Error } from "uu_plus4u5g02-elements";
import Config from "./config/config";
import DataObjectStateResolver from "../../data-resolvers/data-object-state-resolver";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  error: () =>
    Config.Css.css({
      padding: 16,
    }),
  buttonRowCss: () =>
    Config.Css.css({
      margin: "16px",
    }),
  buttonCss: () =>
    Config.Css.css({
      margin: "8px",
    }),
};
//@@viewOff:css

export const DeleteModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DeleteModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    logbookEntryDataObject: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    onCancel: PropTypes.func,
    onDeleteDone: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    shown: false,
    onCancel: () => {},
    onDeleteDone: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { logbookEntryDataObject, onDeleteDone, onCancel, shown } = props;
    const logbookEntry = logbookEntryDataObject.data;
    const lsi = useLsi(importLsi, [DeleteModal.uu5Tag]);

    async function handleDelete() {
      try {
        await logbookEntryDataObject.handlerMap.delete(logbookEntry);
        onDeleteDone();
      } catch (error) {
        DeleteModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    const isPending = logbookEntryDataObject.state === "pending";

    return (
      <Form>
        <Modal header={lsi.header} open={shown} onClose={onCancel} className="center">
          <DataObjectStateResolver dataObject={logbookEntryDataObject}>
            <>
              {logbookEntryDataObject.state === "error" && (
                <div className={Css.error()}>
                  <Error error={logbookEntryDataObject.errorData} nestingLevel="inline" />
                </div>
              )}
              {Utils.String.format(lsi["question"], logbookEntry ? logbookEntry.name : "")}
            </>
          </DataObjectStateResolver>
          <div className={Css.buttonRowCss()} disabled={isPending}>
            <Button onClick={onCancel} className={Css.buttonCss()}>
              {lsi.cancel}
            </Button>
            <Button onClick={handleDelete} className={Css.buttonCss()} colorScheme="negative">
              {lsi.delete}
            </Button>
          </div>
        </Modal>
      </Form>
    );
    //@@viewOff:render
  },
});

export default DeleteModal;
