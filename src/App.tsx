import {
  ArrowRight,
  Bot,
  Brain,
  Check,
  ChevronRight,
  FileText,
  Image,
  Library,
  MessageSquare,
  Palette,
  Paperclip,
  PenLine,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Upload,
  UserRound,
  Wand2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import './App.css'

type Role = 'user' | 'assistant'

interface ChatMessage {
  id: string
  role: Role
  content: string
  createdAt: string
}

interface ChatThread {
  id: string
  assistantId: string
  title: string
  messages: ChatMessage[]
  updatedAt: string
}

interface Assistant {
  id: string
  name: string
  role: string
  tone: string
  status: 'ready' | 'draft' | 'review'
  model: string
  skills: string[]
  systemPrompt: string
  accent: string
  initials: string
}

interface UploadedAsset {
  id: string
  type: 'document' | 'image'
  name: string
  size: number
  createdAt: string
}

interface GeneratedImage {
  id: string
  prompt: string
  palette: string
  createdAt: string
}

interface UserProfile {
  name: string
  email: string
  bio: string
  memory: string
  avatar?: string
}

interface AppState {
  signedIn: boolean
  profile: UserProfile
  assistants: Assistant[]
  threads: ChatThread[]
  assets: UploadedAsset[]
  generatedImages: GeneratedImage[]
}

const storageKey = 'miradeck.state.v1'

const now = () => new Date().toISOString()
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`

const models = [
  'GPT-4.1 Mini',
  'GPT-4.1',
  'Deep Reasoning',
  'Image Studio',
  'Fast Draft',
]

const landingFeatures: Array<{ title: string; body: string; Icon: LucideIcon }> = [
  {
    title: 'Assistentes prontos',
    body: 'Comece com especialistas e crie novos perfis em segundos.',
    Icon: Bot,
  },
  {
    title: 'Memória controlada',
    body: 'Edite o que a IA deve lembrar sobre você e seus projetos.',
    Icon: Brain,
  },
  {
    title: 'Arquivos e fotos',
    body: 'Anexe documentos, imagens e referências para cada fluxo.',
    Icon: Paperclip,
  },
  {
    title: 'Modelos e skills',
    body: 'Escolha modelo, tom, prompt system e capacidades por assistente.',
    Icon: Settings,
  },
]

const starterAssistants: Assistant[] = [
  {
    id: 'assistant-strategy',
    name: 'Nora Strategy',
    role: 'Produto e estratégia',
    tone: 'Direta, criteriosa, orientada por KPI',
    status: 'ready',
    model: 'GPT-4.1',
    skills: ['Roadmap', 'Pesquisa', 'KPI'],
    systemPrompt:
      'Você é uma estrategista de produto. Sempre traduza ambição em escopo, KPI, risco e próximo passo testável.',
    accent: 'cobalt',
    initials: 'NS',
  },
  {
    id: 'assistant-brand',
    name: 'Lio Brand',
    role: 'Branding, paleta e narrativa',
    tone: 'Elegante, visual, pouco genérico',
    status: 'ready',
    model: 'GPT-4.1 Mini',
    skills: ['Naming', 'Paleta', 'Landing'],
    systemPrompt:
      'Você é um diretor de marca. Evite estética genérica de IA; construa identidade com tokens, motivos visuais e linguagem própria.',
    accent: 'mint',
    initials: 'LB',
  },
  {
    id: 'assistant-ops',
    name: 'Vale Ops',
    role: 'Operações e automações',
    tone: 'Calma, pragmática, rastreável',
    status: 'review',
    model: 'Deep Reasoning',
    skills: ['Checklist', 'QA', 'Logs'],
    systemPrompt:
      'Você transforma fluxos complexos em rotinas, checks e evidências. Nunca declare sucesso sem telemetria.',
    accent: 'amber',
    initials: 'VO',
  },
]

const starterThreads: ChatThread[] = [
  {
    id: 'thread-welcome',
    assistantId: 'assistant-strategy',
    title: 'Plano de lançamento',
    updatedAt: now(),
    messages: [
      {
        id: 'm-1',
        role: 'assistant',
        createdAt: now(),
        content:
          'Tenho contexto inicial do MiraDeck. Posso transformar sua ideia em plano, requisitos, riscos e uma primeira sprint executável.',
      },
    ],
  },
]

const defaultState: AppState = {
  signedIn: false,
  profile: {
    name: 'David',
    email: 'david@miradeck.local',
    bio: 'Criando uma camada de gestão para delegar trabalho complexo a assistentes especializados.',
    memory:
      'Prefere avanço rápido com documentação, telemetria forte, Open Design para direção visual e evidência antes de declarar pronto.',
  },
  assistants: starterAssistants,
  threads: starterThreads,
  assets: [
    {
      id: 'asset-brief',
      type: 'document',
      name: 'brief-miradeck.md',
      size: 18400,
      createdAt: now(),
    },
  ],
  generatedImages: [
    {
      id: 'image-hero',
      prompt: 'Hero visual with calm assistant cards floating over warm paper',
      palette: 'cobalt-mint',
      createdAt: now(),
    },
  ],
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return defaultState
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return defaultState
  }
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

function Avatar({ profile, assistant }: { profile?: UserProfile; assistant?: Assistant }) {
  if (profile?.avatar) {
    return <img className="avatar image-avatar" src={profile.avatar} alt="" />
  }

  const initials = assistant?.initials ?? profile?.name?.slice(0, 2).toUpperCase() ?? 'MD'
  return <span className={`avatar ${assistant?.accent ?? 'cobalt'}`}>{initials}</span>
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <main className="landing">
      <nav className="landing-nav" aria-label="Primary">
        <div className="brand-lockup">
          <LogoMark />
          <strong>MiraDeck</strong>
        </div>
        <div className="nav-links">
          <a href="#product">Produto</a>
          <a href="#assistants">Assistentes</a>
          <a href="#security">Memória</a>
        </div>
        <button className="nav-button" type="button" onClick={onStart}>
          Entrar <ArrowRight size={16} />
        </button>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">AI command deck</span>
          <h1>Um painel bonito para criar, treinar e conversar com seus assistentes.</h1>
          <p>
            MiraDeck organiza modelos, prompts, skills, memória, arquivos e imagens em um workspace
            elegante para quem quer operar IA sem perder contexto.
          </p>
          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={onStart}>
              Começar agora <ArrowRight size={18} />
            </button>
            <a className="secondary-action" href="#product">
              Ver plataforma <ChevronRight size={18} />
            </a>
          </div>
        </div>

        <div className="hero-preview" id="product" aria-label="MiraDeck product preview">
          <div className="preview-top">
            <div className="brand-lockup small">
              <LogoMark />
              <span>MiraDeck</span>
            </div>
            <span className="status-pill">12 assistants ready</span>
          </div>
          <div className="preview-grid">
            <aside className="preview-rail">
              <span />
              <span />
              <span />
              <span />
            </aside>
            <div className="preview-list">
              {starterAssistants.map((assistant) => (
                <div className="mini-assistant" key={assistant.id}>
                  <Avatar assistant={assistant} />
                  <div>
                    <strong>{assistant.name}</strong>
                    <span>{assistant.role}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="preview-chat">
              <div className="chat-bubble user">Crie um assistente para revisar landing pages.</div>
              <div className="chat-bubble assistant">
                Posso configurar objetivo, rubrica visual, checklist de QA e memória do projeto.
              </div>
              <div className="preview-input">
                <span>Peça, refine, teste...</span>
                <Send size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-band" id="assistants">
        <div>
          <span className="eyebrow">O que entra no deck</span>
          <h2>Assistentes, prompts, skills, arquivos, memória e imagem no mesmo lugar.</h2>
        </div>
        <div className="feature-grid">
          {landingFeatures.map(({ title, body, Icon }) => (
            <article className="feature-card" key={title}>
              <Icon size={20} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="security-band" id="security">
        <div className="security-copy">
          <span className="eyebrow">Personal AI workspace</span>
          <h2>Bonito por fora, operacional por dentro.</h2>
          <p>
            O app já valida fluxo de conta, perfil, criação de assistente, chat persistente, edição de
            memória, upload local e geração visual simulada.
          </p>
        </div>
        <button className="primary-action dark" type="button" onClick={onStart}>
          Abrir workspace <ArrowRight size={18} />
        </button>
      </section>
    </main>
  )
}

function AuthScreen({ onLogin }: { onLogin: (name: string, email: string) => void }) {
  const [name, setName] = useState('David')
  const [email, setEmail] = useState('david@miradeck.local')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onLogin(name.trim() || 'David', email.trim() || 'david@miradeck.local')
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="brand-lockup">
          <LogoMark />
          <strong>MiraDeck</strong>
        </div>
        <h1>Entre no seu deck de assistentes.</h1>
        <p>
          Fluxo de autenticação simulado para o MVP. Os dados ficam no navegador e persistem entre
          recarregamentos.
        </p>
        <form className="auth-form" onSubmit={submit}>
          <label>
            Nome
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <button className="primary-action" type="submit">
            Criar conta e entrar <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  )
}

function Workspace({ state, setState }: { state: AppState; setState: (state: AppState) => void }) {
  const [query, setQuery] = useState('')
  const [activeAssistantId, setActiveAssistantId] = useState(state.assistants[0]?.id ?? '')
  const [activeThreadId, setActiveThreadId] = useState(state.threads[0]?.id ?? '')
  const [draft, setDraft] = useState('')
  const [newSkill, setNewSkill] = useState('')
  const [assistantName, setAssistantName] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [thinking, setThinking] = useState(true)

  const activeAssistant =
    state.assistants.find((assistant) => assistant.id === activeAssistantId) ?? state.assistants[0]

  const assistantThreads = state.threads.filter((thread) => thread.assistantId === activeAssistant?.id)
  const activeThread =
    state.threads.find((thread) => thread.id === activeThreadId) ?? assistantThreads[0] ?? state.threads[0]

  const filteredAssistants = state.assistants.filter((assistant) =>
    `${assistant.name} ${assistant.role} ${assistant.skills.join(' ')}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  const updateState = (updater: (current: AppState) => AppState) => setState(updater(state))

  const updateAssistant = (patch: Partial<Assistant>) => {
    if (!activeAssistant) return
    updateState((current) => ({
      ...current,
      assistants: current.assistants.map((assistant) =>
        assistant.id === activeAssistant.id ? { ...assistant, ...patch } : assistant,
      ),
    }))
  }

  const createAssistant = () => {
    const trimmed = assistantName.trim()
    if (!trimmed) return
    const initials = trimmed
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
    const assistant: Assistant = {
      id: uid('assistant'),
      name: trimmed,
      role: 'Novo assistente personalizado',
      tone: 'Claro, útil, com memória de contexto',
      status: 'draft',
      model: 'GPT-4.1 Mini',
      skills: ['Chat', 'Memória'],
      systemPrompt: 'Você é um assistente personalizado do MiraDeck. Responda com clareza e contexto.',
      accent: 'cobalt',
      initials: initials || 'AI',
    }
    const thread: ChatThread = {
      id: uid('thread'),
      assistantId: assistant.id,
      title: 'Primeira conversa',
      updatedAt: now(),
      messages: [
        {
          id: uid('msg'),
          role: 'assistant',
          content: `Pronto. Sou ${assistant.name}. Configure meu prompt, modelo e skills antes de me colocar em produção.`,
          createdAt: now(),
        },
      ],
    }
    updateState((current) => ({
      ...current,
      assistants: [assistant, ...current.assistants],
      threads: [thread, ...current.threads],
    }))
    setActiveAssistantId(assistant.id)
    setActiveThreadId(thread.id)
    setAssistantName('')
  }

  const createThread = () => {
    if (!activeAssistant) return
    const thread: ChatThread = {
      id: uid('thread'),
      assistantId: activeAssistant.id,
      title: `Chat ${assistantThreads.length + 1}`,
      updatedAt: now(),
      messages: [
        {
          id: uid('msg'),
          role: 'assistant',
          content: `Novo chat aberto com ${activeAssistant.name}. Trago o mesmo modelo, skills e memória configurada.`,
          createdAt: now(),
        },
      ],
    }
    updateState((current) => ({ ...current, threads: [thread, ...current.threads] }))
    setActiveThreadId(thread.id)
  }

  const sendMessage = () => {
    if (!activeAssistant || !activeThread || !draft.trim()) return
    const userMessage: ChatMessage = {
      id: uid('msg'),
      role: 'user',
      content: draft.trim(),
      createdAt: now(),
    }
    const assistantMessage: ChatMessage = {
      id: uid('msg'),
      role: 'assistant',
      createdAt: now(),
      content: [
        thinking
          ? 'Pensamento: verifiquei objetivo, memória, arquivos anexados e skills antes de responder.'
          : null,
        `Resposta de ${activeAssistant.name}: posso avançar com isso usando ${activeAssistant.model}.`,
        `Skills ativas: ${activeAssistant.skills.join(', ')}.`,
        state.assets.length > 0 ? `Tenho ${state.assets.length} arquivo(s) como contexto local.` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    }
    updateState((current) => ({
      ...current,
      threads: current.threads.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              title: thread.messages.length <= 1 ? draft.trim().slice(0, 42) : thread.title,
              messages: [...thread.messages, userMessage, assistantMessage],
              updatedAt: now(),
            }
          : thread,
      ),
    }))
    setDraft('')
  }

  const addSkill = () => {
    if (!activeAssistant || !newSkill.trim()) return
    const skill = newSkill.trim()
    updateAssistant({ skills: Array.from(new Set([...activeAssistant.skills, skill])) })
    setNewSkill('')
  }

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    const assets: UploadedAsset[] = files.map((file) => ({
      id: uid('asset'),
      type: file.type.startsWith('image/') ? 'image' : 'document',
      name: file.name,
      size: file.size,
      createdAt: now(),
    }))
    updateState((current) => ({ ...current, assets: [...assets, ...current.assets] }))
    event.target.value = ''
  }

  const updateAvatar = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateState((current) => ({
        ...current,
        profile: { ...current.profile, avatar: String(reader.result) },
      }))
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const generateImage = () => {
    if (!imagePrompt.trim()) return
    const image: GeneratedImage = {
      id: uid('image'),
      prompt: imagePrompt.trim(),
      palette: ['cobalt-mint', 'ink-amber', 'paper-teal'][state.generatedImages.length % 3],
      createdAt: now(),
    }
    updateState((current) => ({
      ...current,
      generatedImages: [image, ...current.generatedImages],
    }))
    setImagePrompt('')
  }

  return (
    <main className="workspace">
      <aside className="sidebar">
        <div className="brand-lockup">
          <LogoMark />
          <strong>MiraDeck</strong>
        </div>
        <nav className="side-nav" aria-label="Workspace">
          <a href="#assistants-panel">
            <Library size={18} /> Assistentes
          </a>
          <a href="#chat-panel">
            <MessageSquare size={18} /> Chats
          </a>
          <a href="#profile-panel">
            <UserRound size={18} /> Perfil
          </a>
          <a href="#files-panel">
            <Upload size={18} /> Arquivos
          </a>
          <a href="#image-panel">
            <Image size={18} /> Imagens
          </a>
        </nav>
        <div className="profile-chip">
          <Avatar profile={state.profile} />
          <div>
            <strong>{state.profile.name}</strong>
            <span>{state.profile.email}</span>
          </div>
        </div>
      </aside>

      <section className="main-panel">
        <header className="workspace-header">
          <div>
            <span className="eyebrow">Personal AI workspace</span>
            <h1>Assistentes sob controle.</h1>
          </div>
          <div className="header-actions">
            <button className={thinking ? 'toggle active' : 'toggle'} type="button" onClick={() => setThinking(!thinking)}>
              <Brain size={16} /> Pensando
            </button>
            <button className="secondary-action compact" type="button" onClick={createThread}>
              <Plus size={16} /> Novo chat
            </button>
          </div>
        </header>

        <div className="workspace-grid">
          <section className="panel assistants-panel" id="assistants-panel">
            <div className="panel-heading">
              <div>
                <h2>Assistentes</h2>
                <p>Predefinidos e personalizados.</p>
              </div>
              <Bot size={20} />
            </div>
            <label className="search-box">
              <Search size={16} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrar por skill, nome..." />
            </label>
            <div className="assistant-list">
              {filteredAssistants.map((assistant) => (
                <button
                  className={assistant.id === activeAssistant?.id ? 'assistant-row selected' : 'assistant-row'}
                  key={assistant.id}
                  type="button"
                  onClick={() => {
                    setActiveAssistantId(assistant.id)
                    const firstThread = state.threads.find((thread) => thread.assistantId === assistant.id)
                    if (firstThread) setActiveThreadId(firstThread.id)
                  }}
                >
                  <Avatar assistant={assistant} />
                  <div>
                    <strong>{assistant.name}</strong>
                    <span>{assistant.role}</span>
                  </div>
                  <span className={`state-dot ${assistant.status}`} />
                </button>
              ))}
            </div>
            <div className="create-row">
              <input value={assistantName} onChange={(event) => setAssistantName(event.target.value)} placeholder="Novo assistente" />
              <button className="icon-button" type="button" onClick={createAssistant} title="Criar assistente">
                <Plus size={18} />
              </button>
            </div>
          </section>

          <section className="panel chat-panel" id="chat-panel">
            <div className="panel-heading">
              <div>
                <h2>{activeAssistant?.name ?? 'Assistente'}</h2>
                <p>{activeAssistant?.tone}</p>
              </div>
              <select value={activeThread?.id ?? ''} onChange={(event) => setActiveThreadId(event.target.value)}>
                {assistantThreads.map((thread) => (
                  <option value={thread.id} key={thread.id}>
                    {thread.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="messages">
              {activeThread?.messages.map((message) => (
                <article className={`message ${message.role}`} key={message.id}>
                  <span>{message.role === 'assistant' ? activeAssistant?.initials : 'EU'}</span>
                  <p>{message.content}</p>
                </article>
              ))}
            </div>
            <div className="composer">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Peça algo ao assistente..."
              />
              <button className="icon-button send" type="button" onClick={sendMessage} title="Enviar mensagem">
                <Send size={18} />
              </button>
            </div>
          </section>

          <section className="panel config-panel">
            <div className="panel-heading">
              <div>
                <h2>Configuração</h2>
                <p>Modelo, skills e prompt system.</p>
              </div>
              <Settings size={20} />
            </div>
            <label>
              Modelo
              <select value={activeAssistant?.model ?? models[0]} onChange={(event) => updateAssistant({ model: event.target.value })}>
                {models.map((model) => (
                  <option key={model}>{model}</option>
                ))}
              </select>
            </label>
            <label>
              Prompt system
              <textarea
                value={activeAssistant?.systemPrompt ?? ''}
                onChange={(event) => updateAssistant({ systemPrompt: event.target.value })}
              />
            </label>
            <div className="skill-cloud">
              {activeAssistant?.skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
            <div className="create-row">
              <input value={newSkill} onChange={(event) => setNewSkill(event.target.value)} placeholder="Adicionar skill" />
              <button className="icon-button" type="button" onClick={addSkill} title="Adicionar skill">
                <Plus size={18} />
              </button>
            </div>
          </section>
        </div>

        <div className="lower-grid">
          <section className="panel" id="profile-panel">
            <div className="panel-heading">
              <div>
                <h2>Perfil e memória</h2>
                <p>Nome, bio, avatar e contexto pessoal.</p>
              </div>
              <PenLine size={20} />
            </div>
            <div className="profile-editor">
              <label className="avatar-upload">
                <Avatar profile={state.profile} />
                <input type="file" accept="image/*" onChange={updateAvatar} />
                <span>Trocar foto</span>
              </label>
              <label>
                Nome
                <input
                  value={state.profile.name}
                  onChange={(event) =>
                    updateState((current) => ({ ...current, profile: { ...current.profile, name: event.target.value } }))
                  }
                />
              </label>
              <label>
                Bio
                <textarea
                  value={state.profile.bio}
                  onChange={(event) =>
                    updateState((current) => ({ ...current, profile: { ...current.profile, bio: event.target.value } }))
                  }
                />
              </label>
              <label>
                Memória da IA
                <textarea
                  value={state.profile.memory}
                  onChange={(event) =>
                    updateState((current) => ({ ...current, profile: { ...current.profile, memory: event.target.value } }))
                  }
                />
              </label>
            </div>
          </section>

          <section className="panel" id="files-panel">
            <div className="panel-heading">
              <div>
                <h2>Arquivos</h2>
                <p>Documentos e imagens como contexto.</p>
              </div>
              <FileText size={20} />
            </div>
            <label className="drop-zone">
              <Upload size={20} />
              <span>Subir documentos ou fotos</span>
              <input multiple type="file" onChange={handleFiles} />
            </label>
            <div className="asset-list">
              {state.assets.map((asset) => (
                <div className="asset-row" key={asset.id}>
                  {asset.type === 'image' ? <Image size={16} /> : <FileText size={16} />}
                  <strong>{asset.name}</strong>
                  <span>{formatFileSize(asset.size)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel" id="image-panel">
            <div className="panel-heading">
              <div>
                <h2>Imagens</h2>
                <p>Pedidos visuais e galeria gerada.</p>
              </div>
              <Palette size={20} />
            </div>
            <div className="image-prompt">
              <input
                value={imagePrompt}
                onChange={(event) => setImagePrompt(event.target.value)}
                placeholder="Peça uma imagem: retrato, capa, mockup..."
              />
              <button className="icon-button" type="button" onClick={generateImage} title="Gerar imagem">
                <Wand2 size={18} />
              </button>
            </div>
            <div className="image-grid">
              {state.generatedImages.map((image) => (
                <article className={`generated-image ${image.palette}`} key={image.id}>
                  <Sparkles size={18} />
                  <p>{image.prompt}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  const readyCount = useMemo(
    () => state.assistants.filter((assistant) => assistant.status === 'ready').length,
    [state.assistants],
  )

  const login = (name: string, email: string) => {
    setState((current) => ({
      ...current,
      signedIn: true,
      profile: { ...current.profile, name, email },
    }))
    setShowAuth(false)
  }

  if (state.signedIn) {
    return <Workspace state={state} setState={setState} />
  }

  if (showAuth) {
    return <AuthScreen onLogin={login} />
  }

  return (
    <>
      <Landing onStart={() => setShowAuth(true)} />
      <div className="floating-proof" aria-label="Platform status">
        <Check size={16} />
        <span>{readyCount} assistentes prontos</span>
      </div>
    </>
  )
}

export default App
