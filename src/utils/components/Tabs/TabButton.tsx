import React from "react";
import { Button } from "./TabSyledComponents";
import {ITabButton} from "./TabModel"; 


const TabButton = (props: ITabButton) => {
    const { id, selected, onClick, children } = props;
    const classes = selected ? 'tab-button--active' : 'tab-button';

    return (
        <Button className={classes} onClick={onClick} data-id={id} style={{outline: 'none'}}>
          {children}
        </Button>
      );

}

export default TabButton;