import React, { useEffect } from "react";
import { useState } from "react";
import { Grid, IconButton } from 'ui-library';
import { useForm } from 'react-hook-form'
import FormField from '../../../utils/components/Form/FormField'

import { TabContent,TabNavBar } from '../OrderListView/StyledOrderListView';
import { useTypedSelector } from "../../../utils/redux/rootReducer";

const TabComponent = ({ step }: any) => {

	const [currentState, setCurrentState] = useState<undefined | any>({})
	const formInstance = useForm<Record<string, any>>({
		mode: 'all', shouldUnregister: false
	})
	const dynamicLabels = useTypedSelector(state => state.dynamicLabels);
	// const { handleSubmit, reset, setValue, getValues, unregister } = formInstance
	const { handleSubmit } = formInstance
	const tabClick = (key: string) => {
		step[key].isActive = true;
		setCurrentState(step[key]);
	}
	const onSubmit = (data:any) => {
		console.log(data,"Submit Hit");
	}
	// step load
	useEffect(() => {
		const current = Object.values(step).find((s: any) =>
			s.isActive === true
		)
		setCurrentState(current)
	}, [step])

	return <><TabNavBar>
		<ul>
			{
				Object.keys(step).map((key: string) => {
					return <li>
						<a onClick={() => tabClick(key)} className={currentState?.labelKey == key ? "active" : "inactive"}>{step[key].label} </a>
					</li>

				})
			}
		</ul>
	</TabNavBar>
		<TabContent>

			{currentState && currentState.childNodes && Object.keys(currentState.childNodes).map((key: any) => {
				const meta = currentState.childNodes[key]
				return <Grid item key={key} xs={12} sm={12} md={12} className='grid-item'>
					<FormField
						name={key}
						meta={meta}
						formInstance={formInstance} />
				</Grid>

			})}
			<IconButton iconVariant='icomoon-save' style={{ padding: '0px 15px' }} onClick={handleSubmit(onSubmit)} primary>{dynamicLabels.save}</IconButton>

		</TabContent></>
}
export default TabComponent;