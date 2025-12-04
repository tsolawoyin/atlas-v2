"use client"; 

// React
import { createContext, useContext } from "react";
import { useImmer } from "use-immer";
import { v4 } from "uuid";

export const ConfigCtx = createContext();

import { ShellContext } from "@/shell/shell";

export default function ConfigProvider({ children }) {
  const [choosen, setChoosen] = useImmer([
    {
      id: v4(),
      subject_id: "", // subject id
      topic_id: "", // topic id
      s_name: "", //
      t_name: "",
      qty: 10,
      type: "s", // type s means single
      display: 1, // the initial view-type will be 1...
    },
  ]);

  function addChoice(choice) {}

  function updateChoice(id, property, value) {}

  function removeChoice(id) {}

  return (
    <ConfigCtx.Provider
      value={{ choosen, addChoice, updateChoice, removeChoice }}
    >
      {children}
    </ConfigCtx.Provider>
  );
}
