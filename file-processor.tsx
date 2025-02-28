"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  FileText,
  FolderOpen,
  Upload,
  Download,
  Clock,
  AlertCircle,
  CheckCircle2,
  Cog,
  RefreshCw,
  FileUp,
  FileDown,
} from "lucide-react"

export default function FileProcessor() {
  const [importPath, setImportPath] = useState("")
  const [exportPath, setExportPath] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [autoProcessing, setAutoProcessing] = useState(false)
  const [processingInterval, setProcessingInterval] = useState("30")
  const [fileTypes, setFileTypes] = useState<string[]>(["csv", "txt", "xlsx"])
  const importRef = useRef<HTMLInputElement>(null)
  const exportRef = useRef<HTMLInputElement>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev])
  }

  const handleImportClick = () => {
    importRef.current?.click()
  }

  const handleExportClick = () => {
    exportRef.current?.click()
  }

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportPath(e.target.files[0].name)
      addLog(`Import directory set to: ${e.target.files[0].name}`)
    }
  }

  const handleExportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExportPath(e.target.files[0].name)
      addLog(`Export directory set to: ${e.target.files[0].name}`)
    }
  }

  const processFiles = () => {
    if (!importPath || !exportPath) {
      addLog("Error: Please select both import and export directories")
      return
    }

    setIsProcessing(true)
    addLog("Starting file processing...")

    // Simulate processing with progress updates
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress === 25) {
        addLog("Scanning import directory...")
      } else if (currentProgress === 50) {
        addLog("Processing files...")
      } else if (currentProgress === 75) {
        addLog("Exporting processed files...")
      }

      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsProcessing(false)
        setProgress(100)
        addLog("Processing completed successfully!")
      }
    }, 200)
  }

  const toggleAutoProcessing = () => {
    const newState = !autoProcessing
    setAutoProcessing(newState)
    addLog(`Automatic processing ${newState ? "enabled" : "disabled"}`)

    if (newState) {
      addLog(`Files will be processed every ${processingInterval} minutes`)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Card className="mb-6">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <CardTitle>Sistema de Processamento de Arquivos</CardTitle>
            </div>
            <Button variant="outline" size="icon" className="bg-primary-foreground text-primary">
              <Cog className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-primary-foreground/80">
            Importe, processe e exporte arquivos automaticamente
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Processamento Manual
              </TabsTrigger>
              <TabsTrigger value="automatic" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Processamento Automático
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Import Section */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Importação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="import-path">Diretório de Importação</Label>
                          <div className="flex gap-2">
                            <Input
                              id="import-path"
                              value={importPath}
                              readOnly
                              placeholder="Selecione o diretório de origem"
                            />
                            <Button variant="outline" size="icon" onClick={handleImportClick}>
                              <FolderOpen className="h-4 w-4" />
                            </Button>
                            <input
                              type="file"
                              ref={importRef}
                              onChange={handleImportChange}
                              className="hidden"
                              webkitdirectory="true"
                              directory=""
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Tipos de Arquivo</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {["csv", "txt", "xlsx", "pdf", "xml", "json"].map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`type-${type}`}
                                  checked={fileTypes.includes(type)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFileTypes((prev) => [...prev, type])
                                    } else {
                                      setFileTypes((prev) => prev.filter((t) => t !== type))
                                    }
                                  }}
                                />
                                <Label htmlFor={`type-${type}`} className="text-sm">
                                  .{type}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Export Section */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Exportação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="export-path">Diretório de Exportação</Label>
                          <div className="flex gap-2">
                            <Input
                              id="export-path"
                              value={exportPath}
                              readOnly
                              placeholder="Selecione o diretório de destino"
                            />
                            <Button variant="outline" size="icon" onClick={handleExportClick}>
                              <FolderOpen className="h-4 w-4" />
                            </Button>
                            <input
                              type="file"
                              ref={exportRef}
                              onChange={handleExportChange}
                              className="hidden"
                              webkitdirectory="true"
                              directory=""
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="export-format">Formato de Exportação</Label>
                          <Select defaultValue="original">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="original">Formato Original</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Processing Controls */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label>Progresso</Label>
                            <span className="text-sm text-muted-foreground">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setImportPath("")
                            setExportPath("")
                            setProgress(0)
                            addLog("Configurações resetadas")
                          }}
                          disabled={isProcessing}
                        >
                          Limpar
                        </Button>
                        <Button
                          onClick={processFiles}
                          disabled={isProcessing || !importPath || !exportPath}
                          className="gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Processando...
                            </>
                          ) : (
                            <>
                              <FileDown className="h-4 w-4" />
                              Processar Arquivos
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="automatic">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Configuração de Processamento Automático
                  </CardTitle>
                  <CardDescription>
                    Configure o sistema para processar arquivos automaticamente em intervalos regulares
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-processing">Processamento Automático</Label>
                        <p className="text-sm text-muted-foreground">Ativa o processamento automático de arquivos</p>
                      </div>
                      <Switch id="auto-processing" checked={autoProcessing} onCheckedChange={toggleAutoProcessing} />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="interval">Intervalo de Processamento (minutos)</Label>
                        <Select
                          value={processingInterval}
                          onValueChange={setProcessingInterval}
                          disabled={!autoProcessing}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o intervalo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutos</SelectItem>
                            <SelectItem value="15">15 minutos</SelectItem>
                            <SelectItem value="30">30 minutos</SelectItem>
                            <SelectItem value="60">1 hora</SelectItem>
                            <SelectItem value="360">6 horas</SelectItem>
                            <SelectItem value="720">12 horas</SelectItem>
                            <SelectItem value="1440">24 horas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Opções Adicionais</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="delete-source" disabled={!autoProcessing} />
                            <Label htmlFor="delete-source" className="text-sm">
                              Excluir arquivos de origem após processamento
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="notify" disabled={!autoProcessing} />
                            <Label htmlFor="notify" className="text-sm">
                              Notificar quando o processamento for concluído
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="retry" disabled={!autoProcessing} />
                            <Label htmlFor="retry" className="text-sm">
                              Tentar novamente em caso de falha
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" disabled={!autoProcessing}>
                    Testar Configuração
                  </Button>
                  <Button disabled={!autoProcessing}>Salvar Configurações</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Log Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Log de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm flex items-start gap-2">
                    {log.includes("Error") ? (
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    ) : log.includes("completed") ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={log.includes("Error") ? "text-destructive" : ""}>{log}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

