import elasticsearch from "elasticsearch";

/**
 * Elasticsearch Client API
 */

/**
 * 엘라스틱 서치 클라이언트 객체를 가져온다.
 * @type {elasticsearch.Client}
 */
const elasticsearchClient = new elasticsearch.Client({
  host: "http://localhost:9200",
  cors: true,
  keepAlive: false,
  requestTimeout: 600000
  // log: 'trace'
});

export default elasticsearchClient;
