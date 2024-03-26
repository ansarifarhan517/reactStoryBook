import React from 'react';
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis';
import { Cell } from 'react-table';
import { Toggle, Position } from 'ui-library';

export const AlertMessage_CELL_MAPPING = {
  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),

  isActiveFl: React.memo(
    ({ value, column, row }: Cell<any>) => {
      const { isDefault } = row.original;
      const [active, setActive] = React.useState<boolean>(value);
      React.useEffect(() => {
        setActive(value);
      }, [value]);

      return (
        <Position
          type='absolute'
          top='5px'
          left='1em'
        >
          <Toggle
            disabled={isDefault}
            checked={active}
            onChange={({
              target: { checked },
            }: React.ChangeEvent<HTMLInputElement>) => {
              setActive(checked);
              column?.['cellCallback'](checked, row.original.emailTemplateId, setActive);
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
};
