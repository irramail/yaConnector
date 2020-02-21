function getAuthType() {
  var response = { type: 'NONE' };
  return response;
}

function getConfig(request) {
  var cc = DataStudioApp.createCommunityConnector();
  var config = cc.getConfig();
  
  config.newInfo()
    .setId('instructions')
    .setText('Enter yonder token, login, campaigns.');
  
  config.newTextInput()
    .setId('token')
    .setName('Token')
    .setHelpText('Yandex Token')
    .setPlaceholder('xxxxxxxxxxxxxxxxxxxx')
    .setAllowOverride(true);
  
  config.newTextInput()
    .setId('site')
    .setName('Site')
    .setHelpText('Site')
    .setPlaceholder('google.com')
    .setAllowOverride(true);
 
  config.newTextInput()
    .setId('note1')
    .setName('Note1')
    .setHelpText('Note')
    .setPlaceholder('')
    .setAllowOverride(true);
  
  config.newTextInput()
    .setId('note2')
    .setName('Note2')
    .setHelpText('Note')
    .setPlaceholder('')
    .setAllowOverride(true);
  
  config.setDateRangeRequired(false);
  
  return config.build();
}

var npmSchema = [
  {
    name: 'site',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'URL'
    }
  },
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
      conceptType: 'DIMENSION',
      semanticType: 'NUMBER'
    }
  },
  {
    name: 'currency',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'TEXT'
    }
  },
  {
    name: 'note1',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'TEXT'
    }
  },
  {
    name: 'note2',
    dataType: 'STRING',
    semantics: {
      conceptType: 'DIMENSION',
      semanticType: 'TEXT'
    }
  }
];

function getSchema(request) {
  return { schema: npmSchema };
}

function getData(request) {
  // Create schema for requested fields
  //var fields=JSON.parse('[{"name":"site"},{"name":"name"},{"name":"amount"},{"name":"currency"}, {"name":"note1"},{"name":"note2"}]');
  var requestedSchema = request.fields.map(function (field) {
    for (var i = 0; i < npmSchema.length; i++) {
      if (npmSchema[i].name == field.name) {
        return npmSchema[i];
      }
    }
  });
  
  // Fetch and parse data from API
  var payload = {"token": request.configParams.token, "method":"AccountManagement", "param": {"Action": "Get"}};
  var apiOptions = {
    headers : {
      'Content-Type': 'application/json'
    },
    "method" : "post",
    'payload' : JSON.stringify(payload)
  };
  
  var url = [
    'https://api.direct.yandex.ru/live/v4/json/'
  ];
  var response = UrlFetchApp.fetch(url.join(''), apiOptions);
  var parsedResponse = JSON.parse(response).data.Accounts;

  // Transform parsed data and filter for requested fields

  

var res = [ ];
var values = [];
parsedResponse.forEach(function(field) {
  requestedSchema.forEach(function (schemaField) {

  switch (schemaField.name) {
    case 'name':
      values.push(field.Login);
      break;
    case 'amount':
      values.push(field.Amount);
      break;
    case 'currency':
      values.push(field.Currency);
      break;
    case 'site':
      values.push(request.configParams.site);
      break;
    case 'note1':
      values.push(request.configParams.note1);
      break;
    case 'note2':
      values.push(request.configParams.note2);
      break;
    default:
      break;
  }
  });
  res.push({values:values});

});
var requestedData = res;
  return {
    schema: requestedSchema,
    rows: requestedData
  };
}
