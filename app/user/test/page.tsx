const Test = () => {
  async function wew() {
    "use server";
    // await testAction();
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
