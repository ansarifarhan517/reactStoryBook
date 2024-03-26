


export const printDiv = (style: any, data: any,setIsPrint:React.Dispatch<React.SetStateAction<boolean>>) => {
    const newWin = open('');
    const divToPrint = document.getElementById('printTable');
    const isChromium = /chrome/.test(navigator.userAgent.toLowerCase());
    const is_chrome = isChromium;
    newWin?.document.open('text/html');
    newWin?.document.write('<html><head>');
    newWin?.document.write(style);
    newWin?.document.write('</head><body>');
    newWin?.document.write(data);
    newWin?.document.write('</body></html>');

    if (is_chrome) {
      setTimeout(function () {
        // wait until all resources loaded
        newWin?.document.close(); // necessary for IE >= 10
        newWin?.focus(); // necessary for IE >= 10
        newWin?.print(); // change window to winPrint
        newWin?.close(); // change window to winPrint
        if (divToPrint) {
          divToPrint.style.display = 'none';
          setIsPrint(false);
        }
      }, 250);
    } else {
      newWin?.document.close(); // necessary for IE >= 10
      newWin?.focus(); // necessary for IE >= 10
      newWin?.print();
      newWin?.close();
      if (divToPrint) {
        divToPrint.style.display = 'none';
        setIsPrint(false);
      }
    }

    return true;
  };
  
export const handlePrint = (setIsPrint:React.Dispatch<React.SetStateAction<boolean>>) => {
    const divToPrint = document.getElementById('printTable');
    if (divToPrint) {
      divToPrint.style.display = 'block';
    }

    const style =
      '' +
      '<style type="text/css">' +
      'table {' +
      ' border: 1px solid gray;' +
      ' border-collapse: collapse;' +
      ' border-spacing: 0;' +
      ' page-break-inside:auto;' +
      '}' +
      'table th {' +
      'border: 1px solid gray;' +
      'text-align: left;'+
      'padding: 5px;'+
      '}' +
      ` tbody,
        tr,
        td {
        page-break-inside: avoid;
        page-break-after: auto;
        padding: 5px;
       }`+
      'tr, td { page-break-inside:avoid; page-break-after:auto }' +
      'table td{' +
      ' border: 1px solid gray;' +
      ' font-family: OpenSans !important;' +
      ' font-size: 11px;' +
      ' font-weight: normal;' +
      '}' +
      'table th{' +
      ' font-family: OpenSans-Bold !important;' +
      ' font-size: 11px;' +
      '}' +
      'table .drsHeader {'  +
      '  height: 50px;' +
      '  font-family: OpenSans-Semibold !important;' +
      '  font-size: 12px;' +
      '  -webkit-print-color-adjust: exact;' +
      '}' +
      'th.borderwhite{' +
      '  border-left: 1px solid white;' +
      '  border-right: 1px solid white;' +
      '}' +
      'th.bordergray{' +
      '  border: 1px solid gray;' +
      '}' +
      '.colmd6{' +
      ' width: 50%; float:left;' +
      '}' +
      '.colmd4 {' +
      ' width: 33%; float:left;' +
      '}' +
      '</style>';

    printDiv(style, divToPrint?.outerHTML,setIsPrint);
  };