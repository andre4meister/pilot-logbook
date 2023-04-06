//@@viewOn:imports
import { createVisualComponent, useScreenSize } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

const Css = {
  routeContainer: (screenSize) => {
    let padding;
    switch (screenSize) {
      case "xs":
      case "s":
        padding = "8px 8px";
        break;
      case "m":
      case "l":
      case "xl":
      default:
        padding = "16px 16px";
    }
    return Config.Css.css({
      backgroundImage:
        "url('https://thedesignair.files.wordpress.com/2021/02/1910_aeg_stills_shot-11_cam-03_ext_12k_13012019.jpg')",
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      padding: padding,
      minHeight: "calc(100vh - 108.8px)",
    });
  },
};

export const RouteContainer = createVisualComponent({
  render(props) {
    const [screenSize] = useScreenSize();
    return <div className={Css.routeContainer(screenSize)}>{props.children}</div>;
  },
});

export default RouteContainer;
