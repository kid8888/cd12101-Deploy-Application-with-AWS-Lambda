
import { AttachmentUtils } from '../utils/attachmentUtils.mjs';
import { createLogger } from '../utils/logger.mjs';
import AWS from 'aws-sdk';

import AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS);
const log = createLogger('TodosAccess');

export class TodosAccess {
  constructor() {
    this.dynamoDB = new XAWS.DynamoDB.DocumentClient();
    this.todoTable = process.env.TODOS_TABLE;
    this.bucketName = process.env.ATTACHMENT_S3_BUCKET;
    this.todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX;
  }

  async create(todoItem) {
    await this.dynamoDB.put({
      TableName: this.todoTable,
      Item: todoItem,
    }).promise();
    log.info(`Todo item ${todoItem.name} added successfully`);
    return todoItem;
  }

  async generateAttachmentUrl(userId, todoId, attachmentId) {
    const attachmentUtils = new AttachmentUtils();
    const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`;

    await this.dynamoDB.update({
      TableName: this.todoTable,
      Key: { todoId, userId },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl',
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      },
    }).promise();

    const presignedUrl = await attachmentUtils.generatePresignedUrl(attachmentId);
    log.info(`Generated presigned URL: ${presignedUrl}`);
    return presignedUrl;
  }

  async getAll(userId) {
    const result = await this.dynamoDB.query({
      TableName: this.todoTable,
      IndexName: this.todosCreatedAtIndex,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }).promise();

    log.info('Todos fetched successfully', result.Items);
    return result.Items;
  }

  async update(userId, todoId, updatedTodo) {
    if (!updatedTodo || Object.keys(updatedTodo).length === 0) {
      throw new Error('Updated attributes must not be empty');
    }
  
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
  
    for (const [key, value] of Object.entries(updatedTodo)) {
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  
    const updateExpression = `set ${updateExpressions.join(', ')}`;
  
    await this.dynamoDB.update({
      TableName: this.todoTable,
      Key: { todoId, userId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }).promise();
  
    log.info('Todo item updated successfully', { userId, todoId, updatedTodo });
  }  

  async remove(userId, todoId) {
    await this.dynamoDB.delete({
      TableName: this.todoTable,
      Key: { todoId, userId },
    }).promise();
    log.info('Todo item deleted successfully');
  }

  async getTodo(userId, todoId) {
    log.info(`Getting a todo with id ${todoId} for user ${userId}`);

    try {
      const result = await this.dynamoDB.get({
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        }
      }).promise();

      if (!result.Item) {
        log.warn(`Todo with id ${todoId} for user ${userId} not found`);
        return null;
      }

      log.info('Todo fetched successfully', result.Item);
      return result.Item;
    } catch (error) {
      log.error('Error fetching todo', { error });
      throw new Error(`Error fetching todo: ${error.message}`);
    }
  }
}
