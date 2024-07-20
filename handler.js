const AWS = require('aws-sdk');
require('dotenv').config();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;


// Create Item
module.exports.create = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: tableName,
    Item: {
      email: data.email,  // Primary Key
      id: data.id,
      name: data.name,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Get Item
module.exports.get = async (event) => {
  const params = {
    TableName: tableName,
    Key: {
      email: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Update Item
module.exports.update = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: tableName,
    Key: {
      email: event.pathParameters.id,
    },
    UpdateExpression: "set #name = :name, id = :id",
    ExpressionAttributeNames: {
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":name": data.name,
      ":id": data.id,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Delete Item
module.exports.delete = async (event) => {
  const params = {
    TableName: tableName,
    Key: {
      email: event.pathParameters.id,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};


module.exports.listItems = async () => {
  const params = {
    TableName: tableName,
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
