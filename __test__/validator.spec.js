import validator from '../src/validator';
import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA,
  INVALID_ACTION
} from '../src/commons/constants';
import baseConfig from './baseConfig';

const configDescription = expect.objectContaining({
  filename: expect.any(String),
  sheet: expect.objectContaining({
    data: expect.arrayContaining(baseConfig.sheet.data)
  })
});
const errorObjectDescription = expect.objectContaining({
  error: expect.any(String)
});

console.error = jest.genMockFn();

describe('Validator', () => {
  it('Should ensure that being called with correct config', () => 
  {
    expect(baseConfig).toEqual(configDescription);
  });

  it('If action param is not provided should fails and return an error', () => 
  {
    let error = validator(baseConfig, "");
    expect(error).toHaveLength(error.length);
  });

  it('If action param is = export it should return an empty text', () => 
  {
    let error = validator(baseConfig, "export");
    expect(error).toBe("");
  });

  it('If action param is = blob it should return an empty text', () => 
  {
    let error = validator(baseConfig, "blob");
    expect(error).toBe("");
  });

  it('If action param is not (export or blob) it should return an error', () => 
  {
    let error = validator(baseConfig, "");
    expect(error).toBe(INVALID_ACTION);

    error = validator(baseConfig, "save");
    expect(error).toBe(INVALID_ACTION);
  });

  it('If validation is successfull return empty text', () => 
  {
    let error = validator(baseConfig, "export");
    expect(error).toBe("");    
  });

  it('If validation fails it should return an error', () => {
    let config = Object.assign({}, baseConfig, { filename: 1234 });
    let error = validator(config,"export"); 
    if (error)
      expect(error).toHaveLength(error.length);
    else
      expect(error).toBe("");    
  });

  describe('Sheet data', () => {
    it('Should ensure that sheet data key is an array', () => {
      let config = Object.assign({}, baseConfig, {
        sheet: { data: { test: 'test' } }
      });
      
      let error = validator(config, "export"); 
      expect(error).toBe(INVALID_TYPE_SHEET);
    });

    it('Should ensure each of the childs is an array', () => {
      let config = Object.assign({}, baseConfig, {
        sheet: { data: [{ test: 'demo' }] }
      });
      let error = validator(config, "export"); 
      expect(error).toBe(INVALID_TYPE_SHEET_DATA);
    });
  });
});
