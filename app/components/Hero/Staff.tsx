const Staff = () => {
  return (
    <div className="relative">
      {/* Top half background */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary shadow-xl"></div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-primary-content font-bold text-3xl z-10 w-full text-center p-10">
          SWS Staff Members
        </h2>
        <div className="relative z-10 flex flex-wrap gap-6 p-20 pb-0 pt-0 items-center justify-center">
          <div className="card bg-base-100 w-96 shadow-sm">
            <figure className="p-3">
              <img src="/images/noUser.svg" alt="No User" />
            </figure>
            <div className="card-body pt-0">
              <h2 className="card-title flex flex-col gap-0">
                Ms. Dela Cruz
                <span className="text-sm">Assistant Manager</span>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              </p>
            </div>
          </div>

          <div className="card bg-base-100 w-96 shadow-sm">
            <figure className="p-3">
              <img src="/images/noUser.svg" alt="No User" />
            </figure>
            <div className="card-body pt-0">
              <h2 className="card-title flex flex-col gap-0">
                Mr. Manansala
                <span className="text-sm">Assistant Manager</span>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              </p>
            </div>
          </div>

          <div className="card bg-base-100 w-96 shadow-sm">
            <figure className="p-3">
              <img src="/images/noUser.svg" alt="No User" />
            </figure>
            <div className="card-body pt-0">
              <h2 className="card-title flex flex-col gap-0">
                Ms. Trinidad
                <span className="text-sm">Assistant Manager</span>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
