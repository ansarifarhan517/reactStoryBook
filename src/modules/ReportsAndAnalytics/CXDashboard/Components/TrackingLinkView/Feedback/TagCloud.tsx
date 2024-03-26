// import React, { useEffect, useState } from "react";

// import { TagCloud } from "react-tagcloud";
// import { Grid, Card, SectionHeader } from "ui-library";
// import { useTypedSelector } from "../../../../../../utils/redux/rootReducer";
// import { WordWrapper, Word } from "../../../Layouts/StaticLayout.style";
// const data = [
//   { value: "JavaScript", count: 38 },
//   { value: "React", count: 30 },
//   { value: "Nodejs", count: 28 },
//   { value: "Express.js", count: 25 },
//   { value: "HTML5", count: 33 },
//   { value: "MongoDB", count: 18 },
//   { value: "CSS3", count: 20 },
// ];

const SimpleCloud = () => {
  // const dateFilter = useTypedSelector(
  //   (state) => state.cxDashboardReducer?.calendar
  // );
  // const data =
  //   useTypedSelector(
  //     (state) => state.cxDashboardReducer?.trackingLink.feedback.tagCloud.data
  //   ) || [];
  // const [tagCloud, setTagCloud] = useState<
  //   Array<{ value: number; text: string }>
  // >([]);
  // useEffect(() => {
  //   let tagDetails: any = [];
  //   Object.entries(data).forEach((tag) => {
  //     tagDetails.push({
  //       text: tag[0],
  //       value: tag[1],
  //     });
  //   });
  //   setTagCloud(tagDetails);
  // }, [data, dateFilter]);

  // const [maxValue, setMaxValue] = useState(0);
  // const [minValue, setMinValue] = useState(Infinity);
  // useEffect(() => {
  //   const values = tagCloud.map((word) => word.value);
  //   let maxVal = Math.max(...values);
  //   const minVal = Math.min(...values);
  //   if (maxVal === minVal) {
  //     maxVal++;
  //   }
  //   setMaxValue(maxVal);
  //   setMinValue(minVal);
  // }, [tagCloud]);

  // return tagCloud?.length > 0 ? (
  //   <Grid spacing="10" item>
  //     <Card style={{ display: "flex", flexDirection: "column" }}>
  //       <div style={{ fontSize: "13px" }}>{"Feedback Analytics"}</div>
  //       <div
  //         style={{
  //           display: "grid",
  //           placeItems: "center",
  //           height: "300px",
  //         }}
  //       >
  //         <WordWrapper>
  //           {tagCloud.map((word: { text: string; value: number }) => {
  //             return (
  //               <Word
  //                 maxValue={maxValue}
  //                 minValue={minValue}
  //                 value={word.value}
  //               >
  //                 {word.text}
  //               </Word>
  //             );
  //           })}
  //         </WordWrapper>
  //       </div>
  //     </Card>
  //   </Grid>
  // ) : (
  //   <></>
  // );
};
export default SimpleCloud;
