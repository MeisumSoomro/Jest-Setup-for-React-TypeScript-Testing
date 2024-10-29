import { createSwaggerSpec } from 'next-swagger-doc'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

const spec = createSwaggerSpec({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API Documentation',
      version: '1.0'
    }
  }
})

export default function ApiDoc() {
  return <SwaggerUI spec={spec} />
} 