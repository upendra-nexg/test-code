'use strict';
const AWS = require('aws-sdk');
const postsTable = process.env.POSTS_TABLE;
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.getAllAudioInfo = async (event, context, callback) => {
  if (event.queryStringParameters == null) {
    let data = await getInfo().then(info => info).catch(err => console.log(err));
    console.log(data);
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
  } else {
    let audioId = event.queryStringParameters;
    let mainArr = [];
    let audioInfo = await getAudioInfoById(audioId).then(info => info).catch(err => console.log(err));
    if (audioInfo.Count > 0) {
      let mainObj = {
        id:audioInfo.Items[0].id,
        clientName:audioInfo.Items[0].clientName,
        Info:audioInfo.Items[0].info
      }
      mainArr.push(mainObj);
      callback(null, { statusCode: 200, body: JSON.stringify(mainArr) });
    } else {
      callback(null, { statusCode: 200, body: JSON.stringify('data not found!!') });
    }
  }
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

const getAudioInfoById = (audioId) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      TableName: "Content_Assets",
      KeyConditionExpression: "#id = :id",
      ExpressionAttributeNames: {
        "#id": "id"
      },
      ExpressionAttributeValues: {
        ":id": audioId.id  // Sort key
      }
    };
    docClient.query(params, function (err, data) {
      if (err) {
        return reject('data not fount');
      } else {
        return resolve(data);
      }
    });
  });
}