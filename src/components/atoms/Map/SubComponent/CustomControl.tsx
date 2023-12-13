import React, { useEffect } from 'react'
import { ICustomControlProps } from '../interfaces.d'

const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

const Control = (props: ICustomControlProps): JSX.Element => {
    const [portalRoot, setPortalRoot] = React.useState<any>(document.createElement('div'))
    const positionClass = ((props.position && POSITION_CLASSES[props.position]) || POSITION_CLASSES.topright)
    const controlContainerRef = React.createRef<HTMLDivElement>()

    useEffect(() => {
        const targetDiv = document.getElementsByClassName(positionClass)
        setPortalRoot(targetDiv[0])
    }, [positionClass])

    useEffect(() => {
        if (portalRoot !== null) {
            if (props.prepend !== undefined && props.prepend === true) {
                portalRoot.prepend(controlContainerRef.current)
            } else {
                portalRoot.append(controlContainerRef.current)
            }
        }
    }, [portalRoot, props.prepend, controlContainerRef])

    const className = (props.container?.className?.concat(' ') || '') + 'leaflet-control'
    return (
        <div
            {...props.container}
            ref={controlContainerRef}
            className={className}
        >
            {props.children}
        </div>
    )
}

export default Control