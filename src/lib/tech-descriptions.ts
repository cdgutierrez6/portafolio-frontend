export const TECH_DESC: Record<string, string> = {
  "React.js":
    "Biblioteca de UI de Facebook para SPAs con componentes reutilizables y hooks reactivos. " +
    "Se integra en cualquier proyecto como capa de presentación: consume APIs REST o GraphQL, " +
    "gestiona estado con Redux/Zustand y se embebe en apps existentes mediante Web Components o micro-frontends.",
  "Angular 8":
    "Framework MVC de Google con TypeScript, RxJS e inyección de dependencias. " +
    "Ideal para portales empresariales: se conecta a backends SOAP/REST mediante interceptores HTTP, " +
    "y se integra con sistemas legados a través de módulos lazy-load y librerías de componentes corporativas.",
  "Next.js":
    "Framework React con SSR, App Router y optimizaciones de build automáticas. " +
    "Se integra como frontend de cualquier sistema exponiéndole una capa de API Routes, " +
    "conectándolo a CMS headless (Contentful, Sanity) o a microservicios via fetch server-side.",
  "TypeScript":
    "Superset tipado de JavaScript que detecta errores en compilación y mejora el autocompletado. " +
    "Se añade a cualquier proyecto JS sin romper código existente: basta con cambiar extensiones a .ts " +
    "e ir tipando gradualmente, reduciendo bugs en producción hasta un 40%.",
  "JavaScript":
    "Lenguaje principal de la web, presente tanto en cliente como en servidor (Node.js). " +
    "Se integra en cualquier stack como glue-code: automatización de builds, scripts de migración, " +
    "integraciones serverless y lógica de negocio ligera en el navegador.",
  "jQuery":
    "Librería DOM para manipulación, AJAX y compatibilidad cross-browser en sistemas legacy. " +
    "Se añade a portales existentes con una sola etiqueta script, permitiendo modernizar " +
    "formularios y llamadas AJAX sin reescribir el backend ni la arquitectura actual.",
  "CSS3":
    "Flexbox, Grid, Custom Properties y animaciones nativas del navegador. " +
    "Se integra en cualquier proyecto web añadiendo hojas de estilo modulares o variables CSS " +
    "globales que respetan el sistema de diseño y se adaptan a cualquier framework de UI.",
  "Bootstrap":
    "Framework CSS con grid responsivo y más de 30 componentes pre-diseñados. " +
    "Se incorpora en días a proyectos sin diseñador: sobreescribe variables SCSS para adaptar " +
    "la paleta corporativa y se combina con React, Angular o Blade sin conflictos.",
  "Tailwind CSS":
    "CSS utility-first que genera sólo el CSS que se usa, reduciendo el bundle final. " +
    "Se integra en cualquier proyecto moderno en minutos con PostCSS: " +
    "permite construir interfaces consistentes con design tokens y dark mode sin escribir una línea de CSS custom.",
  "Java":
    "Lenguaje robusto para microservicios empresariales con Spring Boot y arquitectura hexagonal. " +
    "Se integra en sistemas existentes como servicio independiente detrás de un API Gateway, " +
    "consumiendo colas Kafka/RabbitMQ y exponiendo contratos via OpenAPI para otros equipos.",
  "Spring":
    "Ecosistema Java para REST APIs, seguridad, microservicios y mensajería. " +
    "Se conecta a cualquier base de datos (JPA/Hibernate), implementa OAuth2/JWT de forma nativa " +
    "y publica eventos a colas de mensajería para integrar sistemas distribuidos sin acoplamiento.",
  "C#":
    "Lenguaje .NET con tipado fuerte para APIs robustas y servicios de alto rendimiento. " +
    "Se integra en entornos Microsoft consumiendo Azure Service Bus, SQL Server o Active Directory, " +
    "y expone gRPC o REST para ser consumido por cualquier cliente del ecosistema.",
  ".NET Core":
    "Framework cross-platform de Microsoft para APIs REST y microservicios escalables. " +
    "Se despliega en Docker/Kubernetes, se conecta a Azure/AWS nativamente " +
    "y expone endpoints que cualquier frontend o servicio puede consumir con mínima configuración.",
  ".NET Framework":
    "Plataforma Windows para aplicaciones empresariales y servicios WCF existentes. " +
    "Se moderniza gradualmente migrando módulos a .NET Core, exponiendo WCF como REST " +
    "o envolviéndolo en un API Gateway para integrarlo con sistemas cloud sin reescritura total.",
  "Node.js":
    "Runtime JavaScript para APIs rápidas con arquitectura orientada a eventos I/O. " +
    "Se integra como capa de orquestación entre microservicios: agrega datos de múltiples APIs, " +
    "maneja websockets en tiempo real y se despliega serverless en AWS Lambda o Vercel Edge.",
  "Adonis.js":
    "Framework MVC Node.js con ORM Lucid, auth JWT integrado y validaciones. " +
    "Se estructura como backend completo o API REST para cualquier frontend, " +
    "con migraciones de base de datos, jobs en cola y scheduler listos desde el primer día.",
  "PHP":
    "Lenguaje backend dinámico presente en más del 75% de sitios web del mundo. " +
    "Se integra en hosting compartido sin configuración extra, se conecta a cualquier BD " +
    "y se embebe en CMS como WordPress o Drupal para agregar lógica de negocio personalizada.",
  "Laravel":
    "Framework PHP elegante con ORM Eloquent, routing expressivo y ecosistema completo. " +
    "Se integra con cualquier frontend via API Resources, gestiona colas con Redis/SQS " +
    "y se despliega en segundos con Laravel Forge, Vapor serverless o Docker.",
  "REST APIs":
    "Diseño e implementación de APIs RESTful con versionado, autenticación JWT y documentación Swagger. " +
    "Cualquier sistema —móvil, web, IoT o terceros— puede consumir los endpoints de forma estándar; " +
    "se integra con API Gateways (Kong, AWS) para rate limiting, logging y seguridad centralizada.",
  "PostgreSQL":
    "BD relacional avanzada con JSONB, índices parciales, Full-Text Search y alta concurrencia. " +
    "Se integra en cualquier backend via drivers estándar o ORMs (Prisma, Hibernate, Sequelize); " +
    "soporta replicación maestro-esclavo y sharding para escalar sin cambiar el código de la app.",
  "MySQL":
    "BD relacional popular con excelente soporte en hosting compartido y cloud. " +
    "Se conecta a cualquier lenguaje backend con drivers maduros, " +
    "se replica en AWS RDS o PlanetScale y se integra con herramientas de BI como Metabase sin configuración.",
  "SQL Server":
    "BD Microsoft para entornos corporativos con Reporting Services y alta disponibilidad Always On. " +
    "Se integra con el ecosistema .NET de forma nativa, expone datos a Power BI via DirectQuery " +
    "y se conecta a sistemas SAP/ERP mediante linked servers y procedimientos almacenados.",
  "Oracle":
    "BD empresarial crítica con PL/SQL, particionado y cargas de trabajo OLAP/OLTP masivas. " +
    "Se integra con sistemas legados y ERP (SAP, PeopleSoft) mediante database links; " +
    "sus stored procedures y jobs encapsulan lógica de negocio reutilizable desde cualquier capa.",
  "Redis":
    "Almacén de datos en memoria ultrarrápido para caché, sesiones y pub/sub en tiempo real. " +
    "Se integra en cualquier backend como capa de caché delante de la BD: reduce latencia de consultas frecuentes " +
    "en un 90% y maneja millones de operaciones por segundo con un comando de instalación.",
  "Prisma ORM":
    "ORM moderno para Node.js/TypeScript con migraciones automáticas, tipos generados y Prisma Studio visual. " +
    "Se integra en cualquier proyecto Next.js, Express o NestJS en minutos: define el schema en Prisma, " +
    "ejecuta las migraciones y obtienes queries type-safe sin escribir SQL manual.",
  "Docker":
    "Contenerización que empaqueta app + dependencias en una imagen reproducible en cualquier entorno. " +
    "Se integra en cualquier proyecto con un Dockerfile: mismo comportamiento en local, CI y producción. " +
    "Orquestado con Docker Compose para desarrollo y Kubernetes para escala en producción.",
  "Kubernetes":
    "Orquestador de contenedores para despliegue, escalado y gestión automática de microservicios. " +
    "Se integra en cualquier arquitectura Docker existente: define Deployments y Services en YAML, " +
    "y Kubernetes garantiza alta disponibilidad, auto-scaling y rollbacks sin downtime.",
  "Git":
    "Control de versiones distribuido con GitFlow, branching strategies y code reviews. " +
    "Se integra en cualquier equipo configurando hooks de pre-commit (linting, tests) " +
    "y conectándose a GitHub/GitLab para CI/CD automático en cada push o pull request.",
  "GitLab":
    "Plataforma DevOps all-in-one con CI/CD pipelines, Container Registry y gestión de proyectos. " +
    "Se integra en la infraestructura existente con runners auto-escalables en AWS/GCP, " +
    "desplegando automáticamente a Kubernetes o servidores propios con un único archivo .gitlab-ci.yml.",
  "AWS":
    "Plataforma cloud líder con +200 servicios: EC2, S3, RDS, Lambda, ECS y API Gateway. " +
    "Se integra en cualquier stack desplegando la app en EC2/ECS, la BD en RDS, " +
    "los archivos en S3 y exponiendo todo via API Gateway con autoscaling y costos por uso.",
  "Azure":
    "Nube de Microsoft con integración nativa para apps .NET, Active Directory y Office 365. " +
    "Se integra en entornos corporativos Microsoft sin fricción: Azure DevOps para CI/CD, " +
    "Azure SQL para la BD, App Service para el hosting y AAD para autenticación empresarial.",
  "Vercel":
    "Plataforma de despliegue optimizada para Next.js con Edge Network global y previews automáticos. " +
    "Se integra con GitHub/GitLab en segundos: cada push genera un preview URL, " +
    "cada merge a main despliega a producción con CDN global y zero-config.",
  "CI/CD":
    "Pipeline de integración y despliegue continuo: tests automáticos → build → deploy en cada commit. " +
    "Se implementa con GitHub Actions, GitLab CI o Jenkins en cualquier proyecto; " +
    "elimina deploys manuales y garantiza que solo código testeado llegue a producción.",
  "Microservices":
    "Arquitectura de servicios desacoplados con responsabilidad única, desplegables de forma independiente. " +
    "Se implementa gradualmente extrayendo módulos de un monolito hacia servicios con su propia BD, " +
    "comunicados via REST/gRPC o mensajería asíncrona (Kafka, RabbitMQ) con un API Gateway central.",
  "Microfrontends":
    "División del frontend en módulos autónomos por dominio de negocio, cada uno con su propio deploy. " +
    "Se integra en portales existentes con Module Federation (Webpack 5) o iframes aislados, " +
    "permitiendo que distintos equipos desplieguen en paralelo sin bloquear la aplicación principal.",
  "Tomcat":
    "Servidor de aplicaciones Java liviano para despliegue de WARs y servicios Spring MVC. " +
    "Se integra en pipelines CI/CD desplegando WARs via Maven o copiando artefactos en el directorio webapps; " +
    "se dockeriza fácilmente para llevar aplicaciones legacy a entornos modernos en la nube.",
  "GlassFish":
    "Servidor Jakarta EE completo con soporte EJB, JPA, JMS y transacciones distribuidas XA. " +
    "Se integra en sistemas Java EE empresariales gestionando pools de conexiones y clústeres de alta disponibilidad, " +
    "con administración remota via consola web o scripts de automatización.",
  "GraphQL":
    "Lenguaje de consulta para APIs que permite al cliente pedir exactamente los datos que necesita. " +
    "Se integra sobre cualquier backend existente como capa de API adicional con Apollo Server o Hasura; " +
    "reduce el over-fetching en apps móviles y frontends complejos con múltiples fuentes de datos.",
  "WebSockets":
    "Protocolo de comunicación bidireccional en tiempo real entre cliente y servidor. " +
    "Se integra en cualquier app via Socket.io o la API nativa: perfecto para chats, " +
    "notificaciones en vivo, dashboards de métricas y editores colaborativos sin polling.",
  "gRPC":
    "Framework RPC de Google con Protocol Buffers, tipado fuerte y streaming bidireccional. " +
    "Se integra como protocolo de comunicación entre microservicios internos, " +
    "siendo hasta 7x más rápido que REST/JSON para comunicación inter-servicio de alto volumen.",
  "API Gateway":
    "Punto de entrada único para todos los microservicios: enrutamiento, auth, rate limiting y logging. " +
    "Se integra delante de cualquier arquitectura (Kong, AWS API Gateway, NGINX): " +
    "centraliza la seguridad y el monitoreo sin modificar los servicios individuales.",
  "Stripe":
    "Plataforma de pagos con API completa para suscripciones, pagos únicos y marketplace. " +
    "Se integra en cualquier SaaS con pocas líneas de código: webhooks para eventos de pago, " +
    "Stripe Checkout hosted para evitar el manejo de datos de tarjetas y cumplimiento PCI automático.",
  "JWT / OAuth2":
    "Estándares de autenticación y autorización: JWT para tokens stateless, OAuth2 para login social. " +
    "Se integra en cualquier API como middleware: protege endpoints sin sesiones en servidor, " +
    "y permite login con Google/GitHub/Microsoft sin almacenar contraseñas.",
  "Claude Code":
    "CLI oficial de Anthropic con contexto profundo del codebase completo. " +
    "Se integra en cualquier proyecto como agente de desarrollo: analiza arquitectura, " +
    "genera código con contexto real, ejecuta refactoring masivo y revisa PRs desde la terminal.",
  "ChatGPT":
    "LLM de OpenAI para generación de código, debugging y documentación técnica. " +
    "Se integra en sistemas vía API de OpenAI: chatbots de soporte, generación de reportes, " +
    "análisis de texto no estructurado y asistentes internos para equipos de desarrollo.",
  "GitHub Copilot":
    "Autocompletado con IA integrado en VS Code, JetBrains y Neovim. " +
    "Se activa en cualquier repositorio GitHub/Azure DevOps; sugiere funciones completas, " +
    "genera tests unitarios y explica código legacy, reduciendo el tiempo de desarrollo hasta un 55%.",
  "Gemini":
    "Modelo multimodal de Google para análisis de código, imágenes y documentos técnicos. " +
    "Se integra via Google AI SDK en apps que necesiten procesar texto + imágenes simultáneamente, " +
    "o conectado a Google Workspace para automatizar análisis de datos en Sheets y Drive.",
  "n8n":
    "Plataforma open-source de automatización con +400 integraciones, webhooks y nodos de IA. " +
    "Se despliega en cualquier servidor en minutos con Docker; conecta sistemas heterogéneos " +
    "(CRMs, ERPs, bases de datos, APIs) sin escribir código y con lógica condicional visual.",
  "Cursor AI":
    "Editor de código con IA que chatea con el codebase completo y edita múltiples archivos. " +
    "Se integra reemplazando VS Code en el flujo de trabajo del equipo; " +
    "permite describir cambios en lenguaje natural y el agente los implementa con diff revisable.",
  "Prompt Engineering":
    "Diseño de prompts precisos para LLMs: chain-of-thought, few-shot learning y control de output. " +
    "Se aplica en cualquier integración con IA para reducir alucinaciones, " +
    "obtener respuestas estructuradas (JSON, Markdown) y maximizar la utilidad de los modelos sin fine-tuning.",
  "LangChain":
    "Framework Python/JS para construir apps con LLMs: RAG, agentes, cadenas y memoria persistente. " +
    "Se integra en cualquier backend conectando el LLM a bases de datos vectoriales (Pinecone, Chroma), " +
    "APIs externas y herramientas propias para crear agentes que razonan y actúan de forma autónoma.",
  "RAG Systems":
    "Retrieval-Augmented Generation: combina búsqueda semántica vectorial con generación de LLMs. " +
    "Se integra en cualquier sistema documental (PDFs, bases de conocimiento, wikis corporativas) " +
    "para crear un chatbot que responde con datos propios actualizados sin reentrenar el modelo.",
  "AI Code Review":
    "Revisión automatizada de código con análisis de seguridad, patrones anti-DRY y sugerencias SOLID. " +
    "Se integra en el pipeline CI/CD como paso previo al merge: comenta PRs automáticamente en GitHub/GitLab " +
    "y bloquea código con vulnerabilidades antes de llegar a producción.",
  "Copilot Chat":
    "Asistente conversacional de GitHub para refactoring, explicación de código y generación de tests. " +
    "Se integra directamente en el IDE sin cambiar el flujo de trabajo: " +
    "responde preguntas sobre el código seleccionado, genera documentación JSDoc y sugiere optimizaciones.",
  "MCP Servers":
    "Model Context Protocol: estándar abierto de Anthropic para conectar LLMs con herramientas externas. " +
    "Se integra en cualquier sistema exponiendo un servidor MCP que dé al LLM acceso a tu BD, " +
    "APIs internas o archivos, convirtiendo al asistente en un agente con acceso real a tus datos.",
  "OpenAI API":
    "API directa de OpenAI para GPT-4, embeddings, visión, audio y function calling. " +
    "Se integra en cualquier backend con pocas líneas: generación de texto estructurado, " +
    "análisis de documentos, extracción de datos y agentes con herramientas propias via function calling.",
};
