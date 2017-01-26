
const empty = require('../testFiles/empty.json');
const validFile = require('../books.json');
const wrongFile = require('../testFiles/wrongFile.txt');
let index = require('../../src/inverted-index.js');

index = new Index();
describe('Inverted index test Suite: ', () => {
  describe('Read book data', () => {
    it('should return "File empty" for upload with no data ', () => {
      expect(index.verify(empty)).toEqual('File empty');
    });
    it('should return "Not a JSON file" for upload of a file other than JSON ',
    () => {
      expect(index.verify(wrongFile)).toEqual('Not a JSON file');
    });
    it('should return "Not a JSON file" for upload of a file other than JSON ',
     () => {
       expect(index.verify(validFile)).toEqual('valid');
     });
  });
  describe('Populate Index', () => {
    it('verifies that the index is created once the JSON file has been read ',
     () => {
       expect(index.createIndex(validFile, 'books.json').alice).toBeDefined();
     });
    it('verifies the index maps the string keys to the correct objectsin the JSON array ', () => {
      expect(index.createIndex(validFile, 'books.json').alice).toEqual([0]);
      expect(index.createIndex(validFile, 'books.json').a).toEqual([0, 1]);
    });
  });
  describe('Search index', () => {
    it('verifies that searching the index returns an array of the indices of the correct objects that contain the words in the search query ', () => {
      expect(index.search('books.json', 'and')).toEqual({ and: [0, 1] });
    });
    it('Ensure searchIndex can handle an array of search terms ', () => {
      expect(index.search('books.json', 'and', ['alice', 'a'])).toEqual({ and: [0, 1], alice: [0], a: [0, 1] });
    });
  });
});

