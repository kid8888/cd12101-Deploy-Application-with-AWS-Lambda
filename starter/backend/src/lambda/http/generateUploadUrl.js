import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { getTodo, updateTodo } from '../../businessLogic/todos.mjs';
import { getUploadUrl, getPublicUrl } from '../../fileStorage/attachmentUtils.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    try {
      const todoId = event.pathParameters.todoId;
      const userId = getUserId(event);

      if (!todoId) {
        throw new Error('Todo ID is missing in the path parameters');
      }

      const todo = await getTodo(userId, todoId);

      if (!todo) {
        throw new Error(`Todo ${todoId} does not exist`);
      }

      // Generate upload URL and public URL
      const uploadUrl = await getUploadUrl(todoId);
      const publicUrl = getPublicUrl(todoId);

      if (!uploadUrl || !publicUrl) {
        throw new Error('Failed to generate upload or public URL');
      }

      // Update the TODO with the attachment URL
      await updateTodo(userId, todoId, {
        attachmentUrl: publicUrl
      });

      // Return the generated pre-signed URL
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl
        })
      };
    } catch (error) {
      console.error('Error generating upload URL:', error);

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message
        })
      };
    }
  });
