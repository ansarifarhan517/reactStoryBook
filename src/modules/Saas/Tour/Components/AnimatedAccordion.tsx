import React, { useState, useRef, useLayoutEffect } from "react";
import {
  StyledAccordionHead,
  StyledSubStepTitle,
} from "../Layouts/StyledOnboardingView";
import { motion, AnimatePresence } from "framer-motion";

const SubStepTitle = ({
  text,
  isSelected,
  id,
  setSelectedSubStep,
  setSelected,
  stepName,
  parentId,
  status,
  isOpen,
}) => {
  console.log("status", status);

  const selectionSubStep = useRef(null);

  useLayoutEffect(() => {
    if (id.split(".")[1] === "1") {
      setSelectedSubStep(String(id));
      setSelected(parentId, id, false,status);
    }
  }, []);

  return (
    <StyledSubStepTitle
      className={`${status === "UNVISITED" ? "unvisited-step" : ""} ${
        String(id) === isSelected ? `selected` : ""
      }`}
      id={stepName}
      onClick={() => {
        setSelectedSubStep(String(id));
        setSelected(parentId, id, false, status);
      }}
      ref={selectionSubStep}
    >
      {text}
    </StyledSubStepTitle>
  );
};

const AccordionSteps = ({ id, expanded, title, subStep, stepName, ...props }) => {
  //setExpanded
  const { isSelected, status, setSelected, data } = props;
  const [subStepSelected, setSubStepSelected] = useState(`${id}.1`);
  const isOpen = expanded;

  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <div className={`animated__accordion__wrapper ${expanded ? "active" : ""}`}>
      <motion.div initial={false}>
        <AccordionHead
          title={title}
          isSelected={isSelected}
          id={id}
          stepName={stepName}
          status={status}
          setSelected={setSelected}
          arrow={true}
          data={data}
          isSubStepHeader={true}
          isOpen={isOpen}
        />
      </motion.div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: "0" },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <motion.div
              variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
              transition={{ duration: 0.4 }}
              className="content-placeholder"
            >
              {subStep.map((data, index) => {
                return (
                  <SubStepTitle
                    key={index}
                    parentId={id}
                    text={data?.headerLabel}
                    stepName={data?.stepName}
                    isSelected={subStepSelected}
                    setSelected={setSelected}
                    setSelectedSubStep={setSubStepSelected}
                    id={data?.stepId}
                    isOpen={isOpen}
                    status={data?.status}
                  />
                );
              })}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

const AccordionHead = ({
  title,
  isSelected,
  id,
  status,
  setSelected,
  isSubStepHeader = false,
  arrow = false,
  isOpen = false,
  stepName = '',
  ...props
}) => {
  const { data } = props;
  return (
    <StyledAccordionHead
      className={
        isSelected
          ? data?.subSteps?.length > 0
            ? "subSelected"
            : `selected`
          : ""
      }
      onClick={() => {
        !isOpen && setSelected(id, isSubStepHeader ? Number(`${id}.1`) : 0, false ,status);
      }}
      id={stepName}
    >
      <span className={`cbx ${status === "COMPLETED" ? "active" : ""}`}>
        <span>
          <svg width="12px" height="9px" viewBox={"0 0 12 9"}>
            <polyline points="1 5 4 8 11 1"></polyline>
          </svg>
        </span>
      </span>
      <i>{title}</i>
      {arrow && <strong></strong>}
    </StyledAccordionHead>
  );
};

const AnimatedAccordion = (props) => {
  const { data, isSelected, id, title, stepName } = props;

  if (data.subSteps && data.subSteps.length > 0) {
    return (
      <AccordionSteps
        subStep={data.subSteps}
        expanded={isSelected}
        stepName={stepName}
        id={id}
        title={title}
        {...props}
      />
    );
  } else {
    return (
      <>
        <AccordionHead {...props} />
      </>
    );
  }
};

export default AnimatedAccordion;
