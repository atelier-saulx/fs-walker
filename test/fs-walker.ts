import anyTest, { TestFn } from 'ava'
import { fsWalk } from '../src'

type TestContext = {}

export const test = anyTest as TestFn<TestContext>

test.serial('fs walker', async (t) => {
  const result = []
  const start = performance.now()
  await fsWalk('./test/_testFolder', async (_item, info) => {
    result.push({ path: info.path, info })
  })
  const end = performance.now()
  t.log(`amount: ${result.length}, millis: ${end - start}`)
  const totalItems = result.length
  t.is(totalItems, 12)
  const totalDirs = result.filter((r) => r.info.type === 'dir').length
  t.is(totalDirs, 4)
  t.is(result.find((r) => r.info.path === 'd/f.txt').info.type, 'dir')
  const totalFiles = result.filter((r) => r.info.type === 'file').length
  t.is(totalFiles, 8)
})

test.serial('fs walker should handle undefined and void objects', async (t) => {
  let matchCounter = 0
  await fsWalk(undefined, async () => {
    matchCounter++
  })
  t.is(matchCounter, 0)
  await fsWalk(null, async () => {
    matchCounter++
  })
  t.is(matchCounter, 0)
  //@ts-ignore
  await fsWalk({}, async () => {
    matchCounter++
  })
  t.is(matchCounter, 0)
  //@ts-ignore
  await fsWalk([], async () => {
    matchCounter++
  })
  t.is(matchCounter, 0)
  await fsWalk('', async () => {
    matchCounter++
  })
  t.is(matchCounter, 0)
  t.is(matchCounter, 0)
  //@ts-ignore
  await fsWalk(42, async () => {
    matchCounter++
  })
  t.is(matchCounter, 0)
  await fsWalk('./unexisting_folder', async () => {
    matchCounter++
  })
  t.is(matchCounter, 0)
})
