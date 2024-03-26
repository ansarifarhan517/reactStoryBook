import React from 'react';
import { TabContent } from "./TabSyledComponents";
import { ITabPanel} from "./TabModel";


const TabPanel = (props: ITabPanel) => {
    const { id, selected, children } = props;

    const classes = selected ? "tab-panel--active" : "tab-panel";
    return (
        <TabContent className={classes} data-id={id}>
          {children}
        </TabContent>
      );
}

export default TabPanel;