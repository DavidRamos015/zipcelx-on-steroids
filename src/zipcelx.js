import { strToU8, zip } from 'fflate';
import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';
import generatorCols from './formatters/cols/generatorCols';

import workbookXML from './statics/workbook.xml';
import workbookXMLRels from './statics/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './statics/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

// export const generateXMLWorksheet = (rows) => {
//   const XMLRows = generatorRows(rows);
//   return templateSheet.replace('{placeholder}', XMLRows);
// };

export const generateXMLWorksheet = (rows, cols) => {
  const XMLRows = generatorRows(rows);
  const XMLCols = generatorCols(cols);
  return templateSheet.replace('{placeholder}', XMLRows).replace('{colsPlaceholder}', XMLCols);
};

export default (config, action) => {
  const error = validator(config, action);
  if (error) {
    throw new Error(error);
  }

  // const worksheet = generateXMLWorksheet(config.sheet.data);
  const worksheet = generateXMLWorksheet(config.sheet.data, config.sheet.cols);

  const zipContent = {
    xl: {
      'workbook.xml': strToU8(workbookXML),
      '_rels/workbook.xml.rels': strToU8(workbookXMLRels),
      'worksheets/sheet1.xml': strToU8(worksheet),
    },
    '_rels/.rels': strToU8(rels),
    '[Content_Types].xml': strToU8(contentTypes),
  };

  return new Promise((resolve, reject) => {
    zip(
      zipContent,
      (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(
          new Blob([data.buffer], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
        );
      }
    );
  }).then((blob) => {
    if (action === 'export' && config.filename) {
      return FileSaver.saveAs(blob, `${config.filename}.xlsx`);
    }

    if (action === 'blob') {
      return blob;
    }

    return null;
  });
};
