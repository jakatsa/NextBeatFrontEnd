import React, { Suspense } from "react";

// Lazy load the components
const CategoryList = React.lazy(() => import("../CategoryList/CategoryList"));
const AllBeatsPage = React.lazy(() => import("../AllBeatsPage/AllBeatsPage"));

export const LandingPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading Category List...</div>}>
        <CategoryList />
      </Suspense>
      <Suspense fallback={<div>Loading Beats...</div>}>
        <AllBeatsPage />
      </Suspense>
    </div>
  );
};
