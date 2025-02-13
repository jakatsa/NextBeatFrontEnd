import React from "react";
import { AllBeatsPage } from "../AllBeatsPage/AllBeatsPage";
import { CategoryList } from "../CategoryList/CategoryList";

export const LandingPage = () => {
  return (
    <div>
      LandingPage
      <CategoryList />
      <AllBeatsPage />
    </div>
  );
};
