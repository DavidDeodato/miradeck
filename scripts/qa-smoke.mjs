import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const baseUrl = process.env.MIRADECK_BASE_URL ?? 'http://127.0.0.1:53220'
const chromePath =
  process.env.PLAYWRIGHT_CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const evidenceDir = resolve('evidence')
const sampleDir = resolve('evidence', 'samples')

await mkdir(evidenceDir, { recursive: true })
await mkdir(sampleDir, { recursive: true })

const sampleDoc = resolve(sampleDir, 'sample-brief.md')
const sampleAvatar = resolve(sampleDir, 'sample-avatar.svg')

await writeFile(
  sampleDoc,
  [
    '# MiraDeck QA Brief',
    '',
    'Objetivo: validar assistentes, memoria, arquivos, modelo e geracao visual simulada.',
    'KPI visual: sem overflow horizontal em desktop e mobile.',
  ].join('\n'),
)

await writeFile(
  sampleAvatar,
  [
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">',
    '<rect width="160" height="160" rx="32" fill="#253f3a"/>',
    '<circle cx="80" cy="70" r="34" fill="#c7e9d0"/>',
    '<path d="M36 142c10-31 78-31 88 0" fill="#f4efe5"/>',
    '</svg>',
  ].join(''),
)

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
})

const errors = []
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
})
const page = await context.newPage()
page.on('console', (message) => {
  if (['error', 'warning'].includes(message.type())) errors.push(`${message.type()}: ${message.text()}`)
})
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

const screenshot = async (name) => {
  const file = resolve(evidenceDir, name)
  await page.screenshot({ path: file, fullPage: false })
  return file
}

await page.goto(baseUrl, { waitUntil: 'load' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'load' })

const captures = []
captures.push(await screenshot('flow-01-landing.png'))

await page.getByRole('button', { name: 'Comecar agora' }).click().catch(async () => {
  await page.getByRole('button', { name: 'Começar agora' }).click()
})
captures.push(await screenshot('flow-02-auth.png'))

await page.getByLabel('Nome').fill('David QA')
await page.getByLabel('Email').fill('qa@miradeck.local')
await page.getByRole('button', { name: 'Criar conta e entrar' }).click()
await page.waitForSelector('.workspace')
captures.push(await screenshot('flow-03-workspace.png'))

await page.getByPlaceholder('Novo assistente').fill('Atlas QA')
await page.getByRole('button', { name: 'Criar assistente' }).click()
await page.locator('.config-panel select').selectOption('Deep Reasoning')
await page.getByPlaceholder('Adicionar skill').fill('telemetria de ponta a ponta')
await page.getByRole('button', { name: 'Adicionar skill' }).click()
await page.getByPlaceholder('Peça algo ao assistente...').fill('Valide essa plataforma como se fosse release candidata.')
await page.getByRole('button', { name: 'Enviar mensagem' }).click()
captures.push(await screenshot('flow-04-chat.png'))

const profileTextareas = page.locator('.profile-editor textarea')
await profileTextareas.nth(0).fill('Gestor de agentes e produtos com foco em lastro operacional.')
await profileTextareas.nth(1).fill('Memoria QA: sempre validar build, browser, console, mobile, upload e persistencia.')
await page.locator('.avatar-upload input[type="file"]').setInputFiles(sampleAvatar)
await page.locator('.drop-zone input[type="file"]').setInputFiles([sampleDoc, sampleAvatar])
await page.getByPlaceholder('Peça uma imagem: retrato, capa, mockup...').fill(
  'mockup editorial do MiraDeck com assistentes em camadas e paleta limpa',
)
await page.getByRole('button', { name: 'Gerar imagem' }).click()
captures.push(await screenshot('flow-05-assets-profile-image.png'))

await page.reload({ waitUntil: 'load' })
await page.waitForSelector('.workspace')

const desktopMetrics = await page.evaluate(() => ({
  title: document.title,
  h1: document.querySelector('h1')?.textContent,
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  assistants: [...document.querySelectorAll('button')]
    .map((button) => button.textContent?.trim())
    .filter((text) => text?.includes('Atlas QA') || text?.includes('Nora') || text?.includes('Lio') || text?.includes('Vale')),
  latestMessages: [...document.querySelectorAll('.message')]
    .map((message) => message.textContent?.trim())
    .slice(-4),
  assets: [...document.querySelectorAll('.asset-row strong')].map((asset) => asset.textContent),
  generatedImages: document.querySelectorAll('.generated-image').length,
  avatarIsImage: Boolean(document.querySelector('.image-avatar')),
}))

await page.setViewportSize({ width: 390, height: 844 })
await page.reload({ waitUntil: 'load' })
await page.waitForSelector('.workspace')
await page.evaluate(() => window.scrollTo(0, 0))
captures.push(await screenshot('flow-06-mobile-workspace.png'))

const mobileMetrics = await page.evaluate(() => ({
  h1: document.querySelector('h1')?.textContent,
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  hasWorkspace: Boolean(document.querySelector('.workspace')),
}))

await browser.close()

const result = {
  baseUrl,
  screenshots: captures,
  errors,
  desktopMetrics,
  mobileMetrics,
  passed:
    errors.length === 0 &&
    desktopMetrics.scrollWidth <= desktopMetrics.innerWidth &&
    mobileMetrics.scrollWidth <= mobileMetrics.innerWidth &&
    desktopMetrics.assets.includes('sample-brief.md') &&
    desktopMetrics.assets.includes('sample-avatar.svg') &&
    desktopMetrics.avatarIsImage &&
    desktopMetrics.generatedImages >= 2,
}

await writeFile(resolve(evidenceDir, 'qa-smoke-results.json'), `${JSON.stringify(result, null, 2)}\n`)

if (!result.passed) {
  console.error(JSON.stringify(result, null, 2))
  process.exit(1)
}

console.log(JSON.stringify(result, null, 2))
