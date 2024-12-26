import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { createLogger } from '../utils/logger.mjs'
import * as uuid from 'uuid'

const log = createLogger('TodosService')
const todosAccess = new TodosAccess()

export const createTodo = async (userId, todoData) => {
  if (!userId) {
    log.info('User not authenticated')
    return false
  }
  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const newTodo = {
    userId,
    todoId,
    createdAt,
    done: false,
    ...todoData
  }
  return await todosAccess.create(newTodo)
}

export const generateAttachmentUrl = async (userId, todoId) => {
  if (!userId) {
    log.info('User not authenticated')
    return false
  }
  const attachmentId = uuid.v4()
  return await todosAccess.generateAttachmentUrl(userId, todoId, attachmentId)
}

export const getAll = async (userId) => {
  if (!userId) {
    log.info('User not authenticated')
    return false
  }
  return await todosAccess.getAll(userId)
}

export const updateTodo = async (userId, todoId, updatedData) => {
  if (!userId) {
    log.info('User not authenticated')
    return false
  }
  await todosAccess.update(userId, todoId, updatedData)
  return true
}

export const deleteTodo = async (userId, todoId) => {
  if (!userId) {
    log.info('User not authenticated')
    return false
  }
  await todosAccess.remove(userId, todoId)
  return true
}
export async function getTodo(userId, todoId) {
  return await todosAccess.getTodo(userId, todoId)
}