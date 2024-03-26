import React from 'react';
import { ITabProps } from './TabModel';
import TabButton from './TabButton';
import TabPanel from './TabPanel';
import { TabContainer, TabButtons, TabPanels, TabTracker } from './TabSyledComponents';

interface ChildProps {
  children: React.ReactElement<ITabProps>[];
  selected: string;
  onSelect: Function;
}

const Tabs = (props: ChildProps) => {
  const { selected, onSelect, children } = props;

  const buttons = React.Children.map(children, (child) => {
    const { id, label, icon } = child.props;
    const isSelected = selected === id;
    const handleClick = () => onSelect(id);

    return (
      <TabButton id={id} selected={isSelected} onClick={handleClick}>
        {icon} {label}
      </TabButton>
    );
  });

  const panels = React.Children.map(children, (child) => {
    const id = child.props.id;
    const isSelected = selected === id;

    return (
      <TabPanel id={id} selected={isSelected}>
        {child.props.children}
      </TabPanel>
    );
  });

  return (
    <TabContainer className='tabs'>
      <TabButtons className='tabs__buttons'>
        {buttons}
      </TabButtons>
      <TabPanels className='tabs__panels'>
        <TabTracker className='tabs__tracker'>{panels}</TabTracker>
      </TabPanels>
    </TabContainer>
  );
};

export default Tabs;
