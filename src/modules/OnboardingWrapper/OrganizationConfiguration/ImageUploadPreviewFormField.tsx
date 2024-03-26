import React, { useEffect, useLayoutEffect, useState } from 'react';
import { IMongoField } from "../../../utils/mongo/interfaces";
import { UseFormMethods } from "react-hook-form";
import { useToast } from 'ui-library'
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import ImageUploadPreview from './OrganizationProfile/ImageUploadPreview';

interface IImageUploadPreviewFormField  {
    name: string,
    meta: IMongoField,
    formInstance: UseFormMethods
    clientName: string
    setImageURL?: any
    captionText?: string
}

const ImageUploadPreviewFormField = ({
    name,
    meta,
    formInstance: { watch, setValue, getValues },
    setImageURL,
    clientName,
    captionText=''
  }: IImageUploadPreviewFormField) => {
    const fieldValue = watch(name);
    const toast = useToast();
    const dynamicLabels = useTypedSelector(state => state.dynamicLabels)

    const [imgUrl , setImgUrl] = useState(fieldValue);

    useEffect(() => {
      setValue(name, imgUrl || fieldValue)
      if(setImageURL){
        setImageURL(imgUrl)
        setImgUrl(localStorage.getItem('uploadLogo') || '')
      }
    }, [imgUrl])
    useLayoutEffect(()=>{
      setValue(name, fieldValue)
    },[fieldValue])


    const uploadFileToServer = async (file: File) => {
        const fd = new FormData()
        fd.append('uploadLogo', file || '')

        try {
          const { data: responseUpload } = await axios.post(`${apiMappings.common.uploadLogo}?clientName=${clientName}`, fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
    
          if (responseUpload.status === 200) {
            console.log(responseUpload)
            setImgUrl(responseUpload.data);
          } else {
            throw responseUpload
          }
        } catch (error) {
            toast.add(error?.response?.message || error?.message || dynamicLabels.somethingWendWrong, 'warning', false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        Array.from(e?.target?.files || []).forEach((file: File) => {
          if (!file) {
            return
          }
    
          const { size } = file
          if (size > 100000) {
            toast.add('The file size shall not exceed 100 KB', 'warning', false);
            return
          }
    
          if (size === 0) {
            toast.add('The file cannot be blank', 'warning', false);
            return
          }
    
          uploadFileToServer(file)
        })
    }

    function createMarkup(htmlMarkup: any) {
      return { __html: htmlMarkup };
    }
  

    return (
      <>
        <ImageUploadPreview
          label={meta.label}
          id={name}
          name={name}
          value={imgUrl}
          className={`formFieldWrapper-${name}`}
          onChange={handleChange}
        />
        <div
          style={{
            color: "#777",
            fontSize: "12px",
            margin: "15px 15px",
            marginTop: "10px",
          }}
        >
          {captionText === "" ? (
            "Best fit : 160px x 35px | Maximum file size : 100 kb."
          ) : (
            <p dangerouslySetInnerHTML={createMarkup(captionText)}></p>
          )}
        </div>
      </>
    );
  }

export default ImageUploadPreviewFormField