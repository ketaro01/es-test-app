import elasticsearchClient from "./elasticsearchConnection";

export default {
  getSettings(indexName) {
    return new Promise((resolve, reject) => {
      elasticsearchClient.indices.getSettings(
        {
          index: indexName
        },
        (err, resp, status) => {
          if (status === 200) {
            resolve(resp);
          } else {
            reject(err);
          }
        }
      );
    }).then(resp => {
      return resp;
    });
  },
  createIndex(indexName, reqBody) {
    return new Promise((resolve, reject) => {
      elasticsearchClient.indices.create(
        {
          index: indexName,
          body: reqBody
        },
        (err, resp, status) => {
          if (status === 200) {
            resolve(resp);
          } else {
            reject(err);
          }
        }
      );
    }).then(resp => {
      return resp;
    });
  },
  deleteIndex(indexName) {
    return new Promise((resolve, reject) => {
      elasticsearchClient.indices.delete(
        {
          index: indexName
        },
        (err, resp, status) => {
          if (status === 200) {
            resolve(resp);
          } else {
            reject(err);
          }
        }
      );
    }).then(resp => {
      return resp;
    });
  },
  getMapping(indexName) {
    return new Promise((resolve, reject) => {
      elasticsearchClient.indices.getMapping(
        {
          index: indexName,
          expandWildcards: "all"
        },
        (err, resp, status) => {
          if (status === 200) {
            resolve(resp);
          } else {
            reject(err);
          }
        }
      );
    }).then(resp => {
      return resp;
    });
  },
  putMapping(indexName, typeName, reqBody) {
    return new Promise((resolve, reject) => {
      elasticsearchClient.indices.putMapping(
        {
          index: indexName,
          type: typeName,
          body: {
            properties: reqBody
          }
        },
        (err, resp, status) => {
          if (status === 200) {
            resolve(resp);
          } else {
            reject(err);
          }
        }
      );
    }).then(resp => {
      return resp;
    });
  },
  analyze(indexName, analyzer, text) {
    return new Promise((resolve, reject) => {
      elasticsearchClient.indices.analyze(
        {
          index: indexName,
          body: {
            analyzer,
            text
          }
        },
        (err, resp, status) => {
          if (status === 200) {
            resolve(resp);
          } else {
            reject(err);
          }
        }
      );
    }).then(resp => {
      return resp;
    });
  }
};
