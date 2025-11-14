type ActionResult<T> =
  | {
      success: true;
      data?: T;
    }
  | {
      success: false;
      message: string;
      cause?: any;
    };

export default ActionResult;
