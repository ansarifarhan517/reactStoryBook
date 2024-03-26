import styled from "styled-components";

export const PieContainer = styled.div`
  margin-top: 18px;
  border-top: 1px solid #D3D3D3;
`;

export const OverallPieCard = styled.div`
  background-color: #fff;
  width: 23.8%;
  padding: 15px 15px 22px 15px;
  border-radius: 3px;
  margin-left:12px;
  margin-right:12px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.24),
    0px 0px 11px rgba(0, 0, 0, 0.12);
`;

export const HeaderStyling = styled.div`
padding-top: 1px;
padding-bottom: 30px;
font-size: 14px;
font-weight: 550;
`;

export const LabelDataStyling = styled.div`
bottom : 13.5px;
text-align:right;
position: relative;
bottom: 13.5px;
`;

export const RowFlexContainer = styled.div`
  display : flex;
  flex-direction: row;
`;

export const ColumnFlexContainer = styled.div`
display : flex;
flex-direction: column;
`;

export const OrderIconCard = styled.div`
  width: 24%;
  height : 10%;
  border-radius: 3px;
  margin-left:12px;
  background-color: #fff;
  margin-right: 12px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.24),
    0px 0px 11px rgba(0, 0, 0, 0.12);
`;

export const OrderLeftIconContent = styled.div`
background-color: #5698d3;
width : 30%;
padding: 50px 15px 42px 15px;
text-align : center;
`;

export const OrderRightIconContent = styled.div`
width : 70%;
padding: 40px 15px 52px 0px;
text-align:center;
`;

export const OrderRightBelowContent = styled.div`
 text-align:center;
  color : red;
`;

export const TripCardPosition = styled.div`
position : relative;
bottom: 12.20rem;
left: 50%;
width: 96.5%
`;

export const BottomCardPosition = styled.div`
 position : relative;
 bottom : 24.3rem;
 left: 75%;
 width: 96.5%
`;

export const PerformanceIconCard = styled.div`
width: 24%;
height : 20%;
border-radius: 3px;
margin-left:12px;
margin-right: 12px;
background-color: #fff;
box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.24),
  0px 0px 11px rgba(0, 0, 0, 0.12);
text-align: center;
padding-top: 45px;
padding-bottom: 48px;
`;

export const AverageBadgeSeparator = styled.div`
max-width: 180px;
padding: 5px 10px;
border-radius: 50px;
background-color: #fafafa;
color: #5698d3;
text-align:center;
margin-left:23%;
margin-bottom: 10px;
`;

export const OrderSummaryTitle = styled.div`
margin-top: 30px;
margin-bottom: 15px;
font-size: 15px;
color: #000;
font-family: "Gotham-Rounded-Medium";
margin-left: 12px;
`;

export const DAIconCard = styled.div`
width: 24%;
height : 100px;
border-radius: 3px;
margin-left:12px;
margin-right: 12px;
background-color: #fff;
box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.24),
0px 0px 11px rgba(0, 0, 0, 0.12);
text-align:center;
padding-top: 20px;
padding-left: 30px;
`;

export const DALabel = styled.div`
fontSize : 12px;
color: #606060;
whiteSpace: nowrap; 
text-align: center;
position:relative;
left: 35px;
top: 10px;
`;

export const DAHeader = styled.div`
font-size : 15px;
color: #000;
text-align: center;
position:relative;
left: 35px;
top: 10px;
`;

export const DAGraphCardStyle = styled.div`

width: 98%;
border-radius: 3px;
margin-left:12px;
margin-right: 12px;
margin-bottom: 32px;

box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.24),
  0px 0px 11px rgba(0, 0, 0, 0.12);
  text-align:center;
  padding-top: 25px;
  padding-bottom: 50px;
`;

export const RelativePosition = styled.div`
position: relative;
bottom: 245px;;
`;

export const DownloadModalHeader = styled.div`
  height:38px;
  background-color: rgb(86, 152, 211);
  color: rgb(255, 255, 255);
  font-size: 15px;
  padding: 0px 0.6em;
  display: flex;
  justify-content: space-between;
  line-height: 38px;
  button {
    background-color: rgb(86, 152, 211);
    font-size: 18px;
  }
`;

export const AdvancedFilterButton = styled.div`
margin: 0px 5px;
cursor: pointer;
background: #fff;
box-shadow: 0px 2px 11px -5px #000;
padding: 0px 10px;
font-size: 13px;
line-height: 30px;
height: 30px;
text-transform: uppercase;
display: inline-block;
color: #5698d3;
display: flex;
flex-direction: row;
`;

export const ProgressBarWrapper = styled.div`
width: 100%;
margin-left: 6px;
position: relative;
top: 3px;
`;

export const ProgressBarLabel = styled.div`
font-size: 12px;
letter-spacing: 0.5px;
color: #e32022;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
width: 110px;
display: inline-block;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  font-size: 11px;
  position:absolute;
  top:0px;
  right:40px;
  cursor:pointer;
  button {
     margin-top: 5px;
  }
  & > button i {
    color:grey
  }
  & > button:hover {
      background-color:transparent
  }
`;

export const LegendPosition = styled.div`
position: relative;
left: 60%;
top: 8px;
`;

export const LegendsTitle = styled.div`
padding-left: 5px;
padding-right: 12px;
`;
