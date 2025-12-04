"use client";

import { useContext } from "react";
import { ConfigCtx } from "./configProvider";

export default function ExamSelector() {
  const { choosen } = useContext(ConfigCtx);
//   console.log(choosen)

  return <div></div>;
}
