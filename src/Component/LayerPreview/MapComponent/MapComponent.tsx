import React, {
  useEffect,
  useRef
} from 'react';

import OlMap from 'ol/Map';

import './MapComponent.less';

export interface MapComponentProps extends React.ComponentProps<'div'> {
  map?: OlMap;
  onRender?: () => void;
};

export const MapComponent: React.FC<MapComponentProps> = ({
  onRender = () => {},
  map,
  ...passThroughProps
}): JSX.Element => {

  const mapDiv = useRef();

  useEffect(() => {
    if (!map) {
      return undefined;
    }

    map.setTarget(mapDiv.current);

    onRender();

    return () => {
      map.setTarget(undefined);
    };
  }, [map, onRender]);

  if (!map) {
    return <></>;
  }

  return (
    <div
      ref={mapDiv}
      className="map"
      role="presentation"
      {...passThroughProps}
    />
  );
};

export default MapComponent;
