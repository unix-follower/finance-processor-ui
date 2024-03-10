import ErrorCode from "./ErrorCode"

export default class FinProcessorError extends Error {
  errorCode: ErrorCode
  response?: Response | undefined

  constructor(
    errorCode: ErrorCode,
    response: Response | undefined = undefined,
    cause: unknown | null = null,
    message: string | null = null,
  ) {
    super(message || undefined)
    this.response = response
    this.cause = cause
    this.errorCode = errorCode || ErrorCode.UNKNOWN
  }
}
