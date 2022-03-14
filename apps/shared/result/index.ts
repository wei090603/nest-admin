export class ResultData {
  readonly data: any;
  readonly code: number;
  readonly message: string;

  constructor(code: number, data?: any, message = 'success') {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success(data?: any) {
    return new ResultData(200, data);
  }
}
