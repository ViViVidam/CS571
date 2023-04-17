export class Reservation {
  name:string;
  date: string;
  time: string;
  email: string;

  constructor(
  name:string,
  date: string,
  hour:number,minute:number,
  email: string){
    this.date = date;
    this.name = name;
    this.time = String(hour) + ':' +String(minute);
    this.email = email;
  }
}
