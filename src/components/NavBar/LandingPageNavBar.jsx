import React from "react";

export const LandingPageNavBar = () => {
  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-screen h-[8vh] md:shadow-md shadow-sm bg-white">
        <div className="hidden md:flex justify-between px-7 p-2">
          <div className="logo flex">
            <div>
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 mr-3"
                alt="BeatRoot Logo"
                width="40px"
                height="40px"
              />
            </div>
            <h2 className="text-2xl font-semibold ml-3">BeatRoot</h2>
          </div>
          {/**navlinks */}
          <div className="menu">
            <ul className="flex">
              {navBar.map((list, i) => (
                <li className={`mx-5 py-2  ${activeNavLink}`} key={i}>
                  <NavLink to={list.path}>{list.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};
