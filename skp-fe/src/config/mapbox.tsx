import Mapbox from "@rnmapbox/maps";
import { cssInterop } from "nativewind";

const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN

if (token) {
  Mapbox.setAccessToken(token);
} else if (__DEV__) {
  console.warn("EXPO_PUBLIC_MAPBOX_TOKEN is not set — maps will not render. Add it to your .env file.");
}

cssInterop(Mapbox.MapView, { className: "style" });

export default Mapbox;
