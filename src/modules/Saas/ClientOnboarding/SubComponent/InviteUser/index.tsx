import React, { useEffect, useState } from "react";
import { ISubComponentProps } from "../../OnboardingSteps.model";
import FormField from "../../../../../utils/components/Form/FormField";
import {
  Grid,
  // BreadCrumb,
} from "ui-library";

const InviteUser = ({
  config,
  totalSteps,
  formInstance,
  isValidEmail,
  formData,
  isLaunchClickdFunction,
}: ISubComponentProps) => {
  const { reset } = formInstance;
  useEffect(() => {
    reset();
  }, []);

  return (
    <>
      <div className="card__selection__block">
        <div className="step__text">
          Step {config?.stepId - 1} of {totalSteps - 1}
        </div>
        <div className="form__control">
          {Object.keys(formData ?? {})?.map((fieldName, index) => {
            const meta = (formData ?? {})[fieldName];
            meta.multipleFiles = false;

            const { permission } = meta;
            if (!permission) {
              return undefined;
            }

            return (
              <Grid
                item
                key={fieldName}
                xs={12}
                sm={6}
                md={3}
                className="grid-item"
              >
                <FormField
                  onChange={() => {
                    if (isLaunchClickdFunction) isLaunchClickdFunction();
                  }}
                  name={fieldName}
                  meta={{
                    ...meta,
                    handleBlurEvent: (data) => {
                      if (isValidEmail) isValidEmail(data, index);
                    },
                  }}
                  formInstance={formInstance}
                />
              </Grid>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default InviteUser;
