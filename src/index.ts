import fs from 'fs/promises'
import {
  walk,
  Walk,
  WalkerListFn,
  WalkerTargetValidationFn,
  getType,
} from '@saulx/utils'
import path from 'path'

type FsListItem = { name: string; ref: any; path: string; type: FsItemTypes }
type FsItemMatchFn = (item: FsListItem) => Promise<boolean>
type FsRecurseFn = (item: FsListItem) => Promise<boolean>
type FsItemTypes = 'dir' | 'file' | 'unknown'
type FsItemFn = (
  item: string,
  info: {
    name: string
    path: string
    type: FsItemTypes
  }
) => Promise<void>

const fsItemMatchFn: FsItemMatchFn = async (_item) => true
const fsListFn: WalkerListFn<FsListItem> = async (target, previousPath) => {
  const items = await fs.readdir(target, { withFileTypes: true })
  return items.map((item) => ({
    name: item.name,
    ref: path.join(target, item.name),
    path: [previousPath, item.name].filter(Boolean).join('/'),
    type: item.isDirectory() ? 'dir' : item.isFile ? 'file' : 'unknown',
  }))
}
const fsRecurseFn: FsRecurseFn = async (item) => item.type === 'dir'
const fsTargetValidationFn: WalkerTargetValidationFn = async (target) => {
  if (getType(target) !== 'string') return false
  try {
    const stat = await fs.stat(target)
    if (stat.isDirectory()) return true
    return false
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
}

export const fsWalk: Walk<FsListItem, FsItemFn> = async (
  targetPath,
  itemFn,
  options
) => {
  options = {
    listFn: fsListFn,
    itemMatchFn: fsItemMatchFn,
    recurseFn: fsRecurseFn,
    targetValidationFn: fsTargetValidationFn,
    ...options,
  }
  // arghhhh typescript generics
  //@ts-ignore
  await walk(targetPath, itemFn, {
    listFn: options.listFn,
    recurseFn: options.recurseFn,
    itemMatchFn: options.itemMatchFn,
    targetValidationFn: options.targetValidationFn,
  })
}
