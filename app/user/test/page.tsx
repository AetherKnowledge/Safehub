import { clearNotifications, testAction } from "./testActions";

const Test = async () => {
  return (
    <>
      <button className="btn" onClick={testAction}>
        Test Action
      </button>
      <button className="btn" onClick={clearNotifications}>
        Delete Action
      </button>
      <div className="flex-1 flex flex-row"></div>
    </>
  );
};

export default Test;
