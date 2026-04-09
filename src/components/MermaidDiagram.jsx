import { useEffect, useState, useId } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false })

export function MermaidDiagram({ chart }) {
  const [svg, setSvg] = useState('')
  const id = `mermaid-${useId().replace(/:/g, '')}`

  useEffect(() => {
    let isMounted = true
    const renderChart = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        if (isMounted) setSvg(renderedSvg)
      } catch (error) {
        console.error('Mermaid error', error)
        if (isMounted) setSvg(`<div class="text-red-500 bg-red-50/50 p-2 rounded-md text-sm font-mono border border-red-200">Error rendering diagram</div>`)
      }
    }
    
    if (chart) {
      renderChart()
    }
    
    return () => {
      isMounted = false
      const node = document.getElementById(id)
      if (node) {
        node.remove()
      }
    }
  }, [chart, id])

  return (
    <div 
      className="my-4 flex justify-center overflow-x-auto bg-card border rounded-md p-4"
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  )
}
