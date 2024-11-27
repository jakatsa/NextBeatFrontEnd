import React from "react";
import { AllBeatsPage } from "../AllBeatsPage/AllBeatsPage";
import { CategoryList } from "../CategoryList/CategoryList";
import { CategoryBeats } from "../CategoryBeats/CategoryBeats";

export const LandingPage = () => {
  return (
    <div>
      <CategoryList />
      <AllBeatsPage />
      <CategoryBeats />
    </div>
  );
};
