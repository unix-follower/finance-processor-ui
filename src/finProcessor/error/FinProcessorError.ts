import ErrorCode from "./ErrorCode"

export default class FinProcessorError extends Error {
  private _errorCode: ErrorCode

  public get errorCode(): ErrorCode {
    return this._errorCode
  }

  constructor(
    errorCode: ErrorCode,
    cause: unknown | null = null,
    message: string | null = null,
  ) {
    super(message || undefined)
    this.cause = cause
    this._errorCode = errorCode
  }
}
