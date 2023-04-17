import { Marker } from '../details-card/Marker'

export class MapOptions {
  center: Marker;
  zoom: number;
  constructor(center:Marker,zoom:number) {
    this.center = new Marker(center.lat,center.lng);
    this.zoom = zoom;
  }
}
