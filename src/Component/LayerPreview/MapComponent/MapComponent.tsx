import './MapComponent.less';

import OlMap from 'ol/Map';
import React, {
  useCallback
} from 'react';

export interface MapComponentProps extends React.ComponentProps<'div'> {
  map: OlMap;
  mapDivId?: string;
  onRender?: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  map,
  mapDivId = 'map',
  onRender = () => {},
  ...passThroughProps
}): JSX.Element => {

  const refCallback = useCallback((ref: HTMLDivElement) => {
    if (!map) {
      return;
    }
    if (ref === null) {
      map.setTarget(undefined);
    } else {
      map.setTarget(ref);
    }

    onRender();

  }, [map, onRender]);

  if (!map) {
    return <></>;
  }

  return (
    <div
      id={mapDivId}
      ref={refCallback}
      className="map"
      role="presentation"
      {...passThroughProps}
    />
  );
};

export default MapComponent;
