import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { withThemeProvider } from '../../../utils/theme';
import { } from 'react-select';
import {
  withPopup,
  withToastProvider,
  Box,
  BreadCrumb,
  Grid,
  TextArea,
  IconButton,
  FontIcon,
  useToast,
  IFileObject,
  IconDropdown
} from "ui-library";
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
import withRedux from '../../../utils/redux/withRedux';
import axios from '../../../utils/axios';
import apiMappings from '../../../utils/apiMapping';
import { Label, Divider, MessageContainer, FileNameContainer, RemoveFileButton, FileContainer, AttachmentFileName,DetailValue } from './TicketingToolDetailView.styled'
import { getFormattedDate } from '../../Order/OrderListOptionData/utils';
import useClientProperties from '../../common/ClientProperties/useClientProperties';
import { useTypedSelector } from '../../../utils/redux/rootReducer';
import { getQueryParams, hybridRouteTo } from '../../../utils/hybridRouting';
import { useDispatch } from 'react-redux';
import { TicketingToolListViewActions } from '../TicketingToolListView/TicketingToolListView.actions';
import ReactTooltip from 'react-tooltip';
import { IFileFormFieldObject } from '../../../utils/components/Form/interface';

export const validFileExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.pdf', '.zip', '.mp4', '.mov', '.flv', '.avi', 'webm', '.mkv']
export const validFileExtensionsJoined = validFileExtensions.join(',')
interface IJournalData {
  attachments?: Array<any>
  created_on?: string
  details?: Array<any>
  id?: number
  notes?: string
  private_notes?: string
  user: any

}
interface ticketData {
  createdBy?: string
  createdOn?: string
  description?: string
  id?: number
  journals: Array<IJournalData>,
  attachments?: any
}
const TicketingToolDetailView = () => {
  const toast = useToast();
  const userAccessInfo = localStorage.getItem('userAccessInfo');

  const s3configs = userAccessInfo ? JSON.parse(JSON.parse(userAccessInfo).s3Config.chat) : null;
  const status = useTypedSelector(state => state.ticketingTool.ticketStatus);
  const dispatch = useDispatch<Dispatch<TicketingToolListViewActions>>();
  let existingParams = getQueryParams();
  const [comment, setComment] = useState("");
  const [commentButtonDisabled, setCommentButtonDisabled] = useState(true);
  const [closeButtonDisabled, setCloseButtonDisabled] = useState(false);
  const clientData = useTypedSelector(state => state.ticketingTool.clientData);
  const [ticketData, setTicketData] = useState<ticketData>();
  const peers = useTypedSelector(state => state.ticketingTool.peers);
  const getData = async (peers:any) => {

    const peerAuthorIds = peers.map((value: any) => {
      return value.id;
    })
    const params = {
      id: existingParams.issueId,
      peerAuthorIds

    }
    try {
      const { data } = await axios.post(apiMappings.ticktingTool.detailView.getdata, params);
      if (data.hasError && data.status == 401) {
        toast.add('You are not authorised to view this ticket.', 'warning', false);
      } else {
        setTicketData(data.data);
        setTimeout(() => {
          if (commentSession.current) {
            commentSession.current.scrollTop = commentSession.current.scrollHeight;
          }

        }, 10)
      }
    } catch (e) {
      toast.add('You are not authorised to view this ticket.', 'warning', false);
    }
  }

  const commentSession = useRef<HTMLDivElement>(null);
  const getClientData = async () => {
    let username = JSON.parse(localStorage.getItem('userAccessInfo') || "")['userName'] || "";
    const { data } = await axios.get('/ThirdPartyPlugins/ticketing/user/authenticate?userName=' + username);
    if(data?.hasError){
      toast.add(data?.message || "You do not have the required access.","warning",true);
      return;
    }
    dispatch({
      type: "@@ticketingToolListView/SET_CLIENT_DATA",
      payload: data.data
    })

    if (!peers.length) {
      const { data: peerIds } = await axios.get(apiMappings.ticktingTool.listview.getPeers + '?userId=' + data.data.userId)
      if (peerIds.data) {
        dispatch({
          type: "@@ticketingToolListView/SET_PEERS",
          payload: peerIds.data
        })
        getData(peerIds.data)
        return;
      }
    }
    
    getData(peers)
    
    
  }
  useEffect(() => {
    getClientData();

    // if(!clientData){
    //   getClientData();
    // }
  }, [])

  const breadCrumbList = [
    { id: "HOME", label: "Tickets", disabled: false },
    { id: "PAGE", label: status[existingParams.fromPage] ? status[existingParams.fromPage].label : "All", disabled: false },
    { id: "UPDATE", label: "Update Ticket", disabled: true },
    { id: "CURRENT", label: existingParams.issueId, disabled: true }
  ];

  const addComment = async (isClose: boolean) => {
    setCommentButtonDisabled(true);
    setComment('');
    const peerAuthorIds = peers.map((value: any) => {
      return value.id;
    })
    const params = {
      id: existingParams.issueId,
      peerAuthorIds

    }
    const { data } = await axios.post(apiMappings.ticktingTool.detailView.getdata, params);
   if(data.data.status === 'Closed')
   {
    toast.add("Ticket status has been changed, Redirecting to list view to know  latest status and update the ticket ",'warning',false);
    setTimeout(() => {
      if (window.location.origin === "http://localhost:9001") {
        location.replace(window.location.origin + "/#/ticketing");
      } else {
        location.replace(location.origin + "/product/#/ticketing");
      }
    },2000);
  }
   else{
    const url = await uploadFileToS3();
    const payload = {
      apiKey: clientData.apiKey,
      description: comment ? '@client ' + comment : '',
      id: existingParams.issueId,
      closeTicket: isClose,
      uploads: url
    }
    setComment('');
    const { data } = await axios.post('ThirdPartyPlugins/ticketing/issue/update', payload);
    if (data && !isClose) {
      setNewFiles([]);
      setNewFilesBlog([]);
      getData(peers);
    } else {
      toast.add(data.message, 'warning', false);
    }
  }
  }
  const clientProperties = useClientProperties(["TIMEZONE", "DATEFORMAT", "CURRENCY", "CRATESTRUCTURE", "OPTIMIZEPACKING", "WEIGHT", "VOLUME"]);

  const [newFiles, setNewFiles] = useState<IFileFormFieldObject[]>([])
  const [newFilesBlob, setNewFilesBlog] = useState<any>([]);
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    const _newFiles: IFileFormFieldObject[] = []
    const blobFile: any = [];
    Array.from(e?.target?.files || []).forEach((file: File, i) => {
      if (!file) {
        return
      }

      const { size } = file
      if (size > 25000000) {
        toast.add('File cannot be uploaded since file size is greater than 25 MB.', 'warning', false);
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
    setCommentButtonDisabled(false);
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
  const getOptionList = (attachments: any) => {
    let list = []
    for (let i = 0; i < attachments.length; i++) {
      if (i != 0) {
        list.push({ label: attachments[i]?.filename, value: attachments[i]?.content_url })
      }
    }
    return list;
  }
  const downloadFile = (url: any) => {
    window.location.href = `${url}/?key=${clientData.apiKey}`;
  }
  return (
    <>
      {ticketData && ticketData &&
        <Box display="flex" flexDirection='column' style={{ width: '100%', marginTop: '50px' }} px='15px' pb='15px'>
          <Box
            display="flex"
            justifyContent="space-between"
            style={{ width: "100%" }}
            pb='15px'
            pt="25px"
            className="header"
          >
            <div>
              <BreadCrumb options={breadCrumbList} onClick={(id: any) => {
                if (id == 'HOME')
                  hybridRouteTo('ticketing');
                else
                  hybridRouteTo(`ticketing?page=${existingParams.fromPage}`);
              }} ></BreadCrumb>
            </div>
            <>
              <IconButton
                id="ticketing_details--actionbar--mark-ticket_as_closed"
                intent="page"
                data-tip=""
                data-for="tt_AddOrder"
                iconVariant="icomoon-close"
                style={{ marginRight: "10px" }}
                disabled={existingParams.status === 'Closed' || closeButtonDisabled}
                onClick={() => {
                  setCloseButtonDisabled(true)
                  addComment(true);
                }}
              >

                Mark Ticket As Closed
              </IconButton>
              <ReactTooltip
                id="tt_AddOrder"
                type="info"
                effect="solid"
                place="bottom"
              >

              </ReactTooltip>
            </>

          </Box>
          <Grid container spacing="10px">
            <Grid className='grid-customised-scroll-bar' spacing="5px" item md={4} style={{ display: "flex", overflow: "hidden" }} >
              <Box style={{ width: "100%", boxShadow: "0 2px 20px -10px #000", height: "calc(100vh - 150px)" }} py="15px" px='15px' pb='15px' className="header">
                <h4>Ticket Details</h4>
                <Grid container spacing="10px" style={{ marginTop: "10px" }}>
                  <Grid item md={12} >
                    <Label>Subject</Label>
                    <Box style={{ maxHeight: "100px", overflow: "auto" }}>
                      <p>{ticketData ? ticketData?.['subject'] : ""}</p>
                    </Box>
                  </Grid>
                  <Grid item md={6} >
                    <Label>Created By</Label>
                    <DetailValue>{ticketData ? ticketData?.['createdBy'] : ""}</DetailValue>
                  </Grid>
                  <Grid item md={6} >
                    <Label>Created On</Label>
                    <DetailValue>{ticketData ? getFormattedDate(ticketData?.['createdOn'] || "", clientProperties?.TIMEZONE?.propertyValue) : ""}</DetailValue>
                  </Grid>
                  <Grid item md={6} >
                    <Label>Updated By</Label>
                    <DetailValue>{ticketData?.['updatedBy']}</DetailValue>
                  </Grid>
                  <Grid item md={6} >
                    <Label>Update On</Label>
                    <DetailValue>{ticketData ? getFormattedDate(ticketData?.['updatedOn'], clientProperties?.TIMEZONE?.propertyValue) : ""}</DetailValue>
                  </Grid>
                  {ticketData.attachments.length ?
                    <Grid item md={12} >
                      <Label>Attachment(s)</Label>
                      <Box display="flex" style={{ marginTop: "5px", color: "#999" }}>

                        <AttachmentFileName onClick={() => {

                          downloadFile(ticketData.attachments?.[0].content_url);
                        }}>{`  ${ticketData.attachments[0]?.filename}(${(ticketData.attachments[0]?.filesize / (1024 * 1024)).toFixed(2)} MB)`}</AttachmentFileName>

                        {ticketData.attachments.length > 1 &&
                          <div>
                            <IconDropdown
                              variant='text-dropdown'
                              iconButtonDetails={[
                                ` |  and ${ticketData.attachments.length - 1} more`
                              ]}
                              optionList={
                                getOptionList(ticketData.attachments)
                              }
                              onChange={downloadFile}
                              value={"test"}

                              width='250px'

                            />
                          </div>
                        }

                      </Box>

                    </Grid> : null
                  }
                  <Divider />
                  <Grid item md={12} >
                    <Label>Description</Label>
                    <Box style={{ maxHeight: "180px", overflow: "auto" }}>
                      <p>{ticketData ? ticketData?.['description'] : ""}</p>
                    </Box>

                  </Grid>

                </Grid>
              </Box>
            </Grid>
            <Grid className='grid-customised-scroll-bar' spacing="5px" item md={8} style={{ display: "flex", overflow: "hidden" }}>
              <Box style={{ width: "100%", boxShadow: "0 2px 20px -10px #000", height: "calc(100vh - 150px)" }} py="15px" px='15px' pb='15px' className="header">
                <h4>History ({ticketData ? ticketData?.['journals']?.length : ""})</h4>
                <Grid container spacing="10px" style={{ marginTop: "10px" }}>
                  <Grid item md={12}>
                    <div style={{ height: "calc(100vh - 500px)", overflow: "auto" }} ref={commentSession}>
                      {
                        ticketData?.journals.length ? ticketData?.journals.map((value) => {
                          return <Box style={{ margin: "0 0 15px 0" }}>
                            <Box display="flex" style={{ alignItems: "flex-start" }}>
                              <div style={{ borderRadius: "50%", background: "#5698d3", padding: "10px", color: "#fff", marginRight: "10px" }}>
                                <FontIcon variant="icon icon-desktop" size={16} />
                              </div>

                              <MessageContainer>
                                <Box display="flex" justifyContent="space-between" style={{ color: "#9794a7" }}>
                                  <p>{value?.user?.id === clientData.userId ? 'You' : value?.user?.name}</p>
                                  <p>{getFormattedDate(value.created_on || "", clientProperties?.TIMEZONE?.propertyValue)}</p>
                                </Box>
                                <Box>

                                  {value.notes?.split('\n').map(i => {
                                    return <p style={{ color: "#000" }}>{i.replace(/@client/ig, "")}
                                    </p>
                                  })}
                                </Box>
                              </MessageContainer>
                            </Box>
                            {value.attachments?.length ?
                              <Box display="flex" style={{ marginLeft: "50px", marginTop: "5px", color: "#999" }}>

                                <div><FontIcon variant="icon icon-attached" size={14} /> Attachment: </div>
                                <AttachmentFileName onClick={() => {

                                  downloadFile(value.attachments?.[0].content_url);
                                }}>{`  ${value.attachments[0]?.filename}(${(value.attachments[0]?.filesize / (1024 * 1024)).toFixed(2)} MB)`}</AttachmentFileName>

                                {value.attachments.length > 1 &&
                                  <div>
                                    <IconDropdown
                                      variant='text-dropdown'
                                      iconButtonDetails={[
                                        ` |  and ${value.attachments.length - 1} more`
                                      ]}
                                      optionList={
                                        getOptionList(value.attachments)
                                      }
                                      onChange={downloadFile}
                                      value={"test"}
                                      dropdownPosition={{top:"-50px",left:"0"}}
                                      width='250px'

                                    />
                                  </div>
                                }

                              </Box>
                              : null
                            }
                          </Box>


                        }) : <>
                          <img src="./images/noDataTemplate-customReports.png" alt="No data available" style={{ margin: "0 auto", display: "block", width: "250px" }} />
                          <p style={{ textAlign: "center", marginTop: "10px" }}>No Data Available</p>
                        </>
                      }
                    </div>
                  </Grid>
                  <Grid item md={12} style={{ boxShadow: "3px -5px 9px -10px #000", position: "absolute", bottom: "10px", left: "10px", width: "calc(100% - 20px)", background: "#fff" }}>
                    {newFiles.map((value: any) => {
                      return <FileContainer title={value.id}>
                        <FontIcon variant="icon icon-attached" size={12} />
                        <FileNameContainer>{value.id} </FileNameContainer>
                        <span style={{ verticalAlign: "middle" }}>{`${(value.data.size / (1024 * 1024)).toFixed(2)} MB`}</span>
                        <RemoveFileButton onClick={() => { handleFileRemove(value); }}><FontIcon variant="icomoon-close" size={8} /></RemoveFileButton>
                      </FileContainer>
                    })}
                    <TextArea
                      name="disc"
                      onChange={(e) => setComment(e.target.value)}
                      className={`formFieldWrapper-subject`}
                      placeholder="Enter Comment"
                      value={comment}
                      rows={7}
                      label={"Comment"}
                      required={true}
                      id="subject"
                      disabled={existingParams.status === 'Closed'}
                    />

                    <IconButton
                      id="ticketing_details--actionbar--add_a_comment"
                      iconVariant="icon icon-send"
                      iconSize={11}
                      primary
                      style={{ float: "right" }}
                      disabled={commentButtonDisabled && !comment}
                      onClick={() => addComment(false)}
                    >
                      Add a comment
                    </IconButton>
                    <a onClick={() => {
                      document.getElementById('attachment')?.click();
                    }}>
                      <FontIcon variant="icon icon-attached" size={14} /> Attach File(s) Max: 25MB
                    </a>
                    <input type="file" id="attachment" style={{ display: "none" }} multiple onChange={handleChange} accept={validFileExtensionsJoined} />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      }
    </>
  )
}

export default withThemeProvider(
  withToastProvider(withRedux(withPopup(TicketingToolDetailView)), "toast-inject-here")
);