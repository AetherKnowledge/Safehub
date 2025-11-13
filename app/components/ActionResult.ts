export type ErrorResponse = {
  message: string;
  cause?: any;
};

type ActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: ErrorResponse;
    };

export default ActionResult;
