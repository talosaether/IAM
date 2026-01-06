import { db } from '../index'
import type { Checklist, ChecklistItem } from '../../types'

export interface ChecklistWithItems extends Checklist {
  items: ChecklistItem[]
  completedCount: number
  totalCount: number
}

export const checklistsRepository = {
  // ============ CHECKLISTS ============

  async getAll(): Promise<Checklist[]> {
    return db.query<Checklist>(
      `SELECT id, name, is_template as isTemplate, created_at as createdAt, updated_at as updatedAt
       FROM checklists
       ORDER BY created_at DESC`
    )
  },

  async getById(id: number): Promise<Checklist | null> {
    const results = await db.query<Checklist>(
      `SELECT id, name, is_template as isTemplate, created_at as createdAt, updated_at as updatedAt
       FROM checklists WHERE id = ?`,
      [id]
    )
    return results[0] || null
  },

  async create(name: string, isTemplate = false): Promise<number> {
    const result = await db.run(
      'INSERT INTO checklists (name, is_template) VALUES (?, ?)',
      [name, isTemplate ? 1 : 0]
    )
    return result.lastInsertId
  },

  async update(id: number, name: string): Promise<void> {
    await db.run(
      "UPDATE checklists SET name = ?, updated_at = datetime('now') WHERE id = ?",
      [name, id]
    )
  },

  async delete(id: number): Promise<void> {
    await db.run('DELETE FROM checklists WHERE id = ?', [id])
  },

  // ============ ITEMS ============

  async getItems(checklistId: number): Promise<ChecklistItem[]> {
    return db.query<ChecklistItem>(
      `SELECT id, checklist_id as checklistId, text, is_completed as isCompleted,
              sort_order as sortOrder, created_at as createdAt
       FROM checklist_items
       WHERE checklist_id = ?
       ORDER BY sort_order ASC`,
      [checklistId]
    )
  },

  async addItem(checklistId: number, text: string): Promise<number> {
    const maxOrder = await db.query<{ maxOrder: number }>(
      'SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM checklist_items WHERE checklist_id = ?',
      [checklistId]
    )
    const sortOrder = (maxOrder[0]?.maxOrder ?? -1) + 1

    const result = await db.run(
      'INSERT INTO checklist_items (checklist_id, text, sort_order) VALUES (?, ?, ?)',
      [checklistId, text, sortOrder]
    )
    return result.lastInsertId
  },

  async updateItem(id: number, text: string): Promise<void> {
    await db.run('UPDATE checklist_items SET text = ? WHERE id = ?', [text, id])
  },

  async toggleItem(id: number): Promise<boolean> {
    const items = await db.query<{ isCompleted: number }>(
      'SELECT is_completed as isCompleted FROM checklist_items WHERE id = ?',
      [id]
    )
    const newValue = items[0]?.isCompleted ? 0 : 1
    await db.run('UPDATE checklist_items SET is_completed = ? WHERE id = ?', [newValue, id])
    return newValue === 1
  },

  async deleteItem(id: number): Promise<void> {
    await db.run('DELETE FROM checklist_items WHERE id = ?', [id])
  },

  async reorderItems(itemIds: number[]): Promise<void> {
    for (let i = 0; i < itemIds.length; i++) {
      await db.run('UPDATE checklist_items SET sort_order = ? WHERE id = ?', [i, itemIds[i]])
    }
  },

  async clearCompleted(checklistId: number): Promise<void> {
    await db.run(
      'DELETE FROM checklist_items WHERE checklist_id = ? AND is_completed = 1',
      [checklistId]
    )
  },

  // ============ WITH ITEMS ============

  async getAllWithItems(): Promise<ChecklistWithItems[]> {
    const checklists = await this.getAll()
    const result: ChecklistWithItems[] = []

    for (const checklist of checklists) {
      const items = await this.getItems(checklist.id)
      result.push({
        ...checklist,
        items,
        completedCount: items.filter(i => i.isCompleted).length,
        totalCount: items.length
      })
    }

    return result
  },

  async getByIdWithItems(id: number): Promise<ChecklistWithItems | null> {
    const checklist = await this.getById(id)
    if (!checklist) return null

    const items = await this.getItems(id)
    return {
      ...checklist,
      items,
      completedCount: items.filter(i => i.isCompleted).length,
      totalCount: items.length
    }
  },

  // ============ TEMPLATES ============

  async createFromTemplate(templateId: number, name: string): Promise<number> {
    const template = await this.getByIdWithItems(templateId)
    if (!template) throw new Error('Template not found')

    const newId = await this.create(name, false)

    for (const item of template.items) {
      await this.addItem(newId, item.text)
    }

    return newId
  }
}
