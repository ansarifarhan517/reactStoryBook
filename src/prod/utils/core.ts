/** Promise based setTimeout() */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getBaseCurrency() {
  return JSON.parse(localStorage.getItem('userAccessInfo') || '{}')['baseCurrency']
}

// export function downloadFromS3Bucket(url: string, filename: string) {
  // fetch(url).then(function (t) {
  //   return t.blob().then((b) => {
  //     var a = document.createElement("a");
  //     a.href = URL.createObjectURL(b);
  //     a.setAttribute("download", filename);
  //     a.click();
  //   });
  // });
// }

export function toTitleCase(phrase: string) {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}