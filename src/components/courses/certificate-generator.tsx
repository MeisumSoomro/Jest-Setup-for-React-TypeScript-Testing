import { useState } from 'react'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

interface CertificateGeneratorProps {
  courseName: string
  userName: string
  completionDate: Date
  onGenerate: (pdfUrl: string) => Promise<void>
}

export function CertificateGenerator({
  courseName,
  userName,
  completionDate,
  onGenerate
}: CertificateGeneratorProps) {
  const [generating, setGenerating] = useState(false)

  const generateCertificate = async () => {
    try {
      setGenerating(true)
      
      // Create PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([842, 595]) // A4 landscape
      
      // Add content
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const fontSize = 30
      
      page.drawText('Certificate of Completion', {
        x: 50,
        y: 500,
        size: fontSize,
        font
      })
      
      page.drawText(`This is to certify that`, {
        x: 50,
        y: 400,
        size: 20,
        font
      })
      
      page.drawText(userName, {
        x: 50,
        y: 350,
        size: 25,
        font
      })
      
      page.drawText(`has successfully completed the course`, {
        x: 50,
        y: 300,
        size: 20,
        font
      })
      
      page.drawText(courseName, {
        x: 50,
        y: 250,
        size: 25,
        font
      })
      
      page.drawText(`Completed on ${completionDate.toLocaleDateString()}`, {
        x: 50,
        y: 150,
        size: 15,
        font
      })
      
      // Convert to base64
      const pdfBytes = await pdfDoc.saveAsBase64()
      const pdfUrl = `data:application/pdf;base64,${pdfBytes}`
      
      await onGenerate(pdfUrl)
    } catch (error) {
      console.error('Failed to generate certificate:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Button 
      onClick={generateCertificate} 
      disabled={generating}
    >
      {generating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Generating Certificate...
        </>
      ) : (
        'Download Certificate'
      )}
    </Button>
  )
} 