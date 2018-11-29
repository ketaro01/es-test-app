import elasticsearchClient from "./elasticsearchConnection";

export default {
  bulkStart(indexName, type, jsonArr, id) {
    let reqParam = new Array();
    let bulkFormat = {
      index: {
        _index: indexName,
        _type: type
      }
    };
    jsonArr.map(v => {
      if (id) bulkFormat.index._id = parseInt(v[id], 10);
      reqParam.push(JSON.stringify(bulkFormat));
      reqParam.push(v);
    });
    return new Promise((resolve, reject) => {
      elasticsearchClient.bulk({ body: reqParam }, (err, resp, status) => {
        if (status === 200) {
          resolve(resp);
        } else {
          reject(err);
        }
      });
    }).then(resp => {
      return resp;
    });
  }
};
