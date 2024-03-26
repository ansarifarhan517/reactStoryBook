import React, { useEffect } from "react";
import FormField from "../../../../../../../utils/components/Form/FormField";
import { Accordion, AccordionHeaderTitle } from "ui-library";
import { useForm } from "react-hook-form";

import "./style.css";

const DetailsAccordian = ({
  customerDetails,
  onToggle,
  expandedId,
  accordianId,
  structure,
}) => {
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
  });

  const { reset } = formInstance;

  const { mobileNumber, name, emailAddress } = customerDetails;

  useEffect(() => {
    const resetData = {
      ...customerDetails,
      contactEmail: emailAddress,
      contactNumber: mobileNumber,
    };
    reset({ ...resetData });
  }, [customerDetails]);

  return (
    <Accordion
      expanded={expandedId === accordianId}
      id={accordianId}
      onToggle={onToggle}
      key={accordianId}
    >
      {{
        header: <AccordionHeaderTitle>{name}</AccordionHeaderTitle>,
        content: (
          <div className="form-container">
            {Object.keys(structure?.columns).map((fieldName) => {
              const meta = {
                ...structure.columns?.[fieldName],
                editable: false,
              };
              const { permission } = meta;

              if (!permission) {
                return undefined;
              }

              return (
                <div className="form-item">
                  <FormField
                    name={fieldName}
                    meta={meta}
                    formInstance={formInstance}
                  />
                </div>
              );
            })}
          </div>
        ),
      }}
    </Accordion>
  );
};

export default DetailsAccordian;
