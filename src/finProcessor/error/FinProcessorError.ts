import ErrorCode from "./ErrorCode"

export default class FinProcessorError extends Error {
  private _errorCode: ErrorCode
  private _response?: Response | undefined

  public get errorCode(): ErrorCode {
    return this._errorCode || ErrorCode.UNKNOWN
  }

  public get response(): Response | undefined {
    return this._response
  }

  constructor(
    errorCode: ErrorCode,
    response: Response | undefined = undefined,
    cause: unknown | null = null,
    message: string | null = null,
  ) {
    super(message || undefined)
    this._response = response
    this.cause = cause
    this._errorCode = errorCode
  }
}
