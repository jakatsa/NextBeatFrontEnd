// src/dummydata/data.js (or wherever your data is stored)
import heroOne from "../assets/heroone.jpeg";
import heroTwo from "../assets/herotwo.jpg";
import heroThree from "../assets/herothree.jpeg";
import heroFour from "../assets/herofour.jpeg";
import heroFive from "../assets/herofive.jpeg";
import heroSix from "../assets/herosix.jpeg";
import heroSeven from "../assets/heroseven.jpeg";

export const hero1 = [
  {
    id: 1,
    name: "New SoundPack from Bobby",
    tag: "Bobby",
    cover: heroOne, // direct import
  },
  {
    id: 2,
    name: "Ballonerism",
    tag: "Ballonerism",
    cover: heroTwo,
  },
  {
    id: 3,
    name: "New Album From Akatsa",
    tag: "Joe",
    cover: heroThree,
  },
];

export const hero2 = [
  {
    id: 1,
    name: "The life and times",
    tag: "life",
    cover: heroFour,
  },
  {
    id: 2,
    name: "New Album by VQ",
    tag: "VQ",
    cover: heroFive,
  },
  {
    id: 3,
    name: "Colored By Emotions",
    tag: "Jeremy Scott",
    cover: heroSix,
  },
  {
    id: 4,
    name: "Freestyle Beats By Mia Nane",
    tag: "Mia Nane ",
    cover: heroSeven,
  },
];
