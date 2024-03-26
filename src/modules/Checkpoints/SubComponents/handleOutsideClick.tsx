import React, { useEffect } from "react";
import { useTypedSelector } from "../../../utils/redux/rootReducer";

const handleOutsideClick = (ref, handler) => {
  const outsideClickFl = useTypedSelector(
    (state) => state.checkpoints.listView.isModalOpen
  );

  useEffect(() => {
    if (outsideClickFl && outsideClickFl == true) {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    } else {
      return;
    }
  }, [ref, handler, outsideClickFl]);
};

export default handleOutsideClick;
