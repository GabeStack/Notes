import app from '@adonisjs/core/services/app'
import edge from 'edge.js'
import mjml2html from 'mjml'
import { Message } from '@adonisjs/mail'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// ✅ Monte o namespace 'default' com o caminho absoluto correto
const viewsPath = join(fileURLToPath(app.appRoot), 'resources/views')
edge.mount('default', viewsPath)

// 🔍 Debug opcional (remova em produção)
// console.log('📁 Edge mounted:', viewsPath)

Message.templateEngine = {
  async render(templatePath: string, _sharedState: any, viewData: any) {
    // 🔍 Debug: veja o caminho sendo resolvido
    // console.log('🎨 Renderizando:', templatePath)

    const edgeOutput = await edge.render(templatePath, viewData)
    
    if (!edgeOutput?.trim()) {
      throw new Error(`Template Edge retornou vazio: ${templatePath}`)
    }

    const result = await mjml2html(edgeOutput, { 
      minify: false, 
      validationLevel: 'soft'
    })
    
    if (result.errors?.length > 0) {
      console.error('⚠️ MJML Warnings:', JSON.stringify(result.errors, null, 2))
    }

    return result.html
  },
}