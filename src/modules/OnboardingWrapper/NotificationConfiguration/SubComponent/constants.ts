export const stripParagraphTags = (str: string) => {
  return str.replaceAll("<p>", "").replaceAll("</p>", "");
};

export const convertSpaces = (str: string) => {
  return str.replaceAll("&nbsp;", " ");
};

export const convertNewLines = (str: string) => {
  return str.replaceAll("\n", "<br>");
};

export const stripsSpaces = (str: string) => {
  return str.replaceAll("&nbsp;", "");
};

export const convertAllBr = (str: string) => {
  return str.replace(/(<br\s*\/?>\s*)+$/, "");
};

export const convertSingleSpace = (str: string) => {
  return str.replace(/\n\s+/g, " ");
};

export const excludeArray = [
  "Update Information",
  "Promotional Offer",
  "Update Address",
  "Order Feedback",
  "Halted Operations",
  "Provide Feedback",
];
