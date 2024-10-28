import React from "react";
import { AllBeatsPage } from "../AllBeatsPage/AllBeatsPage";
import { NavBar } from "../NavBar/NavBar";
import { CategoryList } from "../CategoryList/CategoryList";

export const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <CategoryList />
      <AllBeatsPage />
    </div>
  );
};
