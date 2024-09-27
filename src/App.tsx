import * as React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Map, { GeolocateControl, NavigationControl, ScaleControl } from "react-map-gl";

import 'mapbox-gl/dist/mapbox-gl.css';

import "./App.css";
// import style from "./App.module.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    },
    palette: {
        primary: {
            main: '#00835D',
            light: '#A3E2B5',
            dark: '#26535C',
            contrastText: 'white',
        },
    },
});

export default function App() {

    // console.log("Re-rendering App component");

    // const apiContext = useContext(ApiContext);

    return (
        <ThemeProvider theme={theme}>

            <div className={"slippy-map"}>
                <Map
                    mapboxAccessToken={MAPBOX_TOKEN}
                    initialViewState={{
                        latitude: 40,
                        longitude: -100,
                        pitch: 45,
                        zoom: 3.5
                    }}
                    style={{width: 600, height: 400}}
                    // mapStyle={`https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=${MAPBOX_TOKEN}`}
                    mapStyle={`https://api.mapbox.com/styles/v1/ruralinno/cl010e7b7001p15pe3l0306hv?access_token=${MAPBOX_TOKEN}`}
                >
                    {/*<GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-right" />*/}
                    <GeolocateControl position="top-right" />
                    <NavigationControl position="top-right" />
                    <ScaleControl  position="bottom-left"
                                   unit={"imperial"} />
                </Map>
            </div>

        </ThemeProvider>
    );
}
