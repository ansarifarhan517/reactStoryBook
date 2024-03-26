import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, Box, IconButton, TextInput, TextArea, FileUpload, useToast, FontIcon, IFileObject } from 'ui-library';
import { IFileFormFieldObject } from "../../../utils/components/Form/interface";
import { useTypedSelector } from "../../../utils/redux/rootReducer";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";
import {
  getSignedUrl
} from '@aws-sdk/s3-request-presigner'
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import axios from "../../../utils/axios";
import { axiosWP } from "../../../utils/axios";
import { PostContainer } from "./TicketingToolAddModal.styled";
import { excludeAnnouncements, excludeExplores } from './../../FeaturePanel/FeaturePanel.constants';
import apiMappings from "../../../utils/apiMapping";
// import fs from 'fs';
// import ReactS3Client from 'react-aws-s3-typescript';
export const validFileExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.pdf', '.zip','.mp4','.mov','.flv','.avi','webm','.mkv']
export const validFileExtensionsJoined = validFileExtensions.join(',')
const AddTicketModal = (props: any) => {
  /** Redux Hooks */
  const toast = useToast();
  const { isAddTicketModal, setIsAddTicketModal, handleFetchData, fetchOptions } = props;
  // const formInstance = useForm<Record<string, any>>({ mode: 'all', shouldUnregister: false})
  const clientData = useTypedSelector(state => state.ticketingTool.clientData);
  // const { handleSubmit } = formInstance;
  const [newFiles, setNewFiles] = useState<IFileFormFieldObject[]>([])
  const [newFilesBlob, setNewFilesBlog] = useState<any>([]);
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const userAccessInfo = localStorage.getItem('userAccessInfo');
  // const username = userAccessInfo ? JSON.parse(userAccessInfo).userName : null;
  const s3configs = userAccessInfo? JSON.parse(JSON.parse(userAccessInfo).s3Config.chat):null;
  const [posts, setPosts] = useState([]);
  const [postsVisible, setPostsVisible] = useState(false);
  const [disableSaveButton, setDisableSaveButton] = useState(false);
  const [subjectError, setSubjectError] = useState(false);


  const addTicket = async () => {

    if (!subject) {
      setSubjectError(true);
    }
    if (subject) {
      setDisableSaveButton(true);
      const url = await uploadFileToS3();
      const payload = {
        apiKey: clientData.apiKey,
        project: {
          "id": clientData.project.id
        },
        "subject": subject,
        "priority_id": 2, // This is hardcoded because it will never change
        authorEmail: clientData.mail,
        "description": desc,
        "operationManagerUserId": clientData.operationManagerUserId,
        "accountManagerUserId": clientData.accountManagerUserId,
        "groupName": clientData.groupName,
        "customFieldData": clientData.customFieldData,
        uploads: url
      }
      setIsAddTicketModal(false);
      setDisableSaveButton(false);
      setSubject("");
      setDesc("");
      setNewFiles([]);
      setNewFilesBlog([]);
      setSubjectError(false)
      const { data } = await axios.post('/ThirdPartyPlugins/ticketing/issue/create', payload)
      if (data.data) {

        handleFetchData(fetchOptions);
        
        toast.add(data.message, 'success', false);
      } else {
        setSubject("");
        setDesc("");
        setNewFiles([]);
        setNewFilesBlog([]);
        setSubjectError(false)
        setDisableSaveButton(false);
        toast.add(data.message, 'warning', false);
      }
    }

  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const _newFiles: IFileFormFieldObject[] = []
    const blobFile: any = [];
    Array.from(e?.target?.files || []).forEach((file: File, i) => {
      if (!file) {
        return
      }

      const { size } = file
      if (size > 25000000) {
        toast.add('File cannot be uploaded since size is greater than 25 MB.', 'warning', false);
        return
      }

      if (size === 0) {
        toast.add('The file cannot be blank', 'warning', false);
        return
      }


      _newFiles.push({
        id: file.name,
        filename: file.name,
        type: 'new',
        index: i,
        data: file
      })
      blobFile.push({ id: file.name, blob: new Blob([file]) });


    })
    setNewFiles(_newFiles)
    setNewFilesBlog(blobFile);
  }
  const uploadFileToS3 = async () => {
    const client = new S3Client({
      region: s3configs.region, 
      credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: s3configs.region }),
        identityPoolId: `${s3configs.region}:${s3configs.poolId}`,
      }),
    });
    const fileUrl = []
    for (let i = 0; i < newFiles.length; i++) {
      const newFileName = `uploads/images/redmine/${clientData.userId}/${newFiles[i].id}`;
      const uploadParams = {
        Bucket: s3configs.bucket,
        Key: newFileName,
        Body: newFilesBlob[i].blob,
      };

      if (newFilesBlob.length) {
        try {
          const data = await client.send(new PutObjectCommand(uploadParams));
          if (data) {
            const getParams = {
              Bucket: s3configs.bucket,
              Key: newFileName
            };
            const getObject = new GetObjectCommand(getParams)
            const url = await getSignedUrl(client, getObject, { expiresIn: 3600 });
            fileUrl.push({ url, filename: newFiles[i].id });
          }

        }
        catch (e) {
          console.log("Fail", e);
        }
      }
    }

    return fileUrl;
  }


  const onSubjectKeyPress = async (e: any) => {
    setSubject(e.target.value);
    // debounce(getPosts, 5000)
   
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => getPosts(), 800);
    return () => clearTimeout(timeoutId);
  }, [subject]);
  const getPosts = async () => {
     if(subject){
    let config = {
      params: {
        search: subject,
        per_page: 50,
        order: 'desc',
        orderby: 'relevance',
        tags_exclude: excludeAnnouncements + ',' + excludeExplores
      }
    };

    const { data } = await axiosWP.get('/wp-json/wp/v2/posts', config);
    const isResult = data.length;
    
      setPostsVisible(isResult)
      setPosts(data);
 }
  }

  // File 

  const handleFileRemove = (file: IFileObject) => {

    const files = newFiles.filter((value) => {
      return value.id !== file.id
    })
    const blobs = newFilesBlob.filter((value: any) => {
      return value.id !== file.id
    })
    setNewFiles(files);
    setNewFilesBlog(blobs);
  }

  const redirectToLink = async function (url: string) {
    const isSupportReact = localStorage.getItem("support_react")

    let newUrl = url

    if (isSupportReact) {
        newUrl = url.replace('index.php', '#')
    }
    var encodeString = encodeURIComponent(newUrl);
    const { data } = await axios.get(apiMappings.wordpress.autoLogin + '?url=' + encodeString)
    if (data) {
      open('https://support.loginextsolutions.com/auto-login.php?token=' + data.token, '_blank');
    }


  }
  return (


    <><Modal

      open={isAddTicketModal}
      width="600px"
      onToggle={() => {
        // setIsAddTicketModal(value);
      }}
      size='sm'
      children={{
        header: (
          <ModalHeader
            headerTitle='Add Ticket'
            handleClose={() => {
              setSubject("");
              setDesc("");
              setNewFiles([]);
              setNewFilesBlog([]);
              setSubjectError(false)
              setIsAddTicketModal(false)
            }}
            imageVariant="icomoon-close"
            headerStyle={{ fontSize: "15px", justifyContent: 'left' }}
            width='100%'
          />
        ),
        content: (<>
          <Box style={{ maxHeight: window.innerHeight - 200, position: "relative" }}>
            <div>
              <TextInput
                fullWidth
                name="subject"
                onChange={(e) => onSubjectKeyPress(e)}
                tooltipDirection="top"
                className={`formFieldWrapper-subject`}
                placeholder="Enter Subject"
                label={"Subject"}
                maxLength={255} // As per redmine database max length for subject is 255
                error={subjectError}
                required={true}
                id="subject"
                errorMessage={"Subject is required."}
              />
              {postsVisible ?
                <PostContainer>
                  <h5>Related Help Center Articles
                  <div style={{ float: "right", display: "inline-block", padding: "10px", cursor: "pointer",marginTop: "-10px" }} onClick={() => { setPostsVisible(false) }}>
                    <FontIcon variant="icomoon-close" size={18} />
                  </div>
                  </h5>
                  
                  <ul>
                    {posts.map((value: any) => {
                      return <li className="searchResultList" onClick={() => redirectToLink(value.link)}>{value.title.rendered}</li>
                    })}
                  </ul>
                </PostContainer> : null}
            </div>
            <TextArea
              name="disc"
              onChange={(e) => setDesc(e.target.value)}
              className={`formFieldWrapper-subject`}
              placeholder="Enter Description"
              rows={15}
              label={"Description"}
              required={true}
              id="subject"

            />

            <FileUpload
              id={"attachment"}
              multiple={true}
              label={"Upload File"}
              name={"attachment"}
              onChange={handleChange}
              placeholder={"Upload File | Max: 25MB"}
              required={false}
              style={{ height: '100%' }}
              files={newFiles}
              onFileRemove={handleFileRemove}
              accept={validFileExtensionsJoined}
            />

            {disableSaveButton && newFiles.length > 0 && <>
              <div id="loader" style={{ zIndex: 1, alignItems: "center", justifyContent: "center", background: "#ffffffd4", top: "45px", position: "absolute", bottom: "18px", height: "calc(100% - 45px)", width: "100%", left: "0", paddingTop: "40%" }}><div className="logi-spinner"><div className="bounce1"></div><div className="bounce2"></div><div className="bounce3"></div></div>
                <div style={{ textAlign: "center" }}>Uploading</div>
              </div></>}
          </Box>
          <Box
            horizontalSpacing="10px"
            display="flex"
            style={{ padding: "15px" }}
            justifyContent="flex-end"
          >
            <IconButton
              id='AddTicket-Modal-button-Save'
              iconVariant="icomoon-save"
              iconSize={11}
              primary
              onClick={addTicket}
              disabled={disableSaveButton}
            >
              Save
                    </IconButton>
            <IconButton
            id='AddTicket-Modal-button-Close'
              iconVariant="icomoon-close"
              iconSize={11}
              onClick={() => {
                setSubject("");
                setDesc("");
                setNewFiles([]);
                setNewFilesBlog([]);
                setSubjectError(false)
                setIsAddTicketModal(false)
                setDisableSaveButton(false);
              }
              }
            >
              Cancel
                    </IconButton>
          </Box>
        </>),
        footer: (<>
          

        </>
        )
      }}

    />
    </>


  )
}
export default AddTicketModal;
