export class Response {
  private _status: string;
  private _message: any;

  constructor(status: string, message: any) {
    this._status = status;
    this._message = message;
  }


  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get message() {
    return this._message;
  }

  set message(value: any) {
    this._message = value;
  }
}
