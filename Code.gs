function getAuthType() {
  var response = { type: 'NONE' };
  return response;
}

function getConfig(request) {
  var config = {
    configParams: [
    ],
    dateRangeRequired: false
  };
  return config;
}

var npmSchema = [
  {
    name: 'name',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'TEXT'
    }
  },
  {
    name: 'amount',
    dataType: 'NUMBER',
    semantics: {
      conceptType: 'METRIC',
      semanticType: 'NUMBER'
    }
  }
];

function getSchema(request) {
  return { schema: npmSchema };
}

function getData(request) {
  // Create schema for requested fields
  var fields=JSON.parse('[{"name":"name"},{"name":"amount"}]');

  var requestedSchema = fields.map(function (field) {
    for (var i = 0; i < npmSchema.length; i++) {
      if (npmSchema[i].name == field.name) {
        return npmSchema[i];
      }
    }
  });
  
  // Fetch and parse data from API
  var payload = {"token": "ThisIsToken", "method":"AccountManagement", "param": {"Action": "Get"}};
  var apiOptions = {
    headers : {
      'Content-Type': 'application/json'
    },
    "method" : "post",
    'payload' : JSON.stringify(payload)
  };
  
  var url = [
    'https://api-sandbox.direct.yandex.ru/live/v4/json/'
  ];
  var response = UrlFetchApp.fetch(url.join(''), apiOptions);
  var parsedResponse = JSON.parse(response).data.Accounts;

  // Transform parsed data and filter for requested fields

var res = [ ];
for (var k in parsedResponse) {
  var name =parsedResponse[k].Login;
  var amount =parsedResponse[k].Amount;
  res.push({values:[name, amount]});
};
  
var requestedData = res;
  return {
    schema: requestedSchema,
    rows: requestedData
  };
}
