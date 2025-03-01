import React, { lazy, Suspense } from "react";
import { CategoryList } from "../CategoryList/CategoryList";

// Lazy load AllBeatsPage
const AllBeatsPage = lazy(() => import("../AllBeatsPage/AllBeatsPage"));

export const LandingPage = () => {
  return (
    <div>
      <CategoryList />
      <Suspense fallback={<div>Loading AllBeats...</div>}>
        <AllBeatsPage />
      </Suspense>
    </div>
  );
};
