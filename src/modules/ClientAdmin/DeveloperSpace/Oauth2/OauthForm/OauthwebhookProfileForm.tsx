import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { OauthAction } from "../Oauth.action";
import {
  FormWrapper,
  SectionHeaderContainer,
} from "./OauthwebhookProfileForm.style";
import {
  BreadCrumb,
  Box,
  Card,
  Grid,
  SectionHeader,
  IconButton,
  Checkbox
} from "ui-library";
import FormLoader from "../../../../../utils/components/FormLoader";
import { useBreadCrumbs } from "./FormUtils";
import { useForm } from "react-hook-form";

import { useTypedSelector } from "../../../../../utils/redux/rootReducer";
import FormField from "../../../../../utils/components/Form/FormField";
import { deepCopy } from "../../../../../utils/helper";
import axios from "../../../../../utils/axios";
import apiMappings from "../../../../../utils/apiMapping";
import withReact from "../../../../../utils/components/withReact";
import { tGlobalToastActions } from "../../../../common/GlobalToasts/globalToast.reducer";
import AdditionalHeaders from "../components/AdditionalHeaderOauth";


const OauthwebhookProfileForm = ({ setPageType ,commonDynamicLabels,formDynamicLabels}) => {
  const formInstance = useForm<Record<string, any>>({
    mode: "all",
    shouldUnregister: false,
    defaultValues: {},
  });

  // Checking if form is dirty
  console.log(formInstance.formState.isDirty, "isDirty");
  /** Redux Hooks */
  const { handleSubmit , getValues,watch ,setValue} = formInstance;
  const dispatch = useDispatch<Dispatch<OauthAction>>();
  const { structure, isLoading ,oAuthFormData,fetchFormStructureSuccessFlag } = useTypedSelector(
    (state) => state.oAuth.form
  );
  const isFormEditable = useTypedSelector((state)=>state.oAuth.isFormEditable)
  const sectionsKeysArray = Object.keys(structure);
  const { breadCrumbOptions, onBreadCrumbClick } = useBreadCrumbs(
    formInstance,
    commonDynamicLabels,
    setPageType
  );

  const toastDispatch = useDispatch<Dispatch<tGlobalToastActions>>()
  const {setError} = formInstance


  const [slabs, setSlabs] = useState([]);
  const [isAdditionalHeaderVisible, setAdditionalHeadersVisible] = useState(true);


  const onSubmit = async (data: any) => {
    console.log(data,'alankar')
    const clientId = JSON.parse(localStorage.getItem("userAccessInfo") || "")?.[
      "subClients"
    ]?.[0]?.["clientId"];

    if(isAdditionalHeaderVisible && slabs?.length >0){
      const lastdata : any  = slabs[slabs.length -1]
      if(lastdata.key === '' || lastdata.value === ''  ){
        toastDispatch({
          type: '@@globalToast/add', payload: {
              message: "Additional Headers cannot be empty",
              icon: 'icon-cross-circled',
              remove: false
          }
      })
          return
      }
    }
   
    const payload = {
      ...data,
      authenticationType : data?.authenticationType?.name,
      clientId: clientId,
      headerList:isAdditionalHeaderVisible ?  slabs : []
    }
    const UpdatePayload = {
      ...data,
      authenticationType : data?.authenticationType?.name,
      clientId: clientId,
      referenceId:oAuthFormData.referenceId,
      headerList:isAdditionalHeaderVisible ?  slabs : []
    }
    try {
      const results = await axios[isFormEditable ? "put" : "post"](isFormEditable ? apiMappings.OauthProfile.form.updateOauth : apiMappings.OauthProfile.form.create, isFormEditable ? UpdatePayload :  payload)
      console.log(results,'results')
      if(results?.status === 200){
        setPageType('listView')
        toastDispatch({
          type: '@@globalToast/add', payload: {
              message: isFormEditable ? formDynamicLabels.webhookToken + " updated successfully." : formDynamicLabels.webhookToken + " added successfully.",
              icon: 'check-round',
              remove: false
          }
      })
      }
    
    } catch (errorMessage) {
      
      toastDispatch({
        type: '@@globalToast/add', payload: {
            message:"asd",   //solve
            icon: 'check-round',
            remove: false
        }
    })
    
    }

  };
  const showHideFieldsHandler = (fieldsArray, newStructure, showHideFlag) => {
    fieldsArray.forEach((fieldName) => {
      newStructure["general Details"][fieldName]?.permission =
        showHideFlag == "show" ? true : false;
    });

    return newStructure
  };
  const resetFields = (fieldsArray:Array<string>)=>{
    fieldsArray.forEach((fieldName :string)=>{
      setValue(fieldName,"")
    })
  }
  const showHide = (newStructure) => {
      if (getValues("authenticationType")?.value == "OAUTH2.0" ) {
       
        const fieldsListToShow = [
          "authorizationHost",
          "tokenClientId",
          "clientSecret",
          "comments",
          "contentType",
          "grantType",
          "scope",
          "tokenCreationEndpoint",
          "refreshToken"
        ];
       const reduxData =  showHideFieldsHandler(fieldsListToShow, newStructure, "show");
        
        dispatch({
          type: "@@OAUTH/SET_UPDATED_FORM_STRUCTURE",
          payload: reduxData,
        });

      } else {
        const fieldsListToHide = [
          "authorizationHost",
          "tokenClientId",
          "clientSecret",
          "comments",
          "contentType",
          "grantType",
          "scope",
          "tokenCreationEndpoint",
          "refreshToken"
        ];
        
        const reduxData =  showHideFieldsHandler(fieldsListToHide, newStructure, "hide");
        
        dispatch({
          type: "@@OAUTH/SET_UPDATED_FORM_STRUCTURE",
          payload: reduxData,
        });
        const fieldsArray = ['authorizationHost','tokenClientId','clientSecret','comments','contentType','grantType','scope','tokenCreationEndpoint','authenticationType',"refreshToken"]
        resetFields(fieldsArray)
      }

    
  };




  useEffect(() => {  

    if(!Object.keys(structure).length){
      dispatch({ type: "@@OAUTH/GET_FORM_STRUCTURE" });
    }
    return(()=>{
      dispatch({type:"@@OAUTH/SET_FORM_EDITABLE",payload:false})
      dispatch({type:'@@OAUTH/RESET_FORM_DATA'})
    })
  }, []);
const authenticationTypeWatcher = watch('authenticationType')

  useEffect(() => {
      const newStructure = deepCopy(structure);
      if(Object.keys(newStructure)?.length ){
        showHide(newStructure);
      }
      
  }, [authenticationTypeWatcher?.toString(), fetchFormStructureSuccessFlag]);

  useEffect(()=>{
    if(isFormEditable &&Object.keys(oAuthFormData).length > 0){
    const {authorizationHost,tokenClientId,clientSecret,comments,contentType,grantType,scope,tokenCreationEndpoint,tokenName,authenticationType ,refreshToken} = oAuthFormData
      const dataToFill = {
        authorizationHost,
        tokenClientId,
        clientSecret,
        comments,
        contentType,
        grantType,
        scope,
        tokenCreationEndpoint,
        tokenName,
        refreshToken,
        authenticationType :{
                  id: authenticationType,
                  name: authenticationType,
                  label: authenticationType,
                  value: authenticationType,
                }

      }
      for(let key in dataToFill){
        setValue(key,dataToFill[key])
      }
    }

  },[oAuthFormData])



 

  useEffect(()=>{
    debugger;
    if(oAuthFormData?.headerList){
      setSlabs(oAuthFormData?.headerList)
    }
    if(oAuthFormData?.headerList?.length == 0) {
      setAdditionalHeadersVisible(false)
     }else{
      setAdditionalHeadersVisible(true)
    }
  },[oAuthFormData?.headerList])

  console.log(slabs,'headers')


  return (
    <>
      <FormWrapper>
      <div id="toast-inject-here" />
        <Box pt="24px" pb="24px">
          <BreadCrumb options={breadCrumbOptions} onClick={onBreadCrumbClick} />
        </Box>
        <Card
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "white",
            height: "100vh",
          }}
        >
          {isLoading ? (
            <FormLoader />
          ) : (
            <>
            <div>
              {sectionsKeysArray?.length
                ? sectionsKeysArray?.map((sectionName) => {
                    return (
                      <div
                        className={`${sectionName}-section`}
                        key={sectionName}
                      >
                        {Object.keys(structure[sectionName])?.some(
                          (fieldKey) =>
                            structure[sectionName][fieldKey].permission
                        ) ? (
                          <>
                            <SectionHeaderContainer>
                              <SectionHeader
                                headerTitle={
                                  formDynamicLabels[sectionName] ||
                                  "General Details"
                                }
                              />
                            </SectionHeaderContainer>

                            <Grid
                              container
                              spacing="10px"
                              style={{ marginBottom: "15px" }}
                            >
                              {Object.keys(structure[sectionName])
                                ? Object.keys(structure[sectionName])?.map(
                                    (fieldName: string) => {
                                      const fieldStructure =
                                        structure[sectionName][fieldName];
                                      const { permission } = fieldStructure;
                                      if (fieldName == "authenticationType") {
                                        return !permission ? undefined : (
                                          <Grid
                                            item
                                            key={fieldName}
                                            xs={12}
                                            sm={6}
                                            md={3}
                                            className="grid-item"
                                          >
                                            <FormField
                                              name={fieldName}
                                              meta={fieldStructure}
                                              formInstance={formInstance}
                                              options={[
                                                {
                                                  id: "OAUTH2.0",
                                                  label: "OAUTH2.0",
                                                  value: "OAUTH2.0",
                                                  name: "OAUTH2.0",
                                                }
                                                
                                              ]}
                                            />
                                          </Grid>
                                        );
                                      }

                                      return !permission ? undefined : (
                                        <Grid
                                          item
                                          key={fieldName}
                                          xs={12}
                                          sm={6}
                                          md={3}
                                          className="grid-item"
                                        >
                                          <FormField
                                            name={fieldName}
                                            meta={fieldStructure}
                                            formInstance={formInstance}
                                          />
                                        </Grid>
                                      );
                                    }
                                  )
                                : null}
                            </Grid>
                          </>
                        ) : null}
                      </div>
                    );
                  })
                : null}
                  <Grid container spacing='15px'>
                  <Grid item xs={6} sm={6} md={4} lg={3}>
                    <Checkbox
                      checked={isAdditionalHeaderVisible}
                      label='Additional Header'
                      onChange={() =>
                        setAdditionalHeadersVisible(!isAdditionalHeaderVisible)
                      }
                    />
                  </Grid>
                  {isAdditionalHeaderVisible && <AdditionalHeaders slabs={slabs} setSlabs={setSlabs} formInstance ={formInstance} dynamicLabels={formDynamicLabels} />}

                </Grid>
            </div>
              
            </>

          )}

          {/* Action Buttons */}
          <Box horizontalSpacing="15px" display="flex" mt="30px">
            <IconButton
              id={`webhook_token_configuration--actionbar--${isFormEditable ? 'update' : 'save' }`}
              iconVariant="icomoon-save"
              style={{ padding: "0px 15px" }}
              onClick={handleSubmit(onSubmit)}
              primary
            >
              {/* {isUpdateForm ? formDynamicLabels.update : formDynamicLabels.save} */}
              {isFormEditable ? formDynamicLabels?.update: formDynamicLabels?.save}
            </IconButton>
            <IconButton
               id={'webhook_token_configuration--actionbar--cancel'}
              iconVariant="icomoon-close"
              style={{ padding: "0px 15px" }}
              disabled={isLoading}
              onClick={() => {
                onBreadCrumbClick();
              }}
            >
              {formDynamicLabels.cancel}
            </IconButton>
          </Box>
        </Card>
      </FormWrapper>
    </>
  );
};

export default withReact(OauthwebhookProfileForm);
