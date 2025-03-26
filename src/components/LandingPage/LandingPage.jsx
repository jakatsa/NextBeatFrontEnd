import React, { Suspense } from "react";
import { Hero } from "../SharedPages/Hero";
import { Link } from "react-router-dom";
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
      <h1>Hello thank you for visiting my beatstore</h1>
      <h1>
        Unfortunately my db on render is expired currently working on a solution
        thank you for your paitence{" "}
      </h1>
      <Link to="https://github.com/jakatsa/NextBeatFrontEnd">
        <h1>Repositroy link</h1>
      </Link>

      <Hero />

      <Suspense fallback={<div>Loading Category List...</div>}>
        <CategoryList />
      </Suspense>

      {/* <Suspense fallback={<div>Loading Beats...</div>}>
        <AllBeatsPage />
      </Suspense> */}
    </div>
  );
};
