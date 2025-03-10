// import React, { useEffect, useState } from "react";
// import { SideBar } from "../SharedPages/SideBar";

// export const LayoutSideBar = ({ children }) => {
//   const [SideBarWidth, setSideBarWidth] = useState(undefined);
//   const [SideBarTop, setSideBarTop] = useState(undefined);

//   useEffect(() => {
//     const SideBarEl = document
//       .querySelector(".SideBar")
//       .getBoundingClientRect();
//     setSideBarWidth(SideBarEl.width);
//     setSideBarTop(SideBarEl.top);
//   }, []);

//   useEffect(() => {
//     if (!SideBarTop) return;

//     window.addEventListener("scroll", isSticky);
//     return () => {
//       window.removeEventListener("scroll", isSticky);
//     };
//   }, [SideBarTop]);

//   const isSticky = (e) => {
//     const SideBarEl = document.querySelector(".SideBar");
//     const scrollTop = window.scrollY;
//     if (scrollTop >= SideBarTop - 10) {
//       SideBarEl.classList.add("is-sticky");
//     } else {
//       SideBarEl.classList.remove("is-sticky");
//     }
//   };
//   return (
//     <>
//       <main className="md:flex md:justify-between px-5 mt-8">
//         <div className="content w-full md:w-[73%]">{children}</div>
//         <div
//           className="md:w-[25%] border-2 border-solid border-gray-100 rounded-xl p-5"
//           style={{ width: SideBarWidth }}
//         >
//           <SideBar />
//         </div>
//       </main>
//     </>
//   );
// };
