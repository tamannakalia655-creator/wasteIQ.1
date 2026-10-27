"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2, User, Bot, Leaf } from "lucide-react"
import { wasteiqAssistant } from "@/ai/flows/wasteiq-assistant"
import { cn } from "@/lib/utils"

type Message = {
  role: 'user' | 'model'
  content: string
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hi! I am your WasteIQ Assistant. How can I help you keep Baripada clean today?' }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const response = await wasteiqAssistant({
        query: userMsg,
        history: messages.slice(-5) // Keep last 5 messages for context
      })
      setMessages(prev => [...prev, { role: 'model', content: response.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end md:bottom-6">
      {isOpen && (
        <Card className="mb-4 w-[calc(100vw-3rem)] sm:w-96 border-none shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <CardHeader className="bg-primary text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">WasteIQ AI Assistant</CardTitle>
                  <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">Always Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex items-start gap-3", m.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                      m.role === 'user' ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={cn(
                      "max-w-[80%] rounded-2xl p-3 text-sm shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-white border rounded-tl-none text-foreground"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="bg-white border rounded-2xl rounded-tl-none p-3 shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t bg-muted/10">
            <form onSubmit={handleSend} className="flex w-full gap-2">
              <Input 
                placeholder="Ask anything..." 
                className="rounded-xl h-10 bg-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-xl" disabled={loading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      
      <Button 
        size="icon" 
        className={cn(
          "h-14 w-14 rounded-2xl shadow-xl transition-all active:scale-95",
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  )
}
