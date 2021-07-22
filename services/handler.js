'use strict';
const AWS = require('aws-sdk');
const postsTable = process.env.POSTS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.getAllAudioInfo = async (event, context, callback) => {
  let data = await getInfo().then(info => info).catch(err => console.log(err));
  let mainArr = [];
  for (let i = 0; i < data.Count; i++) {
    let mainObj = {
      id:data.Items[i].id,
      clientName:data.Items[i].clientName,
      Info:data.Items[i].info
    }
    mainArr.push(mainObj);
  }
  callback(null, { statusCode: 200, body: JSON.stringify(mainArr) });

};

module.exports.getAudioById = (event, context, callback) => {
  let mainArr = [];
  const params = {
    TableName: 'Content_Assets',
    Key: {
      id:event.pathParameters.id,
    },
  };
  docClient.get(params, (error, result) => {
    if (result.Item != undefined) {
      let mainObj = {
        id:result.Item.id,
        clientName:result.Item.clientName,
        Info:result.Item.info
      }
      mainArr.push(mainObj);
      callback(null, { statusCode: 200, body: JSON.stringify(mainArr) });
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify('data not found!!') });
    }
  });
};


const getInfo = () => {
  return new Promise(async (resolve, reject) => {
    var params = {
      TableName: 'Content_Assets'
    };
    docClient.scan(params, function (err, data) {
      if (err) {
        return reject(err);
      } else {
        return resolve(data);
      }
    });
  });
}
