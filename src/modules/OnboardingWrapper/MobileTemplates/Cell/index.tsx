import React from 'react';
import { Cell } from 'react-table';
import { Position, Toggle } from 'ui-library';
import TextOverflowEllipsis from '../../../../utils/components/TextOverflowEllipsis';
import NumberCountCell from "../../../../utils/components/CellMapping/NumberCountCell";
import { useTypedSelector } from '../../../../utils/redux/rootReducer';

export const MOBILE_TEMPLATES_CELL_MAPPING = {
  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),
  activeFl: React.memo(
    ({ value, column, row }: Cell) => {
      const [active, setActive] = React.useState<boolean>(value);

      React.useEffect(() => {
        setActive(value);
      }, [value]);

      return (
        <Position type='absolute' left='1em'>
          <Toggle
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
  attachedUserGroups: NumberCountCell
}

export const MOBILE_TEMPLATE_ROLES_CELL_MAPPING = {

  default: React.memo(
    ({ value }: Cell<any>) => {
      return <TextOverflowEllipsis title={value}>{value}</TextOverflowEllipsis>;
    },
    (p, n) => p.value === n.value
  ),
  activeFl: React.memo(
    ({ value }: Cell) => {
      const dynamicLabels = useTypedSelector((state) => state.dynamicLabels);
      return <TextOverflowEllipsis title={value ? dynamicLabels.active : dynamicLabels.inactive}>{value ? dynamicLabels.active : dynamicLabels.inactive}</TextOverflowEllipsis>
    },
    (p, n) =>
      p.value === n.value
  )
}

export const MOBILE_TEMPLATES_EDITABLE_CELL_MAPPING = {
  activeFl: async (dynamicLabels: Record<string, string>) => {
      if (dynamicLabels.active && dynamicLabels.inactive) {
          return [
              { value: 'Y', label: dynamicLabels.active, tooltipText: dynamicLabels.active },
              { value: 'N', label: dynamicLabels.inactive, tooltipText: dynamicLabels.inactive },
          ]
      } else {
          return []
      }

  },
}