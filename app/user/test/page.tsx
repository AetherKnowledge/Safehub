import { testAction } from "./testActions";

const Test = () => {
  const header = ["Header 1", "Header 2", "Header 3"];
  const rows = [
    [<p>Row 1, Cell 1</p>, <p>Row 1, Cell 2</p>, <p>Row 1, Cell 3</p>],
    [<p>Row 2, Cell 1</p>, <p>Row 2, Cell 2</p>, <p>Row 2, Cell 3</p>],
    [<p>Row 3, Cell 1</p>, <p>Row 3, Cell 2</p>, <p>Row 3, Cell 3</p>],
  ];

  async function wew() {
    "use server";
    await testAction();
  }

  return (
    <>
      <form action={wew}>
        <button className="btn">test</button>
      </form>
      hello
    </>
  );
};

export default Test;
