import styled from "styled-components";
import { Grid } from "ui-library";
import FormField from "../../../../utils/components/Form/FormField";
import React, { ReactElement } from "react";
import { IMongoField } from "../../../../utils/mongo/interfaces";
import { UseFormMethods } from "react-hook-form";
//import ImageUploadPreview from './ImageUploadPreview';
import ImageUploadPreviewFormField from "./../ImageUploadPreviewFormField";

interface ISectionImageProps {
  fieldNames: Record<string, IMongoField>;
  formInstance: UseFormMethods<Record<string, any>>;
  clientName: string;
  setImageURL?: any;
  isClientOnboarding?: boolean;
  imageCaption?:string;
}

export const FieldsContainer = styled.div`
  width: 50%;
  padding: 0;
  display: block;
  > div {
    display: block !important;
  }
`;

export const ImageContainer = styled.div`
  width: 100%;
  height: 486px;
  padding: 0;
  margin-top: -15px;
  margin-right: -45px;
  justify-content: right;
  align-items: right;
`;

export default function SectionImageContainer({
  fieldNames,
  formInstance,
  clientName,
  isClientOnboarding = false,
  setImageURL,
  imageCaption=''
}: ISectionImageProps): ReactElement {
  return (
    <>
      <FieldsContainer className="image__container">
        {Object.entries(fieldNames).map(([key, value]) => {
          const { permission, fieldType } = value;
          if (!permission) {
            return undefined;
          }
          if (fieldType === "fileViewUploader") {
            return (
              <ImageUploadPreviewFormField
                meta={value}
                name={key}
                setImageURL={setImageURL}
                formInstance={formInstance}
                clientName={clientName}
                captionText={imageCaption}
              />
            );
          }
          return (
            <Grid
              key={key}
              container
              xs={12}
              sm={6}
              md={6}
              className="address-fields"
              spacing="0px 15px 0px 0px"
              style={{
                width: "100%",
                marginRight: 0,
                padding: 0,
                alignItems: "center",
              }}
            >
              <Grid
                spacing="15px"
                item
                key={key}
                xs={12}
                sm={6}
                md={6}
                className="grid-item"
              >
                <FormField
                  name={key}
                  meta={value}
                  formInstance={formInstance}
                />
              </Grid>
            </Grid>
          );
        })}
      </FieldsContainer>
      {!isClientOnboarding && (
        <Grid container xs={12} sm={6} md={6} style={{ width: "50%" }}>
          <ImageContainer>
            <img
              src="images/onboarding/laptop-profile.png"
              alt=""
              height="486px"
              width="100%"
            />
          </ImageContainer>
        </Grid>
      )}
    </>
  );
}
