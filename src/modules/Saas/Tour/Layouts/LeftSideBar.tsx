import React from "react";
import { motion } from "framer-motion";

const animationConfig = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

const LeftSidebar = ({ children }) => {
  return (
    <div className="sidebarWrapper">
      <motion.div
        transition={animationConfig}
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 10, opacity: 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default LeftSidebar;
