import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'

const token = process.env.VERCEL_TOKEN
if (!token) {
  console.error('Missing VERCEL_TOKEN')
  process.exit(1)
}

const distDir = resolve('dist')
const evidenceFile = resolve('evidence', 'vercel-rest-deploy.json')

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const absolute = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolute)))
    } else {
      files.push(absolute)
    }
  }
  return files
}

const files = await Promise.all(
  (await listFiles(distDir)).map(async (absolute) => ({
    file: relative(distDir, absolute).replaceAll('\\', '/'),
    data: await readFile(absolute, 'utf8'),
  })),
)

const body = {
  name: 'miradeck',
  files,
  projectSettings: {
    framework: null,
    buildCommand: null,
    devCommand: null,
    installCommand: null,
    outputDirectory: null,
  },
  meta: {
    source: 'codex-rest-static-dist',
  },
}

const createResponse = await fetch(
  'https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1&forceNew=1',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  },
)

const createText = await createResponse.text()
let createJson
try {
  createJson = JSON.parse(createText)
} catch {
  createJson = { raw: createText }
}

const result = {
  createStatus: createResponse.status,
  create: createJson,
  polls: [],
}

if (createResponse.ok && createJson.id) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await new Promise((resolveTimeout) => setTimeout(resolveTimeout, 3000))
    const pollResponse = await fetch(`https://api.vercel.com/v13/deployments/${createJson.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const pollJson = await pollResponse.json()
    result.polls.push({
      status: pollResponse.status,
      readyState: pollJson.readyState,
      statusText: pollJson.status,
      url: pollJson.url,
      errorCode: pollJson.errorCode,
      errorMessage: pollJson.errorMessage,
    })
    if (['READY', 'ERROR', 'CANCELED'].includes(pollJson.readyState)) break
  }
}

await writeFile(evidenceFile, `${JSON.stringify(result, null, 2)}\n`)

const lastPoll = result.polls.at(-1)
const ready = createResponse.ok && (createJson.readyState === 'READY' || lastPoll?.readyState === 'READY')
if (!ready) {
  console.error(JSON.stringify(result, null, 2))
  process.exit(1)
}

const url = `https://${lastPoll?.url ?? createJson.url}`
console.log(
  JSON.stringify(
    {
      url,
      id: createJson.id,
      readyState: lastPoll?.readyState ?? createJson.readyState,
      evidence: evidenceFile,
    },
    null,
    2,
  ),
)
