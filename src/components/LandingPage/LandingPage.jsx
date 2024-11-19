import React from "react";
import { AllBeatsPage } from "../AllBeatsPage/AllBeatsPage";
import { NavBar } from "../NavBar/NavBar";
import { CategoryList } from "../CategoryList/CategoryList";
import { CategoryBeats } from "../CategoryBeats/CategoryBeats";

export const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <CategoryList />
      <AllBeatsPage />
      <CategoryBeats />
    </div>
  );
};
