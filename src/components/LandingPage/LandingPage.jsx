import React, { Suspense } from "react";

// Lazy load the components with named export handling
const CategoryList = React.lazy(() =>
  import("../CategoryList/CategoryList").then((module) => ({
    default: module.CategoryList,
  }))
);

const AllBeatsPage = React.lazy(() =>
  import("../AllBeatsPage/AllBeatsPage").then((module) => ({
    default: module.AllBeatsPage,
  }))
);

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
