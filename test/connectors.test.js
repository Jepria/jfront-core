import axios from 'axios';
import { ConnectorBase } from '../src/rest/connector/ConnectorBase';
import { ConnectorCrud } from '../src/rest/connector/ConnectorCrud';

jest.mock('axios');

test('Connector base instance', () => {
  let connector = new ConnectorBase("https://google.com");
  expect(connector).toBeDefined();
  expect(connector.getAxios()).toBe(axios);
});

test('Connector crud instance', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect(connector).toBeDefined();
  expect(connector.getAxios()).toBe(axios);
});

test('Connector CRUD getRecordById', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const resp = { status: 200, data: user };
  axios.get.mockResolvedValue(resp);

  connector.getRecordById("123")
    .then(data => expect(data).toEqual(user))
    .catch(error => {
      expect(error).toBeUndefined();
    });
});

test('Connector CRUD getRecordById error', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const resp = { status: 404 };
  axios.get.mockResolvedValue(resp);

  expect(connector.getRecordById("123")).rejects.toBeDefined();
});

test('Connector CRUD create without getRecordById', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const postResp = { status: 201, headers: { location: 'http://localhost/123' } };
  axios.post.mockResolvedValue(postResp);

  connector.create(user, false)
    .then(data => expect(data).toEqual("123"))
    .catch(error => {
      expect(error).toBeUndefined();
    });
});

test('Connector CRUD create with getRecordById', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const postResp = { status: 201, headers: { location: 'http://localhost/123' } };
  axios.post.mockResolvedValue(postResp);
  const getResp = { status: 200, data: user };
  axios.get.mockResolvedValue(getResp);

  connector.create(user)
    .then(data => expect(data).toEqual(user))
    .catch(error => {
      expect(error).toBeUndefined();
    });
});

test('Connector CRUD create error', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const postResp = { status: 500 };
  axios.post.mockResolvedValue(postResp);

  expect(connector.create(user)).rejects.toBeDefined();
});

test('Connector CRUD update without getRecordById', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const putResp = { status: 200 };
  axios.put.mockResolvedValue(putResp);

  connector.update("123", user, false)
    .then(data => expect(data).toBeUndefined())
    .catch(error => {
      expect(error).toBeUndefined();
    });
});

test('Connector CRUD update with getRecordById', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const putResp = { status: 200 };
  axios.put.mockResolvedValue(putResp);
  const getResp = { status: 200, data: user };
  axios.get.mockResolvedValue(getResp);

  connector.update("123", user)
    .then(data => expect(data).toEqual(user))
    .catch(error => {
      expect(error).toBeUndefined();
    });
});

test('Connector CRUD update error', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const user = { name: 'Bob' };
  const putResp = { status: 500 };
  axios.put.mockResolvedValue(putResp);

  expect(connector.update("123", user)).rejects.toBeDefined();
});

test('Connector CRUD delete', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const putResp = { status: 200 };
  axios.delete.mockResolvedValue(putResp);

  connector.delete("123")
    .then(data => expect(data).toBeUndefined())
    .catch(error => {
      expect(error).toBeUndefined();
    });
});

test('Connector CRUD delete error', () => {
  let connector = new ConnectorCrud("http://localhost");
  expect.assertions(1);

  const putResp = { status: 500 };
  axios.delete.mockResolvedValue(putResp);

  expect(connector.delete("123")).rejects.toBeDefined();
});


test('Connector CRUD search', () => {
  let connector = new ConnectorCrud("http://localhost");

  const template = { template: { name: 'Bob' } };
  const postResp = { status: 201, headers: { location: "add32142g4g2g2w4" } };
  axios.post.mockResolvedValue(postResp);
  const users = [{ name: 'Bob Unsted' }, { name: 'Bob Marley' }];
  const getResp = { status: 200, data: users };
  axios.get.mockResolvedValue(getResp);

  connector.postSearchRequest(template)
    .then(data => expect(data).toBe("add32142g4g2g2w4"))
    .catch(error => {
      expect(error).toBeUndefined();
    });

  connector.search("add32142g4g2g2w4", 123, 1)
    .then(data => expect(data).toBe(users))
    .catch(error => {
      expect(error).toBeUndefined();
    });

  const getResultSetRep = { status: 200, data: 123 };
  axios.get.mockResolvedValue(getResultSetRep);
  
  connector.getResultSetSize("add32142g4g2g2w4")
    .then(data => expect(data).toBe(123))
    .catch(error => {
      expect(error).toBeUndefined();
    });
});