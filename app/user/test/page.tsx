const Test = async () => {
  const response = await fetch(
    "https://safehub.metered.live/api/v1/turn/credentials?apiKey=c3ad0384c50f5ff0a7c849d813ba7835ab10"
  );
  const text = await response.text(); // reads whole stream into a string
  console.log("full body:", text);

  console.log("Response:", response);

  return (
    <div className="flex-1">
      <div className="bg-base-100 shadow-br rounded-xl">
        <button className="btn btn-primary">Click Me</button>
      </div>
    </div>
  );
};

export default Test;
