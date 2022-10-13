import { ApolloProvider, useQuery } from '@apollo/client';
import { Box, Container } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import {
  broadband_unserved_blocks_geojson,
  county_broadband_farm_bill_eligibility_geojson,
  incumbent_electric_providers_geo_geojson,
} from '../services/bcatQueries';

import Map, { MapboxGeoJSONFeature } from 'react-map-gl';
import {Layer, MapboxStyle, Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl, MapRef, MapLayerMouseEvent, Source, FillLayer, LineLayer } from 'react-map-gl';
import bbox from '@turf/bbox';
import ControlPanel from './ControlPanel';
import MAP_STYLE, { fillLayer, lineLayer } from './MapStyle';

function MapContainer() {
  const { loading, error, data } = useQuery(county_broadband_farm_bill_eligibility_geojson, {
    fetchPolicy: 'no-cache',
    variables: {
      state_abbr: 'TN',
      skipCache: true,
    },
  });

  // const mapRef = React.createRef();
  const mapRef = useRef<MapRef>(null);
  const [ popupInfo, setPopupInfo ] = useState<MapboxGeoJSONFeature | null>(null);

  const onClick = (event: MapLayerMouseEvent) => {
    if (!!event && typeof event === 'object' && typeof event.features === 'object') {
      const feature: MapboxGeoJSONFeature = event.features[0];

      event.originalEvent.stopPropagation();

      if (feature) {
        // calculate the bounding box of the feature
        const [minLng, minLat, maxLng, maxLat] = bbox(feature);

        (feature as any)['longitude'] = (minLng + maxLng) / 2;
        (feature as any)['latitude'] = (minLat + maxLat) / 2;
        (feature as any)['label'] = ((feature as any)['properties'] && (feature as any)['properties']['state_abbr']) ?
          "Feature in " + (feature as any)['properties']['state_abbr']:
          "Feature";

        console.log("feature:", feature);

        setPopupInfo(feature);

        if (typeof mapRef.current === 'object' && mapRef.current !== null) {

          mapRef.current.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            { padding: 40, duration: 1000 },
          );
        }
      }
    }

  };

  useEffect(() => {
    console.log('ERROR ', error);
  }, [error]);

  useEffect(() => {
    console.log('Data ', data);
  }, [data]);

  if (typeof mapRef.current === 'object') { return (
    <Container disableGutters maxWidth={false}>{/*maxWidth="xl">*/}
      {data && (
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
          <Map
            mapboxAccessToken="pk.eyJ1IjoibWVyZ2luZ2Z1dHVyZXMiLCJhIjoiY2tpNWhvdGNqMWk0bjJ6bnpmMGt4dm51YyJ9.i4MvF31Xr5fxscllkRx04w"
            mapStyle={{
              ...MAP_STYLE
            } as MapboxStyle}
            initialViewState={{
              longitude: -86.503,
              latitude: 35.562,
              zoom: 7,
            }}
            interactiveLayerIds={['county_broadband_farm_bill_eligibility_fill_layer']}
            onClick={onClick}
            ref={mapRef}
            style={{ width: '100%', height: '100vh' }}
          >
            <Source type="geojson" id="test" data={data.county_broadband_farm_bill_eligibility_geojson}>
              <Layer {...fillLayer} />
              <Layer {...lineLayer} />
            </Source>
            {/* {data.incumbent_electric_providers_geo_geojson.features.map((feature: any, i: number) => {
              return (
                <Source key={`f-${i + 1}}`} type="geojson" id={`f-${i + 1}}`} data={feature}>
                  <Layer {...getSource(`f-${i + 1}}`, dataLayer1)} />
                  <Layer {...getSource(`f-${i + 1}}`, dataLayer2)} />
                </Source>
              );
            })} */}
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />

            {popupInfo && (popupInfo as any)['longitude'] && (popupInfo as any)['latitude'] && (popupInfo as any)['label'] && (
              <Popup
                anchor="top"
                longitude={Number((popupInfo as any).longitude)}
                latitude={Number((popupInfo as any).latitude)}
                closeButton={true}
                closeOnClick={true}
                onClose={() => setPopupInfo(null)}
              >
                <div>
                  <h3>{(popupInfo as any)['label'] }</h3>
                </div>
              </Popup>
            )}

          </Map>
        </Box>
      )}
    </Container>
  ) } else {
    return <div>Loading Data</div>;
  }
}

export default MapContainer;
