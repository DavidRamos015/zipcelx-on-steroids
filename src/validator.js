import {
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA,
  INVALID_ACTION
} from './commons/constants';

const childValidator = (array) => 
{
  return array.every(item => Array.isArray(item));
};


export default (config, action) => 
{  
  if (action !== "export" && action !== 'blob')
  {
    // throw new Error(INVALID_ACTION); 
    return INVALID_ACTION;
  }

  if (action === "export")
  {
    if (!config.filename || typeof config.filename !== 'string')    
    {
      // throw new Error(INVALID_TYPE_FILENAME);
      return INVALID_TYPE_FILENAME;
    }
  }

  if (!Array.isArray(config.sheet.data)) 
  {
    // throw new Error(INVALID_TYPE_SHEET); 
    return INVALID_TYPE_SHEET;
  }

  if (!childValidator(config.sheet.data)) 
  {
    // throw new Error(INVALID_TYPE_SHEET_DATA); 
    return INVALID_TYPE_SHEET_DATA;
  }

  return "";
};
