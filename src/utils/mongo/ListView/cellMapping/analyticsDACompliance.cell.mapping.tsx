
import React, { ComponentType } from 'react'
import { Cell } from 'react-table'
import styled from "styled-components";
import { Checkbox, IconButton } from 'ui-library'
import { isFloat } from "../../../helper";
import BooleanValue from "../../../components/BooleanValue";
import DynamicLabel from "../../../components/DynamicLabel";
import CompliantField from "../../../components/CompliantField";
import DateConversion from "../../../components/DateConversion";
import TextOverflowEllipsis from '../../../components/TextOverflowEllipsis';
import useClientProperties from '../../../../modules/common/ClientProperties/useClientProperties';


export interface ICellMapping {
    [key: string]: ComponentType<Cell>
}

export interface INumberProps {
    value?: number
  }

const CenteredContentWrapper = styled.div`
  display: flex; 
  width: 100%; 
  justify-content: center; 
`;

const NumberCount = styled.div`
  padding: 3px 5px;
  border-radius: 2px;
  background-color: #5698d3; 
  line-height: initial;
  vertical-align: middle;
  color: #fff; 
  text-align: center; 
  cursor: ${({title}) => !title ? "not-allowed" : "pointer" };
`;

const DriverAnalyticsCellMapping: ICellMapping = {

    logInHistory: ({ column, row }: Cell<any>) => {
        return (
          <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <IconButton
              style={{ boxShadow: "none", background: "transparent" }}
              onClick={() => column?.['cellCallback'](row.original)}
              primary={false}
              disabled={false}
              iconSize="sm"
              iconVariant='clock'
            />
          </div>
        )
      },
      deviceCount: ({ value, column, row }: Cell) => {
        return <CenteredContentWrapper><NumberCount onClick={() => column?.['cellCallback'](row.original)} title={value}>{value}</NumberCount></CenteredContentWrapper>;
        
        /* <div onClick={() => column?.['cellCallback'](row.original)} style={{ padding: "3px 5px", borderRadius: "2px", backgroundColor: "#5698d3", lineHeight: "initial", verticalAlign: "middle", color: "#fff", textAlign: "center", cursor: !value ? "not-allowed" : "pointer" }}>{value}</div></div> */
      },
      isPresent: ({ value, row, column }: Cell<any>) => {
        const [checked, setChecked] = React.useState<boolean>(value)
        React.useEffect(() => {
          setChecked(value)
        }, [value])
        return <Checkbox checked={checked} disabled={row.original.isActiveFl === false} checkboxSize='md' onChange={() => column?.['cellCallback'](checked, row.original, setChecked)} />
  
      },
      plannedSequenceCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      plannedTimeCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      deliveryTimeCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      ordersMarkedDeliveredViaMobileCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      checkInCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      checkInWithinGeofenceCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      checkOutCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      checkOutWithinGeofenceCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      distanceTravelledCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      cashCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      serviceTimeCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      esignCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      epodCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      customerRatingCompliant: React.memo(({ value }: Cell<any>) => {
        return <BooleanValue value={value} />;
      }),
      actualDistance: React.memo(({ value }: Cell<any>) => {
        return value && isFloat(value) || value !== 0 ? value.toFixed(2) : value;
      }),
      plannedDistance: React.memo(({ value }: Cell<any>) => {
        return value !== undefined ? isFloat(value) || value !== 0 ? value.toFixed(2) : value : null;
      }),
      orderStatus: React.memo(({ value }: Cell<any>) => {
        return <DynamicLabel value={value} />;
      }),
      orderType: React.memo(({ value }: Cell<any>) => {
        return <DynamicLabel value={value} />;
      }),
      tripName: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      deliveryAssociate: React.memo(({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      orderNo: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      userName: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      phoneNumber: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      employeeId: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      branch: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      loginTime: React.memo(({ value }: Cell<any>) => {
        const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
        return <DateConversion date={value} timezone={clientProperties?.TIMEZONE?.propertyValue} dateformat={`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`}/>
      }),
      logOutTime: React.memo(({ value }: Cell<any>) => {
        const clientProperties = useClientProperties(['TIMEZONE', 'DATEFORMAT']);
        return <DateConversion date={value} timezone={clientProperties?.TIMEZONE?.propertyValue} dateformat={`${clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()} HH:mm`}/>
      }),
      phoneModelCompliance: React.memo(({ value }: Cell<any>) => {
        return <CompliantField compliance={value} />
      }),
      osversionCompliance: React.memo(({ value }: Cell<any>) => {
        return <CompliantField compliance={value} />
      }),
      appVersionCodeCompliance: React.memo(({ value }: Cell<any>) => {
        return <CompliantField compliance={value} />
      }),
      estimatedStartDate: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      estimatedEndDate: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      actualStartDate: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),       
      actualEndDate: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      deliveryCheckIn: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value),
      deliveryCheckOut: React.memo(({ value }: Cell<any>) => {
        return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
      }, (p, n) => p.value === n.value)
}


export default DriverAnalyticsCellMapping;