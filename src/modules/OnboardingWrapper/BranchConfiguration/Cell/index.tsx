import React, { useEffect, useState, memo } from 'react';
import { Cell } from 'react-table';
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis';
import { CenteredContentWrapper, NumberCount, ListViewIconWrapper, EnabledCount, DisabledCount } from "../BranchConfigurationStyledComponents"
import { Position, Toggle, FontIcon } from 'ui-library';
import TimeConversion from '../SubComponents/ListView/TimeConversion';
import useClientProperties from '../../../common/ClientProperties/useClientProperties';
import moment from 'moment-timezone';

export const BRANCH_CONFIGURATION_CELL_MAPPING = {
  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),
  name: React.memo(
    ({ value }: Cell) => {
      return <TextOverflowEllipsis title={value} style={{ whiteSpace: 'pre' }}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),
  autoAllocateFl: React.memo(
    ({ value, column, row }: Cell) => {
      const [active, setActive] = React.useState<boolean>(value);

      React.useEffect(() => {
        setActive(value === 'Y');
      }, [value]);

      return (
        <Position type='absolute' top='0em' left='1em'>
          <Toggle
            disabled={true}
            checked={active}
            onChange={({
              target: { checked },
            }: React.ChangeEvent<HTMLInputElement>) => {
              setActive(checked);
              column?.['cellCallback'](checked, row.original, setActive);
            }}
          />
        </Position>
      );
    },
    (p, n) =>
      p.value === n.value &&
      p.column?.['cellCallback'] === n.column?.['cellCallback'] &&
      JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
  ),
  deliveryMediumAutoAllocateFl: React.memo(
    ({ value, column, row }: Cell) => {
      const [active, setActive] = React.useState<string>(value);

      React.useEffect(() => {
        setActive(value);
      }, [value]);

      return (
        <Position type='absolute' top='0em' left='1em'>
          <Toggle
            disabled={true}
            checked={active === 'Y'}
            onChange={({
              target: { checked },
            }: React.ChangeEvent<HTMLInputElement>) => {
              setActive(checked ? 'Y' : 'N');
              column?.['cellCallback'](checked, row.original, setActive);
            }}
          />
        </Position>
      );
    },
    (p, n) =>
      p.value === n.value &&
      p.column?.['cellCallback'] === n.column?.['cellCallback'] &&
      JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
  ),
  managersCount: ({ value, column, row }: Cell) => {
    return <CenteredContentWrapper>{value && value !== 0 ? <NumberCount onClick={() => column?.['cellCallback'](row.original)}><EnabledCount>{value}</EnabledCount></NumberCount> :
      <NumberCount><DisabledCount>{value}</DisabledCount></NumberCount>}</CenteredContentWrapper>;
  },
  operationTimings: ({ column, row }: Cell) => {
    return <CenteredContentWrapper><ListViewIconWrapper onClick={() => column?.['cellCallback'](row.original)}><FontIcon variant="clock-outlined" size={20} /></ListViewIconWrapper></CenteredContentWrapper>
  },
  loadMultipliers: ({ column, row }: Cell) => {
    return <CenteredContentWrapper><ListViewIconWrapper onClick={() => column?.['cellCallback'](row.original)}><FontIcon variant="clock-outlined" size={20} /></ListViewIconWrapper></CenteredContentWrapper>
  },
  daysOfWeek: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value),
  operationsStartTime: ({ value }: Cell) => {
    return <TimeConversion time={value} />
  },
  operationsEndTime: ({ value, row }: Cell) => {
    let values = {
      startTime: row?.values?.operationsStartTime,
      endTime: row?.values?.operationsEndTime
    }
    return <TimeConversion time={value} values={values} isEndTime={true} />
  },
  shiftStartTime: ({ value }: Cell) => {
    return <TimeConversion time={value} />
  },
  shiftEndTime: ({ value, row }: Cell) => {
    let values = {
      startTime: row?.values?.shiftStartTime,
      endTime: row?.values?.shiftEndTime
    }
    return <TimeConversion time={value} values={values} isEndTime={true} />
  }, 
  acceptOrderOnHolidaysFl: React.memo(
      ({ value, column, row }: Cell) => {
        const [active, setActive] = React.useState<string>(value);
        React.useEffect(() => {
          setActive(value);
        }, [value]);
  
        return (
          <Position type='absolute' top='0em' left='1em'>
            <Toggle
              disabled={true}
              checked={active === 'Y'}
              onChange={({
                target: { checked },
              }: React.ChangeEvent<HTMLInputElement>) => {
                setActive(checked ? 'Y' : 'N');
                column?.['cellCallback'](checked, row.original, setActive);
              }}
            />
          </Position>
        );
      },
      (p, n) =>
        p.value === n.value &&
        p.column?.['cellCallback'] === n.column?.['cellCallback'] &&
        JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
    ),
  
  isActiveFl: React.memo(({ value }: Cell<any>) => {
    return <TextOverflowEllipsis title={(value)}>{value ? sessionStorage.logiLabels_Active : sessionStorage.logiLabels_inactive}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value),
  
  whatsappOptin : React.memo(({ value, column, row }: Cell) => {
    const whatsappValue = value === undefined ? '' : value === 'Y' ? 'Yes' : 'No';

    return <TextOverflowEllipsis id={`${column.id}-${row.id}`} title={whatsappValue}>{whatsappValue}</TextOverflowEllipsis>
  }, (p, n) => p.value === n.value ),


  createdOnDt: React.memo(({ value }: Cell) => {
    const clientProperties = useClientProperties(['DATEFORMAT','TIMEZONE'])
    const d2 = moment.utc(value).tz(clientProperties?.TIMEZONE?.propertyValue)
    const format1 = clientProperties?.DATEFORMAT?.propertyValue?.toUpperCase()+' hh:mm A'

  return <TextOverflowEllipsis title={d2.format(format1)}>{d2.format(format1)}</TextOverflowEllipsis>
      
}, (p, n) => p.value === n.value && p.column?.['cellCallback'] === n.column?.['cellCallback'] && JSON.stringify(p.row.original) === JSON.stringify(n.row.original)),


cashTransactionFl: memo(
  ({ row }: Cell) => {
    const value = row.original?.['branchConfigDTO'].cashTransactionFl;
    const [active, setActive] = useState<string>(value);

    useEffect(() => {
      setActive(value);
    }, [value]);

    return (
        <Toggle
          disabled={true}
          checked={active === "Y"}
          onChange={({
            target: { checked },
          }: React.ChangeEvent<HTMLInputElement>) => {
            setActive(checked ? "Y" : "N");
          }}
        />
    );
  },
  (p, n) =>
    p.value === n.value &&
    p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
    JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
),

// minOrderValue
minOrderValue: memo(
  ({ row }: Cell<any>) => {
    const value = row.original?.branchConfigDTO.minOrderValue;
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
  },
  (p, n) => p.value === n.value
),

// maxOrderValue
maxOrderValue: memo(
  ({ row }: Cell<any>) => {
    const value = row.original?.branchConfigDTO.maxOrderValue;
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
  },
  (p, n) => p.value === n.value
),

// discardValue
discardValue: memo(
  ({ row }: Cell<any>) => {
    const value = row.original?.branchConfigDTO.discardValue;
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
  },
  (p, n) => p.value === n.value
),

// pincodeVerificationFl,
pincodeVerificationFl: memo(
  ({ row }: Cell) => {
    const value = row.original?.['branchConfigDTO'].pincodeVerificationFl;
    const [active, setActive] = useState<string>(value);

    useEffect(() => {
      setActive(value);
    }, [value]);

    return (
      <Toggle
        disabled={true}
        checked={active === "Y"}
        onChange={({
          target: { checked },
        }: React.ChangeEvent<HTMLInputElement>) => {
          setActive(checked ? "Y" : "N");
        }}
      />
    );
  },
  (p, n) =>
    p.value === n.value &&
    p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
    JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
),

// signatureVerificationFl,
signatureVerificationFl: memo(
  ({ row }: Cell) => {
    const value = row.original?.['branchConfigDTO'].signatureVerificationFl;
    const [active, setActive] = useState<string>(value);

    useEffect(() => {
      setActive(value);
    }, [value]);

    return (
      <Toggle
        disabled={true}
        checked={active === "Y"}
        onChange={({
          target: { checked },
        }: React.ChangeEvent<HTMLInputElement>) => {
          setActive(checked ? "Y" : "N");
        }}
      />
    );
  },
  (p, n) =>
    p.value === n.value &&
    p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
    JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
),

// additionalPickupNotes
additionalPickupNotes: memo(
  ({ row }: Cell<any>) => {
    const value = row.original?.branchConfigDTO.additionalPickupNotes;
    return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
  },
  (p, n) => p.value === n.value
),

// signerNameFl,
signerNameFl: memo(
  ({ row }: Cell) => {
    const value = row.original?.['branchConfigDTO'].signerNameFl;
    const [active, setActive] = useState<string>(value);

    useEffect(() => {
      setActive(value);
    }, [value]);

    return (
      <Toggle
        disabled={true}
        checked={active === "Y"}
        onChange={({
          target: { checked },
        }: React.ChangeEvent<HTMLInputElement>) => {
          setActive(checked ? "Y" : "N");
        }}
      />
    );
  },
  (p, n) =>
    p.value === n.value &&
    p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
    JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
),

// signerDetailsFl,
signerDetailsFl: memo(
  ({ row }: Cell) => {
    const value = row.original?.['branchConfigDTO'].signerDetailsFl;
    const [active, setActive] = useState<string>(value);

    useEffect(() => {
      setActive(value);
    }, [value]);

    return (
      <Toggle
        disabled={true}
        checked={active === "Y"}
        onChange={({
          target: { checked },
        }: React.ChangeEvent<HTMLInputElement>) => {
          setActive(checked ? "Y" : "N");
        }}
      />
    );
  },
  (p, n) =>
    p.value === n.value &&
    p.column?.["cellCallback"] === n.column?.["cellCallback"] &&
    JSON.stringify(p.row.original) === JSON.stringify(n.row.original)
),

};
