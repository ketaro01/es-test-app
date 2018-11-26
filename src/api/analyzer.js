const commonFilter = {
  hangul_jamo_filter: {
    type: "hangul_jamo",
    name: "jamo"
  },
  hangul_chosung_filter: {
    type: "hangul_chosung",
    name: "chosung"
  },
  edge100Gram: {
    type: "edgeNGram",
    min_gram: 1,
    max_gram: 100,
    side: "front"
  }
};
const tokenizer = {
  seunjeon_default_tokenizer: {
    type: "seunjeon_tokenizer",
    index_eojeol: false,
    user_words: ["낄끼+빠빠,-100", "c\\+\\+", "어그로", "버카충", "abc마트"]
  }
};

const analyzers = {
  seunjeon: {
    korean: {
      type: "custom",
      tokenizer: "seunjeon_default_tokenizer"
    }
  },
  jamo: {
    hangul_jamo_analyzer: {
      type: "custom",
      tokenizer: "keyword",
      filter: ["hangul_jamo_filter", "edge100Gram", "lowercase"]
    },
    hangul_jamo_search_analyzer: {
      type: "custom",
      tokenizer: "keyword",
      filter: ["hangul_jamo_filter", "lowercase"]
    }
  },
  chosung: {
    hangul_chosung_analyzer: {
      type: "custom",
      tokenizer: "keyword",
      filter: ["hangul_chosung_filter", "edge100Gram", "lowercase"]
    },
    hangul_chosung_search_analyzer: {
      type: "custom",
      tokenizer: "keyword",
      filter: ["lowercase"]
    }
  }
};

const root = {
  settings: {
    index: {
      analysis: {}
    }
  }
};

const analyzer = key => {
  const setting = Object.assign({}, root);
  switch (key) {
    case "jamo":
      setting.settings.index.analysis.filter = commonFilter;
      setting.settings.index.analysis.analyzer = analyzers.jamo;
      break;
    case "chosung":
      setting.settings.index.analysis.filter = commonFilter;
      setting.settings.index.analysis.analyzer = analyzers.chosung;
      break;
    case "seunjeon":
      setting.settings.index.analysis.tokenizer = tokenizer;
      setting.settings.index.analysis.analyzer = analyzers.seunjeon;
      break;
    default:
      break;
  }
  return setting;
};

export default analyzer;
