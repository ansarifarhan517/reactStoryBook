import moment from "moment";
import React from "react";
import { FontIcon } from "ui-library";
import store from "../../../../../utils/redux/store";
import { handleInvoiceDownloadClick, handlePayClick } from "../../Services/Utils/HelperFunctions";

import {
  PayButton,
  IconContainer,
  StatusDisplayBox,
} from "../../Services/SubscriptionAndBilling.styles";

export const pendingPaymentsHeader = [
  {
    width: 85,
    Header: "Invoice No.",
    accessor: "number",
  },
  {
    width: 25,
    Header: "",
    accessor: "invoice_id",
    Cell: (params: any) => (
      <IconContainer
        onClick={() =>
          handleInvoiceDownloadClick(
            params.value,
            params.row.original.number,
            params.row.original.currency_code
          )
        }
      >
        <FontIcon variant="icomoon-download" size="sm" />
      </IconContainer>
    ),
  },
  {
    width: 70,
    Header: "Due Date",
    accessor: "due_date",
    Cell: ({ value }: any) => {
      let clientProperties = store.getState().clientProperties;
      if (clientProperties?.DATEFORMAT) {
        return moment(value).format(
          clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
        );
      } else {
        return moment(value).format("MMM Do YYYY");
      }
    },
  },
  {
    width: 75,
    Header: "Amount",
    accessor: "balance",
    Cell: (props: any) => (
      <>
        {props.row.original.currency_symbol}
        {props.value.toLocaleString("USD")}
      </>
    ),
  },
  {
    width: 40,
    Header: "",
    accessor: "-",
    Cell: (props: any) => { 
      let signUpType = store.getState().subscriptionBilling.currentplandata.signUpType;
      return (
      <PayButton
        disabled = {signUpType === "ENTERPRISE" ? true : false }
        onClick={() =>
          handlePayClick({
            invoiceId: props.row.original.invoice_id,
            countryCode: props.row.original.currency_code,
          })
        }
      >
        Pay
      </PayButton>
    )},
  },
];

export const billingHistoryHeader = [
  {
    width: 52,
    Header: "Invoice No.",
    accessor: "number",
  },
  {
    width: 20,
    Header: "",
    accessor: "invoice_id",
    Cell: (params: any) => (
      <IconContainer
        onClick={() =>
          handleInvoiceDownloadClick(
            params.value,
            params.row.original.number,
            params.row.original.currency_code
          )
        }
      >
        <FontIcon variant="icomoon-download" size="sm" />
      </IconContainer>
    ),
  },
  {
    width: 68,
    Header: "Subscribed On",
    accessor: "invoice_date", // getReviewed
    Cell: ({ value }: any) => {
      let clientProperties = store.getState().clientProperties;
      if (clientProperties?.DATEFORMAT) {
        return moment(value).format(
          clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()
        );
      } else {
        return moment(value).format("MMM Do YYYY");
      }
    },
  },
  {
    width: 70,
    Header: "Status",
    accessor: "status",
    Cell: ({ value }: any) => (
      <StatusDisplayBox payStatus={value}>
        {value === "partially_paid" ? "PARTIALLY PAID" : value.toUpperCase()}
      </StatusDisplayBox>
    ),
  },
  {
    width: 70,
    Header: "Amount",
    accessor: "total",
    Cell: (props: any) => (
      <>
        {props.row.original.currency_symbol}
        {props.value.toLocaleString("USD")}
      </>
    ),
  },
];
