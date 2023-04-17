import {Coordinates} from './Coordinates'
import {Categories} from './Categories'
import {Location} from './Location'

export interface TableItem {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories:Categories[];
  rating: number;
  coordinates: Coordinates;
  price:string;
  transactions: string[];
  location: Location;
  phone: string;
  display_phone: string;
  distance: number;

}
