import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/CategorySlice";

export const CategoryList = () => {
  const dispatch = useDispatch();
  const { data: category, status } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  if (status === "Loading") {
    return <p>Loading</p>;
  }
  if (status === "error") {
    return <p>error</p>;
  }
  return (
    <>
      <div>Category List</div>
      {category.map((categories) => (
        <div key={categories.id}>
          <h1>{categories.name}</h1>
        </div>
      ))}
    </>
  );
};
